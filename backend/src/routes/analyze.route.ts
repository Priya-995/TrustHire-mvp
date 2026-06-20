import { Router, Request, Response } from "express";
import { z } from "zod";
import { scamSignal } from "../services/scamSignal";
import { jdSignal } from "../services/jdSignal";
import { contactSignal } from "../services/contactSignal";
import { salarySignal } from "../services/salarySignal";
import { companySignal } from "../services/companySignal";
import { computeScore } from "../engines/scoreEngine";
import { generateExplanation } from "../llm/explain";

const router = Router();

const JobSchema = z.object({
  title: z.string().min(2, "Title required"),
  company: z.string().min(1, "Company name required"),
  description: z.string().min(10, "Description required"),
  url: z.string().url().optional().or(z.literal("")),
  salary: z.string().optional(),
  contact: z.string().optional(),
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = JobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const input = parsed.data;

  try {
    const [jd, scam, contact, salary] = [
      jdSignal(input),
      scamSignal(input),
      contactSignal(input),
      salarySignal(input),
    ];

    const company = await companySignal(input);

    const scoreResult = computeScore(input, jd, scam, company, contact, salary);

    const explanation = await generateExplanation(
      scoreResult,
      input.title,
      input.company
    );

    return res.json({ ...scoreResult, explanation });

  } catch (err) {
    console.error("Analysis error:", err);
    return res.status(500).json({ error: "Analysis failed", message: String(err) });
  }
});

export default router;
