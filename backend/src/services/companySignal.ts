import { JobInput, SignalResult } from "../types";

const KNOWN_LEGIT = [
  "infosys", "tcs", "wipro", "accenture", "google", "microsoft",
  "amazon", "flipkart", "swiggy", "zomato", "razorpay", "zerodha",
  "freshworks", "zoho", "byju", "ola", "paytm", "myntra", "meesho",
  "phonepe", "cred", "groww", "unacademy", "vedantu", "dunzo",
];

const SUSPICIOUS_DOMAINS = [
  "blogspot", "wix.com", "weebly", "wordpress.com",
  "freehosting", "000webhost", "tripod",
];

export async function companySignal(input: JobInput): Promise<SignalResult> {
  const flags: string[] = [];
  let score = 10;

  const companyLower = (input.company || "").toLowerCase();
  const url = (input.url || "").toLowerCase();

  if (KNOWN_LEGIT.some(name => companyLower.includes(name))) {
    score = 20;
    return { score, flags, details: "Recognized established company" };
  }

  if (SUSPICIOUS_DOMAINS.some(d => url.includes(d))) {
    score -= 10;
    flags.push("Job posted on free website platform");
  }

  if (input.url && input.url.startsWith("http")) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(input.url, {
        method: "HEAD",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        score += 8;
        if (input.url.startsWith("https://")) score += 4;
        else flags.push("Website uses HTTP, not HTTPS");
      } else {
        score -= 5;
        flags.push(`Website returned ${response.status}`);
      }
    } catch {
      score -= 3;
      flags.push("Company website unreachable");
    }
  } else {
    score -= 5;
    flags.push("No company website URL provided");
  }

  score = Math.min(20, Math.max(0, Math.round(score)));
  return {
    score,
    flags,
    details: input.url ? `Checked: ${input.url}` : "No URL to verify",
  };
}
