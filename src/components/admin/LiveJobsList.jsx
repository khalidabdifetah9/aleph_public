import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { timeAgo } from "@/lib/format";
import { BriefcaseBusiness } from "lucide-react";

export function LiveJobsList({ jobs = [] }) {
  if (!jobs || jobs.length === 0) {
    return (
      <EmptyState
        icon={BriefcaseBusiness}
        title="No live jobs yet"
        description="Jobs will appear here once they're posted."
      />
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((p) => (
        <Card key={p.id} className="border-[#e8e8e8] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={`/jobs/${p.job?.id}`}
                className="font-medium text-[#101010] hover:text-[#cdeb00] transition-colors"
              >
                {p.job?.title || "Untitled Job"}
              </Link>
              <div className="flex items-center gap-2">
                <Badge
                  className={`rounded-full border-0 ${
                    p.job?.postedToTelegram
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {p.job?.postedToTelegram
                    ? "Posted to Telegram"
                    : "Telegram Pending"}
                </Badge>
                <Badge className="bg-[#cdeb00]/10 text-[#101010] border-0 rounded-full">
                  {p.amount ? p.amount.toLocaleString() : 0} {p.currency || ""}
                </Badge>
              </div>
            </div>
            <p className="mt-1 text-sm text-[#6b6b6b]">
              {p.client?.name || "Unknown Client"} · paid {p.paidAt ? timeAgo(p.paidAt) : timeAgo(p.updatedAt)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}