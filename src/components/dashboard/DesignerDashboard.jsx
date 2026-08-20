import Link from "next/link";
import { JobCard } from "@/components/dashboard/job-card";
import { ApplyDialog } from "@/components/dashboard/apply-dialog";
import { ApplicationStatusBadge, JobStatusBadge } from "@/components/status-badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatCard } from "./StatCard";
import { EmptyState } from "./EmptyState";
import { ProfileCheck } from "./ProfileCheck";
import { formatBudget, timeAgo } from "@/lib/format";
import {
  Compass,
  FileText,
  UserCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";

export async function DesignerDashboard({ userId }) {
  const { prisma } = await import("@/lib/prisma");

  const [openJobs, myApps, designer] = await Promise.all([
    prisma.job.findMany({
      where: { status: "POSTED" },
      include: {
        _count: { select: { applications: true } },
        client: { select: { name: true, company: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.findMany({
      where: { designerId: userId },
      include: {
        job: {
          include: { client: { select: { name: true, company: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { skills: true, headline: true, portfolioUrl: true },
    }),
  ]);

  const appliedJobIds = new Set(myApps.map((a) => a.jobId));
  const accepted = myApps.filter((a) => a.status === "ACCEPTED").length;
  const pending = myApps.filter((a) => a.status === "PENDING").length;
  const rejected = myApps.filter((a) => a.status === "REJECTED").length;

  const skillTokens =
    designer?.skills?.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) ?? [];
  const recommended = openJobs.filter((j) =>
    skillTokens.some((token) =>
      `${j.title} ${j.category} ${j.description} ${j.requiredSkills ?? ""}`
        .toLowerCase()
        .includes(token)
    )
  );

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Compass}
          label="Open Jobs"
          value={openJobs.length}
          trend="Available now"
        />
        <StatCard
          icon={FileText}
          label="Applications"
          value={myApps.length}
          trend={`${pending} pending`}
        />
        <StatCard
          icon={UserCheck}
          label="Jobs Won"
          value={accepted}
          trend="Completed"
        />
        <StatCard
          icon={Clock}
          label="Awaiting Response"
          value={pending}
          trend={`${rejected} rejected`}
        />
      </div>

      {/* Recommendations & Profile */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#101010]">Recommended Jobs</h3>
              <p className="mt-0.5 text-sm text-[#6b6b6b]">
                Matched to your skills and profile
              </p>
            </div>
            {recommended.length > 0 && (
              <span className="rounded-sm bg-[#101010] py-4 px-8 text-xs font-medium text-[#cdeb00]">
                {recommended.length} matches
              </span>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {(recommended.length > 0 ? recommended : openJobs).slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-medium text-[#101010] hover:text-[#cdeb00] transition-colors"
                  >
                    {job.title}
                  </Link>
                  <p className="text-sm text-[#6b6b6b]">
                    {formatBudget(job)} · {job.category}
                  </p>
                </div>
                <ApplyDialog
                  jobId={job.id}
                  jobTitle={job.title}
                  alreadyApplied={appliedJobIds.has(job.id)}
                />
              </div>
            ))}

            {openJobs.length === 0 && (
              <p className="text-center text-sm text-[#6b6b6b] py-4">
                No open jobs available right now
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6">
          <h3 className="font-semibold text-[#101010]">Profile Strength</h3>
          <p className="mt-0.5 text-sm text-[#6b6b6b]">
            Complete your profile to win more jobs
          </p>

          <div className="mt-4 space-y-3">
            <ProfileCheck
              label="Headline"
              status={designer?.headline ? "complete" : "missing"}
            />
            <ProfileCheck
              label="Skills"
              status={designer?.skills ? "complete" : "missing"}
            />
            <ProfileCheck
              label="Portfolio"
              status={designer?.portfolioUrl ? "complete" : "missing"}
            />
          </div>

          <Button asChild className="mt-4 w-full bg-[#101010] text-white hover:bg-[#2a2a2a]">
            <Link href="/verify">Edit Profile</Link>
          </Button>
        </div>
      </div>

      {/* Tabs for Jobs */}
      <Tabs defaultValue="browse" className="mt-4">
        <TabsList className="border-b border-[#e8e8e8] bg-transparent p-0">
          <TabsTrigger
            value="browse"
            className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-[#6b6b6b] data-[state=active]:border-[#cdeb00] data-[state=active]:bg-transparent data-[state=active]:text-[#101010] data-[state=active]:shadow-none"
          >
            Browse Jobs
          </TabsTrigger>
          <TabsTrigger
            value="mine"
            className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-[#6b6b6b] data-[state=active]:border-[#cdeb00] data-[state=active]:bg-transparent data-[state=active]:text-[#101010] data-[state=active]:shadow-none"
          >
            My Applications ({myApps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          {openJobs.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No open jobs right now"
              body="New jobs appear here as soon as clients post them. Check back soon!"
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {openJobs.map((job) => (
                <div key={job.id} className="flex flex-col gap-2">
                  <JobCard job={job} showClient />
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-[#6b6b6b]">
                      {appliedJobIds.has(job.id) ? "✓ Applied" : ""}
                    </span>
                    <ApplyDialog
                      jobId={job.id}
                      jobTitle={job.title}
                      alreadyApplied={appliedJobIds.has(job.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine" className="mt-6">
          {myApps.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No applications yet"
              body="Browse open jobs and send your first application to get hired."
            />
          ) : (
            <div className="space-y-3">
              {myApps.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col gap-3 rounded-2xl border border-[#e8e8e8] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/jobs/${app.jobId}`}
                        className="font-semibold text-[#101010] hover:text-[#cdeb00] transition-colors"
                      >
                        {app.job.title}
                      </Link>
                      <JobStatusBadge status={app.job.status} />
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-[#6b6b6b]">
                      {app.message || "No message provided"}
                    </p>
                    <p className="mt-1 text-xs text-[#6b6b6b]">
                      {formatBudget(app.job)} · Applied {timeAgo(app.createdAt)}
                      {app.proposedPrice &&
                        ` · Offered ${app.proposedPrice.toLocaleString()} ${app.job.currency}`}
                    </p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}