export type Job = {
  id: string;
  company: string;
  title: string;
  salary: string;
  location: string;
  trustScore: number;
  matchPercent: number;
  insight: string;
  flagged?: boolean;
  logo: string; // emoji placeholder
  tags: string[];
};

export const jobs: Job[] = [
  { id: "1", company: "Stripe", title: "Frontend Engineer Intern", salary: "$8k/mo", location: "Remote · US", trustScore: 96, matchPercent: 92, insight: "Verified domain, transparent salary, real recruiter activity.", logo: "◈", tags: ["React", "TypeScript", "Tailwind"] },
  { id: "2", company: "Linear", title: "Product Design Intern", salary: "$7.2k/mo", location: "Remote", trustScore: 94, matchPercent: 81, insight: "Strong hiring history. Clear interview process.", logo: "▲", tags: ["Figma", "Design", "UX"] },
  { id: "3", company: "Vercel", title: "ML Platform Intern", salary: "$8.5k/mo", location: "SF / Remote", trustScore: 92, matchPercent: 78, insight: "Authenticated company. Salary above market median.", logo: "▼", tags: ["Python", "ML", "GPU"] },
  { id: "4", company: "Notion", title: "Backend Engineering Intern", salary: "$7.8k/mo", location: "NYC", trustScore: 90, matchPercent: 74, insight: "Domain verified. Recruiter has 3yr tenure.", logo: "◉", tags: ["Go", "Postgres", "Distributed"] },
  { id: "5", company: "QuickRich Global", title: "Remote Data Entry — Earn $5k/week", salary: "$5,000/week", location: "Anywhere", trustScore: 18, matchPercent: 31, insight: "Domain registered 9 days ago. Salary 11x market median. No verifiable hiring history.", flagged: true, logo: "⚠", tags: ["Suspicious"] },
  { id: "6", company: "Figma", title: "Growth Engineer Intern", salary: "$8k/mo", location: "Remote · Global", trustScore: 95, matchPercent: 88, insight: "Authenticated. Clear scope. Recruiter response rate 94%.", logo: "✦", tags: ["React", "Analytics", "Growth"] },
];

export const testimonials = [
  { name: "Aisha Patel", role: "CS Senior · Georgia Tech", quote: "TrustHire saved me from two scam offers in week one. The honesty is wild.", avatar: "AP" },
  { name: "Diego Romero", role: "Recruiter · Series B SaaS", quote: "The trust score told us our own JD looked sketchy. We rewrote it. Conversions doubled.", avatar: "DR" },
  { name: "Mira Chen", role: "Bootcamp Grad", quote: "Finally an app that tells me why I don't match — and what to learn next.", avatar: "MC" },
];

export const features = [
  { icon: "shield", title: "Fraud Detection", desc: "Catches ghost jobs, fake recruiters, and pyramid schemes before you apply." },
  { icon: "globe", title: "Domain Credibility", desc: "Verifies WHOIS age, SSL posture, and brand authenticity in real time." },
  { icon: "dollar", title: "Salary Transparency", desc: "Cross-checks pay against 40k+ market datapoints. Flags outliers." },
  { icon: "users", title: "Hiring Authenticity", desc: "Tracks recruiter behavior signals across the platform." },
  { icon: "sparkles", title: "Honest Fit", desc: "We tell you why you don't match. No fluff, just signal." },
  { icon: "zap", title: "Verified Feed", desc: "Every job earns its spot. Or it doesn't show up at all." },
];

export const skills = [
  { name: "React", level: 88 },
  { name: "TypeScript", level: 82 },
  { name: "Python", level: 71 },
  { name: "System Design", level: 54 },
  { name: "SQL", level: 76 },
  { name: "ML Fundamentals", level: 48 },
];

export const liveStats = [
  { label: "Jobs Verified", value: 184293, suffix: "" },
  { label: "Scams Blocked", value: 12847, suffix: "" },
  { label: "Students Matched", value: 56210, suffix: "" },
  { label: "Avg Trust Score", value: 91, suffix: "/100" },
];
