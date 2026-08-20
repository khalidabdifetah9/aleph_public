"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfile } from "@/server/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BriefcaseBusiness, Languages, Loader2, Palette, UserRound } from "lucide-react";

export interface ProfileFormUser {
  name: string;
  role: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  phone?: string | null;
  languages?: string | null;
  linkedinUrl?: string | null;
  profileImage?: string | null;
  skills?: string | null;
  portfolioUrl?: string | null;
  hourlyRate?: number | null;
  company?: string | null;
  companyWebsite?: string | null;
  industry?: string | null;
}

const LOCATION_OPTIONS = [
  "Addis Ababa",
  "Adama",
  "Bahir Dar",
  "Hawassa",
  "Mekelle",
  "Dire Dawa",
  "Remote",
] as const;

const LANGUAGE_OPTIONS = [
  "English",
  "Amharic",
  "Afaan Oromo",
  "Tigrinya",
  "French",
  "Arabic",
] as const;

const INDUSTRY_OPTIONS = [
  "Technology",
  "Retail & E-commerce",
  "Education",
  "Health",
  "Finance",
  "Media & Marketing",
  "Food & Hospitality",
  "Construction & Real Estate",
  "Other",
] as const;

export function ProfileForm({
  user,
  onSaved,
  submitLabel = "Save profile",
}: {
  user: ProfileFormUser;
  onSaved?: () => void;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isDesigner = user.role === "DESIGNER";
  const [location, setLocation] = useState(
    user.location && LOCATION_OPTIONS.includes(user.location as (typeof LOCATION_OPTIONS)[number])
      ? user.location
      : "Addis Ababa"
  );
  const [language, setLanguage] = useState(
    user.languages &&
      LANGUAGE_OPTIONS.includes(user.languages as (typeof LANGUAGE_OPTIONS)[number])
      ? user.languages
      : "English"
  );
  const [industry, setIndustry] = useState(
    user.industry &&
      INDUSTRY_OPTIONS.includes(user.industry as (typeof INDUSTRY_OPTIONS)[number])
      ? user.industry
      : "Technology"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    const res = await updateProfile({
      name: String(form.get("name") ?? ""),
      headline: String(form.get("headline") ?? ""),
      bio: String(form.get("bio") ?? ""),
      location,
      phone: String(form.get("phone") ?? ""),
      languages: language,
      linkedinUrl: String(form.get("linkedinUrl") ?? ""),
      profileImage: String(form.get("profileImage") ?? ""),
      skills: String(form.get("skills") ?? ""),
      portfolioUrl: String(form.get("portfolioUrl") ?? ""),
      company: String(form.get("company") ?? ""),
      companyWebsite: String(form.get("companyWebsite") ?? ""),
      industry: isDesigner ? "" : industry,
      hourlyRate: form.get("hourlyRate")
        ? Number(form.get("hourlyRate"))
        : null,
    });
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Profile saved");
    router.refresh();
    onSaved?.();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div
        className={`rounded-2xl border p-4 ${
          isDesigner
            ? "border-primary/30 bg-primary/5"
            : "border-mint/30 bg-mint/10"
        }`}
      >
        <p className="flex items-center gap-2 text-sm font-medium">
          {isDesigner ? (
            <Palette className="size-4 text-primary" />
          ) : (
            <BriefcaseBusiness className="size-4 text-mint" />
          )}
          {isDesigner ? "Designer profile" : "Client profile"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {isDesigner
            ? "Make it easy for clients to trust your style, skills, and pricing."
            : "Share clear company details so designers understand your brand quickly."}
        </p>
      </div>

      <section className="rounded-2xl border bg-card/60 p-4">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <UserRound className="size-4 text-primary" />
          Identity
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" defaultValue={user.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headline">
            {isDesigner ? "Headline / craft" : "Headline"}
          </Label>
          <Input
            id="headline"
            name="headline"
            defaultValue={user.headline ?? ""}
            placeholder={
              isDesigner ? "Brand & logo designer" : "Marketing manager"
            }
          />
        </div>
      </div>
      </section>

      <section className="rounded-2xl border bg-card/60 p-4">
      <div className="space-y-2">
        <Label htmlFor="bio">{isDesigner ? "About your work" : "About"}</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={user.bio ?? ""}
          rows={3}
          placeholder={
            isDesigner
              ? "Tell clients about your experience and style…"
              : "Tell us a little about you or your business…"
          }
        />
      </div>
      </section>

      <section className="rounded-2xl border bg-card/60 p-4">
      <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <Languages className="size-4 text-primary" />
        Contact & presence
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCATION_OPTIONS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={user.phone ?? ""}
            placeholder="+251…"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Primary language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn profile</Label>
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            defaultValue={user.linkedinUrl ?? ""}
            placeholder="linkedin.com/in/username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile image URL</Label>
          <Input
            id="profileImage"
            name="profileImage"
            defaultValue={user.profileImage ?? ""}
            placeholder="https://..."
          />
        </div>
      </div>
      </section>

      {isDesigner ? (
        <section className="rounded-2xl border bg-card/60 p-4">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Palette className="size-4 text-primary" />
          Portfolio details
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              name="skills"
              defaultValue={user.skills ?? ""}
              placeholder="Logo design, Illustration, Figma"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">Portfolio link</Label>
            <Input
              id="portfolioUrl"
              name="portfolioUrl"
              defaultValue={user.portfolioUrl ?? ""}
              placeholder="behance.net/you"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly rate (ETB)</Label>
            <Input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              min={0}
              defaultValue={user.hourlyRate ?? ""}
              placeholder="500"
            />
          </div>
        </div>
        </section>
      ) : (
        <section className="rounded-2xl border bg-card/60 p-4">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <BriefcaseBusiness className="size-4 text-mint" />
          Company details
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Company / brand</Label>
            <Input
              id="company"
              name="company"
              defaultValue={user.company ?? ""}
              placeholder="Your business name"
            />
          </div>
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRY_OPTIONS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="companyWebsite">Company website</Label>
            <Input
              id="companyWebsite"
              name="companyWebsite"
              defaultValue={user.companyWebsite ?? ""}
              placeholder="https://yourcompany.com"
            />
          </div>
        </div>
        </section>
      )}

      <Button type="submit" className="gap-2" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
