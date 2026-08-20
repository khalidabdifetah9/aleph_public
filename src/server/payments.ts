"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { buildTelegramJobText, postToTelegramChannel } from "@/lib/telegram-channel";

async function completePayment(paymentId: string, providerRef: string) {
  const payment = await prisma.jobPayment.findUnique({
    where: { id: paymentId },
    include: { job: true },
  });
  if (!payment) return { error: "Payment not found" };

  if (payment.status === "PAID") {
    return { success: true, alreadyPaid: true, jobId: payment.jobId };
  }

  await prisma.$transaction(async (tx) => {
    await tx.jobPayment.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        providerReference: providerRef,
        paidAt: new Date(),
      },
    });
    await tx.job.update({
      where: { id: payment.jobId },
      data: { status: "POSTED" },
    });
  });

  const job = await prisma.job.findUnique({ where: { id: payment.jobId } });
  if (job) {
    const telegram = await postToTelegramChannel(buildTelegramJobText(job));
    await prisma.job.update({
      where: { id: payment.jobId },
      data: { postedToTelegram: !("error" in telegram) },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { success: true, jobId: payment.jobId };
}

export async function markMockPaymentPaid(paymentId: string) {
  const user = await requireUser();

  const payment = await prisma.jobPayment.findUnique({
    where: { id: paymentId },
    select: { clientId: true },
  });
  if (!payment || payment.clientId !== user.id) {
    return { error: "Payment record not found for this account" };
  }

  return completePayment(paymentId, `MOCK-${Date.now()}`);
}

export async function markPaymentFailed(paymentId: string, reason?: string) {
  const payment = await prisma.jobPayment.findUnique({
    where: { id: paymentId },
  });
  if (!payment || payment.status !== "PENDING") return { success: true };

  await prisma.$transaction(async (tx) => {
    await tx.jobPayment.update({
      where: { id: paymentId },
      data: { status: "FAILED", failureReason: reason?.slice(0, 300) ?? null },
    });
    await tx.job.update({
      where: { id: payment.jobId },
      data: { status: "REJECTED" },
    });
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function completePaymentServer(params: {
  paymentId: string;
  providerReference: string;
}) {
  return completePayment(params.paymentId, params.providerReference);
}

export async function completePaymentByProviderReference(providerReference: string) {
  const payment = await prisma.jobPayment.findFirst({
    where: { providerReference },
    select: { id: true },
  });
  if (!payment) return { error: "Payment reference not found" };
  return completePayment(payment.id, providerReference);
}

// Backward-compatible aliases.
export const markMockTelebirrPaid = markMockPaymentPaid;
export const markTelebirrFailed = markPaymentFailed;
export const completeTelebirrPaymentServer = completePaymentServer;
