import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBMJH2-fO-4MJIX19_TWLHyo2YIhxYlEI4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fixforward-wellbeing.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fixforward-wellbeing",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fixforward-wellbeing.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "384212518357",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:384212518357:web:ebfb95fae356e34fb5295c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TDD5Z7KLNS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);



