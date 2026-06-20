import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Sparkles, MapPin, DollarSign } from "lucide-react";
import type { Job } from "@/lib/mock-data";

export function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  const flagged = job.flagged;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`glass rounded-2xl p-5 group relative overflow-hidden transition-all hover:glow-primary ${flagged ? "border-destructive/40" : ""}`}
    >
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/20 group-hover:to-accent/20 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl font-bold ${flagged ? "bg-destructive/15 text-destructive" : "bg-gradient-primary text-primary-foreground"}`}>
            {job.logo}
          </div>
          <div>
            <div className="font-semibold leading-tight">{job.title}</div>
            <div className="text-sm text-muted-foreground">{job.company}</div>
          </div>
        </div>
        {flagged ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 text-destructive px-2.5 py-1 text-[11px] font-medium">
            <AlertTriangle className="h-3 w-3" /> Scam Alert
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 text-[oklch(0.78_0.18_155)] px-2.5 py-1 text-[11px] font-medium">
            <ShieldCheck className="h-3 w-3" /> Verified
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-foreground/5 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Trust</div>
          <div className={`text-xl font-display font-bold ${flagged ? "text-destructive" : "text-gradient"}`}>{job.trustScore}</div>
        </div>
        <div className="rounded-xl bg-foreground/5 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Match</div>
          <div className="text-xl font-display font-bold text-gradient">{job.matchPercent}%</div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 mt-0.5 text-accent flex-shrink-0" />
        <span>{job.insight}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.tags.map((t) => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground border border-border">{t}</span>
        ))}
      </div>
    </motion.div>
  );
}
