import { ChatRequest, ConversationMessage } from "./types.ts";
import { CONFIG } from "./config.ts";

export class RequestValidationError extends Error {}

export function validateChatRequest(value: unknown): ChatRequest {
  if (!value || typeof value !== "object") throw new RequestValidationError("INVALID_BODY");
  const raw = value as Record<string, unknown>;
  if (typeof raw.question !== "string") throw new RequestValidationError("QUESTION_REQUIRED");
  const question = raw.question.trim().replace(/\s+/g, " ");
  if (question.length < CONFIG.minQuestionLength) throw new RequestValidationError("QUESTION_TOO_SHORT");
  if (question.length > CONFIG.maxQuestionLength) throw new RequestValidationError("QUESTION_TOO_LONG");

  const language = raw.language ?? "auto";
  if (!(["auto", "fr", "en"] as unknown[]).includes(language)) {
    throw new RequestValidationError("INVALID_LANGUAGE");
  }

  const conversation: ConversationMessage[] = [];
  if (raw.conversation !== undefined) {
    if (!Array.isArray(raw.conversation)) throw new RequestValidationError("INVALID_CONVERSATION");
    for (const candidate of raw.conversation.slice(-CONFIG.maxConversationMessages)) {
      if (!candidate || typeof candidate !== "object") continue;
      const item = candidate as Record<string, unknown>;
      if ((item.role !== "user" && item.role !== "assistant") || typeof item.content !== "string") continue;
      conversation.push({
        role: item.role,
        content: item.content.trim().slice(0, CONFIG.maxHistoryMessageLength),
      });
    }
  }

  let session_id: string | undefined;
  if (typeof raw.session_id === "string") {
    const cleaned = raw.session_id.trim();
    if (/^[A-Za-z0-9_-]{8,100}$/.test(cleaned)) session_id = cleaned;
  }

  return { question, language: language as ChatRequest["language"], conversation, session_id };
}
