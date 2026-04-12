import React, { useState } from 'react';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-6 shadow-xl shadow-primary/20">
                        <span className="material-symbols-outlined text-3xl">spa</span>
                    </div>
                    <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight mb-2">
                        FixForward
                    </h1>
                    <p className="text-on-surface-variant font-medium">
                        {isLogin ? 'Welcome back to your wellness journey' : 'Start your journey to better mental health'}
                    </p>
                </div>

                <div className="bg-white/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl shadow-on-surface/5 border border-white">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-error/10 text-error text-xs font-bold p-4 rounded-xl border border-error/20">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-surface rounded-2xl border-none ring-1 ring-on-surface/5 focus:ring-2 focus:ring-primary transition-all outline-none font-medium"
                                placeholder="name@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 bg-surface rounded-2xl border-none ring-1 ring-on-surface/5 focus:ring-2 focus:ring-primary transition-all outline-none font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-on-surface/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-white/0 px-4 text-on-surface-variant font-bold backdrop-blur-none">Or continue with</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleGoogleSignIn}
                        className="w-full py-4 bg-white rounded-2xl border border-on-surface/10 flex items-center justify-center gap-3 font-bold text-on-surface hover:bg-surface transition-colors active:scale-95"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                        Google
                    </button>

                    <p className="text-center mt-8 text-sm text-on-surface-variant">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary font-bold hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
