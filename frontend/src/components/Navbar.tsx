import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Jobs" },
  { to: "/student", label: "Student" },
  { to: "/recruiter", label: "Recruiter" },
  { to: "/fit", label: "Honest Fit" },
] as const;

export function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50 px-4 pt-4"
    >
      <nav className="glass-strong mx-auto max-w-6xl rounded-full px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary glow-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-lg tracking-tight">TrustHire</span>
        </Link>
        <div className="hidden md:flex items-center gap-1 text-sm">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-1.5 rounded-full transition-all ${active ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <Link
          to="/recruiter"
          className="hidden sm:inline-flex items-center rounded-full bg-gradient-primary px-4 py-1.5 text-sm font-medium text-primary-foreground glow-primary hover:scale-105 transition-transform"
        >
          Get Started
        </Link>
      </nav>
    </motion.header>
  );
}
