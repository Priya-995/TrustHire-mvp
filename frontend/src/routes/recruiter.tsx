import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, Briefcase, DollarSign, Globe, Sparkles, Clock, Mail, Link2, History, ShieldAlert, AlertCircle } from "lucide-react";
import { useState } from "react";
import { GlowButton } from "@/components/GlowButton";
import { useAnalysisStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recruiter")({
  head: () => ({
    meta: [
      { title: "Recruiter Dashboard — TrustHire" },
      { name: "description", content: "Submit a job posting and get an instant AI trust score." },
      { property: "og:title", content: "Recruiter Dashboard — TrustHire" },
      { property: "og:description", content: "Run AI trust analysis on your hiring posts in seconds." },
    ],
  }),
  component: Recruiter,
});

function Recruiter() {
  const navigate = useNavigate();
  const setInput = useAnalysisStore((s) => s.setInput);
  const [form, setForm] = useState({
    company: "Stripe",
    jobTitle: "Frontend Engineer Intern",
    salary: "$8,000 / month",
    website: "https://stripe.com",
    description: "We're hiring a frontend engineer intern to ship product surfaces in our Dashboard. You'll work with React, TypeScript, and our internal design system. Competitive comp, mentorship from senior engineers, and a structured intern program with end-of-summer offers for top performers.",
    companyStage: "Established Company (2+ years)",
    recruiterLinkedIn: "",
    companyLinkedIn: "",
    contactEmail: "",
    hasFee: false,
    foundingYear: "2010",
  });

  const isPersonalEmail = form.contactEmail.match(/@(gmail|yahoo|hotmail|outlook)\./i);

  const recent = [
    { co: "Linear", title: "Design Intern", score: 94, t: "2m ago" },
    { co: "Vercel", title: "ML Platform", score: 92, t: "1h ago" },
    { co: "QuickRich", title: "Data Entry", score: 18, t: "3h ago" },
    { co: "Notion", title: "Backend Eng", score: 90, t: "yesterday" },
  ];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInput(form);
    navigate({ to: "/analysis" });
  };

  return (
    <div className="px-6 pb-12">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-primary">Recruiter Console</div>
          <h1 className="mt-2 text-4xl font-display font-bold">Submit a job for verification</h1>
          <p className="mt-2 text-muted-foreground">Our trust engine analyzes 32 signals before students ever see your posting.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 sm:p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field icon={Building2} label="Company name">
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} placeholder="Acme Inc." />
              </Field>
              <Field icon={History} label="Founding Year">
                <input type="number" value={form.foundingYear} onChange={(e) => setForm({ ...form, foundingYear: e.target.value })} className={inputCls} placeholder="2010" />
              </Field>
            </div>

            <Field icon={Briefcase} label="Job title">
              <input value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className={inputCls} placeholder="Senior Frontend Engineer" />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field icon={DollarSign} label="Salary">
                <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className={inputCls} placeholder="$8,000 / month" />
              </Field>
              <Field icon={Globe} label="Website URL">
                <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputCls} placeholder="https://example.com" />
              </Field>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-foreground/5 border border-border">
              <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Company Stage</div>
              <div className="flex flex-wrap gap-4">
                {["Established Company (2+ years)", "Early Stage Startup (0–2 years)", "Freelance / Contract Work"].map((stage) => (
                  <label key={stage} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="companyStage" 
                      checked={form.companyStage === stage} 
                      onChange={() => setForm({ ...form, companyStage: stage })}
                      className="accent-primary"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stage}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field icon={Link2} label="Recruiter LinkedIn">
                <input value={form.recruiterLinkedIn} onChange={(e) => setForm({ ...form, recruiterLinkedIn: e.target.value })} className={inputCls} placeholder="linkedin.com/in/..." />
              </Field>
              <Field icon={Link2} label="Company LinkedIn">
                <input value={form.companyLinkedIn} onChange={(e) => setForm({ ...form, companyLinkedIn: e.target.value })} className={inputCls} placeholder="linkedin.com/company/..." />
              </Field>
            </div>

            <Field icon={Mail} label="Contact Email">
              <div className="space-y-2">
                <input 
                  type="email" 
                  value={form.contactEmail} 
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} 
                  className={cn(inputCls, isPersonalEmail && "border-destructive/50 focus:ring-destructive/50")} 
                  placeholder="hr@company.com" 
                />
                {isPersonalEmail && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" /> Personal email detected — reduces trust score
                  </div>
                )}
              </div>
            </Field>

            <div className="p-4 rounded-xl bg-foreground/5 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Registration/Training Fee?</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-bold uppercase tracking-widest", !form.hasFee ? "text-primary" : "text-muted-foreground")}>No</span>
                  <button 
                    type="button"
                    onClick={() => setForm({ ...form, hasFee: !form.hasFee })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      form.hasFee ? "bg-destructive" : "bg-primary"
                    )}
                  >
                    <motion.div 
                      animate={{ x: form.hasFee ? 26 : 4 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                  <span className={cn("text-xs font-bold uppercase tracking-widest", form.hasFee ? "text-destructive" : "text-muted-foreground")}>Yes</span>
                </div>
              </div>
              {form.hasFee && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive animate-in zoom-in-95 duration-200">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <div className="text-xs font-bold uppercase tracking-wider">🚨 HIGH RISK: Fee-based jobs are auto-flagged</div>
                </div>
              )}
            </div>

            <Field label="Job description">
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} className={`${inputCls} resize-none font-mono text-sm`} placeholder="Paste the full job description…" />
              <div className="mt-1.5 text-xs text-muted-foreground">{form.description.length} chars · the more context, the better the score.</div>
            </Field>

            <div className="pt-2 flex justify-end">
              <GlowButton type="submit" size="xl"><Sparkles className="h-5 w-5" /> Analyze Trust Score</GlowButton>
            </div>
          </motion.form>

          <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2 mb-3"><Clock className="h-3.5 w-3.5" /> Recent Analyses</div>
              <div className="space-y-3">
                {recent.map((r) => (
                  <div key={r.title} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs text-muted-foreground">{r.co} · {r.t}</div>
                    </div>
                    <div className={`text-lg font-display font-bold tabular-nums ${r.score >= 80 ? "text-gradient" : r.score >= 50 ? "text-warning" : "text-destructive"}`}>{r.score}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-5 text-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">What we check</div>
              <ul className="space-y-1.5 text-muted-foreground text-[13px]">
                <li>· Domain age, SSL, WHOIS</li>
                <li>· Recruiter behavior graph</li>
                <li>· Salary vs market cohort</li>
                <li>· Language scam markers</li>
                <li>· Hiring pattern history</li>
                <li>· LLM intent classification</li>
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl bg-input/40 border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all placeholder:text-muted-foreground/50";

function Field({ label, icon: Icon, children }: { label: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" />} {label}
      </div>
      {children}
    </label>
  );
}
