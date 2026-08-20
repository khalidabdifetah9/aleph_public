import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReceiptText, AlertTriangle } from "lucide-react";

export interface Payment {
  id: string;
  amount?: number;
  currency?: string;
  checkoutUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  payment?: Payment;
}

interface PaymentSectionProps {
  pendingPayments: Job[];
  paidJobs: Job[];
  failedPayments: Job[];
  awaitingPayment: number;
}

export function PaymentSection({
  pendingPayments,
  paidJobs,
  failedPayments,
  awaitingPayment,
}: PaymentSectionProps) {
  return (
    <>
      <div className="flex items-start justify-between mb-3 gap-4">
        <div>
          <h3 className="font-semibold text-[#101010]">Payment Center</h3>
          <p className="mt-0.5 text-sm text-[#6b6b6b]">
            Track posting fees and download receipts
          </p>
        </div>
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-[#101010]">
            <AlertTriangle className="size-4 text-[#101010]" />
            Attention Needed
          </h3>
          <p className="mt-0.5 text-sm text-[#6b6b6b]">
            Track posting fees and download receipts
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-sm overflow-auto border border-[#e8e8e8] bg-white md:col-span-2">
          <div className="flex items-center justify-between">
            {pendingPayments.length > 0 && (
              <span className="bg-[#cdeb00] px-3 py-1 text-xs font-medium text-[#101010]">
                {pendingPayments.length} pending
              </span>
            )}
          </div>

          <div>
            {pendingPayments.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between border border-[#f0f0f0] bg-[#fafafa] p-4"
              >
                <div>
                  <p className="font-medium text-[#101010]">{job.title}</p>
                  <p className="text-sm text-[#6b6b6b]">
                    Awaiting payment · {job.payment?.amount?.toLocaleString() ?? 0}{" "}
                    {job.payment?.currency ?? ""}
                  </p>
                </div>
                {job.payment?.checkoutUrl ? (
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#101010] text-white hover:bg-[#2a2a2a]"
                  >
                    <a href={job.payment.checkoutUrl}>Pay now</a>
                  </Button>
                ) : (
                  <Button size="sm" disabled className="bg-[#e8e8e8] text-[#6b6b6b]">
                    Unavailable
                  </Button>
                )}
              </div>
            ))}

            {pendingPayments.length === 0 && paidJobs.length === 0 && (
              <p className="text-center text-sm text-[#6b6b6b] py-4">
                No payments yet. Your first payment will appear here.
              </p>
            )}

            {paidJobs.slice(0, 2).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between border-b border-[#e2dede] bg-[#fafafa] p-4"
              >
                <div>
                  <p className="font-medium text-[#101010]">{job.title}</p>
                  <p className="text-sm text-[#6b6b6b]">Paid · Receipt ready</p>
                </div>
                {job.payment && (
                  <Button asChild size="sm" variant="outline" className="border-[#e8e8e8]">
                    <Link href={`/payments/receipt/${job.payment.id}`}>
                      <ReceiptText className="mr-1.5 size-3.5" /> Receipt
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-sm border border-[#e8e8e8] bg-white p-6">
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-[#fafafa] p-3">
              <span className="text-sm text-[#6b6b6b]">Failed payments</span>
              <span className="font-medium text-[#101010]">{failedPayments.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#fafafa] p-3">
              <span className="text-sm text-[#6b6b6b]">Awaiting payment</span>
              <span className="font-medium text-[#101010]">{awaitingPayment}</span>
            </div>
            <Button asChild className="w-full bg-[#101010] text-white hover:bg-[#2a2a2a]">
              <Link href="/dashboard">Refresh</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}