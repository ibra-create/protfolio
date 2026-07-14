export type Language = "fr" | "en";
export type Confidence = "high" | "medium" | "low" | "none";
export type FallbackIntent =
  | "project_list"
  | "project_details"
  | "skill_evidence"
  | "personal_contribution"
  | "technical_method"
  | "engineering_results"
  | "professional_experience"
  | "education"
  | "contact"
  | "general_profile"
  | "comparison"
  | "unknown_portfolio_question";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  question: string;
  language?: "auto" | Language;
  conversation?: ConversationMessage[];
  session_id?: string;
}

export interface KnowledgeRow {
  id: number;
  stable_key: string;
  project_slug: string | null;
  language: Language;
  content_type: string;
  category: string;
  title: string;
  content: string;
  skills: string[];
  tools: string[];
  source_url: string | null;
  source_label: string | null;
  similarity?: number;
  metadata: Record<string, unknown>;
}

export interface RankedKnowledge extends KnowledgeRow {
  retrieval_source: "semantic" | "keyword" | "both";
  rerank_score: number;
}

export interface GeminiResult {
  answer: string;
  language: Language;
  confidence: Confidence;
  source_keys: string[];
  suggested_followups: string[];
}

export interface SourceLink {
  stable_key: string;
  label: string;
  url: string;
}

export interface ActionLink {
  type: "open_project" | "view_source" | "contact";
  label: string;
  url: string;
}

export interface ParsedFallbackIntent {
  intent: FallbackIntent;
  subject: string | null;
  requestedProject: string | null;
  requestedSkill: string | null;
  language: Language;
}

export interface DeterministicFallbackResult {
  answer: string;
  intent: FallbackIntent;
  subject: string | null;
  selectedRows: RankedKnowledge[];
  sourceKeys: string[];
  suggestedFollowups: string[];
  publicModeLabel: string;
}
