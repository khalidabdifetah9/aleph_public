import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { JobStatusBadge } from "@/components/status-badge";
import { formatBudget, timeAgo } from "@/lib/format";
import { CalendarClock, MapPin, Users, Wallet } from "lucide-react";

export interface JobCardData {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetType: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  currency: string;
  location?: string | null;
  deadline?: Date | null;
  status: string;
  createdAt: Date;
  _count?: { applications: number };
  client?: { name: string; company?: string | null } | null;
}

export function JobCard({
  job,
  showStatus = false,
  showClient = false,
}: {
  job: JobCardData;
  showStatus?: boolean;
  showClient?: boolean;
}) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5  "
    >
      <div className="flex items-start justify-between gap-3">
        <Badge
          variant="secondary"
          className="rounded-full bg-primary/8 text-primary"
        >
          {job.category}
        </Badge>
        {showStatus ? (
          <JobStatusBadge status={job.status} />
        ) : (
          <span className="text-xs text-muted-foreground">
            {timeAgo(job.createdAt)}
          </span>
        )}
      </div>

      <h3 className="mt-3 line-clamp-1 text-lg font-semibold transition-colors">
        {job.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
        {job.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
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
            <CalendarClock className="size-4" />
            {new Date(job.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-sm text-muted-foreground">
        {showClient && job.client ? (
          <span>
            by{" "}
            <span className="font-medium text-foreground">
              {job.client.company || job.client.name}
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <Users className="size-4" />
            {job._count?.applications ?? 0} applicant
            {(job._count?.applications ?? 0) === 1 ? "" : "s"}
          </span>
        )}
        <span className="font-medium text-primary opacity-0 transition-opacity">
          View →
        </span>
      </div>
    </Link>
  );
}
