export interface JobInput {
  title: string;
  company: string;
  description: string;
  url?: string;
  salary?: string;
  contact?: string;
}

export interface SignalResult {
  score: number;
  flags: string[];
  details: string;
}

export interface AnalysisOutput {
  score: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
  signals: {
    salary_realism: boolean;
    company_exists: boolean;
    contact_quality: boolean;
    jd_quality: boolean;
    suspicious_patterns: boolean;
  };
  breakdown: Array<{
    name: string;
    score: number;
    max: number;
    flags: string[];
    details: string;
  }>;
  explanation: string;
  scored_at: string;
  engine_version: string;
}
