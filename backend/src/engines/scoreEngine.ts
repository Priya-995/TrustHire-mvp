import { SignalResult, AnalysisOutput, JobInput } from "../types";

export function computeScore(
  input: JobInput,
  jd: SignalResult,
  scam: SignalResult,
  company: SignalResult,
  contact: SignalResult,
  salary: SignalResult
): Omit<AnalysisOutput, "explanation"> {

  const hasHardFlag = scam.score === 0 && scam.flags.some(f =>
    f.toLowerCase().includes("registration") || f.toLowerCase().includes("deposit")
  );

  const raw = jd.score + company.score + contact.score + salary.score + scam.score;
  const total = hasHardFlag ? Math.min(raw, 25) : Math.min(100, Math.max(0, raw));

  const risk: "LOW" | "MEDIUM" | "HIGH" =
    total >= 70 ? "LOW" : total >= 40 ? "MEDIUM" : "HIGH";

  return {
    score: total,
    risk,
    signals: {
      salary_realism: salary.score >= 14,
      company_exists: company.score >= 12,
      contact_quality: contact.score >= 12,
      jd_quality: jd.score >= 14,
      suspicious_patterns: scam.score < 15,
    },
    breakdown: [
      { name: "JD Quality", score: jd.score, max: 20, flags: jd.flags, details: jd.details },
      { name: "Scam Patterns", score: scam.score, max: 20, flags: scam.flags, details: scam.details },
      { name: "Company Signal", score: company.score, max: 20, flags: company.flags, details: company.details },
      { name: "Contact Quality", score: contact.score, max: 20, flags: contact.flags, details: contact.details },
      { name: "Salary Realism", score: salary.score, max: 20, flags: salary.flags, details: salary.details },
    ],
    scored_at: new Date().toISOString(),
    engine_version: "1.0.0",
  };
}
