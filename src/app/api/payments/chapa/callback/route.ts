import { NextResponse } from "next/server";
import {
  completePaymentByProviderReference,
} from "@/server/payments";
import { verifyChapaTransaction } from "@/lib/chapa";

function getReferenceFromBody(body: unknown) {
  if (!body || typeof body !== "object") return undefined;
  const record = body as Record<string, unknown>;
  const direct =
    typeof record.tx_ref === "string"
      ? record.tx_ref
      : typeof record.trx_ref === "string"
        ? record.trx_ref
        : undefined;
  if (direct) return direct;
  const camelCase =
    typeof record.txRef === "string"
      ? record.txRef
      : typeof record.trxRef === "string"
        ? record.trxRef
        : undefined;
  if (camelCase) return camelCase;
  const data = record.data;
  if (data && typeof data === "object") {
    const dataRecord = data as Record<string, unknown>;
    const dataRef =
      typeof dataRecord.tx_ref === "string"
        ? dataRecord.tx_ref
        : typeof dataRecord.trx_ref === "string"
          ? dataRecord.trx_ref
          : typeof dataRecord.txRef === "string"
            ? dataRecord.txRef
            : undefined;
    if (typeof dataRef === "string") return dataRef;
  }
  return undefined;
}

async function handleReference(providerReference?: string) {
  if (!providerReference) {
    console.error("[CHAPA CALLBACK] Missing transaction reference");
    return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
  }

  console.info("[CHAPA CALLBACK] Received reference:", providerReference);

  const verified = await verifyChapaTransaction(providerReference);
  if (!verified.success) {
    console.error("[CHAPA CALLBACK] Verification failed:", verified.error);
    const maybePayment = await completePaymentByProviderReference(providerReference);
    if ("error" in maybePayment) {
      return NextResponse.json(
        { error: verified.error || "Payment not completed" },
        { status: 400 }
      );
    }
    // already complete or race condition fallback
    return NextResponse.json({ success: true, note: "Already completed" });
  }

  const completed = await completePaymentByProviderReference(providerReference);
  if ("error" in completed) {
    console.error("[CHAPA CALLBACK] Complete payment failed:", completed.error);
    return NextResponse.json({ error: completed.error }, { status: 400 });
  }
  console.info("[CHAPA CALLBACK] Payment completed for:", providerReference);
  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const providerReference =
    url.searchParams.get("tx_ref") || url.searchParams.get("trx_ref") || undefined;
  return handleReference(providerReference);
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const body = (await req.json().catch(() => null)) as unknown;
  const providerReference =
    getReferenceFromBody(body) ||
    url.searchParams.get("tx_ref") ||
    url.searchParams.get("trx_ref") ||
    undefined;
  return handleReference(providerReference);
}
