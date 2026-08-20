import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

function safeNextPath(path?: string | null) {
  if (!path) return null;
  if (!path.startsWith("/")) return null;
  return path;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Ensures a user is signed in. Redirects unauthenticated visitors to /login.
 */
export async function requireUser(nextPath?: string) {
  const user = await getCurrentUser();
  if (!user) {
    const next = safeNextPath(nextPath);
    redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  }
  return user;
}

/**
 * Full gate for the app. Sends users through profile completion and admin
 * approval before letting them into the dashboard.
 */
export async function requireApprovedUser(nextPath?: string) {
  const user = await requireUser(nextPath);

  // Admins skip the marketplace gating.
  if (user.role === "ADMIN") return user;

  const next = safeNextPath(nextPath);
  const verifyUrl = next ? `/verify?next=${encodeURIComponent(next)}` : "/verify";

  if (!user.onboarded) redirect(verifyUrl);
  if (user.verificationStatus !== "APPROVED") redirect(verifyUrl);

  return user;
}
