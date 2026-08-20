import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/session";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = rawNext && rawNext.startsWith("/") ? rawNext : null;
  const user = await getCurrentUser();
  if (user) redirect(next ?? "/dashboard");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your jobs and applications."
    >
      <LoginForm nextPath={next ?? undefined} />
    </AuthShell>
  );
}
