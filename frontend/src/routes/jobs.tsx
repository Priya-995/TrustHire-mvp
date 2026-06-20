import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { JobCard } from "@/components/JobCard";
import { jobs } from "@/lib/mock-data";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Verified Jobs — TrustHire" },
      { name: "description", content: "Every job is scored. Every score is shown. No ghost jobs, no fake recruiters." },
      { property: "og:title", content: "Verified Jobs Feed — TrustHire" },
      { property: "og:description", content: "AI-verified job listings with trust scores and match percentages." },
    ],
  }),
  component: JobsPage,
});

const filters = [
  { id: "all", label: "All" },
  { id: "top", label: "Top Trust (90+)" },
  { id: "match", label: "High Match (80+)" },
  { id: "flagged", label: "Flagged" },
] as const;

function JobsPage() {
  const [filter, setFilter] = useState<typeof filters[number]["id"]>("all");
  const filtered = jobs.filter((j) => {
    if (filter === "top") return j.trustScore >= 90;
    if (filter === "match") return j.matchPercent >= 80;
    if (filter === "flagged") return j.flagged;
    return true;
  });

  return (
    <div className="px-6 pb-12">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-primary">Verified Feed</div>
          <h1 className="mt-2 text-4xl font-display font-bold">Jobs we can <span className="text-gradient">prove</span> are real.</h1>
          <p className="mt-2 text-muted-foreground">{jobs.filter((j) => !j.flagged).length} verified · {jobs.filter((j) => j.flagged).length} flagged · updated 2 min ago</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${filter === f.id ? "bg-gradient-primary text-primary-foreground glow-primary" : "glass hover:bg-foreground/5 text-muted-foreground"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((j, i) => <JobCard key={j.id} job={j} index={i} />)}
        </div>

        {filtered.length === 0 && <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No jobs match this filter.</div>}
      </div>
    </div>
  );
}
