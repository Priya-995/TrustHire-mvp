import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateExplanation(
  scoreData: {
    score: number;
    risk: string;
    breakdown: Array<{ name: string; score: number; max: number; flags: string[] }>;
  },
  jobTitle: string,
  company: string
): Promise<string> {
  const flagSummary = scoreData.breakdown
    .flatMap(b => b.flags)
    .join(", ") || "none";

  const prompt = `You are an employment fraud analyst reviewing a job posting.

Job: "${jobTitle}" at "${company}"
Trust Score: ${scoreData.score}/100
Risk Level: ${scoreData.risk}
Signal Breakdown:
${scoreData.breakdown.map(b => `- ${b.name}: ${b.score}/${b.max}`).join("\n")}
Flags found: ${flagSummary}

Write exactly 3 sentences explaining this trust score to a student in India.
Be direct. Mention specific signals. Do NOT say "I" or ask questions.
Do NOT change or mention changing the score.`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0]?.message?.content?.trim() ||
      "This posting has been analyzed by our trust engine.";
  } catch {
    return `This job posting scored ${scoreData.score}/100. ${
      scoreData.risk === "HIGH"
        ? "Multiple risk signals were detected — apply with extreme caution."
        : scoreData.risk === "MEDIUM"
        ? "Some concerns were found — verify the company before applying."
        : "This posting appears legitimate based on our signal analysis."
    }`;
  }
}
