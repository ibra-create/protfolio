const REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bdigsilent\b/g, " powerfactory "],
  [/\bbattery energy storage systems?\b/g, " bess "],
  [/\bbatter(?:y|ies) storage\b/g, " bess "],
  [/\bstockage (?:par )?batteries?\b/g, " bess "],
  [/\benergy management systems?\b/g, " ems "],
  [/\bsystemes? de gestion de l energie\b/g, " ems "],
  [/\bbattery management systems?\b/g, " bms "],
  [/\bphotovoltaic\b/g, " pv "],
  [/\bphotovoltaique\b/g, " pv "],
  [/\bsolar energy\b/g, " solar "],
  [/\benergie solaire\b/g, " solar "],
  [/\bsingle line diagrams?\b/g, " sld "],
  [/\bschemas? unifilaires?\b/g, " sld "],
  [/\breturn on investment\b/g, " roi "],
  [/\bvaleur actuelle nette\b/g, " van "],
  [/\bnet present value\b/g, " npv "],
  [/\binternal rate of return\b/g, " irr "],
  [/\btaux de rentabilite interne\b/g, " tri "],
  [/\bpower to x\b/g, " power-to-x "],
  [/\b67mw\b/g, " 67 mw "],
  [/\b580kwc\b/g, " 580 kwc "],
];

export function normalizeCuratedText(value: string): string {
  let normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9+#.%/-]+/g, " ");
  for (const [pattern, replacement] of REPLACEMENTS) normalized = normalized.replace(pattern, replacement);
  return normalized.replace(/\s+/g, " ").trim();
}

export function curatedTokens(value: string): Set<string> {
  const stop = new Set([
    "a", "an", "the", "is", "are", "was", "were", "did", "does", "do", "of", "for", "to", "in", "on", "with", "and", "or",
    "le", "la", "les", "un", "une", "des", "de", "du", "est", "sont", "a", "au", "aux", "pour", "dans", "avec", "et", "ou",
    "ibrahim", "khallouq", "his", "he", "son", "ses", "il", "elle", "quel", "quelle", "quels", "quelles", "what", "which",
  ]);
  return new Set(normalizeCuratedText(value).split(" ").filter((token) => token.length >= 2 && !stop.has(token)));
}
