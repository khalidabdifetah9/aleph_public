const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

interface InitiateChapaCheckoutInput {
  paymentId: string;
  amount: number;
  title: string;
  email: string;
  fullName: string;
}

interface ChapaInitResult {
  checkoutUrl: string;
  providerReference: string;
}

interface ChapaVerifyResult {
  success: boolean;
  status?: string;
  raw?: unknown;
  error?: string;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || "Aleph",
    lastName: parts.slice(1).join(" ") || "Jobs",
  };
}

export function isChapaConfigured() {
  return Boolean(process.env.CHAPA_SECRET_KEY);
}

export async function initiateChapaCheckout(
  input: InitiateChapaCheckoutInput
): Promise<ChapaInitResult> {
  if (!process.env.CHAPA_SECRET_KEY) {
    return {
      checkoutUrl: `${appUrl}/payments/mock-telebirr?paymentId=${input.paymentId}`,
      providerReference: `MOCK-${input.paymentId}`,
    };
  }

  const txRef = `aleph-${input.paymentId}-${Date.now()}`;
  const { firstName, lastName } = splitName(input.fullName);

  const res = await fetch("https://api.chapa.co/v1/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: String(input.amount),
      currency: "ETB",
      email: input.email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: txRef,
      callback_url: `${appUrl}/api/payments/chapa/callback`,
      return_url: `${appUrl}/payments/chapa/return?paymentId=${input.paymentId}&tx_ref=${txRef}`,
      customization: {
        title: "Aleph Jobs",
        description: input.title,
      },
    }),
  });

  const data = (await res.json().catch(() => null)) as
    | {
        status?: string;
        message?: string;
        data?: { checkout_url?: string; tx_ref?: string };
      }
    | null;

  if (!res.ok || data?.status !== "success" || !data?.data?.checkout_url) {
    throw new Error(
      data?.message ||
        `Chapa initialize failed (${res.status}). Check CHAPA credentials.`
    );
  }

  return {
    checkoutUrl: data.data.checkout_url,
    providerReference: data.data.tx_ref || txRef,
  };
}

export async function verifyChapaTransaction(
  providerReference: string
): Promise<ChapaVerifyResult> {
  if (!process.env.CHAPA_SECRET_KEY) {
    return { success: false, error: "CHAPA_SECRET_KEY is not configured." };
  }

  const res = await fetch(
    `https://api.chapa.co/v1/transaction/verify/${providerReference}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    }
  );

  const data = (await res.json().catch(() => null)) as
    | {
        status?: string;
        message?: string;
        data?: { status?: string };
      }
    | null;

  if (!res.ok || data?.status !== "success") {
    return {
      success: false,
      error:
        data?.message ||
        `Chapa verify failed (${res.status}) for reference ${providerReference}.`,
      raw: data ?? undefined,
    };
  }

  const paymentStatus = (data?.data?.status || "").toLowerCase();
  const isPaid = paymentStatus === "success" || paymentStatus === "completed";

  return {
    success: isPaid,
    status: paymentStatus,
    raw: data ?? undefined,
    error: isPaid ? undefined : `Payment status is ${paymentStatus || "unknown"}.`,
  };
}
