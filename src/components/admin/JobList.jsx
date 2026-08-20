import Link from "next/link";
import { AdminJobActions } from "@/components/admin/admin-actions";
import { JobStatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { formatBudget, timeAgo } from "@/lib/format";
import { BriefcaseBusiness, Clock } from "lucide-react";

export function JobList({ jobs = [] }) {
  if (!jobs || jobs.length === 0) {
    return (
      <EmptyState
        icon={BriefcaseBusiness}
        title="All caught up!"
        description="No jobs waiting for review."
      />
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => {
        return (
          <Card key={job.id} className="border-[#e8e8e8] shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-[#cdeb00]/10 text-[#101010] border-0 rounded-full">
                  {job.category}
                </Badge>
                <JobStatusBadge status={job.status} />
                <span className="ml-auto text-sm text-[#6b6b6b] flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {timeAgo(job.createdAt)}
                </span>
              </div>

              <Link
                href={`/jobs/${job.id}`}
                className="block font-display text-xl font-semibold text-[#101010] hover:text-[#cdeb00] transition-colors"
              >
                {job.title}
              </Link>

              <p className="mt-1 text-sm text-[#6b6b6b]">
                {formatBudget(job)} · by {job.client?.company || job.client?.name || "Unknown"}
              </p>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#6b6b6b]">
                {job.description}
              </p>

              <div className="mt-5 pt-4 border-t border-[#e8e8e8]">
                <AdminJobActions jobId={job.id} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}