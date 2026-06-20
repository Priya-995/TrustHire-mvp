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

export async function analyze(input: RecruiterInput): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GROQ_API_KEY is not defined");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a job trust verification engine. Analyze this job posting and return a trust score from 0–100 with breakdown. 
 
 Score these factors: 
 - Domain credibility (check if website URL looks real, has HTTPS) → 20 pts 
 - Salary reality check (is salary realistic for this role + fresher/intern level?) → 20 pts 
 - JD quality (clear responsibilities, no fake promises, no 'guaranteed job') → 20 pts 
 - Company footprint (LinkedIn URL provided, founding year given) → 20 pts 
 - Recruiter authenticity (LinkedIn provided, professional email) → 20 pts 
 
 Apply these penalties: 
 - Contact email is gmail/yahoo → -15 points 
 - Registration/training fee mentioned → -40 points 
 - Salary > 3x market rate for fresher → -20 points 
 - Unrealistic promises detected ('guaranteed', 'no experience 1L/month') → -25 points 
 
 Apply these bonuses: 
 - Recruiter LinkedIn provided → +10 points 
 - Company LinkedIn provided → +10 points 
 - Company founding year provided → +5 points 
 
 If Company Stage = 'Early Stage Startup': 
 DO NOT penalize for: new domain, no Glassdoor, small LinkedIn presence. 
 INSTEAD evaluate: founder credibility, salary transparency, honest about being early stage, clear role description. 
 A startup being honest about being small scores HIGHER than one pretending to be big. 
 
 Return ONLY valid JSON: 
 { 
   "trust_score": number, 
   "verdict": "Trusted" | "Caution" | "High Risk", 
   "breakdown": { 
     "domain_credibility": number, 
     "salary_reality": number, 
     "jd_quality": number, 
     "company_footprint": number, 
     "recruiter_authenticity": number 
   }, 
   "red_flags": string[], 
   "green_signals": string[], 
   "summary": string 
 }`,
        },
        {
          role: "user",
          content: `Analyze this job posting:
          
          Company: ${input.company}
          Job Title: ${input.jobTitle}
          Salary: ${input.salary}
          Website: ${input.website}
          Job Description: ${input.description}
          Company Stage: ${input.companyStage}
          Recruiter LinkedIn: ${input.recruiterLinkedIn}
          Company LinkedIn: ${input.companyLinkedIn}
          Contact Email: ${input.contactEmail}
          Registration Fee: ${input.hasFee ? "Yes" : "No"}
          Founding Year: ${input.foundingYear}`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Groq API error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;

  // Robust JSON extraction
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in response");
  const content = JSON.parse(jsonMatch[0]);

  const parseScore = (val: any) => {
    if (typeof val === "number") return val;
    const num = parseInt(String(val).replace(/[^0-9]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  return {
    trustScore: parseScore(content.trust_score),
    verdict: content.verdict,
    breakdown: content.breakdown,
    red_flags: content.red_flags,
    green_signals: content.green_signals,
    summary: content.summary,
  };
}
