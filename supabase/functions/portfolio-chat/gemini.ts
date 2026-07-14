import { CONFIG } from "./config.ts";
import { SYSTEM_INSTRUCTION, userPrompt } from "./prompts.ts";
import { ConversationMessage, GeminiResult, Language, RankedKnowledge } from "./types.ts";

function parseGeminiJson(text: string): unknown {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(trimmed);
}

function validateResult(value: unknown, language: Language, validKeys: Set<string>): GeminiResult {
  if (!value || typeof value !== "object") throw new Error("MODEL_INVALID_RESPONSE");
  const raw = value as Record<string, unknown>;
  if (typeof raw.answer !== "string" || !raw.answer.trim()) throw new Error("MODEL_INVALID_RESPONSE");
  const confidence = ["high", "medium", "low"].includes(String(raw.confidence)) ? raw.confidence as GeminiResult["confidence"] : "medium";
  const sourceKeys = Array.isArray(raw.source_keys)
    ? raw.source_keys.filter((x): x is string => typeof x === "string" && validKeys.has(x)).slice(0, 6)
    : [];
  const followups = Array.isArray(raw.suggested_followups)
    ? raw.suggested_followups.filter((x): x is string => typeof x === "string").map((x) => x.slice(0, 180)).slice(0, 3)
    : [];
  return { answer: raw.answer.trim().slice(0, 2200), language, confidence, source_keys: sourceKeys, suggested_followups: followups };
}

export async function callGemini(
  question: string,
  language: Language,
  context: string,
  history: ConversationMessage[],
  rows: RankedKnowledge[],
): Promise<{ result: GeminiResult; model: string }> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) throw new Error("MODEL_UNAVAILABLE");
  const model = Deno.env.get("GEMINI_MODEL") || CONFIG.defaultModel;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONFIG.geminiTimeoutMs);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: "user", parts: [{ text: userPrompt(question, language, context, history) }] }],
        generationConfig: {
          temperature: 0.15,
          topP: 0.8,
          maxOutputTokens: 650,
          responseMimeType: "application/json",
        },
      }),
    });
    if (!response.ok) {
      let errCode = "unknown";
      try {
        const errBody = await response.json();
        errCode = errBody?.error?.status ?? String(response.status);
      } catch { /* ignore parse errors */ }
      console.warn(`Gemini HTTP ${response.status} (${errCode}) model=${model}`);
      throw new Error("MODEL_UNAVAILABLE");
    }
    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
    const parsed = parseGeminiJson(text);
    return { result: validateResult(parsed, language, new Set(rows.map((r) => r.stable_key))), model };
  } finally {
    clearTimeout(timer);
  }
}
