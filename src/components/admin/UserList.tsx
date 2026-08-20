import { AdminUserActions } from "@/components/admin/admin-actions";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { timeAgo } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/constants";
import { UserCheck, ExternalLink } from "lucide-react";

interface UserListProps {
  users: any[];
}

export function UserList({ users }: UserListProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={UserCheck}
        title="No pending verifications"
        description="All members are verified."
      />
    );
  }

  return (
    <div className="space-y-4">
      {users.map((u) => (
        <Card key={u.id} className="border-[#e8e8e8] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <Avatar className="size-12">
                  {u.image && <AvatarImage src={u.image} />}
                  <AvatarFallback className="bg-[#cdeb00]/20 text-[#101010] font-semibold">
                    {u.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[#101010]">{u.name}</p>
                    <Badge variant="outline" className="rounded-full text-[#6b6b6b] border-[#e8e8e8]">
                      {ROLE_LABELS[u.role]}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#6b6b6b]">{u.email}</p>
                  {u.headline && (
                    <p className="mt-1 text-sm text-[#101010]">{u.headline}</p>
                  )}
                </div>
              </div>
              <span className="text-xs text-[#6b6b6b] whitespace-nowrap">
                joined {timeAgo(u.createdAt)}
              </span>
            </div>

            {u.bio && (
              <div className="mt-4 rounded-lg bg-[#f8f8f8] p-3 text-sm text-[#6b6b6b]">
                {u.bio}
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#6b6b6b]">
              {u.location && <span>{u.location}</span>}
              {u.company && <span>· {u.company}</span>}
              {u.hourlyRate ? <span>· {u.hourlyRate} ETB/hr</span> : null}
              {u.portfolioUrl && (
                <a
                  href={
                    u.portfolioUrl.startsWith("http")
                      ? u.portfolioUrl
                      : `https://${u.portfolioUrl}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[#cdeb00] hover:underline"
                >
                  <ExternalLink className="size-3.5" /> Portfolio
                </a>
              )}
            </div>

            {u.skills && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {u.skills.split(",").map((s: string) => (
                  <span
                    key={s}
                    className="rounded-full bg-[#f8f8f8] px-2.5 py-0.5 text-xs text-[#6b6b6b]"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-[#e8e8e8]">
              <AdminUserActions userId={u.id} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}