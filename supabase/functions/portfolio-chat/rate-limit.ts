import { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { CONFIG } from "./config.ts";

// In-memory fallback (used if DB call fails or supabase is not passed)
interface Bucket { minuteStart: number; minuteCount: number; dayStart: number; dayCount: number; lastSeen: number; }
const buckets = new Map<string, Bucket>();

function startOfDay(now: number): number {
  const d = new Date(now); d.setUTCHours(0, 0, 0, 0); return d.getTime();
}

function memoryRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const minuteStart = now - (now % 60000);
  const dayStart = startOfDay(now);
  const bucket = buckets.get(key) ?? { minuteStart, minuteCount: 0, dayStart, dayCount: 0, lastSeen: now };
  if (bucket.minuteStart !== minuteStart) { bucket.minuteStart = minuteStart; bucket.minuteCount = 0; }
  if (bucket.dayStart !== dayStart) { bucket.dayStart = dayStart; bucket.dayCount = 0; }
  bucket.minuteCount += 1; bucket.dayCount += 1; bucket.lastSeen = now; buckets.set(key, bucket);

  if (buckets.size > 5000) {
    for (const [id, value] of buckets) if (now - value.lastSeen > 86400000) buckets.delete(id);
  }
  if (bucket.minuteCount > CONFIG.requestsPerMinute) return { allowed: false, retryAfterSeconds: 60 - Math.floor((now % 60000) / 1000) };
  if (bucket.dayCount > CONFIG.requestsPerDay) return { allowed: false, retryAfterSeconds: Math.ceil((dayStart + 86400000 - now) / 1000) };
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Persistent DB-backed rate limit using the check_chat_rate_limit RPC.
 * Falls back to in-memory if the DB call fails.
 */
export async function checkRateLimit(
  key: string,
  supabase?: SupabaseClient,
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc("check_chat_rate_limit", {
        p_key_hash: key,
        p_requests_per_minute: CONFIG.requestsPerMinute,
        p_requests_per_day: CONFIG.requestsPerDay,
      });
      if (!error && data && data.length > 0) {
        return { allowed: data[0].allowed, retryAfterSeconds: data[0].retry_after_seconds };
      }
      console.warn("DB rate limit fallback to memory:", error?.message ?? "no data");
    } catch (e) {
      console.warn("DB rate limit exception, fallback:", e instanceof Error ? e.message : "unknown");
    }
  }
  return memoryRateLimit(key);
}

export async function anonymousRateKey(req: Request, sessionId?: string): Promise<string> {
  const material = sessionId || `${req.headers.get("user-agent") ?? "unknown"}:${req.headers.get("origin") ?? "no-origin"}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(material));
  return Array.from(new Uint8Array(digest)).slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}
