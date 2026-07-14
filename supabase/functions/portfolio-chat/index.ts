import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, isOriginAllowed } from "./cors.ts";
import { validateChatRequest, RequestValidationError } from "./validation.ts";
import { detectLanguage, localizedMessage } from "./language.ts";
import { anonymousRateKey, checkRateLimit } from "./rate-limit.ts";
import { buildContext, retrieveKnowledge } from "./retrieval.ts";
import { callGemini } from "./gemini.ts";
import { logChatEvent } from "./analytics.ts";
import { CONFIG } from "./config.ts";
import { findCuratedAnswer } from "./curated-matcher.ts";
import type { ActionLink, Confidence, Language, RankedKnowledge, SourceLink } from "./types.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing Supabase server configuration");
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });

const UNRELATED = /\b(weather|météo|recipe|recette|world cup|coupe du monde|joke|blague|homework|devoirs?|football score|score de football)\b/i;
const ATTACK = /\b(system prompt|developer message|api key|service role|private database|ignore (all |your )?instructions|reveal (your |the )?(prompt|secret|key))\b/i;
const PUBLIC_LABELS: Record<string, { fr: string; en: string }> = {
  "index.html": { fr: "Profil professionnel", en: "Professional profile" },
  "solar-project.html": { fr: "Micro-réseaux PV+BESS — Dakhla", en: "Dakhla PV+BESS Microgrids" },
  "solar-bess-67mw.html": { fr: "Centrale PV 67 MW + BESS", en: "67 MW PV+BESS Plant" },
  "ibwatts.html": { fr: "IBWatts — Outil solaire", en: "IBWatts — Solar Tool" },
  "smart_house.html": { fr: "Maison bioclimatique intelligente", en: "Smart Bioclimatic House" },
  "hydrotwin.html": { fr: "HydroTwin — Power-to-X", en: "HydroTwin — Power-to-X" },
  "ai-prediction.html": { fr: "Prédiction énergétique par IA", en: "AI Energy Prediction" },
};

function requestId(): string { return crypto.randomUUID(); }

function json(origin: string | null, body: unknown, status = 200, extra: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...corsHeaders(origin), ...extra },
  });
}

function errorResponse(origin: string | null, language: Language, code: string, status: number, id: string): Response {
  const messages: Record<string, [string, string]> = {
    INVALID_REQUEST: ["Invalid request.", "Requête invalide."],
    ORIGIN_NOT_ALLOWED: ["This website is not allowed to use the assistant.", "Ce site n’est pas autorisé à utiliser l’assistant."],
    RATE_LIMITED: ["Too many requests. Please try again later.", "Trop de requêtes. Veuillez réessayer plus tard."],
    NO_RELEVANT_CONTEXT: ["I could not find enough verified portfolio information to answer that question.", "Je n’ai pas trouvé suffisamment d’informations vérifiées dans le portfolio pour répondre à cette question."],
    INTERNAL_ERROR: ["The portfolio assistant encountered a temporary error.", "L’assistant du portfolio a rencontré une erreur temporaire."],
  };
  const pair = messages[code] ?? messages.INTERNAL_ERROR;
  return json(origin, { ok: false, error: { code, message: localizedMessage(language, pair[0], pair[1]) }, request_id: id }, status);
}

function safeSourceUrl(url: string | null): string | null {
  if (!url) return null;
  const value = url.trim();
  if (/\.(md|json|sql|ts|py)(?:[#?].*)?$/i.test(value) || /^(javascript|data|vbscript):/i.test(value)) return null;
  if (/^https?:\/\//i.test(value)) {
    try { const parsed = new URL(value); return parsed.protocol === "https:" ? value : null; } catch { return null; }
  }
  return /^[A-Za-z0-9_./#?=&%-]+$/.test(value) ? value.replace(/^\.\//, "") : null;
}

function pageKey(url: string): string {
  try {
    const path = /^https?:\/\//i.test(url) ? new URL(url).pathname : url;
    return path.replace(/^\//, "").split(/[?#]/)[0].toLowerCase();
  } catch { return url.replace(/^\//, "").split(/[?#]/)[0].toLowerCase(); }
}

function sourcesFromRows(rows: RankedKnowledge[], requestedKeys: string[], language: Language): SourceLink[] {
  const requested = new Set(requestedKeys);
  const ordered = requested.size ? [...rows.filter((x) => requested.has(x.stable_key)), ...rows.filter((x) => !requested.has(x.stable_key))] : rows;
  const seen = new Set<string>();
  const result: SourceLink[] = [];
  for (const row of ordered) {
    const url = safeSourceUrl(row.source_url);
    if (!url) continue;
    const key = pageKey(url);
    if (seen.has(key)) continue;
    seen.add(key);
    const label = PUBLIC_LABELS[key]?.[language] ?? (language === "fr" ? "Source du portfolio" : "Portfolio source");
    result.push({ stable_key: row.stable_key, label, url });
    if (result.length >= 3) break;
  }
  return result;
}

function actionsFromSources(sources: SourceLink[], language: Language): ActionLink[] {
  return sources.slice(0, 3).map((source, index) => ({
    type: index === 0 ? "open_project" : "view_source",
    label: language === "fr" ? `Voir : ${source.label}` : `View: ${source.label}`,
    url: source.url,
  }));
}

function retrievalConfidence(topSimilarity: number, rowCount: number): Confidence {
  if (topSimilarity >= 0.82 && rowCount >= 2) return "high";
  if (topSimilarity >= 0.68 && rowCount >= 1) return "medium";
  if (topSimilarity >= CONFIG.noContextThreshold && rowCount >= 1) return "low";
  return "none";
}

function safeClarification(language: Language): { answer: string; followups: string[] } {
  return language === "fr" ? {
    answer: "Je n’ai pas trouvé de réponse suffisamment précise et vérifiée pour cette formulation. Je préfère ne pas assembler des fragments incomplets. Vous pouvez reformuler la question ou choisir un sujet ci-dessous.",
    followups: ["Quels sont les principaux projets d’Ibrahim ?", "Quelles sont ses compétences techniques ?", "Quelle est son expérience professionnelle ?"],
  } : {
    answer: "I could not find a sufficiently precise and verified answer for that wording. Rather than combine incomplete fragments, I recommend rephrasing the question or choosing one of the topics below.",
    followups: ["What are Ibrahim’s main projects?", "What are his technical skills?", "What is his professional experience?"],
  };
}

function portfolioOnlyResponse(origin: string | null, language: Language, id: string): Response {
  return json(origin, {
    ok: true,
    answer: localizedMessage(language,
      "I can only answer questions about Ibrahim Khallouq’s profile, projects, technical skills, and professional experience.",
      "Je peux uniquement répondre aux questions concernant le profil, les projets, les compétences techniques et l’expérience professionnelle d’Ibrahim Khallouq."),
    language, confidence: "none", sources: [], actions: [],
    suggested_followups: language === "fr"
      ? ["Quels sont ses principaux projets ?", "Quelles sont ses compétences techniques ?", "Comment contacter Ibrahim ?"]
      : ["What are his main projects?", "What are his technical skills?", "How can I contact Ibrahim?"],
    generation_mode: "scope_guard",
    public_mode_label: language === "fr" ? "Assistant limité au portfolio" : "Portfolio-only assistant",
    request_id: id,
  });
}

serve(async (req) => {
  const id = requestId();
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") {
    if (!isOriginAllowed(origin)) return json(origin, { ok: false }, 403);
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") return json(origin, { ok: false, error: { code: "METHOD_NOT_ALLOWED" }, request_id: id }, 405);
  if (!isOriginAllowed(origin)) return errorResponse(origin, "en", "ORIGIN_NOT_ALLOWED", 403, id);

  const started = performance.now();
  let language: Language = "en";
  let projectSlug: string | null = null;
  let modelName: string | null = null;

  try {
    const body = await req.json().catch(() => null);
    const input = validateChatRequest(body);
    language = detectLanguage(input.question, input.language ?? "auto");
    // Correct short conversational phrases that contain too little text for the general detector.
    if (/\b(bonjour|salut|bonsoir|coucou|merci|a bientot|au revoir|bonne journee)\b/i.test(input.question.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) language = "fr";
    else if (/\b(hello|hi|hey|thanks|thank you|goodbye|bye|see you)\b/i.test(input.question)) language = "en";

    const limiter = await checkRateLimit(await anonymousRateKey(req, input.session_id), supabase);
    if (!limiter.allowed) return errorResponse(origin, language, "RATE_LIMITED", 429, id);
    if (UNRELATED.test(input.question) || ATTACK.test(input.question)) return portfolioOnlyResponse(origin, language, id);

    // Curated answers cost no model tokens and are returned before retrieval/Gemini.
    const curated = findCuratedAnswer(input.question, language);
    if (curated) {
      const sources: SourceLink[] = curated.topic.sources.map((source, index) => ({
        stable_key: `curated.${curated.topic.id}.${index + 1}`,
        label: source.label[language],
        url: source.url,
      }));
      await logChatEvent(supabase, {
        event_type: "answer", language, question_category: curated.topic.category,
        matched_project_slug: null, answered: true, source_count: sources.length,
        response_time_ms: Math.round(performance.now() - started), model_name: null, error_code: null,
      });
      return json(origin, {
        ok: true, answer: curated.topic.answer[language], language,
        confidence: curated.confidence, intent: curated.topic.category,
        sources, actions: actionsFromSources(sources, language),
        suggested_followups: curated.topic.followups[language], generation_mode: "curated",
        public_mode_label: language === "fr" ? "Réponse vérifiée du portfolio" : "Verified portfolio answer",
        request_id: id,
      });
    }

    const retrieval = await retrieveKnowledge(supabase, input.question, language);
    projectSlug = retrieval.projectSlug;
    const confidence = retrievalConfidence(retrieval.topSimilarity, retrieval.rows.length);
    if (confidence === "none") {
      const safe = safeClarification(language);
      return json(origin, {
        ok: true, answer: safe.answer, language, confidence: "none", sources: [], actions: [],
        suggested_followups: safe.followups, generation_mode: "safe_clarification",
        public_mode_label: language === "fr" ? "Réponse prudente" : "Safe response", request_id: id,
      });
    }

    const context = buildContext(retrieval.rows);
    try {
      const generated = await callGemini(input.question, language, context, input.conversation ?? [], retrieval.rows);
      modelName = generated.model;
      const sources = sourcesFromRows(retrieval.rows, generated.result.source_keys, language);
      await logChatEvent(supabase, {
        event_type: "answer", language, question_category: retrieval.rows[0]?.category ?? null,
        matched_project_slug: projectSlug, answered: true, source_count: sources.length,
        response_time_ms: Math.round(performance.now() - started), model_name: modelName, error_code: null,
      });
      return json(origin, {
        ok: true, answer: generated.result.answer, language, confidence: generated.result.confidence,
        sources, actions: actionsFromSources(sources, language), suggested_followups: generated.result.suggested_followups,
        generation_mode: "gemini", public_mode_label: language === "fr" ? "Aura · IA + sources vérifiées" : "Aura · AI + verified sources",
        request_id: id,
      });
    } catch (error) {
      console.warn("Gemini unavailable; returning safe clarification", error instanceof Error ? error.message : "unknown");
      const safe = safeClarification(language);
      return json(origin, {
        ok: true, answer: safe.answer, language, confidence: "none", sources: [], actions: [],
        suggested_followups: safe.followups, generation_mode: "safe_clarification",
        public_mode_label: language === "fr" ? "Réponse prudente" : "Safe response", request_id: id,
      });
    }
  } catch (error) {
    const code = error instanceof RequestValidationError ? "INVALID_REQUEST" : "INTERNAL_ERROR";
    console.error("portfolio-chat error", { request_id: id, code, message: error instanceof Error ? error.message : "unknown" });
    await logChatEvent(supabase, {
      event_type: "error", language, matched_project_slug: projectSlug, answered: false, source_count: 0,
      response_time_ms: Math.round(performance.now() - started), model_name: modelName, error_code: code,
    });
    return errorResponse(origin, language, code, code === "INVALID_REQUEST" ? 400 : 500, id);
  }
});
