import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticate, AuthRequest } from './middleware/authMiddleware';
import { geminiModel } from './services/aiServiceInstance';
import { getAIWellnessAnalysis } from './services/aiService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Global error handlers to prevent crashes
process.on('uncaughtException', (err) => { console.error('💥 Uncaught Exception:', err.message); });
process.on('unhandledRejection', (reason) => { console.error('💥 Unhandled Rejection:', reason); });

// ─────────────────────────────────────────────
// DATABASE SETUP (with graceful fallback)
// ─────────────────────────────────────────────
let prisma: any = null;

const initDB = async () => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || dbUrl.includes('REPLACE_USER')) {
        console.warn('⚠️  DATABASE_URL not set. Running in OFFLINE mode (in-memory only).');
        return false;
    }
    try {
        const { PrismaClient } = await import('@prisma/client');
        const { PrismaPg } = await import('@prisma/adapter-pg');
        const { Pool } = await import('pg');

        const pool = new Pool({
            connectionString: dbUrl,
            ssl: dbUrl.includes('render.com') || dbUrl.includes('sslmode') ? { rejectUnauthorized: false } : false
        });

        await pool.query('SELECT 1');
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter } as any);
        console.log('✅ Database connected:', dbUrl.split('@')[1]?.split('/')[0]);
        return true;
    } catch (err: any) {
        console.warn('⚠️  Database unavailable:', err.message);
        console.warn('   Running in OFFLINE mode. Set DATABASE_URL in server/.env to enable persistence.');
        return false;
    }
};

// ─────────────────────────────────────────────
// RISK SCORE FORMULA
// ─────────────────────────────────────────────
const calculateRiskScore = (sleep: number, stress: string, mood: string, productivity: number, activity: string): number => {
    let score = 0;
    if (sleep <= 2) score += 4;
    else if (sleep === 3) score += 2;
    if (stress === 'Heavy Load') score += 3;
    if (['Anxious', 'Low Energy'].includes(mood)) score += 2;
    if (productivity <= 2) score += 1;
    if (activity === 'None') score += 1;
    return Math.min(score, 10);
};

// ─────────────────────────────────────────────
// IN-MEMORY STORE (when DB not available)
// ─────────────────────────────────────────────
const memoryLogs: any[] = [];
const memoryAnalysis: Record<string, any> = {};

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        message: 'FixForward API',
        db: prisma ? 'connected' : 'offline (in-memory mode)',
    });
});

// POST /api/logs
app.post('/api/logs', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const firebaseId = req.user?.uid;
        if (!firebaseId) return res.status(401).json({ error: 'Auth failed' });

        const { sleepScore, mood, stressLevel, hrv, productivity, caffeine, activity } = req.body;
        const riskScore = calculateRiskScore(sleepScore, stressLevel, mood, productivity || 3, activity || 'None');

        if (prisma) {
            // ── DB Mode ──
            let user = await prisma.user.findUnique({ where: { firebaseId } });
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        firebaseId,
                        email: req.user?.email || `user_${firebaseId}@placeholder.com`,
                        name: req.user?.name || null
                    }
                });
            }

            const history = await prisma.dailyLog.findMany({
                where: { userId: user.id },
                orderBy: { loggedAt: 'desc' },
                take: 7
            });

            const log = await prisma.dailyLog.create({
                data: { userId: user.id, sleepScore, mood, stressLevel, hrv, riskScore, productivity: productivity || 3, caffeine: caffeine || 'None', activity: activity || 'None' }
            });

            res.status(201).json(log);

            // Background AI
            setImmediate(async () => {
                try {
                    const aiAnalysis = await getAIWellnessAnalysis(log, history);
                    if (aiAnalysis) {
                        await prisma.aIAnalysis.create({
                            data: {
                                logId: log.id,
                                tasks: aiAnalysis.tasks || [],
                                suggestions: aiAnalysis.suggestions || [],
                                riskLevel: aiAnalysis.riskLevel || 'Low',
                                insight: aiAnalysis.insight || '',
                                warning: aiAnalysis.warning || null,
                                actionPlan: aiAnalysis.actionPlan || []
                            }
                        });
                        console.log(`[AI] Analysis complete for log ${log.id}`);
                    }
                } catch (err: any) {
                    console.error('[AI] Background failed:', err.message);
                }
            });

        } else {
            // ── In-Memory Mode ──
            const log = {
                id: `mem_${Date.now()}`,
                userId: firebaseId,
                sleepScore, mood, stressLevel, hrv, riskScore,
                productivity: productivity || 3,
                caffeine: caffeine || 'None',
                activity: activity || 'None',
                loggedAt: new Date().toISOString(),
                analysis: null
            };
            memoryLogs.unshift(log);

            res.status(201).json(log);

            // Background AI even in memory mode
            setImmediate(async () => {
                try {
                    const aiAnalysis = await getAIWellnessAnalysis(log, memoryLogs.slice(1, 8));
                    if (aiAnalysis) {
                        memoryAnalysis[log.id] = aiAnalysis;
                        const idx = memoryLogs.findIndex(l => l.id === log.id);
                        if (idx >= 0) memoryLogs[idx].analysis = aiAnalysis;
                        console.log(`[AI] In-memory analysis complete for ${log.id}`);
                    }
                } catch (err: any) {
                    console.error('[AI] In-memory analysis failed:', err.message);
                }
            });
        }
    } catch (error: any) {
        console.error('Log creation error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/logs/history
app.get('/api/logs/history', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const firebaseId = req.user?.uid;
        const take = parseInt(req.query.limit as string) || 7;

        if (prisma) {
            const logs = await prisma.dailyLog.findMany({
                where: { user: { firebaseId } },
                include: { analysis: true },
                orderBy: { loggedAt: 'desc' },
                take
            });
            return res.json(logs);
        }

        // In-memory fallback
        return res.json(memoryLogs.slice(0, take));
    } catch (err: any) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// GET /api/analysis/:logId
app.get('/api/analysis/:logId', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { logId } = req.params;

        if (prisma) {
            const analysis = await prisma.aIAnalysis.findUnique({ where: { logId } });
            if (!analysis) return res.status(202).json({ status: 'pending' });
            return res.json({ status: 'complete', analysis });
        }

        // In-memory fallback
        const analysis = memoryAnalysis[logId];
        if (!analysis) return res.status(202).json({ status: 'pending' });
        return res.json({ status: 'complete', analysis });
    } catch {
        res.status(500).json({ error: 'Failed to fetch analysis' });
    }
});

// GET /api/analytics/behavior
app.get('/api/analytics/behavior', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const firebaseId = req.user?.uid;
        let logs: any[] = [];

        if (prisma) {
            logs = await prisma.dailyLog.findMany({
                where: { user: { firebaseId } },
                include: { analysis: true },
                orderBy: { loggedAt: 'desc' },
                take: 30
            });
        } else {
            logs = memoryLogs.slice(0, 30);
        }

        if (logs.length === 0) return res.json({ message: 'No data yet' });

        const avgSleep = logs.reduce((a: number, b: any) => a + b.sleepScore, 0) / logs.length;
        const avgRisk  = logs.reduce((a: number, b: any) => a + b.riskScore, 0) / logs.length;
        const avgProductivity = logs.reduce((a: number, b: any) => a + (b.productivity || 3), 0) / logs.length;

        const recent3Avg = logs.slice(0, 3).reduce((a: number, b: any) => a + b.riskScore, 0) / Math.min(logs.length, 3);
        const prev3 = logs.slice(3, 6);
        const prev3Avg = prev3.length > 0 ? prev3.reduce((a: number, b: any) => a + b.riskScore, 0) / prev3.length : recent3Avg;
        const burnoutTrend = recent3Avg > prev3Avg + 1 ? 'worsening' : recent3Avg < prev3Avg - 1 ? 'improving' : 'stable';

        const moodCounts: Record<string, number> = {};
        logs.forEach((l: any) => { moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1; });
        const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

        const heavyDays = logs.filter((l: any) => l.stressLevel === 'Heavy Load').length;
        const stressPattern = heavyDays > logs.length * 0.5 ? 'chronic-stress' :
                              heavyDays > logs.length * 0.3 ? 'elevated-stress' : 'manageable';

        const heatmap = logs.slice(0, 7).map((l: any) => ({
            date: l.loggedAt, risk: l.riskScore,
            sleep: l.sleepScore, mood: l.mood,
            productivity: l.productivity
        })).reverse();

        res.json({
            summary: {
                avgSleep: +avgSleep.toFixed(1),
                avgRisk: +avgRisk.toFixed(1),
                avgProductivity: +avgProductivity.toFixed(1),
                burnoutTrend, dominantMood, stressPattern,
                totalLogsAnalyzed: logs.length
            },
            heatmap,
            insights: [
                burnoutTrend === 'worsening' ? '⚠️ Burnout risk increasing. Recovery needed now.' : null,
                avgSleep < 3 ? '😴 Chronic sleep deficit detected. Prioritize 7+ hours.' : null,
                stressPattern === 'chronic-stress' ? '📚 High academic stress pattern. Review workload.' : null,
            ].filter(Boolean)
        });
    } catch (err: any) {
        res.status(500).json({ error: 'Analytics failed' });
    }
});

// POST /api/chat
app.post('/api/chat', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ error: 'Message required' });

        const firebaseId = req.user?.uid || 'anon';
        const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'self harm', 'hurt myself', "don't want to live"];
        const isCrisis = crisisKeywords.some(kw => message.toLowerCase().includes(kw));

        const conversationContext = (history || [])
            .slice(-8)
            .map((m: any) => `${m.sender === 'user' ? 'Student' : 'Aria'}: ${m.text}`)
            .join('\n');

        const prompt = `You are Aria, an empathetic AI wellness companion for students.
${isCrisis ? `⚠️ CRISIS: Acknowledge pain, provide: 988 (Lifeline), Text HOME to 741741` : ''}
CONVERSATION:\n${conversationContext || 'Start of conversation.'}
STUDENT: "${message}"
GUIDELINES: Be warm, concise (2-4 sentences), use student's own words, no diagnoses.
Respond as Aria:`;

        if (!geminiModel) {
            return res.json({
                response: "I'm here for you. Can you tell me more about what you're feeling right now?",
                isCrisis
            });
        }

        const result = await geminiModel.generateContent(prompt);
        const responseText = result?.response?.text()?.trim() ||
            "I hear you, and I'm here. What's weighing on you the most?";

        console.log(`[CHAT] ${firebaseId}: "${message.substring(0, 40)}..."`);
        res.json({ response: responseText, isCrisis });

    } catch (err: any) {
        console.error('[CHAT] Error:', err.message);
        res.json({
            response: "I'm experiencing a brief issue, but I'm still here. If urgent, call 988.",
            isCrisis: false, fallback: true
        });
    }
});

// ─────────────────────────────────────────────
// STARTUP
// ─────────────────────────────────────────────
const startServer = async () => {
    await initDB();
    app.listen(PORT, () => {
        console.log(`✅ FixForward running on http://localhost:${PORT}`);
        console.log(`   DB mode: ${prisma ? 'PostgreSQL (Render)' : 'In-Memory (no DB)'}`);
    });
};

startServer();
