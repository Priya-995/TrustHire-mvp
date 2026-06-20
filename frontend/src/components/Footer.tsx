import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/50 px-6 py-10">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-md bg-gradient-primary flex items-center justify-center">
            <Shield className="h-3.5 w-3.5 text-primary-foreground" />
          </span>
          <span className="font-display font-semibold text-foreground">TrustHire</span>
          <span>· honest hiring, by design.</span>
        </div>
        <div className="font-mono text-xs">v1.0 · demo</div>
      </div>
    </footer>
  );
}
