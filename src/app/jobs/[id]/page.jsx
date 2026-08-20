import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ApplyDialog } from "@/components/dashboard/apply-dialog";
import {
  ApplicantActions,
  CloseJobButton,
} from "@/components/dashboard/job-actions";
import {
  ApplicationStatusBadge,
  JobStatusBadge,
} from "@/components/status-badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { formatBudget, timeAgo } from "@/lib/format";
import {
  ArrowLeft,
  CalendarClock,
  Clock3,
  ExternalLink,
  Gauge,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";

export default async function JobDetailPage({ params }) {
  const { id } = await params;

  // Mock user data - replace with your actual user fetching logic
  const user = {
    id: "user_123",
    name: "John Doe",
    email: "john@example.com",
    role: "CLIENT", // or "DESIGNER"
    verificationStatus: "APPROVED",
  };

  // If you want to keep session checking without auth, use this:
  // const user = await getUserFromSession(); // Your custom function

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/jobs/${id}`)}`);
  }

  if (user.verificationStatus !== "APPROVED") {
    redirect(`/verify?next=${encodeURIComponent(`/jobs/${id}`)}`);
  }

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      client: { select: { name: true, company: true, location: true } },
      payment: true,
      applications: {
        include: {
          designer: {
            select: {
              id: true,
              name: true,
              headline: true,
              skills: true,
              portfolioUrl: true,
              image: true,
              location: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!job) notFound();

  const isOwner = user.role === "CLIENT" && job.clientId === user.id;
  const isDesigner = user.role === "DESIGNER";
  const myApplication = isDesigner
    ? job.applications.find((a) => a.designerId === user.id)
    : undefined;
  const canApply = isDesigner && job.status === "POSTED";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to dashboard
        </Link>

        <div className="rounded-3xl border border-border bg-card p-7 md:p-9">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="rounded-full bg-primary/8 text-primary"
            >
              {job.category}
            </Badge>
            <JobStatusBadge status={job.status} />
            <span className="ml-auto text-sm text-muted-foreground">
              Posted {timeAgo(job.createdAt)}
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {job.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 text-base font-semibold text-foreground">
              <Wallet className="size-4 text-primary" />
              {formatBudget(job)}
            </span>
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" /> {job.location}
              </span>
            )}
            {job.deadline && (
              <span className="flex items-center gap-1.5">
                <CalendarClock className="size-4" /> Due{" "}
                {new Date(job.deadline).toLocaleDateString()}
              </span>
            )}
            {job.workMode && (
              <span className="flex items-center gap-1.5">{job.workMode}</span>
            )}
            {job.experienceLevel && (
              <span className="flex items-center gap-1.5">
                <Gauge className="size-4" /> {job.experienceLevel}
              </span>
            )}
            {job.projectLength && (
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-4" /> {job.projectLength}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="size-4" /> {job.applications.length} applicant
              {job.applications.length === 1 ? "" : "s"}
            </span>
          </div>

          <Separator className="my-6" />

          <h2 className="mb-2 font-semibold">Description</h2>
          <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
            {job.description}
          </p>
          {(job.requiredSkills || job.attachmentsUrl) && (
            <div className="mt-6 space-y-3 rounded-xl border border-border bg-muted/20 p-4">
              {job.requiredSkills && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Required skills:</span>{" "}
                  {job.requiredSkills}
                </p>
              )}
              {job.attachmentsUrl && (
                <a
                  href={ensureHttp(job.attachmentsUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="size-3.5" /> Open reference link
                </a>
              )}
            </div>
          )}

          {!isOwner && (
            <p className="mt-6 text-sm text-muted-foreground">
              Posted by{" "}
              <span className="font-medium text-foreground">
                {job.client.company || job.client.name}
              </span>
            </p>
          )}

          {isOwner && job.status === "PAYMENT_PENDING" && job.payment?.checkoutUrl && (
            <div className="mt-6 rounded-2xl border border-coral/30 bg-coral/5 p-4">
              <p className="text-sm font-medium text-foreground">
                Payment required before review
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete your Telebirr payment to submit this job to admin review.
              </p>
              <Button asChild className="mt-3">
                <a href={job.payment.checkoutUrl}>Continue payment</a>
              </Button>
            </div>
          )}

          {/* Designer apply zone */}
          {isDesigner && (
            <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
              {myApplication ? (
                <>
                  <div>
                    <p className="font-medium">You&apos;ve applied to this job</p>
                    <p className="text-sm text-muted-foreground">
                      Your application is{" "}
                      <span className="lowercase">
                        {myApplication.status === "PENDING"
                          ? "awaiting a response"
                          : myApplication.status === "ACCEPTED"
                            ? "accepted — congratulations!"
                            : "not selected"}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApplicationStatusBadge status={myApplication.status} />
                    {job.status === "POSTED" && (
                      <ApplyDialog
                        jobId={job.id}
                        jobTitle={job.title}
                        alreadyApplied
                        existingMessage={myApplication.message}
                        existingPrice={myApplication.proposedPrice}
                      />
                    )}
                  </div>
                </>
              ) : canApply ? (
                <>
                  <div>
                    <p className="font-medium">Interested in this job?</p>
                    <p className="text-sm text-muted-foreground">
                      Send the client your pitch and proposed price.
                    </p>
                  </div>
                  <ApplyDialog jobId={job.id} jobTitle={job.title} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This job is no longer open for applications.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Owner applicants management */}
        {isOwner && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">
                Applicants ({job.applications.length})
              </h2>
              {job.status !== "CLOSED" && <CloseJobButton jobId={job.id} />}
            </div>

            {job.applications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 py-14 text-center">
                <Users className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No applicants yet</p>
                <p className="text-sm text-muted-foreground">
                  {job.status === "PENDING_REVIEW"
                    ? "Your job is awaiting admin review before it goes live."
                    : "Applications will show up here as designers apply."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {job.applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3">
                        <Avatar className="size-11">
                          {app.designer.image && (
                            <AvatarImage src={app.designer.image} />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {app.designer.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{app.designer.name}</p>
                            <ApplicationStatusBadge status={app.status} />
                          </div>
                          {app.designer.headline && (
                            <p className="text-sm text-muted-foreground">
                              {app.designer.headline}
                            </p>
                          )}
                          {app.designer.skills && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {app.designer.skills
                                .split(",")
                                .slice(0, 4)
                                .map((s) => (
                                  <span
                                    key={s}
                                    className="rounded-full bg-muted px-2.5 py-0.5 text-xs"
                                  >
                                    {s.trim()}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {app.proposedPrice && (
                          <p className="font-display text-lg font-semibold">
                            {app.proposedPrice.toLocaleString()} {job.currency}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {timeAgo(app.createdAt)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap rounded-xl bg-muted/40 p-4 text-sm leading-relaxed">
                      {app.message}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {app.designer.portfolioUrl && (
                          <a
                            href={ensureHttp(app.designer.portfolioUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 hover:text-foreground"
                          >
                            <ExternalLink className="size-3.5" /> Portfolio
                          </a>
                        )}
                      </div>
                      {job.status !== "CLOSED" && app.status !== "ACCEPTED" && (
                        <ApplicantActions applicationId={app.id} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

function ensureHttp(url) {
  return url.startsWith("http") ? url : `https://${url}`;
}