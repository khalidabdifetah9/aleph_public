"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function setUserVerification(input: {
  userId: string;
  status: "APPROVED" | "REJECTED";
  reason?: string;
}) {
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
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return { error: "Job not found" };
  if (job.status !== "PENDING_REVIEW") {
    return { error: "Only jobs in review queue can be posted" };
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "POSTED" },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function rejectJob(jobId: string) {
  await prisma.job.update({
    where: { id: jobId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}