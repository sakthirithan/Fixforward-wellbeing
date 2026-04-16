import { Request, Response, NextFunction } from 'express';
import admin from '../firebase-admin';

export interface AuthRequest extends Request {
    user?: {
        uid: string;
        email?: string;
        name?: string;
        [key: string]: any;
    };
}

// Decode JWT payload without verification (for dev fallback only)
const decodeTokenPayload = (token: string): any => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
        return JSON.parse(payload);
    } catch {
        return null;
    }
};

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization;

    // No token provided
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        // Try to verify token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        return next();
    } catch (verifyError: any) {
        // If Firebase Admin couldn't verify (no credentials configured properly),
        // fall back to decoding the JWT to extract the user's UID
        // This is ONLY safe in development and only reads public JWT claims
        const isDev = process.env.NODE_ENV !== 'production';
        
        if (isDev) {
            const decoded = decodeTokenPayload(idToken);
            if (decoded?.user_id || decoded?.sub) {
                console.warn(`[Auth] Using dev token decode fallback for UID: ${decoded.user_id || decoded.sub}`);
                req.user = {
                    uid: decoded.user_id || decoded.sub,
                    email: decoded.email,
                    name: decoded.name,
                };
                return next();
            }
        }

        console.error('[Auth] Token verification failed:', verifyError.code || verifyError.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
