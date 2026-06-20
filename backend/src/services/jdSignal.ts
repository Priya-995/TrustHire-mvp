import { JobInput, SignalResult } from "../types";

const POSITIVE_KEYWORDS = [
  "responsibilities", "requirements", "qualifications", "benefits",
  "salary", "compensation", "experience", "skills", "team", "role",
  "apply", "candidate", "position", "join", "opportunity",
];

const NEGATIVE_KEYWORDS = [
  "guaranteed", "earn from home", "no investment", "no experience needed",
  "lakhs per month", "part time earn",
];

export function jdSignal(input: JobInput): SignalResult {
  const desc = input.description || "";
  const wordCount = desc.trim().split(/\s+/).length;
  const flags: string[] = [];
  let score = 0;

  if (wordCount >= 200) score += 8;
  else if (wordCount >= 100) score += 5;
  else if (wordCount >= 50) score += 2;
  else { score += 0; flags.push("Description too short (< 50 words)"); }

  const foundPositive = POSITIVE_KEYWORDS.filter(k =>
    desc.toLowerCase().includes(k)
  );
  score += Math.min(8, foundPositive.length * 1.5);

  if (input.title && input.title.length > 5) score += 4;
  else flags.push("Job title missing or too vague");

  const foundNegative = NEGATIVE_KEYWORDS.filter(k =>
    desc.toLowerCase().includes(k)
  );
  if (foundNegative.length > 0) {
    score -= foundNegative.length * 3;
    flags.push(`Suspicious language: "${foundNegative[0]}"`);
  }

  score = Math.min(20, Math.max(0, Math.round(score)));

  return {
    score,
    flags,
    details: `${wordCount} words · ${foundPositive.length} quality signals found`,
  };
}
