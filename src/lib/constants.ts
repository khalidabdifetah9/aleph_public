export const JOB_CATEGORIES = [
  "Logo & Branding",
  "Poster & Flyer",
  "Social Media Graphics",
  "UI/UX Design",
  "Illustration & Art",
  "Photo Editing",
  "Video & Motion",
  "Web Development",
  "Writing & Translation",
  "Other",
] as const;

export const CURRENCIES = ["ETB", "USD", "EUR"] as const;

export const BUDGET_TYPES = [
  { value: "FIXED", label: "Fixed price" },
  { value: "HOURLY", label: "Per hour" },
  { value: "NEGOTIABLE", label: "Negotiable" },
] as const;

export const WORK_MODES = [
  { value: "REMOTE", label: "Remote" },
  { value: "ONSITE", label: "On-site" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid-level" },
  { value: "SENIOR", label: "Senior" },
  { value: "EXPERT", label: "Expert" },
] as const;

export const URGENCY_LEVELS = [
  { value: "LOW", label: "Low urgency" },
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High urgency" },
] as const;

export const ROLE_LABELS: Record<string, string> = {
  CLIENT: "Client",
  DESIGNER: "Designer",
  ADMIN: "Admin",
};

export const JOB_STATUS_LABELS: Record<string, string> = {
  PAYMENT_PENDING: "Awaiting payment",
  PENDING_REVIEW: "Awaiting review",
  POSTED: "Live",
  ASSIGNED: "Assigned",
  CLOSED: "Closed",
  REJECTED: "Rejected",
};

export const JOB_POSTING_FEES_ETB: Record<string, number> = {
  "Logo & Branding": 500,
  "Poster & Flyer": 300,
  "Social Media Graphics": 350,
  "UI/UX Design": 700,
  "Illustration & Art": 450,
  "Photo Editing": 250,
  "Video & Motion": 800,
  "Web Development": 1200,
  "Writing & Translation": 300,
  Other: 400,
};
