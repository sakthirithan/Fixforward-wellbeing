import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// For production, you would use a service account key file or environment variables
// const serviceAccount = require('./serviceAccountKey.json');

// Using environment variables for better security
const firebaseAdminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
    try {
        if (firebaseAdminConfig.projectId && firebaseAdminConfig.clientEmail && firebaseAdminConfig.privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert(firebaseAdminConfig as admin.ServiceAccount),
            });
            console.log('Firebase Admin initialized successfully');
        } else {
            console.warn('Firebase Admin credentials not found. Auth middleware will run in MOCK mode.');
        }
    } catch (error) {
        console.error('Firebase Admin initialization error:', error);
    }
}

export default admin;
