"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

type TelegramUser = Record<string, unknown> & { id: number };

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

export function TelegramVerify({
  configured,
  botUsername,
}: {
  configured: boolean;
  botUsername?: string;
}) {
  const router = useRouter();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  async function submit(payload: Record<string, unknown>) {
    setLoading(true);
    try {
      const res = await fetch("/api/telegram/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed");
      toast.success("Telegram verified successfully!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!configured || !botUsername || !widgetRef.current) return;

    window.onTelegramAuth = (user: TelegramUser) => submit(user);

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    const container = widgetRef.current;
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured, botUsername]);

  if (configured) {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <div ref={widgetRef} className="min-h-[48px]" />
        {loading && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Linking your account…
          </p>
        )}
        <p className="max-w-sm text-center text-xs text-muted-foreground">
          Open Telegram on your phone (or log in at web.telegram.org) first, then
          tap the button above and approve the login request.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="grid size-11 place-items-center rounded-full bg-[#229ED9]/10 text-[#229ED9]">
        <Send className="size-5" />
      </span>
      <p className="max-w-xs text-center text-sm font-medium">
        Telegram verification is temporarily unavailable
      </p>
      <p className="max-w-xs text-center text-xs text-muted-foreground">
        The Telegram bot is not configured on the server yet. Please contact
        support so your account can be verified.
      </p>
    </div>
  );
}
