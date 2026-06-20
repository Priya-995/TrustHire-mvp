import { useEffect, useState } from "react";

export function TypingText({ text, speed = 18, onDone, className = "" }: { text: string; speed?: number; onDone?: () => void; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= text.length) { onDone?.(); return; }
    const t = setTimeout(() => setI(i + 1), speed);
    return () => clearTimeout(t);
  }, [i, text, speed, onDone]);
  return (
    <span className={className}>
      {text.slice(0, i)}
      {i < text.length && <span className="inline-block w-[2px] h-[1em] bg-primary align-[-0.1em] ml-0.5 animate-blink" />}
    </span>
  );
}
