import { Request, Response, NextFunction } from 'express';
import admin from '../firebase-admin';

export interface AuthRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // For development/mocking purposes where admin isn't fully configured
        if (process.env.NODE_ENV === 'development' && !process.env.FIREBASE_PROJECT_ID) {
            console.warn('Authentication skipped: MOCK MODE (dev only)');
            req.user = { uid: 'mock-user-id' } as any;
            return next();
        }
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
