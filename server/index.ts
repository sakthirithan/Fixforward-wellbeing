import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { authenticate, AuthRequest } from './middleware/authMiddleware';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy', message: 'FixForward API' });
});

// Risk Score Formula (Non-AI Heuristic)
const calculateRiskScore = (sleep: number, stress: string, mood: string, productivity: number, activity: string): number => {
    let score = 0;
    // Sleep: Lower is worse. Max +4
    if (sleep <= 2) score += 4;
    else if (sleep === 3) score += 2;

    // Stress: Heavy load is worse. Max +3
    if (stress === 'Heavy Load') score += 3;

    // Mood: Negative emotions. Max +2
    const lowMoods = ['Anxious', 'Low Energy'];
    if (lowMoods.includes(mood)) score += 2;

    // Productivity: Low productivity is a risk signal.
    if (productivity <= 2) score += 1;

    // Activity: No activity increases risk.
    if (activity === 'None') score += 1;

    return Math.min(score, 10);
};

import { getAIWellnessAnalysis, geminiModel } from './services/aiService';

// SUBMIT Daily Log (Authenticated)
app.post('/api/logs', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const firebaseId = req.user?.uid;
        if (!firebaseId) return res.status(401).json({ error: 'Auth failed' });

        const { sleepScore, mood, stressLevel, hrv, productivity, caffeine, activity } = req.body;
        
        // 1. Get or Create User
        let user = await prisma.user.findUnique({
            where: { firebaseId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    firebaseId,
                    email: req.user?.email || `user_${firebaseId}@placeholder.com`,
                    name: req.user?.name || null
                }
            });
        }

        // 2. Business Logic: Heuristic Risk Score
        const riskScore = calculateRiskScore(sleepScore, stressLevel, mood, productivity || 3, activity || "None");

        // 3. AI Logic: Generate Insights
        const aiAnalysis = await getAIWellnessAnalysis(sleepScore, mood, stressLevel, riskScore);

        // 4. Persistence: Log + Analysis
        const log = await prisma.dailyLog.create({
            data: {
                userId: user.id,
                sleepScore,
                mood,
                stressLevel,
                hrv,
                riskScore,
                productivity: productivity || 3,
                caffeine: caffeine || "None",
                activity: activity || "None",
                analysis: aiAnalysis ? {
                    create: {
                        tasks: aiAnalysis.tasks,
                        suggestions: aiAnalysis.suggestions,
                        riskLevel: aiAnalysis.riskLevel,
                        insight: aiAnalysis.insight,
                        warning: aiAnalysis.warning,
                        actionPlan: aiAnalysis.actionPlan
                    }
                } : undefined
            },
            include: {
                analysis: true
            }
        });

        res.status(201).json(log);
    } catch (error) {
        console.error('Log creation error:', error);
        res.status(500).json({ error: 'Internal server error while processing wellness data.' });
    }
});

// GET Log History (Authenticated)
app.get('/api/logs/history', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const firebaseId = req.user?.uid;
        const logs = await prisma.dailyLog.findMany({
            where: {
                user: { firebaseId }
            },
            include: {
                analysis: true
            },
            orderBy: { loggedAt: 'desc' },
            take: 7
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wellness history' });
    }
});

// AI CHAT: Crisis Support
app.post('/api/chat', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const prompt = `
            You are an empathetic, professional crisis support counselor. 
            A student is reaching out with the following message: "${message}"
            
            Guidelines:
            - Be extremely supportive and non-judgmental.
            - If they mention self-harm, provide international help resources immediately.
            - Keep responses concise but deeply caring.
            - Do not give clinical diagnosis.
            
            Response:
        `;

        const chatResult = await geminiModel?.generateContent(prompt);
        const responseText = chatResult?.response.text() || "I am here for you. Tell me more about how you are feeling.";

        res.status(200).json({ response: responseText });
    } catch (error) {
        res.status(500).json({ error: "Chat service unavailable" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

