"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  setUserVerification,
  postJob,
  rejectJob,
} from "@/server/admin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Copy, Loader2, Send, X } from "lucide-react";

export function AdminUserActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  function approve() {
    startTransition(async () => {
      const res = await setUserVerification({ userId, status: "APPROVED" });
      if (res.error) toast.error(res.error);
      else toast.success("User approved");
      router.refresh();
    });
  }

  function reject() {
    startTransition(async () => {
      const res = await setUserVerification({
        userId,
        status: "REJECTED",
        reason: reason.trim() || undefined,
      });
      if (res.error) toast.error(res.error);
      else toast.success("User rejected");
      setOpen(false);
      setReason("");
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" className="gap-1.5" disabled={pending} onClick={approve}>
        <Check className="size-3.5" /> Approve
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="gap-1.5" disabled={pending}>
            <X className="size-3.5" /> Reject
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject this user?</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional, shown to the user)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Portfolio link didn't work — please resubmit."
            />
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={reject} disabled={pending}>
              {pending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Confirm rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AdminJobActions({
  jobId,
  telegramText,
}: {
  jobId: string;
  telegramText: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function approve() {
    startTransition(async () => {
      const res = await postJob(jobId);
      if (res.error) toast.error(res.error);
      else toast.success("Job approved, posted to Telegram, and now live.");
      router.refresh();
    });
  }

  function decline() {
    startTransition(async () => {
      const res = await rejectJob(jobId);
      if (res.error) toast.error(res.error);
      else toast.success("Job rejected");
      router.refresh();
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(telegramText);
      toast.success("Copied — paste it into your Telegram group");
    } catch {
      toast.error("Couldn't copy automatically");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" className="gap-1.5" disabled={pending} onClick={approve}>
        {pending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Check className="size-3.5" />
        )}
        Approve &amp; post
      </Button>
      <Button size="sm" variant="outline" className="gap-1.5" onClick={copy}>
        <Copy className="size-3.5" /> Copy for Telegram
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="gap-1.5 text-muted-foreground"
        disabled={pending}
        onClick={decline}
      >
        <X className="size-3.5" /> Reject
      </Button>
    </div>
  );
}

export function TelegramShareButton({ text }: { text: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied for Telegram");
    } catch {
      toast.error("Couldn't copy");
    }
  }
  return (
    <Button size="sm" variant="outline" className="gap-1.5" onClick={copy}>
      <Send className="size-3.5" /> Copy for Telegram
    </Button>
  );
}
