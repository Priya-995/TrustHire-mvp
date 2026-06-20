import { JobInput, SignalResult } from "../types";

const SALARY_RANGES: Record<string, { min: number; max: number }> = {
  "software engineer": { min: 300000, max: 2000000 },
  "frontend developer": { min: 300000, max: 1800000 },
  "backend developer": { min: 350000, max: 2000000 },
  "full stack": { min: 350000, max: 2200000 },
  "data analyst": { min: 300000, max: 1500000 },
  "data scientist": { min: 500000, max: 2500000 },
  "product manager": { min: 600000, max: 3000000 },
  "devops": { min: 400000, max: 2000000 },
  "ui/ux": { min: 250000, max: 1500000 },
  "intern": { min: 5000, max: 50000 },
  "content writer": { min: 180000, max: 800000 },
  "digital marketing": { min: 200000, max: 1200000 },
  "sales": { min: 200000, max: 1000000 },
  "hr": { min: 200000, max: 900000 },
  "accountant": { min: 200000, max: 800000 },
  "data entry": { min: 120000, max: 400000 },
};

function parseSalary(text: string): number | null {
  const lpaMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lpa|l\.p\.a|lakhs?\s*per\s*annum)/i);
  if (lpaMatch) return parseFloat(lpaMatch[1]) * 100000;

  const monthlyMatch = text.match(/[₹Rs.]*\s*(\d[\d,]*)\s*\/?\s*(?:per\s*)?month/i);
  if (monthlyMatch) return parseInt(monthlyMatch[1].replace(/,/g, "")) * 12;

  const numericMatch = text.match(/[₹Rs.]*\s*(\d[\d,]{4,})/);
  if (numericMatch) return parseInt(numericMatch[1].replace(/,/g, ""));

  return null;
}

export function salarySignal(input: JobInput): SignalResult {
  const flags: string[] = [];
  const text = `${input.title} ${input.description} ${input.salary || ""}`;

  let range = { min: 150000, max: 1500000 };
  for (const [role, r] of Object.entries(SALARY_RANGES)) {
    if (text.toLowerCase().includes(role)) {
      range = r;
      break;
    }
  }

  const salary = parseSalary(text);

  if (!salary) {
    return {
      score: 8,
      flags: ["Salary not mentioned"],
      details: "Could not parse salary from posting",
    };
  }

  let score = 0;
  const ratio = salary / range.max;

  if (salary >= range.min && salary <= range.max) {
    score = 20;
  } else if (salary > range.max && ratio <= 2) {
    score = 14;
    flags.push("Salary above typical range — verify");
  } else if (salary > range.max && ratio > 2) {
    score = 0;
    flags.push(`Salary ₹${(salary/100000).toFixed(1)}L seems unrealistic for this role`);
  } else if (salary < range.min) {
    score = 8;
    flags.push("Salary below typical market rate");
  }

  return {
    score,
    flags,
    details: `Parsed salary: ₹${(salary / 100000).toFixed(1)}L · Market range: ₹${(range.min/100000).toFixed(1)}L–₹${(range.max/100000).toFixed(1)}L`,
  };
}
