import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

export function TrustScoreRing({ score, size = 220, label = "Trust Score" }: { score: number; size?: number; label?: string }) {
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  const target = Math.max(0, Math.min(100, score));
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const offset = useTransform(mv, (v) => circumference - (v / 100) * circumference);

  useEffect(() => {
    const c = animate(mv, target, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    const unsub = mv.on("change", (v) => setDisplay(Math.round(v)));
    return () => { c.stop(); unsub(); };
  }, [target, mv]);

  const color = target >= 75 ? "oklch(0.72 0.18 155)" : target >= 50 ? "oklch(0.78 0.17 75)" : "oklch(0.62 0.24 25)";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 drop-shadow-[0_0_30px_rgba(140,100,255,0.4)]">
        <defs>
          <linearGradient id={`grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.72 0.2 280)" />
            <stop offset="100%" stopColor="oklch(0.72 0.2 240)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="oklch(0.3 0.04 275 / 0.5)" strokeWidth="10" fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={`url(#grad-${size})`} strokeWidth="10" fill="none" strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset, filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-display font-bold text-gradient">{display}</div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
