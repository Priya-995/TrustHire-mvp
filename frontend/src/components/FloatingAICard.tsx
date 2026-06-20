import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function FloatingAICard({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-strong rounded-2xl p-4 shadow-2xl ${className}`}
      style={{ animation: `float 6s ease-in-out ${delay}s infinite` }}
    >
      {children}
    </motion.div>
  );
}
