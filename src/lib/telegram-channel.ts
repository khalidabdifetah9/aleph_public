import { formatBudget } from "@/lib/format";

interface JobForTelegram {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string | null;
  deadline: Date | null;
  budgetType: string;
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string;
}

export function buildTelegramJobText(job: JobForTelegram): string {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const lines = [
    "🎨 New job on Aleph Jobs!",
    "",
    `📌 ${job.title}`,
    `🏷 ${job.category}`,
    `💰 ${formatBudget(job)}`,
  ];

  if (job.location) lines.push(`📍 ${job.location}`);
  if (job.deadline) {
    lines.push(`🗓 Deadline: ${new Date(job.deadline).toLocaleDateString()}`);
  }

  lines.push("", job.description, "", `👉 Apply here: ${appUrl}/jobs/${job.id}`);
  return lines.join("\n");
}

export async function postToTelegramChannel(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!token || !channelId) {
    return {
      error:
        "Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID in environment variables.",
    };
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: channelId,
      text,
      disable_web_page_preview: true,
    }),
  });

  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; result?: { message_id?: number }; description?: string }
    | null;

  if (!res.ok || !data?.ok) {
    return {
      error:
        data?.description ||
        `Telegram API error (${res.status}). Please verify channel ID and bot channel admin access.`,
    };
  }

  return { success: true, messageId: data.result?.message_id };
}
