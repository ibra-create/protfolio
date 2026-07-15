import { CONFIG } from "./config.ts";
import { SYSTEM_INSTRUCTION, userPrompt } from "./prompts.ts";

import type {
  ConversationMessage,
  GeminiResult,
  Language,
  RankedKnowledge,
} from "./types.ts";

/**
 * Reads a server-side environment variable from the Supabase Deno runtime.
 *
 * Using globalThis avoids the "Cannot find name 'Deno'" editor error
 * without exposing secrets or changing the Supabase runtime behavior.
 */
function getEnvironmentVariable(name: string): string | undefined {
  const runtime = globalThis as typeof globalThis & {
    Deno?: {
      env: {
        get(key: string): string | undefined;
      };
    };
  };

  return runtime.Deno?.env.get(name);
}

/**
 * Removes optional Markdown JSON fences before parsing the model response.
 */
function parseGeminiJson(text: string): unknown {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(trimmed);
}

/**
 * Validates and sanitizes the structured response returned by Gemini.
 */
function validateResult(
  value: unknown,
  language: Language,
  validKeys: Set<string>,
): GeminiResult {
  if (!value || typeof value !== "object") {
    throw new Error("MODEL_INVALID_RESPONSE");
  }

  const raw = value as Record<string, unknown>;

  if (typeof raw.answer !== "string" || !raw.answer.trim()) {
    throw new Error("MODEL_INVALID_RESPONSE");
  }

  const confidence = ["high", "medium", "low"].includes(
      String(raw.confidence),
    )
    ? raw.confidence as GeminiResult["confidence"]
    : "medium";

  const sourceKeys = Array.isArray(raw.source_keys)
    ? raw.source_keys
      .filter(
        (item): item is string =>
          typeof item === "string" && validKeys.has(item),
      )
      .slice(0, 6)
    : [];

  const followups = Array.isArray(raw.suggested_followups)
    ? raw.suggested_followups
      .filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
      .map((item) => item.trim().slice(0, 180))
      .slice(0, 3)
    : [];

  return {
    answer: raw.answer.trim().slice(0, 2200),
    language,
    confidence,
    source_keys: sourceKeys,
    suggested_followups: followups,
  };
}

/**
 * Calls the configured Gemini model using verified portfolio context.
 */
export async function callGemini(
  question: string,
  language: Language,
  context: string,
  history: ConversationMessage[],
  rows: RankedKnowledge[],
): Promise<{
  result: GeminiResult;
  model: string;
}> {
  const apiKey = getEnvironmentVariable("GEMINI_API_KEY");

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured.");
    throw new Error("MODEL_UNAVAILABLE");
  }

  const model =
    getEnvironmentVariable("GEMINI_MODEL") ||
    CONFIG.defaultModel;

  const controller = new AbortController();

  const timer = setTimeout(
    () => controller.abort(),
    CONFIG.geminiTimeoutMs,
  );

  try {
    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `${encodeURIComponent(model)}:generateContent`;

    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },

      signal: controller.signal,

      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: SYSTEM_INSTRUCTION,
            },
          ],
        },

        contents: [
          {
            role: "user",
            parts: [
              {
                text: userPrompt(
                  question,
                  language,
                  context,
                  history,
                ),
              },
            ],
          },
        ],

        generationConfig: {
          temperature: 0.15,
          topP: 0.8,
          maxOutputTokens: 650,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      let errorStatus = String(response.status);
      let errorMessage = "Unknown Gemini API error";

      try {
        const errorBody = await response.json() as {
          error?: {
            status?: string;
            message?: string;
          };
        };

        errorStatus =
          errorBody.error?.status ||
          String(response.status);

        errorMessage =
          errorBody.error?.message ||
          errorMessage;
      } catch {
        // The Gemini error response was not valid JSON.
      }

      console.warn(
        JSON.stringify({
          event: "gemini_request_failed",
          http_status: response.status,
          provider_status: errorStatus,
          provider_message: errorMessage.slice(0, 300),
          model,
        }),
      );

      throw new Error("MODEL_UNAVAILABLE");
    }

    const payload = await response.json() as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
        finishReason?: string;
      }>;
      promptFeedback?: {
        blockReason?: string;
      };
    };

    const blockedReason =
      payload.promptFeedback?.blockReason;

    if (blockedReason) {
      console.warn(
        JSON.stringify({
          event: "gemini_response_blocked",
          block_reason: blockedReason,
          model,
        }),
      );

      throw new Error("MODEL_INVALID_RESPONSE");
    }

    const candidate = payload.candidates?.[0];

    const text =
      candidate?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!text) {
      console.warn(
        JSON.stringify({
          event: "gemini_empty_response",
          finish_reason:
            candidate?.finishReason ?? "unknown",
          model,
        }),
      );

      throw new Error("MODEL_INVALID_RESPONSE");
    }

    let parsed: unknown;

    try {
      parsed = parseGeminiJson(text);
    } catch {
      console.warn(
        JSON.stringify({
          event: "gemini_invalid_json",
          model,
          response_length: text.length,
        }),
      );

      throw new Error("MODEL_INVALID_RESPONSE");
    }

    const validSourceKeys = new Set(
      rows.map((row) => row.stable_key),
    );

    const result = validateResult(
      parsed,
      language,
      validSourceKeys,
    );

    return {
      result,
      model,
    };
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      console.warn(
        JSON.stringify({
          event: "gemini_timeout",
          model,
          timeout_ms: CONFIG.geminiTimeoutMs,
        }),
      );

      throw new Error("MODEL_UNAVAILABLE");
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}
