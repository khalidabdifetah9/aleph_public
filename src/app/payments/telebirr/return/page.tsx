import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function TelebirrReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ paymentId?: string }>;
}) {
  const { paymentId } = await searchParams;

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
    redirect(
      `/login?next=${encodeURIComponent(
        `/payments/telebirr-return?paymentId=${paymentId || ""}`
      )}`
    );
  }

  if (!paymentId) redirect("/dashboard");

  const payment = await prisma.jobPayment.findUnique({
    where: { id: paymentId },
  });

  if (!payment || payment.clientId !== user.id) redirect("/dashboard");

  const paid = payment.status === "PAID";

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
              ? "Thanks! Your job has been submitted and is now waiting for admin review."
              : "We haven't received confirmation from Telebirr yet. If you completed payment, wait a minute and refresh this page."}
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}