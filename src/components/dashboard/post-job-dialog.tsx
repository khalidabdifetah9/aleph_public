"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createJob } from "@/server/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import {JOB_CATEGORIES,CURRENCIES,BUDGET_TYPES,JOB_POSTING_FEES_ETB,WORK_MODES,EXPERIENCE_LEVELS,URGENCY_LEVELS,} from "@/lib/constants";
import {Loader2,Plus,Sparkles,Briefcase,DollarSign,MapPin,Calendar,Clock,Tag,Link2,Users,Zap,ShieldCheck,X} from "lucide-react";

export function PostJobDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>(JOB_CATEGORIES[0]);
  const [budgetType, setBudgetType] = useState<string>("FIXED");
  const [currency, setCurrency] = useState<string>("ETB");
  const [workMode, setWorkMode] = useState<string>("REMOTE");
  const [experienceLevel, setExperienceLevel] = useState<string>("MID");
  const [urgencyLevel, setUrgencyLevel] = useState<string>("NORMAL");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    const res = await createJob({
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      category,
      budgetType,
      currency,
      budgetMin: form.get("budgetMin") ? Number(form.get("budgetMin")) : null,
      budgetMax: form.get("budgetMax") ? Number(form.get("budgetMax")) : null,
      location: String(form.get("location") ?? ""),
      deadline: form.get("deadline") ? String(form.get("deadline")) : null,
      workMode,
      experienceLevel,
      urgencyLevel,
      projectLength: String(form.get("projectLength") ?? ""),
      requiredSkills: String(form.get("requiredSkills") ?? ""),
      attachmentsUrl: String(form.get("attachmentsUrl") ?? ""),
    });
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (!res.checkoutUrl) {
      toast.error("Could not open Chapa checkout.");
      return;
    }
    toast.success(
      `Continue to Chapa and pay ${res.amount.toLocaleString()} ${res.currency} to publish this job.`
    );
    setOpen(false);
    window.location.href = res.checkoutUrl;
  }

  const getFee = JOB_POSTING_FEES_ETB[category] || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2 bg-[#cdeb00] px-8 py-5.5 hover:bg-[#101010] transition-all duration-300 hover:text-[#cdeb00] text-[#101010]  font-semibold">
            <Plus className="size-4" /> Post a Job
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl p-0">
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#cdeb00]/10">
                <Briefcase className="size-5 text-[#cdeb00]" />
              </div>
              <div>
                <DialogTitle className="font-display text-xl font-semibold text-[#101010]">
                  Post a New Job
                </DialogTitle>
                <DialogDescription className="text-sm text-[#6b6b6b]">
                  Fill in the details below to post your job
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 pt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium text-[#101010] flex items-center gap-2">
              <Tag className="size-4 text-[#cdeb00]" />
              Job Title
              <span className="text-xs font-normal text-[#6b6b6b]">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Logo Design for a Coffee Shop"
              required
              className="border-[#e8e8e8] focus-visible:ring-[#cdeb00] focus-visible:border-[#cdeb00] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#101010] flex items-center gap-2">
                <Sparkles className="size-4 text-[#cdeb00]" />
                Category
                <span className="text-xs font-normal text-[#6b6b6b]">*</span>
              </Label>
              <Select  value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full border-[#e8e8e8] focus:ring-[#cdeb00] h-13!">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#101010] flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#cdeb00]" />
                Posting Fee
              </Label>
              <div className="rounded-xl bg-[#f8f8f8] border border-[#e8e8e8] px-4 py-3">
                <p className="font-semibold text-[#101010]">
                  {getFee.toLocaleString()} ETB
                </p>
                <p className="text-xs text-[#6b6b6b]">One-time payment</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium text-[#101010] flex items-center gap-2">
              <Briefcase className="size-4 text-[#cdeb00]" />
              Description
              <span className="text-xs font-normal text-[#6b6b6b]">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Share the details: what you need, style references, timeline expectations…"
              required
              className="resize-none border-[#e8e8e8] focus-visible:ring-0 focus-visible:border-[#cdeb00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#101010] flex items-center gap-2">
                <DollarSign className="size-4 text-[#cdeb00]" />
                Budget Type
              </Label>
              <Select value={budgetType} onValueChange={setBudgetType}>
                <SelectTrigger className="w-full border-[#e8e8e8] focus:ring-[#cdeb00] h-13!">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_TYPES.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#101010] flex items-center gap-2">
                <DollarSign className="size-4 text-[#cdeb00]" />
                Currency
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full border-[#e8e8e8] focus:ring-[#cdeb00] h-13!">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {budgetType !== "NEGOTIABLE" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="budgetMin" className="text-sm font-medium text-[#101010]">
                  Budget From
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#6b6b6b]">
                    {currency}
                  </span>
                  <Input
                    id="budgetMin"
                    name="budgetMin"
                    type="number"
                    min={0}
                    placeholder="1000"
                    className="pl-12 border-[#e8e8e8] focus-visible:ring-[#cdeb00] focus-visible:border-[#cdeb00]"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="budgetMax" className="text-sm font-medium text-[#101010]">
                  Budget To
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#6b6b6b]">
                    {currency}
                  </span>
                  <Input
                    id="budgetMax"
                    name="budgetMax"
                    type="number"
                    min={0}
                    placeholder="3000"
                    className="pl-12 border-[#e8e8e8] focus-visible:ring-[#cdeb00] focus-visible:border-[#cdeb00]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#101010] flex items-center gap-2">
                <Users className="size-4 text-[#cdeb00]" />
                Work Mode
              </Label>
              <Select value={workMode} onValueChange={setWorkMode}>
                <SelectTrigger className="w-full border-[#e8e8e8] focus:ring-[#cdeb00] h-13!">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORK_MODES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#101010] flex items-center gap-2">
                <Zap className="size-4 text-[#cdeb00]" />
                Experience Level
              </Label>
              <Select
                value={experienceLevel}
                onValueChange={setExperienceLevel}
              >
                <SelectTrigger className="w-full border-[#e8e8e8] focus:ring-[#cdeb00] h-13!">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-sm font-medium text-[#101010] flex items-center gap-2">
                <MapPin className="size-4 text-[#cdeb00]" />
                Location
                <span className="text-xs font-normal text-[#6b6b6b]">(optional)</span>
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="Remote / Addis Ababa"
                className="border-[#e8e8e8] focus-visible:ring-[#cdeb00] focus-visible:border-[#cdeb00]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deadline" className="text-sm font-medium text-[#101010] flex items-center gap-2">
                <Calendar className="size-4 text-[#cdeb00]" />
                Deadline
                <span className="text-xs font-normal text-[#6b6b6b]">(optional)</span>
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                className="border-[#e8e8e8] focus-visible:ring-[#cdeb00] focus-visible:border-[#cdeb00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="projectLength" className="text-sm font-medium text-[#101010] flex items-center gap-2">
                <Clock className="size-4 text-[#cdeb00]" />
                Project Duration
                <span className="text-xs font-normal text-[#6b6b6b]">(optional)</span>
              </Label>
              <Input
                id="projectLength"
                name="projectLength"
                placeholder="e.g. 2 weeks"
                className="border-[#e8e8e8] focus-visible:ring-[#cdeb00] focus-visible:border-[#cdeb00]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#101010] flex items-center gap-2">
                Urgency
              </Label>
              <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                <SelectTrigger className="w-full border-[#e8e8e8] focus:ring-[#cdeb00] h-13!">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {URGENCY_LEVELS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="requiredSkills" className="text-sm font-medium text-[#101010] flex items-center gap-2">
              <Tag className="size-4 text-[#cdeb00]" />
              Required Skills
              <span className="text-xs font-normal text-[#6b6b6b]">(optional)</span>
            </Label>
            <Input
              id="requiredSkills"
              name="requiredSkills"
              placeholder="Logo design, Adobe Illustrator, social media strategy"
              className="border-[#e8e8e8] focus-visible:ring-[#cdeb00] focus-visible:border-[#cdeb00]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="attachmentsUrl" className="text-sm font-medium text-[#101010] flex items-center gap-2">
              <Link2 className="size-4 text-[#cdeb00]" />
              Reference Link
              <span className="text-xs font-normal text-[#6b6b6b]">(optional)</span>
            </Label>
            <Input
              id="attachmentsUrl"
              name="attachmentsUrl"
              placeholder="Drive, Figma, Notion, or brief document URL..."
              className="border-[#e8e8e8] focus-visible:ring-[#cdeb00] focus-visible:border-[#cdeb00]"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              className="gap-2 bg-[#cdeb00] text-[#101010] px-4 hover:bg-[#cdeb00] font-semibold w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Publish Job — {getFee.toLocaleString()} ETB
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}