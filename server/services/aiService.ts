import { geminiModel } from './aiServiceInstance';

export async function getAIWellnessAnalysis(currentLog: any, history: any[]) {
    if (!geminiModel) {
        console.error("Gemini Model not initialized");
        return null;
    }

    try {
        const historyContext = history.map(h => 
            `- Date: ${new Date(h.loggedAt).toDateString()}, Sleep: ${h.sleepScore}, Mood: ${h.mood}, Stress: ${h.stressLevel}, Productivity: ${h.productivity}`
        ).join('\n');

        const prompt = `
            As a clinical wellness AI, analyze this student's latest data in the context of their recent history.
            
            HISTORY (Last 7 Logs):
            ${historyContext || 'No previous history.'}
            
            LATEST LOG:
            - Sleep: ${currentLog.sleepScore}/5
            - Mood: ${currentLog.mood}
            - Stress: ${currentLog.stressLevel}
            - Productivity: ${currentLog.productivity}/5
            - Activity: ${currentLog.activity}
            - Risk Score (Heuristic): ${currentLog.riskScore}/10

            Task:
            1. Identify if there is a 'Downward Spiral' (deteriorating metrics) or 'Rebound Recovery' (improvement after bad phase).
            2. Provide actionable, academic-aligned recovery or optimization steps.
            
            Return ONLY a JSON object with:
            {
                "insight": "Short empathetic summary (max 2 sentences)",
                "tasks": ["3 specific academic/health tasks"],
                "suggestions": ["3 immediate wellness nudges"],
                "riskLevel": "Low/Moderate/High/Critical",
                "warning": "Specific clinical warning if patterns are dangerous",
                "actionPlan": ["Step 1", "Step 2", "Step 3"]
            }
        `;

        const result = await geminiModel.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        // Fallback: strip markdown code blocks and parse
        return JSON.parse(responseText.replace(/```json|```/g, '').trim());
    } catch (error) {
        console.error("AI Insight Error:", error);
        return null;
    }
}
