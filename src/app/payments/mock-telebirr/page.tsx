import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { MockTelebirrActions } from "@/components/payments/mock-telebirr-actions";
import { prisma } from "@/lib/prisma";

export default async function MockTelebirrPage({
  searchParams,
}: {
  searchParams: Promise<{ paymentId?: string }>;
}) {
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

  const { paymentId } = await searchParams;

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/payments/mock-telebirr?paymentId=${paymentId || ""}`)}`);
  }

  if (!paymentId) redirect("/dashboard");

  const payment = await prisma.jobPayment.findUnique({
    where: { id: paymentId },
    include: { job: true },
  });

  if (!payment || payment.clientId !== user.id) {
    redirect("/dashboard");
  }

  if (payment.status === "PAID") {
    redirect(`/payments/receipt/${payment.id}`);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12">
        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm font-medium text-primary">Mock Chapa Checkout</p>
          <h1 className="mt-2 font-display text-2xl font-semibold">
            {payment.amount.toLocaleString()} {payment.currency}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Job posting fee for: <span className="font-medium">{payment.job.title}</span>
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            This page simulates Chapa while you complete merchant onboarding. In
            production, your client will be redirected to the real Chapa checkout.
          </p>
          <div className="mt-6">
            <MockTelebirrActions paymentId={payment.id} />
          </div>
        </div>
      </main>
    </>
  );
}