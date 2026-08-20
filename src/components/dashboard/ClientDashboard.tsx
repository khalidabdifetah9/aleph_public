import Link from "next/link";
import { PostJobDialog } from "@/components/dashboard/post-job-dialog";
import { JobCard } from "@/components/dashboard/job-card";
import { StatCard } from "./StatCard";
import { EmptyState } from "./EmptyState";
import { PaymentSection } from "./PaymentSection";
import {
  Briefcase,
  Users,
  Radio,
  CheckCircle2,
  DollarSign,
  ArrowRight,
} from "lucide-react";

interface ClientDashboardProps {
  userId: string;
}

export async function ClientDashboard({ userId }: ClientDashboardProps) {
  const { prisma } = await import("@/lib/prisma");

  const jobs = await prisma.job.findMany({
    where: { clientId: userId },
    include: {
      _count: { select: { applications: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalApplicants = jobs.reduce((sum, j) => sum + j._count.applications, 0);
  const live = jobs.filter((j) => j.status === "POSTED").length;
  const hired = jobs.filter((j) => j.status === "ASSIGNED").length;
  const awaitingPayment = jobs.filter((j) => j.status === "PAYMENT_PENDING").length;
  const failedPayments = jobs.filter((j) => j.payment?.status === "FAILED");
  const pendingPayments = jobs.filter((j) => j.payment?.status === "PENDING");
  const paidJobs = jobs.filter((j) => j.payment?.status === "PAID");

  return (
    <div className="space-y-10">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={Briefcase}
          label="Total Jobs"
          value={jobs.length}
          trend={`${live} live`}
        />
        <StatCard
          icon={Users}
          label="Applicants"
          value={totalApplicants}
          trend={`${hired} hired`}
        />
        <StatCard
          icon={Radio}
          label="Live Jobs"
          value={live}
          trend="Active now"
        />
        <StatCard
          icon={CheckCircle2}
          label="Hired"
          value={hired}
          trend="Completed"
        />
        <StatCard
          icon={DollarSign}
          label="Pending Payment"
          value={awaitingPayment}
          trend={`${failedPayments.length} failed`}
        />
      </div>

      <PaymentSection
        pendingPayments={pendingPayments}
        paidJobs={paidJobs}
        failedPayments={failedPayments}
        awaitingPayment={awaitingPayment}
      />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#101010]">
            Recently Posted Jobs
          </h2>
          <Link
            href="/jobs"
            className="text-sm text-[#cdeb00] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs yet"
            body="Post your first job and start receiving applications from verified designers."
            action={<PostJobDialog />}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} showStatus />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}