"use client";

import { Button } from "@/components/ui/button";

interface ReceiptDownloadProps {
  receiptNumber: string;
  paymentId: string;
  provider: string;
  providerReference?: string | null;
  amount: number;
  currency: string;
  paidAt?: Date | string | null;
  clientName: string;
  clientEmail: string;
  jobTitle: string;
  jobId: string;
}

export function DownloadReceiptButton(props: ReceiptDownloadProps) {
  const {
    receiptNumber,
    paymentId,
    provider,
    providerReference,
    amount,
    currency,
    paidAt,
    clientName,
    clientEmail,
    jobTitle,
    jobId,
  } = props;

  function buildReceiptText() {
    const paid = paidAt ? new Date(paidAt).toISOString() : "N/A";
    return [
      "ALEPH JOBS - PAYMENT RECEIPT",
      "====================================",
      `Receipt No: ${receiptNumber}`,
      `Payment ID: ${paymentId}`,
      `Payment Provider: ${provider}`,
      `Provider Reference: ${providerReference || "N/A"}`,
      `Amount: ${amount.toLocaleString()} ${currency}`,
      `Paid At (UTC): ${paid}`,
      "",
      `Client Name: ${clientName}`,
      `Client Email: ${clientEmail}`,
      "",
      `Job ID: ${jobId}`,
      `Job Title: ${jobTitle}`,
      "====================================",
      "Thank you for using Aleph Jobs.",
    ].join("\n");
  }

  function onDownload() {
    const content = buildReceiptText();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aleph-jobs-receipt-${receiptNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={onDownload}>Download receipt</Button>
      <Button type="button" variant="outline" onClick={() => window.print()}>
        Print receipt
      </Button>
    </div>
  );
}
