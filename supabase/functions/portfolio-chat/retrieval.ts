import { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { CONFIG, DOMAIN_TERMS, PROJECT_ALIASES } from "./config.ts";
import { KnowledgeRow, Language, RankedKnowledge } from "./types.ts";

const embeddingSession = new Supabase.ai.Session("gte-small");

export function normalizeSearchText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function detectProjectSlug(question: string): string | null {
  const q = normalizeSearchText(question);
  for (const [slug, aliases] of Object.entries(PROJECT_ALIASES)) {
    if (aliases.some((alias) => q.includes(normalizeSearchText(alias)))) return slug;
  }
  return null;
}

export function isPortfolioQuestion(question: string): boolean {
  const q = normalizeSearchText(question);
  return DOMAIN_TERMS.some((term) => q.includes(normalizeSearchText(term)));
}

function queryTerms(question: string): string[] {
  const stop = new Set([
    "what", "which", "where", "when", "how", "does", "did", "with", "from", "about", "the", "and",
    "quel", "quelle", "quels", "quelles", "comment", "dans", "avec", "pour", "des", "les", "une", "son", "ses", "ibrahim",
  ]);
  return normalizeSearchText(question)
    .split(/[^a-z0-9+#.-]+/)
    .filter((x) => x.length >= 3 && !stop.has(x))
    .slice(0, 12);
}

function embeddingArray(value: unknown): number[] {
  if (Array.isArray(value)) return value.map(Number);
  if (value && typeof value === "object" && "data" in value) {
    return Array.from((value as { data: ArrayLike<number> }).data, Number);
  }
  return Array.from(value as ArrayLike<number>, Number);
}

function questionLooksLikeProjectList(question: string): boolean {
  return /\b(which|what)\s+projects?\b|\bquels?\s+projets?\b|\bdans quels? projets?\b/i.test(question);
}

function questionLooksLikeEvidence(question: string): boolean {
  return /\b(experience|expérience|skill|compétence|know|maîtrise|utilis|used|use)\b/i.test(question);
}

function scoreRow(
  row: KnowledgeRow,
  question: string,
  language: Language,
  projectSlug: string | null,
  source: "semantic" | "keyword" | "both",
): number {
  const qTerms = queryTerms(question);
  const title = normalizeSearchText(row.title);
  const searchable = normalizeSearchText([
    row.title, row.content, ...(row.skills ?? []), ...(row.tools ?? []), row.category, row.content_type,
  ].join(" "));
  const projectSpecific = Boolean(row.project_slug);
  let score = (row.similarity ?? 0) * 100;

  if (row.language === language) score += 10;
  if (projectSlug && row.project_slug === projectSlug) score += 34;
  else if (projectSlug && row.project_slug && row.project_slug !== projectSlug) score -= 24;

  if ((questionLooksLikeProjectList(question) || questionLooksLikeEvidence(question)) && projectSpecific) score += 10;
  if (questionLooksLikeProjectList(question) && !projectSpecific) score -= 7;

  const preferredTypes = new Set(["personal_contribution", "technical_method", "engineering_result", "control_logic", "project_overview", "software_skill"]);
  if (preferredTypes.has(row.content_type)) score += 4;

  for (const term of qTerms) {
    if (title.includes(term)) score += 7;
    if ((row.tools ?? []).some((x) => normalizeSearchText(x).includes(term))) score += 10;
    if ((row.skills ?? []).some((x) => normalizeSearchText(x).includes(term))) score += 9;
    if (searchable.includes(term)) score += 2;
  }
  if (source === "both") score += 6;
  if (row.source_url) score += 2;
  return score;
}

function mergeRows(
  semantic: KnowledgeRow[],
  keyword: KnowledgeRow[],
  question: string,
  language: Language,
  projectSlug: string | null,
): RankedKnowledge[] {
  const merged = new Map<string, RankedKnowledge>();
  for (const row of semantic) merged.set(row.stable_key, { ...row, retrieval_source: "semantic", rerank_score: 0 });
  for (const row of keyword) {
    const existing = merged.get(row.stable_key);
    merged.set(row.stable_key, existing
      ? { ...existing, retrieval_source: "both" }
      : { ...row, retrieval_source: "keyword", rerank_score: 0 });
  }
  return [...merged.values()]
    .map((row) => ({ ...row, rerank_score: scoreRow(row, question, language, projectSlug, row.retrieval_source) }))
    .sort((a, b) => b.rerank_score - a.rerank_score);
}

function meaningfulTokens(row: RankedKnowledge): Set<string> {
  const stop = new Set(["ibrahim", "project", "projet", "avec", "pour", "dans", "from", "with", "that", "this", "using", "utilise", "utilisation"]);
  const text = normalizeSearchText(`${row.title} ${row.content}`);
  return new Set(text.split(/[^a-z0-9+#.-]+/).filter((x) => x.length >= 4 && !stop.has(x)));
}

function overlapRatio(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const token of a) if (b.has(token)) shared++;
  return shared / Math.min(a.size, b.size);
}

function preferRow(a: RankedKnowledge, b: RankedKnowledge, language: Language): RankedKnowledge {
  const quality = (row: RankedKnowledge) =>
    (row.language === language ? 8 : 0) +
    (row.project_slug ? 8 : 0) +
    (row.source_url ? 3 : 0) +
    (row.content_type === "personal_contribution" ? 5 : 0) +
    (row.content_type === "engineering_result" ? 4 : 0) +
    Math.min(row.content.length / 120, 3) +
    row.rerank_score / 100;
  return quality(b) > quality(a) ? b : a;
}

function deduplicateRows(rows: RankedKnowledge[], preferredLanguage: Language): RankedKnowledge[] {
  const bilingual = new Map<string, RankedKnowledge>();
  for (const row of rows) {
    const base = row.stable_key.replace(/\.(fr|en)$/i, "");
    const existing = bilingual.get(base);
    bilingual.set(base, existing ? preferRow(existing, row, preferredLanguage) : row);
  }

  const result: RankedKnowledge[] = [];
  for (const candidate of bilingual.values()) {
    const candidateTokens = meaningfulTokens(candidate);
    const duplicateIndex = result.findIndex((existing) => {
      const sameProject = (existing.project_slug ?? "profile") === (candidate.project_slug ?? "profile");
      return sameProject && overlapRatio(meaningfulTokens(existing), candidateTokens) >= 0.72;
    });
    if (duplicateIndex < 0) result.push(candidate);
    else result[duplicateIndex] = preferRow(result[duplicateIndex], candidate, preferredLanguage);
  }
  return result.sort((a, b) => b.rerank_score - a.rerank_score);
}

export async function retrieveKnowledge(
  supabase: SupabaseClient,
  question: string,
  language: Language,
): Promise<{ rows: RankedKnowledge[]; projectSlug: string | null; topSimilarity: number }> {
  const projectSlug = detectProjectSlug(question);
  const rawEmbedding = await embeddingSession.run(question, { mean_pool: true, normalize: true });
  const queryEmbedding = embeddingArray(rawEmbedding);
  if (queryEmbedding.length !== 384) throw new Error(`Unexpected embedding dimension: ${queryEmbedding.length}`);

  const semanticArgs = {
    query_embedding: JSON.stringify(queryEmbedding),
    match_threshold: CONFIG.semanticThreshold,
    match_count: CONFIG.semanticCandidateCount,
    filter_language: language,
    filter_project_slug: projectSlug,
  };
  let { data: semantic, error: semanticError } = await supabase.rpc("match_portfolio_knowledge", semanticArgs);

  if (!semanticError && projectSlug && (!semantic || semantic.length === 0)) {
    const retry = await supabase.rpc("match_portfolio_knowledge", { ...semanticArgs, filter_project_slug: null });
    semantic = retry.data;
    semanticError = retry.error;
  }
  if (semanticError) throw semanticError;

  const strongestKeyword = queryTerms(question).sort((a, b) => b.length - a.length)[0] ?? question;
  const { data: keyword, error: keywordError } = await supabase.rpc("search_portfolio_knowledge_keyword", {
    search_query: strongestKeyword,
    match_count: CONFIG.keywordCandidateCount,
    filter_language: language,
  });
  if (keywordError) console.warn("Keyword retrieval failed", keywordError.message);

  const merged = mergeRows((semantic ?? []) as KnowledgeRow[], (keyword ?? []) as KnowledgeRow[], question, language, projectSlug);
  const selected = deduplicateRows(merged, language).slice(0, CONFIG.finalContextCount);
  const topSimilarity = Math.max(0, ...selected.map((r) => r.similarity ?? 0));
  return { rows: selected, projectSlug, topSimilarity };
}

export function buildContext(rows: RankedKnowledge[]): string {
  let result = "";
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const block = [
      `SOURCE ${i + 1}`,
      `Stable key: ${row.stable_key}`,
      `Project: ${row.project_slug ?? "profile"}`,
      `Title: ${row.title}`,
      `Type: ${row.content_type}`,
      `Content: ${row.content}`,
      `Source label: ${row.source_label ?? "Portfolio"}`,
      `Source URL: ${row.source_url ?? ""}`,
    ].join("\n") + "\n\n";
    if ((result + block).length > CONFIG.maxContextCharacters) break;
    result += block;
  }
  return result.trim();
}
