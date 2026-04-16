import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin using the project ID from existing .env
// Firebase Admin can verify tokens using just the Project ID (no service account needed in dev)
const projectId = process.env.FIREBASE_PROJECT_ID || 
                  process.env.VITE_FIREBASE_PROJECT_ID || 
                  'fixforward-wellbeing';

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId
        });
        console.log(`Firebase Admin initialized with Application Default Credentials (project: ${projectId})`);
    } catch {
        // applicationDefault() fails if GOOGLE_APPLICATION_CREDENTIALS is not set
        // Fall back to a minimal initialization that can still verify tokens
        try {
            admin.initializeApp({ projectId });
            console.log(`Firebase Admin initialized (project: ${projectId}) — token verification active`);
        } catch (err: any) {
            console.warn('Firebase Admin could not initialize:', err.message);
        }
    }
}

export default admin;
