import React, { useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // If already authenticated, go to dashboard
    useEffect(() => {
        if (currentUser) {
            navigate('/', { replace: true });
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            navigate('/', { replace: true });
        } catch (err: any) {
            const friendlyMessages: Record<string, string> = {
                'auth/user-not-found':     'No account found. Please sign up first.',
                'auth/wrong-password':     'Incorrect password. Please try again.',
                'auth/email-already-in-use': 'Email already registered. Please sign in.',
                'auth/weak-password':      'Password must be at least 6 characters.',
                'auth/invalid-email':      'Please enter a valid email address.',
                'auth/invalid-credential': 'Incorrect email or password.',
                'auth/too-many-requests':  'Too many attempts. Try again in a few minutes.',
            };
            setError(friendlyMessages[err.code] || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (googleLoading) return;
        setError('');
        setGoogleLoading(true);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            // Try popup first (works in most cases)
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                navigate('/', { replace: true });
            }
        } catch (popupErr: any) {
            // If popup is blocked by browser, fall back to redirect
            if (
                popupErr.code === 'auth/popup-blocked' ||
                popupErr.code === 'auth/popup-closed-by-user'
            ) {
                try {
                    await signInWithRedirect(auth, provider);
                    // Page will reload — result handled by AuthContext + useEffect above
                } catch (redirectErr: any) {
                    setError('Google sign-in failed. Please try again.');
                    setGoogleLoading(false);
                }
            } else if (popupErr.code === 'auth/cancelled-popup-request') {
                // User triggered multiple popups — just ignore
                setGoogleLoading(false);
            } else {
                setError('Google sign-in failed: ' + (popupErr.message || 'Unknown error'));
                setGoogleLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50 pointer-events-none"></div>

            <div className="w-full max-w-sm relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-4 shadow-xl shadow-indigo-200">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">FixForward</h1>
                    <p className="text-sm text-slate-500 mt-1">AI-powered Student Wellness</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">

                    {/* Tab Switcher */}
                    <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => { setIsLogin(true); setError(''); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(''); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 font-medium flex items-start gap-2">
                            <span className="material-symbols-outlined text-sm flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@university.edu"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isLogin ? 'Your password' : 'Min. 6 characters'}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2"
                        >
                            {loading
                                ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                : (isLogin ? 'Sign In' : 'Create Account')
                            }
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-slate-100"></div>
                        <span className="text-xs text-slate-400 font-medium">OR</span>
                        <div className="flex-1 h-px bg-slate-100"></div>
                    </div>

                    {/* Google Sign-In */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        className="w-full py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-slate-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {googleLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                                <span>Connecting to Google...</span>
                            </>
                        ) : (
                            <>
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    className="w-5 h-5"
                                    alt="Google"
                                />
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    🔒 Your wellness data is private and end-to-end encrypted.
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
