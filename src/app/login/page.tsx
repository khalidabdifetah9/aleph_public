import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = rawNext && rawNext.startsWith("/") ? rawNext : null;

  const reqHeaders = await headers();
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/auth/get-session`, {
    headers: reqHeaders,
    cache: "no-store",
  });

  const session = res.ok ? await res.json() : null;

  if (session?.user) redirect(next ?? "/dashboard");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your jobs and applications."
    >
      <LoginForm nextPath={next ?? undefined} />
    </AuthShell>
  );
}