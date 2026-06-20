import { JobInput, SignalResult } from "../types";

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
  "rediffmail.com", "ymail.com", "protonmail.com",
];

export function contactSignal(input: JobInput): SignalResult {
  const flags: string[] = [];
  let score = 10;

  const contact = (input.contact || "").toLowerCase();
  const url = (input.url || "").toLowerCase();
  const desc = (input.description || "").toLowerCase();

  const emailMatch = (contact + " " + desc).match(
    /[a-zA-Z0-9._%+\-]+@([a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/
  );

  if (!emailMatch) {
    score -= 5;
    flags.push("No contact email found");
  } else {
    const domain = emailMatch[1].toLowerCase();
    if (FREE_EMAIL_DOMAINS.includes(domain)) {
      score -= 8;
      flags.push(`Free email domain used: ${domain}`);
    } else {
      score += 10;
      if (url && url.includes(domain.split(".")[0])) {
        score += 5;
      }
    }
  }

  if (/whatsapp/i.test(contact + desc) && !emailMatch) {
    score -= 10;
    flags.push("WhatsApp-only contact (no email)");
  }

  score = Math.min(20, Math.max(0, Math.round(score)));

  return {
    score,
    flags,
    details: emailMatch
      ? `Contact via: ${emailMatch[0]}`
      : "No professional contact found",
  };
}
