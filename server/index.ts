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

// SUBMIT Daily Log (Authenticated)
app.post('/api/logs', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const firebaseId = req.user?.uid;
        if (!firebaseId) return res.status(401).json({ error: 'Auth failed' });

        const { sleepScore, mood, stressLevel, hrv } = req.body;
        
        let user = await prisma.user.findUnique({
            where: { firebaseId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    firebaseId,
                    email: req.user?.email || `user_${firebaseId}@placeholder.com`,
                }
            });
        }

        const log = await prisma.dailyLog.create({
            data: {
                userId: user.id,
                sleepScore,
                mood,
                stressLevel,
                hrv
            }
        });

        res.status(201).json(log);
    } catch (error) {
        console.error('Log creation error:', error);
        res.status(500).json({ error: 'Internal server error' });
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
            orderBy: { loggedAt: 'desc' },
            take: 7
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

