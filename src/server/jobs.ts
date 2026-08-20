"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getPostingFeeForCategory } from "@/lib/telebirr";
import { initiateChapaCheckout } from "@/lib/chapa";

export interface JobInput {
  title: string;
  description: string;
  category: string;
  budgetType: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  currency: string;
  location?: string;
  deadline?: string | null;
  workMode?: string;
  experienceLevel?: string;
  projectLength?: string;
  requiredSkills?: string;
  attachmentsUrl?: string;
  urgencyLevel?: string;
}

export async function createJob(input: JobInput) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };
  if (user.role !== "CLIENT") return { error: "Only clients can post jobs" };
  if (!user.onboarded || user.verificationStatus !== "APPROVED") {
    return { error: "Your account must be approved before posting jobs" };
  }

  const title = input.title?.trim();
  const description = input.description?.trim();
  if (!title || title.length < 4) return { error: "Please add a clear title" };
  if (!description || description.length < 15) {
    return { error: "Please describe the job in a bit more detail" };
  }
  const deadline = input.deadline ? new Date(input.deadline) : null;
  if (deadline && Number.isNaN(deadline.getTime())) {
    return { error: "Please provide a valid deadline date" };
  }
  if (
    input.budgetMin &&
    input.budgetMax &&
    input.budgetMin > 0 &&
    input.budgetMax > 0 &&
    input.budgetMin > input.budgetMax
  ) {
    return { error: "Budget minimum cannot be greater than budget maximum" };
  }

  const postingFee = getPostingFeeForCategory(input.category);

  const created = await prisma.$transaction(async (tx) => {
    const job = await tx.job.create({
      data: {
        title,
        description,
        category: input.category,
        budgetType: input.budgetType,
        budgetMin: input.budgetMin ?? null,
        budgetMax: input.budgetMax ?? null,
        currency: input.currency,
        location: input.location?.trim() || null,
        deadline,
        workMode: input.workMode?.trim() || "REMOTE",
        experienceLevel: input.experienceLevel?.trim() || "MID",
        projectLength: input.projectLength?.trim() || null,
        requiredSkills: input.requiredSkills?.trim() || null,
        attachmentsUrl: input.attachmentsUrl?.trim() || null,
        urgencyLevel: input.urgencyLevel?.trim() || "NORMAL",
        status: "PAYMENT_PENDING",
        clientId: user.id,
      },
    });

    const payment = await tx.jobPayment.create({
      data: {
        jobId: job.id,
        clientId: user.id,
        amount: postingFee,
        currency: "ETB",
        provider: "CHAPA",
        status: "PENDING",
      },
    });

    return { job, payment };
  });

  try {
    const checkout = await initiateChapaCheckout({
      paymentId: created.payment.id,
      amount: postingFee,
      title: created.job.title,
      email: user.email,
      fullName: user.name,
    });

    await prisma.jobPayment.update({
      where: { id: created.payment.id },
      data: {
        checkoutUrl: checkout.checkoutUrl,
        providerReference: checkout.providerReference ?? null,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      checkoutUrl: checkout.checkoutUrl,
      amount: postingFee,
      currency: "ETB",
    };
  } catch (error) {
    await prisma.jobPayment.update({
      where: { id: created.payment.id },
      data: {
        status: "FAILED",
        failureReason:
          error instanceof Error
            ? error.message.slice(0, 300)
            : "Telebirr checkout initialization failed",
      },
    });
    return {
      error:
        "Could not initialize Chapa checkout. Please try again in a moment.",
    };
  }
}

export async function applyToJob(input: {
  jobId: string;
  message: string;
  proposedPrice?: number | null;
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };
  if (user.role !== "DESIGNER") {
    return { error: "Only designers can apply to jobs" };
  }
  if (!user.onboarded || user.verificationStatus !== "APPROVED") {
    return { error: "Your account must be approved before applying" };
  }

  const message = input.message?.trim();
  if (!message || message.length < 10) {
    return { error: "Please write a short pitch (at least 10 characters)" };
  }

  const job = await prisma.job.findUnique({ where: { id: input.jobId } });
  if (!job || job.status !== "POSTED") {
    return { error: "This job is not open for applications" };
  }

  await prisma.application.upsert({
    where: {
      jobId_designerId: { jobId: input.jobId, designerId: user.id },
    },
    create: {
      jobId: input.jobId,
      designerId: user.id,
      message,
      proposedPrice: input.proposedPrice ?? null,
    },
    update: {
      message,
      proposedPrice: input.proposedPrice ?? null,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/jobs/${input.jobId}`);
  return { success: true };
}

export async function setApplicationStatus(input: {
  applicationId: string;
  status: "ACCEPTED" | "REJECTED";
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const application = await prisma.application.findUnique({
    where: { id: input.applicationId },
    include: { job: true },
  });
  if (!application) return { error: "Application not found" };
  if (application.job.clientId !== user.id) {
    return { error: "You can only manage applicants for your own jobs" };
  }

  await prisma.application.update({
    where: { id: input.applicationId },
    data: { status: input.status },
  });

  if (input.status === "ACCEPTED") {
    await prisma.job.update({
      where: { id: application.jobId },
      data: { status: "ASSIGNED" },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/jobs/${application.jobId}`);
  return { success: true };
}

export async function closeJob(jobId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.clientId !== user.id) {
    return { error: "Job not found" };
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "CLOSED" },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
