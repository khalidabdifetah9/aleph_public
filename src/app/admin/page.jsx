import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPage } from "@/components/admin";

export default async function AdminDashboardPage() {
  const user = await requireUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const [
    pendingUsers,
    pendingJobs,
    liveJobs,
    approvedCount,
    pendingPayments,
    recentPaid,
    failedPayments,
  ] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: { in: ["CLIENT", "DESIGNER"] },
        onboarded: true,
        verificationStatus: "PENDING",
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.job.findMany({
      where: { status: "PENDING_REVIEW" },
      include: { client: { select: { name: true, company: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.job.count({ where: { status: "POSTED" } }),
    prisma.user.count({
      where: {
        role: { in: ["CLIENT", "DESIGNER"] },
        verificationStatus: "APPROVED",
      },
    }),
    prisma.jobPayment.findMany({
      where: { status: "PENDING" },
      include: {
        job: { select: { id: true, title: true, status: true } },
        client: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.jobPayment.findMany({
      where: { status: "PAID" },
      include: {
        job: { select: { id: true, title: true, postedToTelegram: true } },
        client: { select: { name: true, email: true } },
      },
      orderBy: { paidAt: "desc" },
      take: 10,
    }),
    prisma.jobPayment.findMany({
      where: { status: "FAILED" },
      include: {
        job: { select: { id: true, title: true, status: true } },
        client: { select: { name: true, email: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <AdminPage
      user={user}
      pendingUsers={pendingUsers}
      pendingJobs={pendingJobs}
      liveJobs={liveJobs}
      approvedCount={approvedCount}
      pendingPayments={pendingPayments}
      recentPaid={recentPaid}
      failedPayments={failedPayments}
    />
  );
}