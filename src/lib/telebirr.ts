import { JOB_POSTING_FEES_ETB } from "@/lib/constants";

interface InitiateCheckoutInput {
  paymentId: string;
  jobId: string;
  clientId: string;
  amount: number;
  title: string;
}

interface CheckoutResult {
  checkoutUrl: string;
  providerReference?: string;
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function getPostingFeeForCategory(category: string): number {
  return JOB_POSTING_FEES_ETB[category] ?? JOB_POSTING_FEES_ETB.Other;
}

export function isTelebirrBridgeConfigured() {
  return Boolean(process.env.TELEBIRR_INITIATE_URL);
}

export async function initiateTelebirrCheckout(
  input: InitiateCheckoutInput
): Promise<CheckoutResult> {
  const bridgeUrl = process.env.TELEBIRR_INITIATE_URL;
  const webhookUrl = `${appUrl}/api/payments/telebirr/webhook`;
  const returnUrl = `${appUrl}/payments/telebirr/return?paymentId=${input.paymentId}`;

  if (!bridgeUrl) {
    return {
      checkoutUrl: `${appUrl}/payments/mock-telebirr?paymentId=${input.paymentId}`,
    };
  }

  const res = await fetch(bridgeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.TELEBIRR_BRIDGE_TOKEN
        ? { Authorization: `Bearer ${process.env.TELEBIRR_BRIDGE_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({
      paymentId: input.paymentId,
      jobId: input.jobId,
      clientId: input.clientId,
      amount: input.amount,
      currency: "ETB",
      title: input.title,
      webhookUrl,
      returnUrl,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Telebirr initiation failed (${res.status}): ${text || "Unknown error"}`
    );
  }

  const data = (await res.json()) as {
    checkoutUrl?: string;
    providerReference?: string;
  };

  if (!data.checkoutUrl) {
    throw new Error("Telebirr initiation response missing checkoutUrl");
  }

  return {
    checkoutUrl: data.checkoutUrl,
    providerReference: data.providerReference,
  };
}
