import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { timeAgo } from "@/lib/format";
import { CreditCard, AlertTriangle, CheckCircle2 } from "lucide-react";

interface PaymentListProps {
  pendingPayments: any[];
  failedPayments: any[];
}

export function PaymentList({ pendingPayments, failedPayments }: PaymentListProps) {
  return (
    <div className="space-y-6">
      {/* Pending Payments */}
      <div>
        <h3 className="mb-3 font-semibold text-[#101010] flex items-center gap-2">
          <CreditCard className="size-4 text-[#cdeb00]" />
          Pending Payments
        </h3>
        {pendingPayments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No pending payments"
            description="All payments are settled."
            compact
          />
        ) : (
          <div className="space-y-3">
            {pendingPayments.map((p) => (
              <Card key={p.id} className="border-[#e8e8e8] shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-[#101010]">{p.job.title}</p>
                    <Badge className="bg-[#cdeb00]/10 text-[#101010] border-0 rounded-full">
                      {p.amount.toLocaleString()} {p.currency}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-[#6b6b6b]">
                    {p.client.name} · {p.client.email} · {timeAgo(p.createdAt)}
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
        {failedPayments.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No failed payments"
            description="Everything is running smoothly."
            compact
          />
        ) : (
          <div className="space-y-3">
            {failedPayments.map((p) => (
              <Card key={p.id} className="border-[#e8e8e8] shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-[#101010]">{p.job.title}</p>
                    <Badge className="bg-red-50 text-red-700 border-0 rounded-full">
                      Failed
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-[#6b6b6b]">
                    {p.client.name} · {p.client.email}
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