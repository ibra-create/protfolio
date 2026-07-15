export const CONFIG = {
  maxQuestionLength: 500,
  minQuestionLength: 3,
  maxConversationMessages: 8,
  maxHistoryMessageLength: 500,
  semanticCandidateCount: 12,
  keywordCandidateCount: 8,
  finalContextCount: 6,
  semanticThreshold: 0.53,
  noContextThreshold: 0.56,
  maxContextCharacters: 9500,
  geminiTimeoutMs: 22000,
  requestsPerMinute: 10,
  requestsPerDay: 50,
  defaultModel: "gemini-2.5-flash-lite",
};

export const PROJECT_ALIASES: Record<string, string[]> = {
  "pv-bess-djibouti-dakhla": [
    "dakhla", "djibouti", "microgrid", "microgrids", "micro-réseau", "micro-réseaux",
  ],
  "pv-bess-67mw-ems": ["67 mw", "67mw", "67 mw pv", "67 mw pv+bess"],
  ibwatts: ["ibwatts", "ib watts"],
  "smart-house": ["smart house", "maison intelligente", "maison bioclimatique"],
  hydrotwin: ["hydrotwin", "hydrogen", "hydrogène", "power-to-x", "power to x", "lohc"],
  "ai-prediction": ["ai prediction", "energy prediction", "prédiction énergétique", "machine learning"],
};

export const DOMAIN_TERMS = [
  "ibrahim", "khallouq", "portfolio", "project", "projet", "experience", "expérience",
  "skill", "compétence", "education", "formation", "contact", "cv", "resume", "résumé",
  "powerfactory", "pvsyst", "homer", "caneco", "matlab", "simulink", "python", "streamlit",
  "ems", "bms", "bess", "soc", "pv", "photovoltaic", "photovoltaïque", "solar", "solaire",
  "microgrid", "micro-réseau", "electrical", "électrique", "protection", "cable", "câble",
  "thermal", "thermique", "hydrogen", "hydrogène", "financial", "financier", "roi", "lcoe", "lcoh",
  "internship", "stage", "novec", "noor", "dakhla", "djibouti", "67 mw", "ibwatts", "hydrotwin",
];
