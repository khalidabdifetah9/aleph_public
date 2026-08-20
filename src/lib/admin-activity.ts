export type AdminActivityType =
  | "signup"
  | "login"
  | "profile_update"
  | "job_posted"
  | "application"
  | "payment"
  | "verification";

export interface AdminActivityEvent {
  id: string;
  type: AdminActivityType;
  label: string;
  detail?: string;
  userId: string;
  userName: string;
  userRole: string;
  at: Date;
}

export function sortActivityEvents(events: AdminActivityEvent[]) {
  return [...events].sort((a, b) => b.at.getTime() - a.at.getTime());
}

export function formatActivityType(type: AdminActivityType) {
  const labels: Record<AdminActivityType, string> = {
    signup: "Signed up",
    login: "Logged in",
    profile_update: "Updated profile",
    job_posted: "Posted job",
    application: "Applied to job",
    payment: "Payment",
    verification: "Verification",
  };
  return labels[type];
}

export function parseUserAgent(ua?: string | null) {
  if (!ua) return "Unknown device";
  if (ua.includes("Mobile")) return "Mobile browser";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  return ua.length > 48 ? `${ua.slice(0, 48)}…` : ua;
}
