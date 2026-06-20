import { motion } from "framer-motion";
import { forwardRef } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  size?: "md" | "lg" | "xl";
};

export const GlowButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const sizes = { md: "px-5 py-2.5 text-sm", lg: "px-7 py-3 text-base", xl: "px-9 py-4 text-lg" }[size];
    const base =
      variant === "primary"
        ? "bg-gradient-primary text-primary-foreground glow-primary hover:scale-[1.03]"
        : "glass text-foreground hover:bg-foreground/5";
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={`relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all ${sizes} ${base} ${className}`}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {variant === "primary" && (
          <span className="absolute inset-0 rounded-full overflow-hidden">
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
          </span>
        )}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }
);
GlowButton.displayName = "GlowButton";
