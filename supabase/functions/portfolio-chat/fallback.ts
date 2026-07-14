import type {
  DeterministicFallbackResult,
  FallbackIntent,
  Language,
  ParsedFallbackIntent,
  RankedKnowledge,
  SourceLink,
} from "./types.ts";

function normalizeSearchText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const SKILLS = [
  "PowerFactory", "PVsyst", "HOMER Pro", "Caneco BT", "MATLAB", "Simulink", "Python", "Streamlit",
  "BESS", "EMS", "BMS", "SOC", "CFD", "AutoCAD", "DesignBuilder", "NSGA-II", "LCOE", "LCOH",
];

const PUBLIC_PAGES: Record<string, { fr: string; en: string }> = {
  "index.html": { fr: "Profil professionnel", en: "Professional profile" },
  "solar-project.html": { fr: "Micro-réseaux PV+BESS — Dakhla et Djibouti", en: "Dakhla and Djibouti PV+BESS Microgrids" },
  "solar-bess-67mw.html": { fr: "Centrale PV 67 MW + BESS", en: "67 MW PV+BESS Plant" },
  "ibwatts.html": { fr: "IBWatts — Outil solaire technico-économique", en: "IBWatts — Solar Techno-Economic Tool" },
  "smart_house.html": { fr: "Maison bioclimatique intelligente", en: "Smart Bioclimatic House" },
  "hydrotwin.html": { fr: "HydroTwin — Power-to-X", en: "HydroTwin — Power-to-X" },
  "ai-prediction.html": { fr: "Prédiction énergétique par IA", en: "AI Energy Prediction" },
};

const PROJECT_LABELS: Record<string, { fr: string; en: string }> = {
  "pv-bess-djibouti-dakhla": PUBLIC_PAGES["solar-project.html"],
  "pv-bess-67mw-ems": PUBLIC_PAGES["solar-bess-67mw.html"],
  ibwatts: PUBLIC_PAGES["ibwatts.html"],
  "smart-house": PUBLIC_PAGES["smart_house.html"],
  hydrotwin: PUBLIC_PAGES["hydrotwin.html"],
  "ai-prediction": PUBLIC_PAGES["ai-prediction.html"],
};

function local(language: Language, en: string, fr: string): string {
  return language === "fr" ? fr : en;
}

function safePublicUrl(url: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/\.(md|json|sql|ts|py)(?:[#?].*)?$/i.test(trimmed)) return null;
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === "https:" ? trimmed : null;
    } catch {
      return null;
    }
  }
  return /^[A-Za-z0-9_./#?=&%-]+$/.test(trimmed) ? trimmed.replace(/^\.\//, "") : null;
}

function pageKey(url: string): string {
  try {
    const path = /^https?:\/\//i.test(url) ? new URL(url).pathname : url;
    return path.replace(/^\//, "").split(/[?#]/)[0].toLowerCase();
  } catch {
    return url.replace(/^\//, "").split(/[?#]/)[0].toLowerCase();
  }
}

function publicLabel(row: RankedKnowledge, url: string, language: Language): string {
  const key = pageKey(url);
  if (PUBLIC_PAGES[key]) return PUBLIC_PAGES[key][language];
  if (row.project_slug && PROJECT_LABELS[row.project_slug]) return PROJECT_LABELS[row.project_slug][language];
  const internal = /(?:\.md|\.json|\.sql|stable_key|source_file|general profile|skills\s*[—-]\s*general)/i.test(row.source_label ?? "");
  if (!internal && row.source_label?.trim()) return row.source_label.trim();
  return local(language, "Portfolio source", "Source du portfolio");
}

export function buildPublicSources(rows: RankedKnowledge[], requestedKeys: string[], language: Language): SourceLink[] {
  const requested = new Set(requestedKeys);
  const ordered = requested.size
    ? [...rows.filter((row) => requested.has(row.stable_key)), ...rows.filter((row) => !requested.has(row.stable_key))]
    : rows;
  const seen = new Set<string>();
  const sources: SourceLink[] = [];

  for (const row of ordered) {
    const url = safePublicUrl(row.source_url);
    if (!url) continue;
    const canonical = pageKey(url);
    if (!canonical || seen.has(canonical)) continue;
    seen.add(canonical);
    sources.push({ stable_key: row.stable_key, label: publicLabel(row, url, language), url });
    if (sources.length >= 3) break;
  }
  return sources;
}

function detectSubject(question: string): string | null {
  const normalized = normalizeSearchText(question);
  const skill = SKILLS.find((item) => normalized.includes(normalizeSearchText(item)));
  if (skill) return skill;
  const subjects: Array<[RegExp, string]> = [
    [/\bbatter(?:y|ies)\b|\bstockage\b/i, "BESS"],
    [/\bphotovolta(?:ic|ique)\b|\bsolar\b|\bsolaire\b/i, "photovoltaïque"],
    [/\belectrical design\b|\bconception electrique\b/i, "conception électrique"],
    [/\bthermal\b|\bthermique\b/i, "ingénierie thermique"],
    [/\bhydrogen\b|\bhydrogene\b/i, "hydrogène"],
  ];
  return subjects.find(([pattern]) => pattern.test(normalized))?.[1] ?? null;
}

export function detectFallbackIntent(question: string, language: Language, requestedProject: string | null): ParsedFallbackIntent {
  const q = normalizeSearchText(question);
  const subject = detectSubject(question);
  let intent: FallbackIntent = "unknown_portfolio_question";

  if (/\b(contact|contacter|email|e-mail|linkedin|telephone|phone|github)\b/.test(q)) intent = "contact";
  else if (/\b(education|formation|degree|diplome|university|universite|etudes)\b/.test(q)) intent = "education";
  else if (/\b(results?|resultats?|performance|reduction|accuracy|precision|achieved|obtenu)\b/.test(q)) intent = "engineering_results";
  else if (/\b(role|contribution|responsabilit|personally|personnellement|what did|qu.a-t-il fait)\b/.test(q)) intent = "personal_contribution";
  else if (/\b(how|comment|method|methode|implement|develop|developp|logic|logique|workflow)\b/.test(q)) intent = "technical_method";
  else if (/\b(which|what) projects?\b|\bquels? projets?\b|\bdans quels? projets?\b/.test(q)) intent = "project_list";
  else if (/\b(experience|experience professionnelle|internship|stage|novec|noor|menara)\b/.test(q) && !subject) intent = "professional_experience";
  else if (subject || /\b(skill|competence|know|maitrise|utilise|used)\b/.test(q)) intent = "skill_evidence";
  else if (requestedProject) intent = "project_details";
  else if (/\b(compare|comparison|comparer|difference)\b/.test(q)) intent = "comparison";
  else if (/\b(profile|profil|who is|qui est|summary|resume)\b/.test(q)) intent = "general_profile";

  return { intent, subject, requestedProject, requestedSkill: subject, language };
}

function thirdPerson(text: string, language: Language): string {
  let value = text.trim().replace(/^[-•]\s*/, "");
  if (language === "fr") {
    const replacements: Array<[RegExp, string]> = [
      [/\bJ['’]ai\b/gi, "Ibrahim a"], [/\bJe suis\b/gi, "Ibrahim est"], [/\bJe développe\b/gi, "Ibrahim développe"],
      [/\bJe réalise\b/gi, "Ibrahim réalise"], [/\bJ['’]utilise\b/gi, "Ibrahim utilise"], [/\bMon rôle\b/gi, "Son rôle"],
      [/\bMes responsabilités\b/gi, "Ses responsabilités"], [/\bma contribution\b/gi, "sa contribution"],
    ];
    for (const [pattern, replacement] of replacements) value = value.replace(pattern, replacement);
  } else {
    const replacements: Array<[RegExp, string]> = [
      [/\bI designed\b/gi, "Ibrahim designed"], [/\bI developed\b/gi, "Ibrahim developed"],
      [/\bI implemented\b/gi, "Ibrahim implemented"], [/\bI used\b/gi, "Ibrahim used"],
      [/\bMy role\b/gi, "His role"], [/\bMy responsibilities\b/gi, "His responsibilities"],
      [/\bMy contribution\b/gi, "His contribution"],
    ];
    for (const [pattern, replacement] of replacements) value = value.replace(pattern, replacement);
  }
  return value.replace(/\s+/g, " ").trim();
}

function conciseFact(row: RankedKnowledge, language: Language, max = 300): string {
  const cleaned = thirdPerson(row.content, language)
    .replace(/^(Mastery|Maîtrise)\s+(of|de)\s+[^:]+:\s*/i, "")
    .replace(/\s*Demonstrated in projects?\s*:\s*/i, " — projets : ")
    .replace(/\s*Démontré dans les projets?\s*:\s*/i, " — projets : ");
  if (cleaned.length <= max) return cleaned;
  const cut = cleaned.slice(0, max);
  const boundary = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "), cut.lastIndexOf(", "));
  return `${cut.slice(0, boundary > max * .55 ? boundary + 1 : max).trim()}…`;
}

function projectName(row: RankedKnowledge, language: Language): string {
  if (row.project_slug && PROJECT_LABELS[row.project_slug]) return PROJECT_LABELS[row.project_slug][language];
  const url = safePublicUrl(row.source_url);
  if (url && PUBLIC_PAGES[pageKey(url)]) return PUBLIC_PAGES[pageKey(url)][language];
  return row.title;
}

function relevantRows(rows: RankedKnowledge[], intent: FallbackIntent): RankedKnowledge[] {
  const typeWeights: Partial<Record<FallbackIntent, string[]>> = {
    project_list: ["project_overview", "personal_contribution", "technical_method", "software_skill"],
    personal_contribution: ["personal_contribution", "experience_responsibility", "technical_method", "project_overview"],
    technical_method: ["technical_method", "control_logic", "simulation_method", "system_architecture", "personal_contribution"],
    engineering_results: ["engineering_result", "financial_result", "project_overview"],
    skill_evidence: ["personal_contribution", "technical_method", "software_skill", "project_overview"],
    professional_experience: ["experience_overview", "experience_responsibility", "engineering_result"],
    education: ["education"],
    contact: ["contact"],
  };
  const preferred = typeWeights[intent] ?? [];
  return [...rows].sort((a, b) => {
    const aw = preferred.includes(a.content_type) ? preferred.length - preferred.indexOf(a.content_type) : 0;
    const bw = preferred.includes(b.content_type) ? preferred.length - preferred.indexOf(b.content_type) : 0;
    return (bw * 15 + b.rerank_score) - (aw * 15 + a.rerank_score);
  });
}

function uniqueFacts(rows: RankedKnowledge[], language: Language, limit: number): Array<{ row: RankedKnowledge; fact: string }> {
  const result: Array<{ row: RankedKnowledge; fact: string }> = [];
  const signatures: string[] = [];
  for (const row of rows) {
    const fact = conciseFact(row, language);
    const signature = normalizeSearchText(fact).replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter((x) => x.length > 3);
    const duplicate = signatures.some((existing) => {
      const existingTokens = new Set(existing.split(" "));
      const shared = signature.filter((token) => existingTokens.has(token)).length;
      return signature.length > 0 && shared / Math.min(signature.length, existingTokens.size || 1) > .68;
    });
    if (duplicate) continue;
    result.push({ row, fact });
    signatures.push(signature.join(" "));
    if (result.length >= limit) break;
  }
  return result;
}

function formatProjectList(rows: RankedKnowledge[], intent: ParsedFallbackIntent): { answer: string; used: RankedKnowledge[] } {
  const grouped = new Map<string, RankedKnowledge[]>();
  for (const row of rows) {
    const url = safePublicUrl(row.source_url);
    const key = row.project_slug ?? (url ? pageKey(url) : "");
    if (!key || key === "index.html") continue;
    const group = grouped.get(key) ?? [];
    group.push(row);
    grouped.set(key, group);
  }
  const groups = [...grouped.values()].slice(0, 4);
  if (!groups.length) return formatSkillEvidence(rows, intent);
  const subject = intent.subject ?? local(intent.language, "this capability", "cette compétence");
  const intro = local(intent.language,
    `Ibrahim used ${subject} in the following verified projects:`,
    `Ibrahim utilise ${subject} dans les projets vérifiés suivants :`);
  const used: RankedKnowledge[] = [];
  const bullets = groups.map((group) => {
    const best = relevantRows(group, "project_list")[0];
    used.push(best);
    return `• ${projectName(best, intent.language)} : ${conciseFact(best, intent.language, 250)}`;
  });
  return { answer: `${intro}\n\n${bullets.join("\n\n")}`, used };
}

function formatSkillEvidence(rows: RankedKnowledge[], intent: ParsedFallbackIntent): { answer: string; used: RankedKnowledge[] } {
  const facts = uniqueFacts(relevantRows(rows, "skill_evidence"), intent.language, 3);
  const subject = intent.subject ?? local(intent.language, "this area", "ce domaine");
  const intro = local(intent.language,
    `Ibrahim's verified experience with ${subject} includes:`,
    `L’expérience vérifiée d’Ibrahim avec ${subject} comprend :`);
  return { answer: `${intro}\n\n${facts.map(({ fact }) => `• ${fact}`).join("\n")}`, used: facts.map((x) => x.row) };
}

function formatContribution(rows: RankedKnowledge[], intent: ParsedFallbackIntent): { answer: string; used: RankedKnowledge[] } {
  const facts = uniqueFacts(relevantRows(rows, "personal_contribution"), intent.language, 4);
  const project = facts[0] ? projectName(facts[0].row, intent.language) : local(intent.language, "the project", "le projet");
  const intro = local(intent.language,
    `In ${project}, Ibrahim's verified contribution included:`,
    `Dans ${project}, la contribution vérifiée d’Ibrahim comprenait :`);
  return { answer: `${intro}\n\n${facts.map(({ fact }) => `• ${fact}`).join("\n")}`, used: facts.map((x) => x.row) };
}

function formatMethod(rows: RankedKnowledge[], intent: ParsedFallbackIntent): { answer: string; used: RankedKnowledge[] } {
  const facts = uniqueFacts(relevantRows(rows, "technical_method"), intent.language, 4);
  const intro = local(intent.language, "The verified implementation followed these main elements:", "La mise en œuvre vérifiée repose sur les éléments principaux suivants :");
  return { answer: `${intro}\n\n${facts.map(({ fact }, i) => `${i + 1}. ${fact}`).join("\n")}`, used: facts.map((x) => x.row) };
}

function formatResults(rows: RankedKnowledge[], intent: ParsedFallbackIntent): { answer: string; used: RankedKnowledge[] } {
  const sorted = relevantRows(rows, "engineering_results").sort((a, b) => {
    const numberA = /\d/.test(a.content) ? 1 : 0;
    const numberB = /\d/.test(b.content) ? 1 : 0;
    return numberB - numberA || b.rerank_score - a.rerank_score;
  });
  const facts = uniqueFacts(sorted, intent.language, 4);
  const intro = local(intent.language, "The main verified results are:", "Les principaux résultats vérifiés sont :");
  return { answer: `${intro}\n\n${facts.map(({ fact }) => `• ${fact}`).join("\n")}`, used: facts.map((x) => x.row) };
}

function formatSimple(rows: RankedKnowledge[], intent: ParsedFallbackIntent, titleEn: string, titleFr: string, limit = 4): { answer: string; used: RankedKnowledge[] } {
  const facts = uniqueFacts(relevantRows(rows, intent.intent), intent.language, limit);
  return { answer: `${local(intent.language, titleEn, titleFr)}\n\n${facts.map(({ fact }) => `• ${fact}`).join("\n")}`, used: facts.map((x) => x.row) };
}

function followups(intent: ParsedFallbackIntent): string[] {
  const subject = intent.subject ?? "";
  const map: Partial<Record<FallbackIntent, { fr: string[]; en: string[] }>> = {
    project_list: {
      fr: [`Comment ${subject || "cette compétence"} a-t-il été utilisé techniquement ?`, "Quel a été le rôle personnel d’Ibrahim ?", "Quels résultats ont été validés ?"],
      en: [`How was ${subject || "this capability"} used technically?`, "What was Ibrahim's personal role?", "Which results were validated?"],
    },
    skill_evidence: {
      fr: [`Dans quels projets ${subject || "cette compétence"} a-t-il été appliqué ?`, "Quels outils complémentaires ont été utilisés ?", "Quels résultats ont été obtenus ?"],
      en: [`In which projects was ${subject || "this skill"} applied?`, "Which complementary tools were used?", "What results were achieved?"],
    },
    personal_contribution: { fr: ["Quels outils a-t-il utilisés ?", "Comment le système a-t-il été validé ?", "Quels résultats ont été obtenus ?"], en: ["Which tools did he use?", "How was the system validated?", "What results were achieved?"] },
    technical_method: { fr: ["Quels outils ont été utilisés ?", "Comment la méthode a-t-elle été validée ?", "Quel était le rôle d’Ibrahim ?"], en: ["Which tools were used?", "How was the method validated?", "What was Ibrahim's role?"] },
    engineering_results: { fr: ["Quelle méthodologie a permis ces résultats ?", "Quels outils ont été utilisés ?", "Quelles étaient les limites du projet ?"], en: ["Which methodology produced these results?", "Which tools were used?", "What were the project limitations?"] },
  };
  return (map[intent.intent]?.[intent.language] ?? (intent.language === "fr"
    ? ["Quels sont ses principaux projets ?", "Quelles sont ses compétences techniques ?", "Comment contacter Ibrahim ?"]
    : ["What are his main projects?", "What are his technical skills?", "How can I contact Ibrahim?"])).slice(0, 3);
}

export function createDeterministicFallback(
  question: string,
  rows: RankedKnowledge[],
  language: Language,
  requestedProject: string | null,
): DeterministicFallbackResult {
  const intent = detectFallbackIntent(question, language, requestedProject);
  const ordered = relevantRows(rows.filter((row) => row.language === language), intent.intent);
  const candidates = ordered.length ? ordered : relevantRows(rows, intent.intent);
  let formatted: { answer: string; used: RankedKnowledge[] };

  switch (intent.intent) {
    case "project_list": formatted = formatProjectList(candidates, intent); break;
    case "personal_contribution": formatted = formatContribution(candidates, intent); break;
    case "technical_method": formatted = formatMethod(candidates, intent); break;
    case "engineering_results": formatted = formatResults(candidates, intent); break;
    case "contact": formatted = formatSimple(candidates.filter((r) => r.content_type === "contact" || r.category === "contact"), intent, "Ibrahim's approved public contact details are:", "Les coordonnées publiques approuvées d’Ibrahim sont :", 3); break;
    case "education": formatted = formatSimple(candidates.filter((r) => r.content_type === "education" || r.category === "education"), intent, "Ibrahim's verified educational background is:", "La formation vérifiée d’Ibrahim est :", 3); break;
    case "professional_experience": formatted = formatSimple(candidates, intent, "Ibrahim's verified professional experience includes:", "L’expérience professionnelle vérifiée d’Ibrahim comprend :", 4); break;
    case "skill_evidence": formatted = formatSkillEvidence(candidates, intent); break;
    case "project_details": formatted = formatSimple(candidates, intent, "The verified project information is:", "Les informations vérifiées du projet sont :", 4); break;
    default: formatted = formatSimple(candidates, intent, "Based on the verified portfolio:", "D’après le portfolio vérifié :", 3);
  }

  const used = formatted.used.length ? formatted.used : candidates.slice(0, 2);
  return {
    answer: formatted.answer.slice(0, 2200),
    intent: intent.intent,
    subject: intent.subject,
    selectedRows: used,
    sourceKeys: used.map((row) => row.stable_key),
    suggestedFollowups: followups(intent),
    publicModeLabel: local(language, "Answer from the verified portfolio", "Réponse issue du portfolio vérifié"),
  };
}
