import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Globe, DollarSign, Users, Sparkles, Zap, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Check, Building2 } from "lucide-react";
import { GlowButton } from "@/components/GlowButton";
import { TrustScoreRing } from "@/components/TrustScoreRing";
import { FloatingAICard } from "@/components/FloatingAICard";
import { AnimatedStat } from "@/components/AnimatedStat";
import { features, liveStats, testimonials } from "@/lib/mock-data";

const ICONS = { shield: ShieldCheck, globe: Globe, dollar: DollarSign, users: Users, sparkles: Sparkles, zap: Zap } as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrustHire — Jobs we can prove are real" },
      { name: "description", content: "AI-powered hiring trust platform. Detect fake jobs, ghost listings, and recruiter scams in seconds." },
      { property: "og:title", content: "TrustHire — Jobs we can prove are real" },
      { property: "og:description", content: "AI trust scoring for every job. For students and recruiters." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[15%] w-[20%] h-[20%] bg-blue-500/5 blur-[80px] rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* HERO */}
      <section className="relative px-6 pt-16 pb-32 overflow-hidden">
        <div className="mx-auto max-w-6xl relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} 
            className="text-center"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight max-w-5xl mx-auto leading-[0.95] mb-8">
              Hire with <span className="text-gradient">Certainty.</span><br />
              Apply with <span className="text-primary glow-sm">Confidence.</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              The world's first hiring platform where every job posting and every candidate is verified by 32+ AI trust signals.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-4"
            >
              <Link to="/recruiter">
                <GlowButton size="xl" className="group">
                  Analyze a Job <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </GlowButton>
              </Link>
              <Link to="/student">
                <GlowButton size="xl" variant="ghost" className="border-white/10 hover:bg-white/5">
                  Verify My Profile
                </GlowButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust ring + floating cards */}
          <div className="relative mt-24 flex items-center justify-center min-h-[480px]">
            <motion.div 
              initial={{ scale: 0.7, opacity: 0, rotate: -10 }} 
              animate={{ scale: 1, opacity: 1, rotate: 0 }} 
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }} 
              className="relative z-10"
            >
              <div className="absolute inset-0 -m-16 rounded-full bg-primary/20 blur-[100px] animate-pulse-glow" />
              <TrustScoreRing score={98} size={320} label="System Trust" />
              
              {/* Central pulse core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_30px_var(--primary)]" />
            </motion.div>

            <FloatingAICard delay={0.7} className="hidden md:block absolute left-4 top-12 max-w-[240px] z-20 border-success/30 bg-success/5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[10px] font-bold text-success mb-2 uppercase tracking-widest"><CheckCircle2 className="h-3.5 w-3.5" /> Domain Authenticated</div>
              <div className="text-sm font-bold font-mono">stripe.com/jobs</div>
              <div className="text-[11px] text-muted-foreground mt-1.5 leading-snug">DNS Verified · 14yr History · 256-bit SSL</div>
            </FloatingAICard>

            <FloatingAICard delay={1.0} className="hidden md:block absolute right-4 top-4 max-w-[240px] z-20 border-destructive/30 bg-destructive/5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[10px] font-bold text-destructive mb-2 uppercase tracking-widest"><AlertTriangle className="h-3.5 w-3.5" /> Fraud Detected</div>
              <div className="text-sm font-bold font-mono">quick-earn-global.in</div>
              <div className="text-[11px] text-muted-foreground mt-1.5 leading-snug">Registration Fee Found · 2d Domain Age</div>
            </FloatingAICard>

            <FloatingAICard delay={1.2} className="hidden lg:block absolute right-16 bottom-8 max-w-[240px] z-20 border-accent/30 bg-accent/5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[10px] font-bold text-accent mb-2 uppercase tracking-widest"><Sparkles className="h-3.5 w-3.5" /> AI Skill Match</div>
              <div className="text-sm font-bold font-mono">Full-Stack Engineer</div>
              <div className="text-[11px] text-muted-foreground mt-1.5 leading-snug">94% Technical Fit · Verified GitHub Commits</div>
            </FloatingAICard>

            <FloatingAICard delay={1.4} className="hidden lg:block absolute left-16 bottom-0 max-w-[240px] z-20 border-primary/30 bg-primary/5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary mb-2 uppercase tracking-widest"><ShieldCheck className="h-3.5 w-3.5" /> Profile Verified</div>
              <div className="text-sm font-bold font-mono">Arjun Sharma</div>
              <div className="text-[11px] text-muted-foreground mt-1.5 leading-snug">IIT Bombay · 2 Prev Internships Verified</div>
            </FloatingAICard>
          </div>
        </div>
      </section>

      {/* RECENT VERIFICATIONS TICKER */}
      <div className="border-y border-white/5 bg-foreground/[0.02] py-4 overflow-hidden relative group">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee group-hover:pause">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Verified: Software Engineer at Linear <span className="text-primary">94 Trust</span>
              <span className="mx-4 text-white/10">|</span>
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
              Flagged: Data Entry at ScamCo <span className="text-destructive">12 Trust</span>
              <span className="mx-4 text-white/10">|</span>
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Verified: Frontend Intern at Vercel <span className="text-primary">98 Trust</span>
              <span className="mx-4 text-white/10">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE STATS */}
      <section className="px-6 relative z-10 -mt-8">
        <div className="mx-auto max-w-6xl glass rounded-[32px] p-10 grid grid-cols-2 md:grid-cols-4 gap-8 border-white/10 shadow-2xl">
          {liveStats.map((s) => (
            <AnimatedStat key={s.label} value={s.value} label={s.label} suffix={s.suffix} />
          ))}
        </div>
      </section>

      {/* TRUTH VS HYPE SECTION */}
      <section className="px-6 mt-40">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-bold">The <span className="text-destructive">Old Way</span> vs. The <span className="text-success">TrustHire Way</span></h2>
            <p className="mt-4 text-muted-foreground">Why 90% of students and recruiters are switching to verified hiring.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-[32px] p-8 border-destructive/10 bg-destructive/[0.02] flex flex-col"
            >
              <div className="flex items-center gap-2 text-destructive font-bold uppercase tracking-widest text-xs mb-6">
                <XCircle className="h-4 w-4" /> Traditional Job Boards
              </div>
              <div className="space-y-6 flex-1">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 opacity-60">
                  <div className="h-4 w-32 bg-white/10 rounded mb-2" />
                  <div className="h-3 w-48 bg-white/5 rounded" />
                  <div className="mt-4 flex gap-2">
                    <div className="h-5 w-16 bg-destructive/20 rounded-full" />
                    <div className="h-5 w-16 bg-white/5 rounded-full" />
                  </div>
                </div>
                <ul className="space-y-4">
                  {[
                    "Ghost jobs that stay open for 6+ months",
                    "Fake recruiter profiles asking for fees",
                    "Unrealistic salary promises (Scam bait)",
                    "Anonymous 'Confidential' companies",
                    "Zero feedback for applicants"
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* The TrustHire Way */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-[32px] p-8 border-success/20 bg-success/[0.02] flex flex-col relative overflow-hidden group hover:glow-success transition-all"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck size={120} className="text-success" />
              </div>
              <div className="flex items-center gap-2 text-success font-bold uppercase tracking-widest text-xs mb-6 relative z-10">
                <CheckCircle2 className="h-4 w-4" /> TrustHire Verified
              </div>
              <div className="space-y-6 flex-1 relative z-10">
                <div className="p-4 rounded-2xl bg-success/10 border border-success/20 shadow-[0_0_20px_rgba(var(--success),0.1)]">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-32 bg-success/20 rounded" />
                    <div className="h-5 w-12 bg-success text-[10px] text-white font-bold flex items-center justify-center rounded">98%</div>
                  </div>
                  <div className="h-3 w-48 bg-success/10 rounded" />
                  <div className="mt-4 flex gap-2">
                    <div className="h-5 w-20 bg-success/20 text-success text-[9px] font-bold flex items-center justify-center rounded-full uppercase">Verified Real</div>
                    <div className="h-5 w-20 bg-primary/20 text-primary text-[9px] font-bold flex items-center justify-center rounded-full uppercase">AI Scanned</div>
                  </div>
                </div>
                <ul className="space-y-4">
                  {[
                    "Active jobs verified by recruiter activity",
                    "Authenticated company & recruiter identity",
                    "Market-matched salary verification",
                    "Transparent trust score for every listing",
                    "Direct feedback from verified recruiters"
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SPLIT ROLE SECTION */}
      <section className="px-6 mt-40">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ y: -8 }}
            className="glass rounded-[40px] p-10 border-primary/20 relative overflow-hidden group h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">For Students</h3>
              <p className="text-muted-foreground mb-8 text-lg">Build a "Proof-First" profile. Stop getting ghosted by fake listings and start applying to companies that are verified to be real.</p>
              <ul className="space-y-3 mb-10">
                {["Get a Trust Score for your profile", "Verify your skills with proof links", "Browse 100% scam-free job board"].map(i => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" /> {i}
                  </li>
                ))}
              </ul>
              <Link to="/student">
                <GlowButton className="w-full">Build My Verified Profile</GlowButton>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8 }}
            className="glass rounded-[40px] p-10 border-accent/20 relative overflow-hidden group h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">For Recruiters</h3>
              <p className="text-muted-foreground mb-8 text-lg">Reduce noise. Our AI pre-verifies candidate claims, GitHub activity, and certifications so you only talk to real talent.</p>
              <ul className="space-y-3 mb-10">
                {["AI-powered candidate trust scoring", "Verification of project URLs & certs", "Fraud detection for job postings"].map(i => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent" /> {i}
                  </li>
                ))}
              </ul>
              <Link to="/recruiter">
                <GlowButton variant="ghost" className="w-full border-accent/20 hover:bg-accent/5">Post a Verified Job</GlowButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 mt-32">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">The Trust Engine</div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold">Six layers of verification.<br />Zero ghost jobs.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = ICONS[f.icon as keyof typeof ICONS];
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="glass rounded-2xl p-6 group hover:glow-primary transition-all"
                >
                  <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="font-semibold text-lg">{f.title}</div>
                  <div className="text-sm text-muted-foreground mt-1.5">{f.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 mt-32">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-accent mb-3">Three Steps</div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold">From posting to <span className="text-gradient">proof</span>.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: "01", t: "Submit", d: "Recruiters submit a job. Students upload a resume." },
              { n: "02", t: "Analyze", d: "AI runs 32 trust signals across domain, salary, language, and behavior." },
              { n: "03", t: "Decide", d: "We give you a score, the why, and an honest fit verdict." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-8 relative overflow-hidden"
              >
                <div className="text-6xl font-display font-bold text-primary/15 absolute top-2 right-4">{s.n}</div>
                <div className="font-display text-2xl font-bold">{s.t}</div>
                <div className="text-sm text-muted-foreground mt-2">{s.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 mt-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-center mb-14">Loved by students.<br /><span className="text-gradient">Trusted by recruiters.</span></h2>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-6"
              >
                <p className="text-sm leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">{t.avatar}</div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 mt-40 pb-32">
        <div className="mx-auto max-w-5xl relative">
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full opacity-50" />
          <div className="glass-strong rounded-[48px] p-12 sm:p-20 text-center relative overflow-hidden border-white/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-8 uppercase tracking-widest border border-primary/20">
                <Sparkles className="h-3.5 w-3.5" /> Start Verifying Today
              </div>
              <h2 className="text-4xl sm:text-6xl font-display font-bold mb-8 leading-tight">
                The future of hiring is <span className="text-gradient">verified.</span>
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                Join 12,000+ students and recruiters using AI to eliminate hiring fraud and build real career connections.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/recruiter">
                  <GlowButton size="xl" className="shadow-[0_0_30px_rgba(var(--primary),0.3)]">
                    Analyze a Job Now
                  </GlowButton>
                </Link>
                <Link to="/student">
                  <GlowButton size="xl" variant="ghost" className="border-white/10 hover:bg-white/5">
                    I'm a Student
                  </GlowButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
