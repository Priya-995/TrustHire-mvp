import { JobInput, SignalResult } from "../types";

const SCAM_PATTERNS = [
  { pattern: /registration\s*fee/i, penalty: 40, flag: "Registration fee requested" },
  { pattern: /training\s*fee/i, penalty: 40, flag: "Training fee requested" },
  { pattern: /deposit\s*(required|needed)/i, penalty: 35, flag: "Deposit required" },
  { pattern: /earn\s*[₹Rs.]*\s*[3-9]\d{4,}/i, penalty: 25, flag: "Unrealistic salary claim" },
  { pattern: /guaranteed\s*(income|salary|earnings)/i, penalty: 20, flag: "Guaranteed income claim" },
  { pattern: /no\s*experience\s*(needed|required)/i, penalty: 15, flag: "No experience needed" },
  { pattern: /work\s*from\s*home.*earn\s*lakhs/i, penalty: 30, flag: "WFH earn lakhs pattern" },
  { pattern: /whatsapp\s*(only|me|us)/i, penalty: 15, flag: "WhatsApp only contact" },
  { pattern: /send\s*(your\s*)?(cv|resume)\s*(on\s*)?whatsapp/i, penalty: 15, flag: "WhatsApp resume submission" },
  { pattern: /part\s*time.*[₹Rs.]*\s*[5-9]\d{3,}/i, penalty: 20, flag: "Suspicious part-time pay" },
  { pattern: /mlm|multi.?level|network\s*marketing/i, penalty: 35, flag: "MLM pattern detected" },
  { pattern: /immediate\s*joiner/i, penalty: 5, flag: "Immediate joining pressure" },
];

export function scamSignal(input: JobInput): SignalResult {
  const text = `${input.title} ${input.description} ${input.contact || ""}`;
  const flags: string[] = [];
  let totalPenalty = 0;
  let hardFlag = false;

  for (const { pattern, penalty, flag } of SCAM_PATTERNS) {
    if (pattern.test(text)) {
      flags.push(flag);
      totalPenalty += penalty;
      if (penalty >= 35) hardFlag = true;
    }
  }

  const score = hardFlag ? 0 : Math.max(0, 20 - totalPenalty);

  return {
    score,
    flags,
    details: flags.length === 0
      ? "No scam patterns detected"
      : `${flags.length} scam pattern(s) found`,
  };
}
