import { animate, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function AnimatedStat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, value, { duration: 2, ease: [0.22, 1, 0.36, 1] });
    const unsub = mv.on("change", (v) => setDisplay(Math.round(v)));
    return () => { c.stop(); unsub(); };
  }, [inView, value, mv]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-display font-bold text-gradient tabular-nums">
        {display.toLocaleString()}{suffix}
      </div>
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1.5">{label}</div>
    </div>
  );
}
