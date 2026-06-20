import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import analyzeRoute from "./routes/analyze.route";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    engine_version: "1.0.0",
    signals: ["jd", "scam", "company", "contact", "salary"],
    groq_model: "llama-3.3-70b-versatile",
    timestamp: new Date().toISOString(),
  });
});

app.use("/analyze", analyzeRoute);

app.listen(PORT, () => {
  console.log(`TrustHire API running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Analyze: POST http://localhost:${PORT}/analyze`);
});
