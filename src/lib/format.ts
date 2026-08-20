export function formatBudget(job: {
  budgetType: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  currency: string;
}): string {
  if (job.budgetType === "NEGOTIABLE") return "Negotiable";
  const suffix = job.budgetType === "HOURLY" ? "/hr" : "";
  const fmt = (n: number) => `${n.toLocaleString()} ${job.currency}`;

  if (job.budgetMin && job.budgetMax && job.budgetMin !== job.budgetMax) {
    return `${job.budgetMin.toLocaleString()}–${fmt(job.budgetMax)}${suffix}`;
  }
  const single = job.budgetMin ?? job.budgetMax;
  if (single) return `${fmt(single)}${suffix}`;
  return "Negotiable";
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let value = seconds;
  let unit = "second";
  for (const [factor, name] of units) {
    if (value < factor) {
      unit = name;
      break;
    }
    value = value / factor;
    unit = name;
  }
  const rounded = Math.floor(value);
  if (unit === "second" && rounded < 10) return "just now";
  return `${rounded} ${unit}${rounded === 1 ? "" : "s"} ago`;
}
