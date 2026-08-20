"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

function safeNextPath(path?: string | null) {
  return path && path.startsWith("/") ? path : null;
}

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next =
    safeNextPath(nextPath) || safeNextPath(searchParams.get("next")) || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setLoading(true);
    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: () => {
          router.push(next);
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message ?? "Invalid email or password");
          setLoading(false);
        },
      }
    );
  }

  async function onGoogleSSO() {
    setSsoLoading(true);
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: next,
      },
      {
        onError: () => {
          toast.error(
            "Google SSO is not configured yet. Ask admin to add Google OAuth credentials."
          );
          setSsoLoading(false);
        },
      }
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
          placeholder="Your password"
          required
          className="outline-none h-13 rounded-sm"  
        />
      </div>

      <button 
        type="submit" 
        className="w-full py-4 rounded-lg text-black bg-[#cdeb00] flex items-center justify-center gap-2" 
        disabled={loading}
      >
        {loading && <Loader2 className="size-4 animate-spin flex-shrink-0" />}
        <span>{loading ? "Logging in..." : "Log in"}</span>
      </button>
      
      <div className="flex items-center space-x-2 my-4 mb-5">
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
        New to Aleph Jobs?{" "}
        <Link
          href={`/signup${next && next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}