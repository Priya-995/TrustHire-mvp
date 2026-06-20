import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Component, ReactNode } from "react";
import { Sparkles, TrendingUp, Target, MessageSquare, Award, ArrowRight, Loader2, Search, RotateCcw, AlertCircle, FileText } from "lucide-react";
import { TypingText } from "@/components/TypingText";
import { GlowButton } from "@/components/GlowButton";
import { TrustScoreRing } from "@/components/TrustScoreRing";
import { toast } from "sonner";

// Simple Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <div className="glass rounded-3xl p-10 max-w-md border-destructive/20 border">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold mb-3">Something went wrong</h1>
            <p className="text-muted-foreground mb-8 text-sm">We encountered an error processing your request. Please try refreshing the page.</p>
            <GlowButton onClick={() => window.location.reload()} size="lg">Refresh Page</GlowButton>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const Route = createFileRoute("/fit")({
  head: () => ({
    meta: [
      { title: "Honest Fit — TrustHire" },
      { name: "description", content: "Conversational AI explains why you match — and what's missing." },
      { property: "og:title", content: "Honest Fit — TrustHire" },
    ],
  }),
  component: () => (
    <ErrorBoundary>
      <Fit />
    </ErrorBoundary>
  ),
});

type FitAnalysis = {
  match_percentage: number;
  verdict: string;
  why_you_match: string[];
  whats_missing: string[];
  growth_suggestions: { skill: string; action: string; timeline: string }[];
  honest_feedback: string;
  final_recommendation: string;
};

function Fit() {
  const [resumeData, setResumeData] = useState<any>(null);
  const [targetJob, setTargetJob] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [fitResult, setFitResult] = useState<FitAnalysis | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("resumeData");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic migration/validation check
        if (parsed && (parsed.breakdown || parsed.trust_breakdown)) {
          setResumeData(parsed);
        } else {
          // Incompatible data, clear it
          localStorage.removeItem("resumeData");
        }
      }
    } catch (e) {
      console.error("Error loading resumeData", e);
      localStorage.removeItem("resumeData");
    }
  }, []);

  const handleAnalyzeFit = async () => {
    if (!targetJob.trim()) {
      toast.error("Please enter a target job role");
      return;
    }

    setAnalyzing(true);
    setFitResult(null);
    setSectionIndex(0);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      toast.error("VITE_GROQ_API_KEY is not defined");
      setAnalyzing(false);
      return;
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a brutally honest career advisor for Indian job seekers. No sugarcoating.",
            },
            {
              role: "user",
              content: `Analyze job fit: 
              Candidate: ${resumeData?.name || "Candidate"} 
              Skills: ${resumeData?.current_skills?.map((s: any) => s.skill).join(", ") || "Not provided"} 
              Experience: ${resumeData?.experience_level || "Not provided"} 
              Target Job: ${targetJob} 
              
              Return ONLY JSON no markdown: 
              { 
                "match_percentage": 0-100, 
                "verdict": "Strong Match or Partial Match or Not Ready Yet", 
                "why_you_match": ["3 specific points"], 
                "whats_missing": ["3-4 skill gaps"], 
                "growth_suggestions": [ 
                  { "skill": "string", "action": "string", "timeline": "string" } 
                ], 
                "honest_feedback": "string (2-3 brutally honest sentences)", 
                "final_recommendation": "string" 
              }`,
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();
      const text = data.choices[0].message.content;
      
      // Robust JSON extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");
      
      const analysis: FitAnalysis = JSON.parse(jsonMatch[0]);
      setFitResult(analysis);
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze fit. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (!resumeData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-10 max-w-md border-primary/20 border"
        >
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto text-primary">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-3">No Profile Found</h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            Please analyze your profile on the Student page first so we can generate your honest fit.
          </p>
          <GlowButton onClick={() => navigate({ to: "/student" })} size="lg" className="w-full">
            Go to Student Page <ArrowRight className="h-4 w-4" />
          </GlowButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-12">
      <div className="mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs mb-4 text-primary">
            <Sparkles className="h-3 w-3" /> Honest Career Advisor
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold">Your Honest Fit</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Targeting a specific role? We'll tell you exactly where you stand. No sugarcoating.
          </p>
        </motion.div>

        {!fitResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="glass rounded-3xl p-8 mb-12"
          >
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block text-center">Which job are you targeting?</div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="e.g. SDE at Google, Data Analyst at Flipkart"
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeFit()}
                className="w-full rounded-2xl bg-foreground/5 border border-border py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
            <div className="mt-6 flex justify-center">
              <GlowButton 
                onClick={handleAnalyzeFit} 
                disabled={analyzing} 
                size="xl" 
                className="w-full sm:w-auto min-w-[200px]"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>Analyze My Fit <ArrowRight className="h-4 w-4" /></>
                )}
              </GlowButton>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {fitResult && (
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="glass rounded-3xl p-8 flex flex-col items-center text-center border-primary/20 border"
              >
                <TrustScoreRing score={fitResult.match_percentage} size={200} label="Match Fit" />
                <div className="mt-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-primary mb-1">Verdict</div>
                  <h2 className="text-3xl font-display font-bold">{fitResult.verdict}</h2>
                  <p className="mt-2 text-muted-foreground italic font-medium text-sm">Target: {targetJob}</p>
                </div>
              </motion.div>

              <div className="space-y-4">
                {[
                  { icon: Target, title: "Why you match", content: fitResult.why_you_match?.join(" · ") || "N/A" },
                  { icon: TrendingUp, title: "What's missing", content: fitResult.whats_missing?.join(" · ") || "N/A" },
                  { icon: Award, title: "Growth Plan", 
                    content: fitResult.growth_suggestions?.map(s => `• ${s.skill}: ${s.action} (${s.timeline})`).join("\n") || "N/A" 
                  },
                  { icon: MessageSquare, title: "Honest Feedback", content: fitResult.honest_feedback || "N/A" },
                  { icon: Sparkles, title: "Final Recommendation", content: fitResult.final_recommendation || "N/A" },
                ].slice(0, sectionIndex + 1).map((s, idx) => {
                  const Icon = s.icon;
                  const isLast = idx === sectionIndex;
                  return (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass rounded-2xl p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs uppercase tracking-[0.15em] text-primary mb-1">{s.title}</div>
                          <div className="text-sm leading-relaxed whitespace-pre-line">
                            {isLast ? (
                              <TypingText 
                                text={s.content} 
                                speed={10} 
                                onDone={() => setSectionIndex(v => Math.min(v + 1, 4))} 
                              />
                            ) : (
                              s.content
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {sectionIndex >= 4 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="mt-12 flex justify-center gap-4"
                >
                  <GlowButton 
                    variant="ghost" 
                    onClick={() => {
                      setFitResult(null);
                      setTargetJob("");
                    }}
                  >
                    <RotateCcw className="h-4 w-4" /> Try Another Job
                  </GlowButton>
                  <Link to="/jobs">
                    <GlowButton>View Matching Jobs <ArrowRight className="h-4 w-4" /></GlowButton>
                  </Link>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
