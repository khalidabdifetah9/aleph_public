import { NextResponse } from "next/server";
import {
  completeTelebirrPaymentServer,
  markTelebirrFailed,
} from "@/server/payments";

interface TelebirrWebhookPayload {
  paymentId?: string;
  providerReference?: string;
  status?: string;
  reason?: string;
}

export async function POST(req: Request) {
  const secret = process.env.TELEBIRR_WEBHOOK_SECRET;
  if (secret) {
    const incoming = req.headers.get("x-telebirr-secret");
    if (incoming !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const body = (await req.json().catch(() => null)) as
    | TelebirrWebhookPayload
    | null;
  if (!body?.paymentId || !body?.status) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (body.status === "SUCCESS") {
    const res = await completeTelebirrPaymentServer({
      paymentId: body.paymentId,
      providerReference:
        body.providerReference || `TELEBIRR-${Date.now().toString(36)}`,
    });
    if ("error" in res) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  }

  await markTelebirrFailed(body.paymentId, body.reason);
  return NextResponse.json({ success: true });
}
