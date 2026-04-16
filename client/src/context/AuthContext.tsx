import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
    onAuthStateChanged,
    type User,
    signOut,
    getRedirectResult
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Step 1: Process any pending Google redirect sign-in FIRST
        // This must happen before onAuthStateChanged resolves
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    // User signed in via redirect — onAuthStateChanged will also fire
                    console.log('[Auth] Google redirect sign-in successful:', result.user.email);
                }
            })
            .catch((err) => {
                // Swallow expected errors (no redirect pending)
                if (err.code !== 'auth/no-current-user' && err.code !== 'auth/null-user') {
                    console.error('[Auth] Redirect result error:', err.code);
                }
            });

        // Step 2: Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ currentUser, loading, logout }}>
            {/* Always render children — ProtectedRoute handles the loading state */}
            {children}
        </AuthContext.Provider>
    );
};
