import { Language } from "./types.ts";

const FRENCH_MARKERS = /[àâçéèêëîïôùûüÿœ]|\b(quel|quelle|quels|quelles|comment|pourquoi|avec|dans|projet|projets|compétence|expérience|travail|utilise|utilisé|maison|énergie|ingénieur|contacter|formation)\b/i;

export function detectLanguage(text: string, requested: "auto" | Language = "auto"): Language {
  if (requested === "fr" || requested === "en") return requested;
  return FRENCH_MARKERS.test(text) ? "fr" : "en";
}

export function localizedMessage(language: Language, en: string, fr: string): string {
  return language === "fr" ? fr : en;
}
