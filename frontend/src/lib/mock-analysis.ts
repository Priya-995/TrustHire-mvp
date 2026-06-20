import type { RecruiterInput } from "./store";

export type AnalysisResult = {
  trustScore: number;
  verdict: string;
  breakdown: {
    domain_credibility: number;
    salary_reality: number;
    jd_quality: number;
    company_footprint: number;
    recruiter_authenticity: number;
  };
  red_flags: string[];
  green_signals: string[];
  summary: string;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

type BackendBreakdownItem = {
  name: string;
  score: number;
  max: number;
  flags: string[];
  details: string;
};

type BackendResponse = {
  score: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
  signals: {
    salary_realism: boolean;
    company_exists: boolean;
    contact_quality: boolean;
    jd_quality: boolean;
    suspicious_patterns: boolean;
  };
  breakdown: BackendBreakdownItem[];
  explanation: string;
  scored_at: string;
  engine_version: string;
};

function findBreakdown(breakdown: BackendBreakdownItem[], name: string) {
  return breakdown.find((b) => b.name === name);
}

function mapVerdict(risk: BackendResponse["risk"]): string {
  if (risk === "LOW") return "Trusted";
  if (risk === "MEDIUM") return "Caution";
  return "High Risk";
}

export async function analyze(input: RecruiterInput): Promise<AnalysisResult> {
  // Make sure a checked "registration fee" checkbox actually reaches the scam regex,
  // even if the recruiter didn't type it into the description.
  const description = input.hasFee
    ? `${input.description}\n\nNote: This posting requires a registration or training fee.`
    : input.description;

  const response = await fetch(`${BACKEND_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: input.jobTitle,
      company: input.company,
      description,
      url: input.website,
      contact: input.contactEmail,
      salary: input.salary,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Backend error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const data: BackendResponse = await response.json();

  const jdItem = findBreakdown(data.breakdown, "JD Quality");
  const companyItem = findBreakdown(data.breakdown, "Company Signal");
  const contactItem = findBreakdown(data.breakdown, "Contact Quality");
  const salaryItem = findBreakdown(data.breakdown, "Salary Realism");

  // Backend tracks 5 categories, frontend UI wants a different 5 — not a perfect 1:1.
  // domain_credibility and company_footprint both pull from "Company Signal" since
  // the backend doesn't separate them. Fine for MVP.
  const breakdown = {
    domain_credibility: companyItem?.score ?? 0,
    salary_reality: salaryItem?.score ?? 0,
    jd_quality: jdItem?.score ?? 0,
    company_footprint: companyItem?.score ?? 0,
    recruiter_authenticity: contactItem?.score ?? 0,
  };

  const red_flags: string[] = [];
  for (const item of data.breakdown) {
    red_flags.push(...item.flags);
  }

  const green_signals: string[] = [];
  if (data.signals.jd_quality) green_signals.push("Job description is clear and detailed");
  if (data.signals.company_exists) green_signals.push("Company website verified");
  if (data.signals.contact_quality) green_signals.push("Contact details look legitimate");
  if (data.signals.salary_realism) green_signals.push("Salary is realistic for this role");
  if (!data.signals.suspicious_patterns) green_signals.push("No scam patterns detected");

  return {
    trustScore: data.score,
    verdict: mapVerdict(data.risk),
    breakdown,
    red_flags,
    green_signals,
    summary: data.explanation,
  };
}