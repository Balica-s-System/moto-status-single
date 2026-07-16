import { headers } from "next/headers";

const attempts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export const checkRateLimit = async () => {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    throw new Error("Muitas tentativas. Tente novamente mais tarde.");
  }

  entry.count++;
};
