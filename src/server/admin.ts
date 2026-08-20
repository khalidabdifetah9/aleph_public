"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { buildTelegramJobText, postToTelegramChannel } from "@/lib/telegram-channel";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function setUserVerification(input: {
  userId: string;
  status: "APPROVED" | "REJECTED";
  reason?: string;
}) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized" };

  await prisma.user.update({
    where: { id: input.userId },
    data: {
      verificationStatus: input.status,
      rejectionReason: input.status === "REJECTED" ? input.reason ?? null : null,
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

/**
 * Approve a client's paid job so it becomes live for approved designers.
 */
export async function postJob(jobId: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized" };

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return { error: "Job not found" };
  if (job.status !== "PENDING_REVIEW") {
    return { error: "Only jobs in review queue can be posted" };
  }

  const text = buildTelegramJobText(job);
  const sent = await postToTelegramChannel(text);
  if ("error" in sent) return { error: sent.error };

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "POSTED", postedToTelegram: true },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true, messageId: sent.messageId };
}

export async function rejectJob(jobId: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized" };

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}
