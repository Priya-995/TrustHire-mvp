import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const STEPS = [
  "Analyzing hiring patterns…",
  "Scanning fraud signals…",
  "Checking company legitimacy…",
  "Cross-referencing market data…",
  "Running AI verification…",
];

export function LoadingScanner({ onDone, durationMs = 3200 }: { onDone: () => void; durationMs?: number }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const interval = durationMs / STEPS.length;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), interval);
    const done = setTimeout(onDone, durationMs);
    return () => { clearInterval(t); clearTimeout(done); };
  }, [onDone, durationMs]);

  return (
    <div className="relative flex flex-col items-center justify-center py-20">
      {/* Scanner ring */}
      <div className="relative h-48 w-48">
        <div className="absolute inset-0 rounded-full border border-primary/30" />
        <motion.div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/40" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute inset-6 rounded-full border-2 border-accent/50" animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
        <div className="absolute inset-10 rounded-full bg-gradient-primary glow-primary animate-pulse-glow" />
        {/* scan line */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" style={{ filter: "blur(2px)" }} />
        </div>
      </div>

      <div className="mt-10 h-6 relative w-full max-w-md text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-mono text-muted-foreground"
          >
            <span className="text-primary">›</span> {STEPS[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* progress bar */}
      <div className="mt-6 h-1 w-72 max-w-full overflow-hidden rounded-full bg-foreground/10">
        <motion.div className="h-full bg-gradient-primary" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: durationMs / 1000, ease: "linear" }} />
      </div>

      {/* fake log lines */}
      <div className="mt-8 w-full max-w-md font-mono text-[10px] text-muted-foreground/60 space-y-0.5">
        {["[ok] tls handshake", "[ok] whois lookup", "[ok] recruiter graph", "[ok] salary cohort", "[ok] llm intent classifier"].slice(0, step + 1).map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>{l}</motion.div>
        ))}
      </div>
    </div>
  );
}
