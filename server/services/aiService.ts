import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing. AI analysis will be disabled.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
export const geminiModel = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

export const getAIWellnessAnalysis = async (sleepScore: number, mood: string, stressLevel: string, riskScore: number) => {
  if (!geminiModel) return null;

  const prompt = `
    You are a professional clinical psychologist and productivity coach.
    Analyze the following user data and provide a response in STRICT JSON format.
    
    DATA:
    Sleep Score: ${sleepScore}/5
    Daily Mood: ${mood}
    Stress Level: ${stressLevel}
    Heuristic Risk Score: ${riskScore}/10
    
    JSON SCHEMA:
    {
      "tasks": ["3 actionable productivity tasks for today based on their energy/mood"],
      "suggestions": ["3 wellness/breathwork/movement tips to improve their state"],
      "riskLevel": "low | medium | high",
      "insight": "A 2-sentence empathetic analysis of their current state",
      "warning": "A specific health warning if risk is high, or null",
      "actionPlan": ["3 immediate steps for the next 4-6 hours"]
    }
    
    RULES:
    - Output ONLY pure JSON.
    - No markdown formatting (no \`\`\`json).
    - If risk is high, focus on recovery.
    - If risk is low, focus on productivity.
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();
    // In case the AI includes markdown tags despite instructions
    const cleanJson = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return null;
  }
};
