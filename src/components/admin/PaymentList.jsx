import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { timeAgo } from "@/lib/format";
import { CreditCard, AlertTriangle, CheckCircle2 } from "lucide-react";

export function PaymentList({ pendingPayments = [], failedPayments = [] }) {
  const pending = pendingPayments || [];
  const failed = failedPayments || [];

  return (
    <div className="space-y-6">
      {/* Pending Payments */}
      <div>
        <h3 className="mb-3 font-semibold text-[#101010] flex items-center gap-2">
          <CreditCard className="size-4 text-[#cdeb00]" />
          Pending Payments
        </h3>
        {pending.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No pending payments"
            description="All payments are settled."
            compact
          />
        ) : (
          <div className="space-y-3">
            {pending.map((p) => (
              <Card key={p.id} className="border-[#e8e8e8] shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-[#101010]">{p.job?.title || "Untitled Job"}</p>
                    <Badge className="bg-[#cdeb00]/10 text-[#101010] border-0 rounded-full">
                      {p.amount ? p.amount.toLocaleString() : 0} {p.currency || ""}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-[#6b6b6b]">
                    {p.client?.name || "Unknown"} · {p.client?.email || "No email"} · {p.createdAt ? timeAgo(p.createdAt) : "Recently"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Failed Payments */}
      <div>
        <h3 className="mb-3 font-semibold text-[#101010] flex items-center gap-2">
          <AlertTriangle className="size-4 text-[#cdeb00]" />
          Failed Payments
        </h3>
        {failed.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No failed payments"
            description="Everything is running smoothly."
            compact
          />
        ) : (
          <div className="space-y-3">
            {failed.map((p) => (
              <Card key={p.id} className="border-[#e8e8e8] shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-[#101010]">{p.job?.title || "Untitled Job"}</p>
                    <Badge className="bg-red-50 text-red-700 border-0 rounded-full">
                      Failed
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-[#6b6b6b]">
                    {p.client?.name || "Unknown"} · {p.client?.email || "No email"}
                  </p>
                  {p.failureReason && (
                    <p className="mt-2 text-xs text-[#6b6b6b]">
                      Reason: {p.failureReason}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}