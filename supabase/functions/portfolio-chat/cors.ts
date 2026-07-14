function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/$/, "");
}

export function allowedOrigins(): string[] {
  const configured = Deno.env.get("ALLOWED_ORIGINS") ?? "https://ibra-create.github.io";
  return configured.split(",").map(normalizeOrigin).filter(Boolean);
}

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return Deno.env.get("ALLOW_NO_ORIGIN") === "true";
  const normalized = normalizeOrigin(origin);
  if (allowedOrigins().includes(normalized)) return true;
  try {
    const url = new URL(normalized);
    return (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      (url.protocol === "http:" || url.protocol === "https:");
  } catch {
    return false;
  }
}

export function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
  if (origin && isOriginAllowed(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}
