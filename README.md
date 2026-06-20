<div align="center">

# 🛡️ TrustHire

### Stop Falling for Fake Jobs. Stop Guessing About Candidates.

## AI-Powered Hiring Trust Verification Platform

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-6366f1?style=for-the-badge)](https://future-job-shield.priya9899nk.workers.dev/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Priya-995/future-job-shield)
[![TypeScript](https://img.shields.io/badge/TypeScript-97.7%25-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Groq AI](https://img.shields.io/badge/Groq_AI-llama--3.3--70b-F55036?style=for-the-badge)](https://groq.com/)
[![Cloudflare](https://img.shields.io/badge/Deployed_on-Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare)](https://workers.cloudflare.com/)

---

>  A real-time fraud detection engine for India's broken job market, powered by Groq AI (llama-3.3-70b-versatile). Every score is live AI, not mock data.

</div>

---

## 🎯 The Problem We're Solving

India loses **₹3,500+ crore annually** to job scams. Over **60% of freshers** have encountered fraudulent job postings. At the same time, recruiters have no reliable way to verify if candidates are truly skilled — or just resume-padders.

Two sides of the same broken trust problem:

- **Students** can't tell which jobs are real vs. scams
- **Recruiters** can't verify which candidates actually have skills they claim
- **A resume is just paper** — it proves nothing about real ability, consistency, or honesty

**TrustHire fixes both sides with AI.**

---

## ✨ What It Does

### For Job Seekers
- 🔍 **Job Trust Score** — Paste any job posting and get an AI-generated trust score (0–100) with detailed fraud signal breakdown
- ✅ **Verified Job Feed** — Browse pre-analyzed job listings with trust badges
- 📊 **Honest Fit Score** — Upload your resume and get brutally honest feedback: what matches, what's missing, and a week-by-week skill-building plan

### For Recruiters
- 📋 **Post & Verify** — Submit job details and get instant credibility analysis to self-verify your posting before candidates see it
- 🏢 **Startup-Aware Scoring** — Different evaluation model for early-stage startups vs. established companies (no unfair penalties for being new)

---

## 🧠 How the Trust Score Actually Works

> *"Trust cannot be decided by just a small paper."* — Our judges were right. Here's how we solved it.

### Job Trust Score (0–100)

| Factor | Weight | Signal |
|--------|--------|--------|
| Domain Credibility | 20 pts | Domain age, HTTPS, professional email (gmail = red flag) |
| Salary Reality Check | 20 pts | AI cross-checks salary vs. market rate for role + city |
| JD Quality Analysis | 20 pts | Red flag language detection ("guaranteed income", "no experience needed") |
| Recruiter Authenticity | 20 pts | Contact info quality, LinkedIn presence |
| Scam Pattern Detection | 20 pts | Registration fee, upfront payment, WhatsApp-only contact |

**Special rule:** If a registration/training fee is detected → **automatic High Risk flag**, regardless of other scores.

**Startup mode:** Early-stage startups are evaluated on founder transparency, equity honesty, and realistic expectations — NOT penalized for small LinkedIn following or no Glassdoor reviews.

### Student Candidate Trust Score (0–100)

Three independent layers that combine into one honest score:

```
Final Score = Academic Layer (20%) + Practical Layer (50%) + Trust Layer (30%)
```

**Academic Layer (20 pts)** — CGPA as academic discipline indicator only. Not a skill proxy.

**Practical Layer (50 pts)**
- GitHub URL with active commits → +15
- Live deployed project URL (verified it loads) → +15
- Relevant certifications (Google, AWS, NPTEL) → +10
- Hackathon participation/wins → +10

**Trust Layer (30 pts)** — The honest differentiator:
- Skills claimed match GitHub language stats → +10
- Honest self-assessment (underselling = rewarded, overselling = penalized) → +8
- Peer/mentor reference → +7
- Consistency over time (GitHub streak vs. one-day cramming) → +5

> 💡 **The Honesty Bonus:** If you write "beginner React" but your GitHub shows 50+ React commits, we catch it and tell you — *you're underselling yourself*. If you claim "React expert" with zero GitHub history, your trust score drops. Honesty is algorithmically rewarded.

---

## 🚀 Live Features

| Feature | Status | Powered By |
|---------|--------|------------|
| Job Fraud Detection | ✅ Live AI | Groq llama-3.3-70b |
| Trust Score (0–100) with 6-factor breakdown | ✅ Live AI | Groq |
| Student Resume Analysis | ✅ Live AI | Groq |
| Honest Fit Score | ✅ Live AI | Groq |
| Skill Gap + Action Plan | ✅ Live AI | Groq |
| Verified Jobs Feed | ✅ | Mock (seed data) |
| LinkedIn URL Analysis | ✅ Live AI | Groq |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  TrustHire Frontend                  │
│         React + TanStack Start + TypeScript          │
├──────────────┬──────────────────┬───────────────────┤
│  /recruiter  │    /analysis     │     /student      │
│  Job Form    │  Trust Score     │  Resume Upload    │
│              │  6 Factor View   │  Profile Analysis │
├──────────────┴──────────────────┴───────────────────┤
│                    /fit                             │
│         Honest Fit Score + Skill Gap Plan           │
├─────────────────────────────────────────────────────┤
│              Groq AI Layer                          │
│         llama-3.3-70b-versatile                     │
│   Job Fraud Detection | Candidate Trust Scoring     │
├─────────────────────────────────────────────────────┤
│         Cloudflare Workers (Edge Deploy)            │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript |
| **Framework** | TanStack Start (SSR-capable) |
| **Styling** | Tailwind CSS, Framer Motion |
| **Charts** | Recharts (Radar Chart for trust dimensions) |
| **AI Engine** | Groq API — llama-3.3-70b-versatile |
| **Deployment** | Cloudflare Workers (Edge) |
| **Build** | Vite 7, Bun |
| **Icons** | Lucide React |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A free Groq API key → [console.groq.com](https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/Priya-995/future-job-shield.git
cd future-job-shield

# Install dependencies
bun install
# or
npm install

# Set up environment variables
cp .env.example .env
# Add your Groq API key to .env:
# VITE_GROQ_API_KEY=gsk_your_key_here

# Start development server
bun dev
# or
npm run dev
```

App runs at `http://localhost:8080`

### Environment Variables

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key at [console.groq.com](https://console.groq.com) — free, unlimited on llama models, no credit card required.

---

## 🎬 Demo Flow (Try This)

### Test 1 — Obvious Scam Job (should score ~20/100)
```
Company:     Easy Money Jobs India
Job Title:   Work From Home Data Entry
Salary:      ₹80,000/month (no experience needed)
Website:     easymoneyjobs.blogspot.com
JD:          Easy work from home. No skills required.
             Guaranteed income. Send ₹500 registration fee.
```
**Expected:** ~20/100 · High Risk · Red flags: registration fee, blogspot domain, unrealistic salary

### Test 2 — Legitimate Posting (should score ~90/100)
```
Company:     Infosys Limited
Job Title:   Software Engineer
Salary:      ₹6,00,000 per annum
Website:     infosys.com
JD:          Hiring SWEs for Bangalore office. Java/Spring Boot.
             B.Tech CS/IT, 0-2 yrs exp. PF + health insurance.
             Apply via official careers portal only.
```
**Expected:** ~92/100 · Highly Trustworthy · Green signals: established domain, realistic salary, clear requirements

The contrast between these two is the product in action. 🎯

---

## 📁 Project Structure

```
future-job-shield/
├── src/
│   ├── routes/
│   │   ├── index.tsx          # Landing page
│   │   ├── recruiter.tsx      # Job posting form
│   │   ├── analysis.tsx       # Trust score results
│   │   ├── student.tsx        # Candidate profile + resume upload
│   │   ├── fit.tsx            # Honest fit score
│   │   └── jobs.tsx           # Verified job feed
│   ├── lib/
│   │   ├── groq-analysis.ts   # Job fraud detection API call
│   │   └── mock-data.ts       # Seed data for job feed
│   └── components/
│       └── ui/                # shadcn/ui components
├── vite.config.ts
├── wrangler.jsonc             # Cloudflare Workers config
└── package.json
```

---

## 🔮 Roadmap — Beyond the Hackathon

- [ ] **GitHub Activity Verification** — Real commit history analysis, not just URL presence
- [ ] **MCA Company Registry Integration** — Verify company legal registration in real-time
- [ ] **Peer Reference System** — Structured vouching from teammates/mentors
- [ ] **Browser Extension** — Analyze jobs directly on LinkedIn/Naukri without leaving the page
- [ ] **Recruiter Dashboard** — Track candidate trust scores across applicants
- [ ] **CGPA + Skill Correlation Engine** — Academic performance cross-referenced with practical output
- [ ] **Cohort Benchmarking** — Compare your trust score against students from similar backgrounds/colleges

---

## 💡 Why TrustHire is Different

Most job platforms ask: *"Does this candidate have the skills?"*

TrustHire asks: *"Can we actually verify that?"*

There's a fundamental difference between:
- What you **claim** on a resume
- What you can **prove** through GitHub, live projects, certifications
- What others **validate** through references
- How **consistent** your work is over time

A student who won a hackathon but never posted it still won it. Our honesty system doesn't punish you for poor documentation — it helps you fix that gap. A high-CGPA student with zero projects scores lower than a 7-pointer with three live apps. Because real companies don't hire grade sheets. They hire people who build things.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---
<div align="center">

**If TrustHire saved you from a scam job — star this repo ⭐**

*Built for India's 15 million job seekers who deserve better.*

<br/>

[![🚀 Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Try_TrustHire-6366f1?style=for-the-badge)](https://future-job-shield.priya9899nk.workers.dev/)

<br/><br/>

🔗 **Live App:**  
https://future-job-shield.priya9899nk.workers.dev/

</div>
