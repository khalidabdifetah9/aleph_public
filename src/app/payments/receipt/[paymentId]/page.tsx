import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DownloadReceiptButton } from "@/components/payments/download-receipt-button";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;

  const reqHeaders = await headers();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/auth/get-session`,
    {
      headers: reqHeaders,
      cache: "no-store",
    }
  );

  const authData = res.ok ? await res.json() : null;
  const user = authData?.user;

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/payments/receipt/${paymentId}`)}`);
  }

  const payment = await prisma.jobPayment.findUnique({
    where: { id: paymentId },
    include: {
      job: { select: { id: true, title: true } },
      client: { select: { name: true, email: true } },
    },
  });

  if (!payment || payment.clientId !== user.id) {
    redirect("/dashboard");
  }

  if (payment.status !== "PAID") {
    redirect("/dashboard");
  }

  const receiptNumber = `AJ-${payment.id.slice(0, 8).toUpperCase()}`;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm font-medium text-primary">Payment receipt</p>
          <h1 className="mt-2 font-display text-2xl font-semibold">
            Receipt #{receiptNumber}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Keep this receipt for your records.
          </p>

          <div className="mt-6 space-y-3 rounded-xl border bg-muted/30 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payment provider</span>
              <span className="font-medium">{payment.provider}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Provider reference</span>
              <span className="font-medium">
                {payment.providerReference || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                {payment.amount.toLocaleString()} {payment.currency}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Paid on</span>
              <span className="font-medium">
                {payment.paidAt
                  ? new Date(payment.paidAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Job title</span>
              <span className="font-medium">{payment.job.title}</span>
            </div>
          </div>

          <div className="mt-6">
            <DownloadReceiptButton
              receiptNumber={receiptNumber}
              paymentId={payment.id}
              provider={payment.provider}
              providerReference={payment.providerReference}
              amount={payment.amount}
              currency={payment.currency}
              paidAt={payment.paidAt}
              clientName={payment.client.name}
              clientEmail={payment.client.email}
              jobTitle={payment.job.title}
              jobId={payment.job.id}
            />
          </div>

          <div className="mt-6">
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}