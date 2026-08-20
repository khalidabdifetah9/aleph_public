"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SignupForm({
  defaultRole = "CLIENT",
  nextPath,
}: {
  defaultRole?: string;
  nextPath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next =
    (nextPath && nextPath.startsWith("/") ? nextPath : null) ||
    (searchParams.get("next")?.startsWith("/") ? searchParams.get("next") : null);
  const [role, setRole] = useState(
    defaultRole === "DESIGNER" ? "DESIGNER" : "CLIENT"
  );
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!name || !email || password.length < 6) {
      toast.error("Please fill all fields (password min 6 characters)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || data?.error || "Could not create account");
        setLoading(false);
        return;
      }

      toast.success("Welcome to Aleph Jobs!");
      router.push(
        next ? `/verify?next=${encodeURIComponent(next)}` : "/verify"
      );
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred during signup");
      setLoading(false);
    }
  }

  async function onGoogleSSO() {
    setSsoLoading(true);
    const params = new URLSearchParams({ role });
    if (next) params.set("next", next);

    try {
      const res = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          callbackURL: `/verify?${params.toString()}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.url) {
        toast.error(
          "Google SSO is not configured yet. Ask admin to add Google OAuth credentials."
        );
        setSsoLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error(
        "Google SSO is not configured yet. Ask admin to add Google OAuth credentials."
      );
      setSsoLoading(false);
    }
  }

  const roles = [
    {
      value: "CLIENT",
      label: "I need work done",
      hint: "Post jobs & hire",
    },
    {
      value: "DESIGNER",
      label: "I'm a designer",
      hint: "Find work & get hired",
    },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {roles.map((r) => {
          const active = role === r.value;
          return (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-all",
                active
                  ? "border-[#cdeb00] bg-[#cdeb00]/30 ring-2 ring-[#cdeb00]/30"
                  : "border-border hover:border-[#cdeb00]"
              )}
            >
              <span className="text-sm font-medium">{r.label}</span>
              <span className="text-xs text-muted-foreground">{r.hint}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input className="outline-none h-13 rounded-sm" id="name" name="name" placeholder="Abebe Kebede" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="outline-none h-13 rounded-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          required
          className="focus:outline-none focus:ring-0 h-13 rounded-sm"
        />
      </div>

      <button type="submit" className="w-full py-4 rounded-lg gap-2 text-black bg-[#cdeb00] flex items-center justify-center" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        <span>{loading ? "Creating account..." : "Create account"}</span>
      </button>

      <div className="flex items-center space-x-2 my-3 mb-5">
        <span className="w-full h-px bg-[#101010]/30"/>
        <span>or</span>
        <span className="w-full h-px bg-[#101010]/30"/>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 flex items-center justify-center"
        disabled={ssoLoading}
        onClick={onGoogleSSO}
      >
        {ssoLoading && <Loader2 className="size-4 animate-spin flex-shrink-0" />}
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span>{ssoLoading ? "Redirecting..." : "Continue with Google"}</span>
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}