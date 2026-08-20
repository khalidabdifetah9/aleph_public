import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProfileForm } from "@/components/profile-form";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, UserRoundPen, XCircle } from "lucide-react";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; role?: string }>;
}) {
  const { next: rawNext, role: requestedRoleRaw } = await searchParams;
  const next = rawNext && rawNext.startsWith("/") ? rawNext : null;
  const requestedRole =
    requestedRoleRaw === "DESIGNER" || requestedRoleRaw === "CLIENT"
      ? requestedRoleRaw
      : null;
  const sessionUser = await requireUser(next ?? undefined);
  if (sessionUser.role === "ADMIN") redirect("/admin");

  let user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  });
  if (!user) redirect("/login");

  // Keep SSO signup role consistent with the selected role from /signup.
  if (
    requestedRole &&
    user.role !== "ADMIN" &&
    !user.onboarded &&
    user.role !== requestedRole
  ) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { role: requestedRole },
    });
  }

  if (user.onboarded && user.verificationStatus === "APPROVED") {
    redirect(next ?? "/dashboard");
  }

  const needsProfileUpdate =
    !user.onboarded || user.verificationStatus === "REJECTED";
  const step = needsProfileUpdate ? 1 : 2;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Let&apos;s get you verified
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete your profile, then our admin team reviews and approves your
            account.
          </p>
        </div>

        <Stepper step={step} />

        <div className="mt-8 space-y-4">
          {/* Step 1 — Profile */}
          <StepCard
            active={step === 1}
            done={user.onboarded && user.verificationStatus !== "REJECTED"}
            icon={UserRoundPen}
            title="Complete your profile"
            description={
              user.role === "DESIGNER"
                ? "Show clients who you are and what you do best."
                : "Tell us a little about your business and what kind of talent you need."
            }
          >
            {needsProfileUpdate && (
              <div className="mt-5">
                <ProfileForm user={user} submitLabel="Save & submit for review" />
              </div>
            )}
            {!needsProfileUpdate && (
              <p className="mt-2 text-sm text-muted-foreground">
                Profile submitted. You can still update details while waiting for
                approval.
              </p>
            )}
          </StepCard>

          {/* Step 2 — Review */}
          {user.onboarded && (
            <ReviewStatus status={user.verificationStatus} reason={user.rejectionReason} />
          )}
        </div>
      </main>
    </>
  );
}

function Stepper({ step }: { step: number }) {
  const labels = ["Profile", "Review"];
  return (
    <div className="flex items-center justify-center gap-2">
      {labels.map((label, i) => {
        const n = i + 1;
        const state = step > n ? "done" : step === n ? "active" : "todo";
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-sm font-semibold transition-colors",
                  state === "done" && "bg-primary text-primary-foreground",
                  state === "active" &&
                    "bg-primary/15 text-primary ring-2 ring-primary/30",
                  state === "todo" && "bg-muted text-muted-foreground"
                )}
              >
                {state === "done" ? <CheckCircle2 className="size-4" /> : n}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  state === "todo" && "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <span className="h-px w-8 bg-border" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepCard({
  active,
  done,
  icon: Icon,
  title,
  description,
  children,
}: {
  active: boolean;
  done: boolean;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 transition-colors",
        active ? "border-primary/40 shadow-sm" : "border-border"
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl",
            done ? "bg-mint/20 text-mint" : "bg-primary/10 text-primary"
          )}
        >
          {done ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{title}</h3>
            {done && (
              <Badge variant="secondary" className="bg-mint/15 text-mint">
                Done
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function ReviewStatus({
  status,
  reason,
}: {
  status: string;
  reason?: string | null;
}) {
  if (status === "REJECTED") {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <XCircle className="size-5" />
          </span>
          <div>
            <h3 className="font-semibold text-destructive">Application not approved</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {reason ||
                "Your account wasn't approved this time. You can update your profile above and it will be reviewed again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gold/40 bg-gold/5 p-6">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/20 text-gold">
          <Clock className="size-5" />
        </span>
        <div>
          <h3 className="font-semibold">Under review</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Thanks! Your profile has been submitted. Our team will review and
            approve your account shortly. You&apos;ll get full access once
            approved.
          </p>
        </div>
      </div>
    </div>
  );
}
