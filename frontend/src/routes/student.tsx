import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { 
  Upload, 
  Linkedin, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  FileText, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Briefcase,
  Calendar,
  ExternalLink,
  Terminal,
  Github,
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  Code2,
  Award,
  Users,
  Brain,
  Zap,
  Globe,
  Check,
  Plus,
  Trash2,
  Info,
  AlertTriangle,
  History
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { TrustScoreRing } from "@/components/TrustScoreRing";
import { JobCard } from "@/components/JobCard";
import { GlowButton } from "@/components/GlowButton";
import { jobs } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — TrustHire" },
      { name: "description", content: "Analyze your profile with AI and get actionable career insights." },
      { property: "og:title", content: "Student Dashboard — TrustHire" },
    ],
  }),
  component: Student,
});

type SkillGap = {
  skill: string;
  why_needed: string;
  how_to_learn: string;
  time_to_learn: string;
};

type RecommendedRole = {
  title: string;
  company_type: string;
  match_percentage: number;
  why_fit: string;
};

type RecommendedInternship = {
  title: string;
  skills_needed: string;
  match_percentage: number;
};

type ActionPlan = {
  week: string;
  task: string;
  resource: string;
};

type ResumeAnalysis = {
  name: string;
  experience_level: string;
  current_skills: { skill: string; score: number; trust_tag?: string }[];
  final_score: number;
  verdict: string;
  breakdown: {
    academic: number;
    practical: number;
    trust_signals: number;
  };
  honesty_gap: "none" | "yellow" | "red";
  strengths: string[];
  red_flags: string[];
  improvement_actions: string[];
  honest_feedback: string;
  summary?: string;
  skill_gaps?: SkillGap[];
  recommended_roles?: RecommendedRole[];
  recommended_internships?: RecommendedInternship[];
  action_plan?: ActionPlan[];
  profile_tips?: string[];
};

const boosterInputCls = "w-full rounded-xl bg-foreground/5 border border-border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";

type CertificationInput = {
  issuer: string;
  name: string;
  url: string;
  isOther?: boolean;
  org?: string;
};

type HackathonInput = {
  level: string;
  name: string;
  organizer: string;
  proofUrl: string;
  postedAnywhere: boolean;
};

function Student() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [projectUrls, setProjectUrls] = useState<string[]>([""]);
  const [university, setUniversity] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [hackathon, setHackathon] = useState<HackathonInput>({
    level: "None",
    name: "",
    organizer: "",
    proofUrl: "",
    postedAnywhere: false
  });
  const [certs, setCerts] = useState<CertificationInput[]>([]);
  const [refereeName, setRefereeName] = useState("");
  const [refereeLinkedin, setRefereeLinkedin] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({
    q1: "",
    q2: "",
    q3: ""
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // We only load saved data to check for previous sessions, but we don't display it immediately
    // unless the user clicks "View Previous Results" or performs a new analysis.
    // This keeps the landing state clean.
    const saved = localStorage.getItem("resumeData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed || !parsed.breakdown) {
          localStorage.removeItem("resumeData");
        }
      } catch (e) {
        localStorage.removeItem("resumeData");
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else if (file) {
      toast.error("Please upload a PDF file only.");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else if (file) {
      toast.error("Please upload a PDF file only.");
    }
  };

  const readFileAsText = async (file: File): Promise<string> => { 
    // PDFs are binary; readAsText will return garbage.
    // We must use a PDF parser to get actual text content.
    return new Promise(async (resolve, reject) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(" ") + "\n";
        }
        resolve(fullText);
      } catch (err) {
        console.error("PDF Parsing Error:", err);
        // Fallback to basic text reading if PDF parsing fails
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsText(file);
      }
    });
  };

  const handleAnalyze = async () => { 
    setLoading(true); 
    setError(null); 
     
    try { 
      if (!quizAnswers.q1 || !quizAnswers.q2 || !quizAnswers.q3) {
        toast.error("Please complete the Honest Self-Assessment quiz first.");
        setLoading(false);
        return;
      }

      let profileContext = ""; 
       
      if (uploadedFile) { 
        const text = await readFileAsText(uploadedFile); 
        // Limit text and remove special characters 
        profileContext = text 
          .slice(0, 2000) 
          .replace(/[^\x20-\x7E\n]/g, ' ') 
          .replace(/\s+/g, ' ') 
          .trim(); 
      } else if (linkedinUrl) { 
        profileContext = linkedinUrl; 
      } else { 
        toast.error("Please upload resume or enter LinkedIn URL"); 
        setLoading(false); 
        return; 
      } 
   
      const prompt = `You are a student trust verification engine. Analyze this candidate profile and return a trust score from 0–100 with breakdown across 3 layers. 
 
 LAYER 1 — Academic Score (0–20 points): 
 CGPA 8+ → 20pts 
 CGPA 7–8 → 15pts 
 CGPA 6–7 → 10pts 
 CGPA < 6 → 5pts 
 No CGPA provided → 10pts (neutral) 
 
 LAYER 2 — Practical Skills Score (0–50 points): 
 GitHub URL provided + description suggests activity → +15pts 
 Live project URL provided → +15pts 
 Certifications listed → +10pts 
 Hackathon participated → +5pts, Won → +10pts 
 
 LAYER 3 — Trust/Honesty Score (0–30 points): 
 Self-assessment answers are honest and modest → +10pts 
 Peer reference provided → +8pts 
 Skills on resume match GitHub/project evidence → +7pts 
 Consistent career focus (not random stack jumping) → +5pts 

 CONSISTENCY CROSS-CHECK (critical): 
 Analyze all provided data for logical consistency: 
  
 RED FLAGS to detect and penalize (-10 to -20 pts each): 
 - Claims hackathon win but zero projects or GitHub provided 
 - Claims 1+ year experience but self-assessment says 'just learned' 
 - Multiple high certifications claimed but no verify URLs provided 
 - Claims live projects but URLs are placeholder/localhost/github readme only 
 - Resume says expert level but self-quiz answers suggest beginner 
  
 YELLOW FLAGS (note but don't heavily penalize): 
 - Certifications from unknown issuers with no verify link 
 - Hackathon win mentioned but no proof link 
 - Skills listed on resume not reflected in any project or cert 
  
 IMPORTANT — Label all unverified claims in feedback: 
 In honest_feedback, clearly separate: 
 'VERIFIED:' — things with proof links/evidence 
 'SELF-REPORTED:' — things claimed but unverifiable 
 'INCONSISTENT:' — things that contradict each other 
  
 A candidate with 3 verified items scores higher than one with 10 unverified claims. Reward provable honesty.
 
 Candidate Data:
 - Profile Text: ${profileContext}
 - LinkedIn: ${linkedinUrl || "Not provided"}
 - GitHub: ${githubUrl || "Not provided"}
 - Projects: ${projectUrls.filter(u => u.trim()).join(", ") || "None"}
 - University: ${university || "Not provided"}
 - CGPA: ${cgpa || "Not provided"}
 - Hackathon: ${hackathon.level} (${hackathon.name} at ${hackathon.organizer}, Proof: ${hackathon.proofUrl}, Posted: ${hackathon.postedAnywhere ? "Yes" : "No"})
 - Certifications: ${certs.map(c => `${c.issuer}: ${c.name} (${c.url || "No URL"})`).join("; ") || "None"}
 - Peer Reference: ${refereeName} (${refereeLinkedin})
 - Self-Assessment: 
    1. Experience: ${quizAnswers.q1}
    2. Build from scratch: ${quizAnswers.q2}
    3. Real world use: ${quizAnswers.q3}
 
 Return ONLY JSON: 
 { 
   "name": "string",
   "experience_level": "string",
   "final_score": number, 
   "verdict": "string", 
   "breakdown": { 
     "academic": number, 
     "practical": number, 
     "trust_signals": number 
   }, 
   "honesty_gap": "none" | "yellow" | "red", 
   "strengths": string[], 
   "red_flags": string[], 
   "improvement_actions": string[], 
   "honest_feedback": string,
   "summary": "string",
   "current_skills": [{"skill": "string", "score": number, "trust_tag": "Verified" | "Self-Reported" | "Inconsistent" | "Suspicious"}],
   "skill_gaps": [{"skill": "string", "why_needed": "string", "how_to_learn": "string", "time_to_learn": "string"}],
   "recommended_roles": [{"title": "string", "company_type": "string", "match_percentage": number, "why_fit": "string"}],
   "action_plan": [{"week": "string", "task": "string", "resource": "string"}],
   "profile_tips": string[]
 }`; 
   
      const response = await fetch( 
        'https://api.groq.com/openai/v1/chat/completions', 
        { 
          method: 'POST', 
          headers: { 
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`, 
            'Content-Type': 'application/json' 
          }, 
          body: JSON.stringify({ 
            model: 'llama-3.3-70b-versatile', 
            messages: [ 
              { 
                role: 'user', 
                content: prompt 
              } 
            ], 
            max_tokens: 2000, 
            temperature: 0.3 
          }) 
        } 
      ); 
   
      if (!response.ok) { 
        const errData = await response.json(); 
        throw new Error(`API ${response.status}: ${JSON.stringify(errData)}`); 
      } 
       
      const data = await response.json(); 
      const text = data.choices[0].message.content; 
       
      // Clean and parse JSON 
      const jsonMatch = text.match(/\{[\s\S]*\}/); 
      if (!jsonMatch) throw new Error('No JSON in response'); 
       
      const result = JSON.parse(jsonMatch[0]); 
      
      // Robust number parsing
      const parseScore = (val: any) => {
        if (typeof val === "number") return val;
        const num = parseInt(String(val).replace(/[^0-9]/g, ""));
        return isNaN(num) ? 0 : num;
      };

      if (result.final_score) result.final_score = parseScore(result.final_score);
      if (result.current_skills) {
        result.current_skills = result.current_skills.map((s: any) => ({
          ...s,
          score: parseScore(s.score)
        }));
      }
      if (result.breakdown) {
        result.breakdown.academic = parseScore(result.breakdown.academic);
        result.breakdown.practical = parseScore(result.breakdown.practical);
        result.breakdown.trust_signals = parseScore(result.breakdown.trust_signals);
      }

      localStorage.setItem('resumeData', JSON.stringify(result)); 
      setAnalysisResult(result); 
      toast.success("Profile analyzed successfully!");
      
      // Scroll to results smoothly
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
       
    } catch (err: any) { 
      console.error('Full error:', err); 
      setError('Analysis failed: ' + err.message); 
      toast.error('Analysis failed: ' + err.message);
    } finally { 
      setLoading(false); 
    } 
  }; 

  const recommendedJobs = jobs.filter((j) => !j.flagged).slice(0, 3);

  return (
    <div className="px-6 pb-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent">Student Console</div>
            <h1 className="mt-2 text-4xl font-display font-bold">
              {analysisResult ? `Welcome, ${(analysisResult.name || "Student").split(" ")[0]}.` : "Futuristic Career AI"}
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xl">
              {analysisResult ? analysisResult.summary : "Upload your resume or link your LinkedIn to generate your real-time trust profile."}
            </p>
          </div>
          <GlowButton 
            size="md" 
            disabled={!analysisResult}
            onClick={() => navigate({ to: "/fit" })}
            className={cn(!analysisResult && "opacity-50 cursor-not-allowed")}
          >
            See Honest Fit <ArrowRight className="h-4 w-4" />
          </GlowButton>
        </motion.div>

        {/* Profile Inputs */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 mb-12">
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* PDF Upload */}
              <div 
                onClick={() => fileRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={cn(
                  "glass rounded-3xl p-8 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center text-center hover:bg-foreground/5",
                  uploadedFile ? "border-primary/60 bg-primary/5" : "border-border",
                  isDragging && "border-primary bg-primary/10 scale-[1.02]"
                )}
              >
                <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  {uploadedFile ? <FileText className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
                </div>
                <h3 className="font-display font-bold mb-1">Resume Upload</h3>
                <p className="text-xs text-muted-foreground mb-4">Drag & drop your PDF here</p>
                {uploadedFile && (
                  <div className="text-sm font-medium text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> {uploadedFile.name}
                  </div>
                )}
              </div>

              {/* Socials & University */}
              <div className="glass rounded-3xl p-8 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-border group focus-within:border-primary/40 transition-all">
                  <Linkedin className="h-5 w-5 text-[#0077b5]" />
                  <input 
                    type="text" 
                    placeholder="LinkedIn Profile URL"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0"
                  />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-border group focus-within:border-primary/40 transition-all">
                  <Github className="h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="GitHub / Portfolio URL"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0"
                  />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-border group focus-within:border-primary/40 transition-all">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  <input 
                    type="text" 
                    placeholder="University / College"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <GlowButton 
              onClick={handleAnalyze}
              disabled={loading || (!uploadedFile && !linkedinUrl)}
              className="w-full h-14 text-lg"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> AI is analyzing your profile...</>
              ) : (
                <>Analyze My Profile with AI <ArrowRight className="h-5 w-5" /></>
              )}
            </GlowButton>

            {/* Trust Boosters Section */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-display font-bold uppercase tracking-wider">Trust Boosters</h2>
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">OPTIONAL</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Live Projects Card */}
                <div className="sm:col-span-2 glass rounded-2xl p-4 border border-border hover:border-primary/20 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3">
                    <span className="text-[9px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">+10 pts per project</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider">Live Projects</h4>
                      <p className="text-[10px] text-muted-foreground">Proof your code actually works (AI link check)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {projectUrls.map((url, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground w-14 shrink-0">Project {idx + 1}</span>
                          <input 
                            type="text" 
                            placeholder="https://your-project.com or GitHub repo link"
                            value={url}
                            onChange={(e) => {
                              const newUrls = [...projectUrls];
                              newUrls[idx] = e.target.value;
                              setProjectUrls(newUrls);
                            }}
                            className={boosterInputCls}
                          />
                          {projectUrls.length > 1 && (
                            <button 
                              onClick={() => setProjectUrls(projectUrls.filter((_, i) => i !== idx))}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-[9px] text-muted-foreground/60 ml-16 flex items-center gap-1">
                          <Info className="h-3 w-3" /> Self-Reported — verified by AI link check
                        </p>
                      </div>
                    ))}
                    
                    {projectUrls.length < 5 && (
                      <button 
                        onClick={() => setProjectUrls([...projectUrls, ""])}
                        className="w-full py-2 rounded-xl border border-dashed border-border text-[10px] font-bold text-muted-foreground hover:bg-foreground/5 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Another Project
                      </button>
                    )}
                  </div>
                </div>

                {/* GitHub Card */}
                <TrustBoosterCard 
                  icon={Github} 
                  label="GitHub Profile URL" 
                  hint="Verify real coding activity" 
                  impact="+25 pts"
                >
                  <input 
                    type="text" 
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className={boosterInputCls}
                  />
                </TrustBoosterCard>

                {/* CGPA Card */}
                <TrustBoosterCard 
                  icon={GraduationCap} 
                  label="Academic CGPA" 
                  hint="Academic score (separate from skills)" 
                  impact="+20 pts"
                >
                  <input 
                    type="number" 
                    min="0" max="10" step="0.1"
                    placeholder="Score (0-10)"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className={boosterInputCls}
                  />
                </TrustBoosterCard>
              </div>

              {/* Hackathon Card */}
              <TrustBoosterCard 
                icon={Award} 
                label="Hackathon Experience" 
                hint="Devfolio and Unstop submissions are public — paste your project URL" 
                impact="+10 pts"
              >
                <div className="space-y-4 mt-3">
                  <select 
                    value={hackathon.level}
                    onChange={(e) => setHackathon({ ...hackathon, level: e.target.value })}
                    className={cn(boosterInputCls, "bg-background/80 cursor-pointer")}
                  >
                    <option value="None">No Hackathon Experience</option>
                    <option value="Participated">Participated in Hackathon</option>
                    <option value="Won Local">Won Local Hackathon</option>
                    <option value="Won National">Won National Hackathon</option>
                    <option value="Won International">Won International Hackathon</option>
                  </select>
                  
                  {hackathon.level !== "None" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-border/40"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Hackathon Name</span>
                        <input 
                          type="text" 
                          placeholder="e.g. Smart India Hackathon"
                          value={hackathon.name}
                          onChange={(e) => setHackathon({ ...hackathon, name: e.target.value })}
                          className={boosterInputCls}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Platform/Organizer</span>
                        <input 
                          type="text" 
                          placeholder="Devfolio, Unstop, HackerEarth..."
                          value={hackathon.organizer}
                          onChange={(e) => setHackathon({ ...hackathon, organizer: e.target.value })}
                          className={boosterInputCls}
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Proof Link</span>
                        <input 
                          type="text" 
                          placeholder="Devfolio project link / submission link"
                          value={hackathon.proofUrl}
                          onChange={(e) => setHackathon({ ...hackathon, proofUrl: e.target.value })}
                          className={boosterInputCls}
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-foreground/5 border border-border">
                        <span className="text-[10px] font-medium">Did you post this anywhere?</span>
                        <div className="flex items-center gap-3">
                          <span className={cn("text-[9px] font-bold uppercase", !hackathon.postedAnywhere ? "text-primary" : "text-muted-foreground")}>No</span>
                          <button 
                            type="button"
                            onClick={() => setHackathon({ ...hackathon, postedAnywhere: !hackathon.postedAnywhere })}
                            className={cn(
                              "w-10 h-5 rounded-full relative transition-colors",
                              hackathon.postedAnywhere ? "bg-primary" : "bg-foreground/20"
                            )}
                          >
                            <motion.div 
                              animate={{ x: hackathon.postedAnywhere ? 22 : 2 }}
                              className="absolute top-1 w-3 h-3 rounded-full bg-white"
                            />
                          </button>
                          <span className={cn("text-[9px] font-bold uppercase", hackathon.postedAnywhere ? "text-primary" : "text-muted-foreground")}>Yes</span>
                        </div>
                      </div>
                      {!hackathon.postedAnywhere && (
                        <p className="sm:col-span-2 text-[9px] text-muted-foreground italic leading-tight bg-primary/5 p-2 rounded-lg border border-primary/10">
                          That's okay. Paste your submission link — unposted wins still count and actually show honesty.
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              </TrustBoosterCard>

              {/* Certifications Card */}
              <TrustBoosterCard 
                icon={ShieldCheck} 
                label="Certifications" 
                hint="Known issuer + valid verify URL format → full points (+10)" 
                impact="+10 pts/cert"
              >
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Google", "AWS", "Microsoft", "Coursera", "NPTEL", "Meta", "IBM"].map(issuer => {
                      const isSelected = certs.some(c => c.issuer === issuer && !c.isOther);
                      return (
                        <button
                          key={issuer}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setCerts(certs.filter(c => !(c.issuer === issuer && !c.isOther)));
                            } else {
                              setCerts([...certs, { issuer, name: `${issuer} Certified`, url: "" }]);
                            }
                          }}
                          className={cn(
                            "text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all",
                            isSelected 
                              ? "bg-primary/20 border-primary text-primary" 
                              : "bg-foreground/5 border-border text-muted-foreground hover:border-foreground/20"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 inline mr-1" />}
                          {issuer}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="space-y-3">
                    {certs.map((cert, idx) => (
                      <div key={idx} className="glass rounded-xl p-3 border border-border space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-primary">{cert.issuer}</span>
                            {cert.isOther && <span className="text-[9px] bg-warning/10 text-warning px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">Unrecognized Issuer</span>}
                          </div>
                          <button onClick={() => setCerts(certs.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        
                        {cert.isOther ? (
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              placeholder="Certification Name"
                              value={cert.name}
                              onChange={(e) => {
                                const newCerts = [...certs];
                                newCerts[idx].name = e.target.value;
                                setCerts(newCerts);
                              }}
                              className={boosterInputCls}
                            />
                            <input 
                              type="text" 
                              placeholder="Issuing Organization"
                              value={cert.org || ""}
                              onChange={(e) => {
                                const newCerts = [...certs];
                                newCerts[idx].org = e.target.value;
                                setCerts(newCerts);
                              }}
                              className={boosterInputCls}
                            />
                          </div>
                        ) : (
                          <p className="text-[10px] font-medium">{cert.name}</p>
                        )}
                        
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            placeholder="https://verify-link.com/XXXXXX"
                            value={cert.url}
                            onChange={(e) => {
                              const newCerts = [...certs];
                              newCerts[idx].url = e.target.value;
                              setCerts(newCerts);
                            }}
                            className={boosterInputCls}
                          />
                          <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                            <Info className="h-3 w-3" /> Every cert has a public verify link — paste it here
                          </p>
                          {cert.isOther && (
                            <p className="text-[9px] text-warning flex items-center gap-1 font-medium mt-1">
                              <AlertTriangle className="h-3 w-3" /> Lower trust weight until URL verified
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setCerts([...certs, { issuer: "Other", name: "", url: "", isOther: true, org: "" }])}
                      className="w-full py-2 rounded-xl border border-dashed border-border text-[10px] font-bold text-muted-foreground hover:bg-foreground/5 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Other Certification
                    </button>
                  </div>
                </div>
              </TrustBoosterCard>

              {/* Peer Reference Card */}
              <TrustBoosterCard 
                icon={Users} 
                label="Peer Reference" 
                hint="A teacher, senior, or teammate who can vouch for you" 
                impact="+8 pts"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Referee Name"
                    value={refereeName}
                    onChange={(e) => setRefereeName(e.target.value)}
                    className={boosterInputCls}
                  />
                  <input 
                    type="text" 
                    placeholder="Referee LinkedIn"
                    value={refereeLinkedin}
                    onChange={(e) => setRefereeLinkedin(e.target.value)}
                    className={boosterInputCls}
                  />
                </div>
              </TrustBoosterCard>

              {/* Honest Self-Assessment Quiz */}
              <div className="glass rounded-3xl p-6 border border-border bg-foreground/5">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-accent" />
                  <h3 className="font-display font-bold">Honest Self-Assessment</h3>
                  <span className="text-[10px] text-muted-foreground ml-auto italic">Honest answers score HIGHER</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium mb-2">Q1: How long have you actually used your primary skill?</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["Just learned", "3–6 months", "6–12 months", "1+ years"].map(opt => (
                        <QuizOption 
                          key={opt} 
                          selected={quizAnswers.q1 === opt} 
                          onClick={() => setQuizAnswers({...quizAnswers, q1: opt})}
                          label={opt}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-2">Q2: Can you build a project from scratch without tutorials?</p>
                    <div className="grid grid-cols-3 gap-2">
                      {["No", "With some help", "Yes confidently"].map(opt => (
                        <QuizOption 
                          key={opt} 
                          selected={quizAnswers.q2 === opt} 
                          onClick={() => setQuizAnswers({...quizAnswers, q2: opt})}
                          label={opt}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-2">Q3: Have you used this skill in a real/live project?</p>
                    <div className="grid grid-cols-3 gap-2">
                      {["No", "Personal project only", "Client/internship/job"].map(opt => (
                        <QuizOption 
                          key={opt} 
                          selected={quizAnswers.q3 === opt} 
                          onClick={() => setQuizAnswers({...quizAnswers, q3: opt})}
                          label={opt}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info/Result Summary */}
          <div>
            {analysisResult ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-8 flex flex-col items-center text-center border-primary/20 border h-full justify-center">
                <TrustScoreRing score={analysisResult.final_score || 0} size={200} label="Trust Score" />
                
                <div className="mt-8 space-y-4 w-full">
                  <ScoreBar label="Academic" score={analysisResult.breakdown?.academic || 0} total={20} color="bg-blue-500" />
                  <ScoreBar label="Practical" score={analysisResult.breakdown?.practical || 0} total={50} color="bg-primary" />
                  <ScoreBar label="Trust" score={analysisResult.breakdown?.trust_signals || 0} total={30} color="bg-accent" />
                </div>

                <div className={cn(
                  "mt-6 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest",
                  analysisResult.final_score >= 85 ? "bg-success/20 text-success border border-success/30" :
                  analysisResult.final_score >= 70 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                  analysisResult.final_score >= 50 ? "bg-warning/20 text-warning border border-warning/30" :
                  "bg-foreground/10 text-muted-foreground border border-border"
                )}>
                  {analysisResult.final_score >= 85 ? "Highly Credible Candidate" :
                   analysisResult.final_score >= 70 ? "Strong Candidate" :
                   analysisResult.final_score >= 50 ? "Promising — Needs More Proof" :
                   "Early Stage — Keep Building"}
                </div>
              </motion.div>
            ) : (
              <div className="glass rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <Target className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-sm">Analysis results will appear here after processing.</p>
              </div>
            )}
          </div>
        </div>

        {/* Honesty Gap Banner */}
        {analysisResult && analysisResult.honesty_gap !== "none" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-10 p-4 rounded-2xl border flex items-center gap-4",
              analysisResult.honesty_gap === "red" ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-warning/10 border-warning/20 text-warning"
            )}
          >
            <ShieldAlert className="h-6 w-6 shrink-0" />
            <div className="text-sm font-medium">
              {analysisResult.honesty_gap === "red" 
                ? "Your claims are significantly stronger than your proof — add GitHub or live projects to verify" 
                : "You're underselling yourself — your proof suggests you're better than you claim!"}
            </div>
          </motion.div>
        )}

        {/* Analysis Results Sections */}
        {analysisResult && (
          <div ref={resultsRef} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* How to Improve Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-display font-bold uppercase tracking-wider">How to Improve Your Score</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {(analysisResult.improvement_actions || []).map((action, i) => (
                  <div key={i} className="glass rounded-3xl p-6 border border-primary/10 relative overflow-hidden group">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mb-4">
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed font-medium">{action}</p>
                  </div>
                ))}
              </div>
            </section>
            {/* 2. Current Skills */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Terminal className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-display font-bold uppercase tracking-wider">Current Skills</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(analysisResult.current_skills || []).map((s: any, i) => (
                  <div key={s.skill} className="glass rounded-2xl p-5 group relative">
                    <div className="flex justify-between text-sm mb-2 font-bold">
                      <div className="flex flex-col gap-1">
                        <span>{s.skill}</span>
                        {s.trust_tag && (
                          <span className={cn(
                            "text-[8px] uppercase tracking-tighter px-1.5 py-0.5 rounded-sm w-fit flex items-center gap-1",
                            s.trust_tag === "Verified" ? "bg-success/10 text-success" :
                            s.trust_tag === "Self-Reported" ? "bg-blue-500/10 text-blue-400" :
                            s.trust_tag === "Inconsistent" ? "bg-warning/10 text-warning" :
                            "bg-destructive/10 text-destructive"
                          )}>
                            {s.trust_tag === "Verified" && <CheckCircle2 className="h-2 w-2" />}
                            {s.trust_tag === "Self-Reported" && <FileText className="h-2 w-2" />}
                            {s.trust_tag === "Inconsistent" && <AlertTriangle className="h-2 w-2" />}
                            {s.trust_tag === "Suspicious" && <XCircle className="h-2 w-2" />}
                            {s.trust_tag}
                          </span>
                        )}
                      </div>
                      <span className="text-primary tabular-nums">{s.score || 0}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.score || 0}%` }} transition={{ duration: 1.2, delay: i * 0.05 }} className="h-full bg-gradient-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Skill Gaps */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-destructive" />
                <h2 className="text-2xl font-display font-bold uppercase tracking-wider">Skill Gaps to Bridge</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {(analysisResult.skill_gaps || []).map((gap) => (
                  <div key={gap.skill} className="glass rounded-3xl p-6 border-l-4 border-destructive/40">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border border-destructive/20">
                        {gap.skill}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {gap.time_to_learn}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-2">{gap.why_needed}</p>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{gap.how_to_learn}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4 & 5 Roles & Internships */}
            <div className="grid lg:grid-cols-2 gap-10">
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-display font-bold uppercase tracking-wider">Recommended Roles</h2>
                </div>
                <div className="space-y-4">
                  {(analysisResult.recommended_roles || []).map((role) => (
                    <div key={role.title} className="glass rounded-2xl p-6 flex gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">{role.title}</h3>
                          <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{role.match_percentage}% Match</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{role.company_type}</p>
                        <p className="text-sm leading-relaxed">{role.why_fit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {analysisResult.recommended_internships && analysisResult.recommended_internships.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <h2 className="text-2xl font-display font-bold uppercase tracking-wider">Top Internships</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {analysisResult.recommended_internships.map((intern) => (
                      <div key={intern.title} className="glass rounded-2xl p-5 text-center">
                        <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3 font-bold text-xs">
                          {intern.match_percentage}%
                        </div>
                        <h3 className="font-bold text-sm mb-1">{intern.title}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider line-clamp-1">{intern.skills_needed}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* 6. Action Plan */}
            <section className="glass rounded-[40px] p-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <TrendingUp size={120} />
              </div>
              <div className="flex items-center gap-2 mb-8">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-display font-bold uppercase tracking-wider">Your Action Plan</h2>
              </div>
              <div className="space-y-8 relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-border hidden sm:block" />
                {(analysisResult.action_plan || []).map((step, i) => (
                  <div key={step.week} className="flex flex-col sm:flex-row gap-4 relative">
                    <div className="h-8 w-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-[10px] font-bold z-10 shrink-0 hidden sm:flex">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{step.week}</div>
                      <h3 className="font-display font-bold text-lg mb-2">{step.task}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-foreground/5 w-fit px-3 py-1.5 rounded-lg border border-border">
                        <ExternalLink className="h-3 w-3" /> {step.resource}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Profile Tips */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="h-5 w-5 text-warning" />
                <h2 className="text-2xl font-display font-bold uppercase tracking-wider">Profile Improvement Tips</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {(analysisResult.profile_tips || []).map((tip, i) => (
                  <div key={i} className="glass rounded-3xl p-6 bg-warning/5 border-warning/10 border relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Lightbulb size={80} />
                    </div>
                    <p className="text-sm leading-relaxed font-medium">{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Verified Recommendations Section */}
            <div className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-display font-bold">Verified Recommendations</h2>
                <Link to="/jobs" className="text-sm text-primary hover:underline font-bold flex items-center gap-1.5">
                  See all live openings <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedJobs.map((j, i) => <JobCard key={j.id} job={j} index={i} />)}
              </div>
            </div>

            {/* Trust Footer Note */}
            <div className="pt-10 pb-4 border-t border-border flex flex-col items-center text-center">
              <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold mb-3">
                <ShieldCheck className="h-4 w-4" /> Trust Verification Policy
              </div>
              <p className="text-[11px] text-muted-foreground max-w-2xl leading-relaxed">
                Self-reported items are not independently verified by TrustHire. 
                Candidates take full responsibility for accuracy. 
                False claims reduce trust score and are flagged to recruiters.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrustBoosterCard({ icon: Icon, label, hint, impact, children }: { icon: any, label: string, hint: string, impact: string, children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4 border border-border hover:border-primary/20 transition-all group relative">
      <div className="absolute top-0 right-0 p-3">
        <span className="text-[9px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">{impact}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider">{label}</h4>
          <p className="text-[10px] text-muted-foreground">{hint}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function QuizOption({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-[10px] font-bold py-2 rounded-xl border transition-all",
        selected 
          ? "bg-primary text-primary-foreground border-primary glow-primary" 
          : "bg-foreground/5 border-border text-muted-foreground hover:bg-foreground/10"
      )}
    >
      {label}
    </button>
  );
}

function ScoreBar({ label, score, total, color }: { label: string, score: number, total: number, color: string }) {
  const percentage = (score / total) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">{score}/{total}</span>
      </div>
      <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}
