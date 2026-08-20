import crypto from "crypto";

export interface TelegramAuthData {
  id: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number | string;
  hash: string;
}

/**
 * Verifies that a Telegram Login Widget payload genuinely came from Telegram.
 *
 * How it works (per Telegram's docs):
 *  1. secret_key = SHA256(bot_token)
 *  2. data_check_string = all received fields except `hash`, sorted by key,
 *     formatted as `key=value` and joined with newlines
 *  3. HMAC-SHA256(data_check_string, secret_key) must equal the received hash
 *  4. `auth_date` must be recent (we allow 24h)
 */
export function verifyTelegramAuth(
  data: TelegramAuthData,
  botToken: string
): boolean {
  const { hash, ...fields } = data;
  if (!hash) return false;

  const dataCheckString = Object.keys(fields)
    .filter((key) => (fields as Record<string, unknown>)[key] !== undefined)
    .sort()
    .map((key) => `${key}=${(fields as Record<string, unknown>)[key]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (computedHash !== hash) return false;

  const authDate = Number(data.auth_date);
  const now = Math.floor(Date.now() / 1000);
  if (!authDate || now - authDate > 86400) return false;

  return true;
}

/**
 * Whether a real Telegram bot has been configured. Verification is mandatory,
 * so when this is false nobody can pass the gate.
 */
export function isTelegramConfigured(): boolean {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  return Boolean(
    token &&
      !token.includes("PASTE") &&
      username &&
      !username.includes("PASTE")
  );
}
