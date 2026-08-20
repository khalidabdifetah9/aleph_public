import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { getCurrentUser } from "@/lib/session";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; next?: string }>;
}) {
  const { role, next: rawNext } = await searchParams;
  const next = rawNext && rawNext.startsWith("/") ? rawNext : null;
  const user = await getCurrentUser();
  if (user) redirect(next ?? "/dashboard");

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join as a client or a designer — it only takes a minute."
    >
      <SignupForm defaultRole={role} nextPath={next ?? undefined} />
    </AuthShell>
  );
}
