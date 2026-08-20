"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { applyToJob } from "@/server/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Send,
  Sparkles,
  Briefcase,
  DollarSign,
  MessageSquare,
  X,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ApplyDialog({
  jobId,
  jobTitle,
  alreadyApplied,
  existingMessage,
  existingPrice,
}: {
  jobId: string;
  jobTitle: string;
  alreadyApplied?: boolean;
  existingMessage?: string;
  existingPrice?: number | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(existingMessage || "");
  const [characterCount, setCharacterCount] = useState(existingMessage?.length || 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    const res = await applyToJob({
      jobId,
      message: String(form.get("message") ?? ""),
      proposedPrice: form.get("proposedPrice")
        ? Number(form.get("proposedPrice"))
        : null,
    });
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(alreadyApplied ? "Application updated! ✨" : "Application sent! 🎉");
    setOpen(false);
    router.refresh();
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setCharacterCount(e.target.value.length);
  };

  const maxChars = 500;
  const isOverLimit = characterCount > maxChars;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={alreadyApplied ? "outline" : "default"}
          className={cn(
            "gap-2 px-6 py-2.5 rounded-lg transition-all duration-300 font-medium",
            alreadyApplied 
              ? "border-[#101010] text-[#101010] hover:bg-[#101010] py-6 px-8 hover:text-white" 
              : "bg-[#cdeb00] text-[#101010] hover:bg-[#cdeb00] py-6 px-8"
          )}
        >
          {alreadyApplied ? "Edit Application" : "Apply Now"}
          {!alreadyApplied && <ArrowRight className="size-3.5" />}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg overflow-hidden p-0">
        {/* Decorative header bar */}
        <div className="h-1 bg-[#cdeb00]" />

        <div className="p-6 pt-5">
          <DialogHeader className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#cdeb00]/10">
                  <Briefcase className="size-5 text-[#cdeb00]" />
                </div>
                <div>
                  <DialogTitle className="font-display text-xl font-semibold text-[#101010]">
                    {alreadyApplied ? "Update Application" : "Apply for This Job"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-[#6b6b6b]">
                    {alreadyApplied 
                      ? "Refresh your proposal to stand out." 
                      : "Introduce yourself and propose your price."}
                  </DialogDescription>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            {/* Job Title Display */}
            <div className="rounded-lg bg-[#f8f8f8] border border-[#e8e8e8] p-3">
              <p className="text-xs text-[#6b6b6b]">Applying to</p>
              <p className="font-medium text-[#101010]">{jobTitle}</p>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="message" className="text-sm font-medium text-[#101010] flex items-center gap-2">
                  <MessageSquare className="size-4 text-[#cdeb00]" />
                  Your Pitch
                  <span className="text-xs font-normal text-[#6b6b6b]">*</span>
                </Label>
                <span className={cn(
                  "text-xs font-medium",
                  isOverLimit ? "text-red-500" : "text-[#6b6b6b]"
                )}>
                  {characterCount}/{maxChars}
                </span>
              </div>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={handleMessageChange}
                maxLength={maxChars}
                className={cn(
                  "resize-none border-[#e8e8e8] focus-visible:ring-[#cdeb00] focus-visible:border-[#cdeb00] transition-all",
                  isOverLimit && "border-red-300 focus-visible:ring-red-500"
                )}
                placeholder="Why you're a great fit, relevant work, and how you'd approach it…"
                required
              />
              {isOverLimit && (
                <p className="text-xs text-red-500">Message exceeds {maxChars} characters</p>
              )}
            </div>

            {/* Price Field */}
            <div className="space-y-1.5">
              <Label htmlFor="proposedPrice" className="text-sm font-medium text-[#101010] flex items-center gap-2">
                <DollarSign className="size-4 text-[#cdeb00]" />
                Your Price
                <span className="text-xs font-normal text-[#6b6b6b]">(optional)</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#6b6b6b] font-medium">ETB</span>
                <Input
                  id="proposedPrice"
                  name="proposedPrice"
                  type="number"
                  min={0}
                  step={100}
                  defaultValue={existingPrice ?? undefined}
                  placeholder="Enter your proposed price"
                  className="pl-12 border-[#e8e8e8] focus-visible:ring-[#cdeb00] focus-visible:border-[#cdeb00] transition-all h-11"
                />
              </div>
              <p className="text-xs text-[#6b6b6b]">
                {alreadyApplied 
                  ? "Update your price if needed." 
                  : "Leave empty to negotiate later."}
              </p>
            </div>

            {/* Tips Box */}
            <div className="rounded-lg bg-[#cdeb00]/5 border border-[#cdeb00]/20 p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="size-4 text-[#cdeb00] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#101010]">Tips for a great application:</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-[#6b6b6b]">
                    <li>• Be specific about your relevant experience</li>
                    <li>• Mention similar projects you have worked on</li>
                    <li>• Explain why you have excited about this opportunity</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-[#e8e8e8] text-[#6b6b6b] hover:bg-gray-50 h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gap-2 bg-[#101010] text-white hover:bg-[#2a2a2a] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 h-11"
                disabled={loading || isOverLimit || !message.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {alreadyApplied ? "Updating..." : "Sending..."}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    {alreadyApplied ? "Update Application" : "Send Application"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}