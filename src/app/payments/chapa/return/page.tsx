import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { verifyChapaTransaction } from "@/lib/chapa";
import { completePaymentByProviderReference } from "@/server/payments";

export default async function ChapaReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ paymentId?: string; tx_ref?: string; trx_ref?: string }>;
}) {
  const user = await requireUser();
  const { paymentId, tx_ref, trx_ref } = await searchParams;
  if (!paymentId) redirect("/dashboard");

  const payment = await prisma.jobPayment.findUnique({
    where: { id: paymentId },
  });
  if (!payment || payment.clientId !== user.id) redirect("/dashboard");

  const providerReference = tx_ref || trx_ref || payment.providerReference || undefined;

  if (payment.status !== "PAID" && providerReference) {
    const verified = await verifyChapaTransaction(providerReference);
    if (verified.success) {
      await completePaymentByProviderReference(providerReference);
    }
  }

  const latest = await prisma.jobPayment.findUnique({
    where: { id: paymentId },
  });
  const paid = latest?.status === "PAID";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12">
        <div className="rounded-2xl border bg-card p-6">
          <h1 className="font-display text-2xl font-semibold">
            {paid ? "Payment received" : "Payment still pending"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {paid
              ? "Thanks! Your job is now live and visible to designers."
              : "We have not confirmed your Chapa payment yet. If you completed it, wait a moment and refresh this page."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {paid ? (
              <Button asChild>
                <Link href={`/payments/receipt/${paymentId}`}>View receipt</Link>
              </Button>
            ) : null}
            <Button asChild variant={paid ? "outline" : "default"}>
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
