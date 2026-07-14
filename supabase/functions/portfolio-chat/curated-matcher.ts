import type { Language } from "./types.ts";
import { CURATED_TOPICS } from "./curated-answers.ts";
import type { CuratedTopic } from "./curated-answers.ts";
import { curatedTokens, normalizeCuratedText } from "./curated-synonyms.ts";

export interface CuratedMatch {
  topic: CuratedTopic;
  score: number;
  confidence: "high" | "medium";
}

function tokenOverlap(question: Set<string>, phrase: Set<string>): number {
  if (!question.size || !phrase.size) return 0;
  let shared = 0;
  for (const token of phrase) if (question.has(token)) shared++;
  return shared / phrase.size;
}

function scoreTopic(question: string, language: Language, topic: CuratedTopic): number {
  const normalized = normalizeCuratedText(question);
  const questionTokens = curatedTokens(normalized);
  const phrases = topic.phrases[language];
  let score = topic.priority / 20;
  let bestPhraseScore = 0;

  for (const rawPhrase of phrases) {
    const phrase = normalizeCuratedText(rawPhrase);
    if (!phrase) continue;
    if (normalized === phrase) bestPhraseScore = Math.max(bestPhraseScore, 110);
    else if (!topic.exactOnly && normalized.includes(phrase)) bestPhraseScore = Math.max(bestPhraseScore, 82);
    else if (!topic.exactOnly && phrase.includes(normalized) && normalized.length >= 6) bestPhraseScore = Math.max(bestPhraseScore, 58);
    else if (!topic.exactOnly) {
      const overlap = tokenOverlap(questionTokens, curatedTokens(phrase));
      if (overlap >= 1) bestPhraseScore = Math.max(bestPhraseScore, 62);
      else if (overlap >= .72) bestPhraseScore = Math.max(bestPhraseScore, 43);
      else if (overlap >= .5) bestPhraseScore = Math.max(bestPhraseScore, 25);
    }
  }
  score += bestPhraseScore;

  if (!topic.exactOnly) {
    for (const rawKeyword of topic.keywords) {
      const keyword = normalizeCuratedText(rawKeyword);
      if (keyword && normalized.includes(keyword)) score += keyword.includes(" ") ? 18 : 12;
    }
  }
  return score;
}

export function findCuratedAnswer(question: string, language: Language): CuratedMatch | null {
  const normalized = normalizeCuratedText(question);
  if (!normalized || normalized.length > 500) return null;

  const ranked = CURATED_TOPICS
    .map((topic) => ({ topic, score: scoreTopic(question, language, topic) }))
    .sort((a, b) => b.score - a.score || b.topic.priority - a.topic.priority);

  const best = ranked[0];
  const second = ranked[1];
  if (!best || best.score < 52) return null;
  const margin = best.score - (second?.score ?? 0);

  // Ambiguous medium matches are intentionally rejected so Gemini can handle them.
  if (best.score < 72 && margin < 12) return null;
  return { topic: best.topic, score: Math.round(best.score), confidence: best.score >= 76 ? "high" : "medium" };
}
