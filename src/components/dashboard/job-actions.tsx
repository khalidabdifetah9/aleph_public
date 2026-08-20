"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setApplicationStatus, closeJob } from "@/server/jobs";
import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";

export function ApplicantActions({
  applicationId,
  disabled,
}: {
  applicationId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<"ACCEPTED" | "REJECTED" | null>(null);

  function handle(status: "ACCEPTED" | "REJECTED") {
    setAction(status);
    startTransition(async () => {
      const res = await setApplicationStatus({ applicationId, status });
      if (res.error) toast.error(res.error);
      else
        toast.success(
          status === "ACCEPTED" ? "Designer hired!" : "Applicant declined"
        );
      router.refresh();
      setAction(null);
    });
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        className="gap-1.5"
        disabled={disabled || pending}
        onClick={() => handle("ACCEPTED")}
      >
        {pending && action === "ACCEPTED" ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Check className="size-3.5" />
        )}
        Hire
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="gap-1.5"
        disabled={disabled || pending}
        onClick={() => handle("REJECTED")}
      >
        {pending && action === "REJECTED" ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <X className="size-3.5" />
        )}
        Decline
      </Button>
    </div>
  );
}

export function CloseJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-muted-foreground"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await closeJob(jobId);
          if (res.error) toast.error(res.error);
          else toast.success("Job closed");
          router.refresh();
        })
      }
    >
      {pending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
      Close job
    </Button>
  );
}
