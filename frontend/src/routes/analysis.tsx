import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, RotateCcw, Briefcase, CheckCircle2, XCircle, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { TrustScoreRing } from "@/components/TrustScoreRing";
import { LoadingScanner } from "@/components/LoadingScanner";
import { GlowButton } from "@/components/GlowButton";
import { useAnalysisStore } from "@/lib/store";
import { analyze, type AnalysisResult } from "@/lib/mock-analysis";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "AI Trust Analysis — TrustHire" },
      { name: "description", content: "Live AI breakdown of a job posting's trust signals." },
      { property: "og:title", content: "AI Trust Analysis — TrustHire" },
      { property: "og:description", content: "Trust score, fraud risk, salary transparency, and more." },
    ],
  }),
  component: Analysis,
});

function Analysis() {
  const input = useAnalysisStore((s) => s.input);
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input) {
      const t = setTimeout(() => navigate({ to: "/recruiter" }), 50);
      return () => clearTimeout(t);
    }
  }, [input, navigate]);

  useEffect(() => {
    if (input && !result && !error) {
      analyze(input)
        .then(setResult)
        .catch((err) => {
          console.error(err);
          setError(err.message || "Failed to analyze job posting");
        });
    }
  }, [input, result, error]);

  if (!input) return null;

  return (
    <div className="px-6 pb-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/recruiter"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to recruiter
        </Link>

        {error ? (
          <div className="glass rounded-3xl p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">Analysis Failed</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setResult(null);
                setScanning(true);
              }}
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 hover:bg-foreground/5"
            >
              <RotateCcw className="h-4 w-4" /> Try Again
            </button>
          </div>
        ) : scanning || !result ? (
          <div className="glass rounded-3xl">
            <LoadingScanner onDone={() => setScanning(false)} />
          </div>
        ) : (
          <Results
            input={input}
            result={result}
            onRescan={() => {
              setResult(null);
              setScanning(true);
            }}
          />
        )}
      </div>
    </div>
  );
}

function Results({
  input,
  result,
  onRescan,
}: {
  input: any;
  result: AnalysisResult;
  onRescan: () => void;
}) {
  const getVerdictColor = (score: number) => {
    if (score >= 75) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const getVerdictLabel = (score: number) => {
    if (score >= 75) return "Trusted Job";
    if (score >= 40) return "Proceed with Caution";
    return "High Risk — Likely Scam";
  };

  const getVerdictIcon = (score: number) => {
    if (score >= 75) return ShieldCheck;
    if (score >= 40) return Shield;
    return ShieldAlert;
  };

  const VerdictIcon = getVerdictIcon(result.trustScore);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header / Main Score */}
      <div className="glass rounded-[40px] p-8 sm:p-12 grid lg:grid-cols-[1fr_360px] gap-12 items-center border-primary/10 border">
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <VerdictIcon className={cn("h-4 w-4", getVerdictColor(result.trustScore))} />
            Analysis Verdict
          </div>
          <h1 className={cn("text-4xl sm:text-5xl font-display font-bold mb-4", getVerdictColor(result.trustScore))}>
            {getVerdictLabel(result.trustScore)}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {result.summary}
          </p>
          
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-foreground/5 border border-border w-fit mb-8">
            <Briefcase className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-bold">{input.jobTitle}</div>
              <div className="text-xs text-muted-foreground">{input.company}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <GlowButton onClick={onRescan} variant="ghost" size="lg">
              <RotateCcw className="h-4 w-4" /> Re-run Analysis
            </GlowButton>
            <Link to="/jobs">
              <GlowButton size="lg">Verify Similar Jobs <Briefcase className="h-4 w-4" /></GlowButton>
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2 flex flex-col items-center justify-center space-y-4">
          <TrustScoreRing score={result.trustScore} size={280} />
          <div className="text-center">
            <div className="text-5xl font-display font-bold tabular-nums">{result.trustScore}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Trust Points</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Trust Factors Breakdown */}
        <section className="glass rounded-[32px] p-8 border border-border">
          <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Trust Factors Breakdown
          </h2>
          <div className="space-y-4">
            {Object.entries(result.breakdown).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  {value >= 14 ? ( // 14/20 is 70%
                    <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                  )}
                  <span className="text-sm font-medium capitalize text-foreground/80 group-hover:text-foreground transition-colors">
                    {key.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="text-sm font-bold tabular-nums opacity-60 group-hover:opacity-100 transition-opacity">
                  {value}/20
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Signals Section */}
        <div className="space-y-6">
          <div className="glass rounded-[32px] p-8 border-success/10 border bg-success/5">
            <h3 className="text-sm uppercase tracking-widest font-bold text-success mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Green Signals
            </h3>
            <ul className="space-y-3">
              {result.green_signals.map((s, i) => (
                <li key={i} className="text-sm flex items-start gap-2 text-foreground/80">
                  <div className="h-1.5 w-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-[32px] p-8 border-destructive/10 border bg-destructive/5">
            <h3 className="text-sm uppercase tracking-widest font-bold text-destructive mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Red Flags
            </h3>
            <ul className="space-y-3">
              {result.red_flags.map((s, i) => (
                <li key={i} className="text-sm flex items-start gap-2 text-foreground/80">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
