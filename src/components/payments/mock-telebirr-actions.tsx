"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { markMockPaymentPaid, markPaymentFailed } from "@/server/payments";

export function MockTelebirrActions({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"pay" | "cancel" | null>(null);

  async function onPay() {
    setLoading("pay");
    const res = await markMockPaymentPaid(paymentId);
    setLoading(null);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Payment successful. Opening your receipt...");
    router.push(`/payments/receipt/${paymentId}`);
    router.refresh();
  }

  async function onCancel() {
    setLoading("cancel");
    await markPaymentFailed(paymentId, "Cancelled by client from mock page");
    setLoading(null);
    toast.message("Payment cancelled.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button disabled={loading !== null} onClick={onPay}>
        {loading === "pay" ? "Processing..." : "Pay now"}
      </Button>
      <Button variant="outline" disabled={loading !== null} onClick={onCancel}>
        {loading === "cancel" ? "Cancelling..." : "Cancel"}
      </Button>
    </div>
  );
}
