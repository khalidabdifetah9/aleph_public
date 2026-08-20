import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import {
  verifyTelegramAuth,
  isTelegramConfigured,
  type TelegramAuthData,
} from "@/lib/telegram";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isTelegramConfigured()) {
    return NextResponse.json(
      { error: "Telegram is not configured on the server." },
      { status: 400 }
    );
  }

  const data = body as TelegramAuthData;
  if (!verifyTelegramAuth(data, process.env.TELEGRAM_BOT_TOKEN!)) {
    return NextResponse.json(
      { error: "Telegram verification failed. Please try again." },
      { status: 400 }
    );
  }

  const telegramId = String(data.id);
  const telegramUsername = data.username ?? null;
  const telegramPhotoUrl = data.photo_url ?? null;

  // Prevent a single Telegram account from verifying multiple users.
  const existing = await prisma.user.findUnique({ where: { telegramId } });
  if (existing && existing.id !== session.user.id) {
    return NextResponse.json(
      { error: "This Telegram account is already linked to another user." },
      { status: 409 }
    );
  }

  // Telegram is the only identity check — a successful verification approves
  // the account outright, no admin review step.
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      telegramId,
      telegramUsername,
      telegramPhotoUrl,
      telegramVerified: true,
      verificationStatus: "APPROVED",
      rejectionReason: null,
    },
  });

  return NextResponse.json({ success: true });
}
