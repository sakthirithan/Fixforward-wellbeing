import { useState } from 'react';
import { auth } from '../firebase';

const ManualLog = () => {
    const [sleepScore, setSleepScore] = useState(3);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [stressLevel, setStressLevel] = useState<string | null>(null);
    const [productivity, setProductivity] = useState(3);
    const [caffeine, setCaffeine] = useState('None');
    const [activity, setActivity] = useState('None');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const moods = ['Anxious', 'Calm', 'Focused', 'Low Energy', 'Grateful'];

    const handleCompleteLog = async () => {
        if (!selectedMood || !stressLevel) {
            alert("Please select your mood and stress level.");
            return;
        }

        setLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Authentication required");

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sleepScore,
                    mood: selectedMood,
                    stressLevel,
                    productivity,
                    caffeine,
                    activity,
                    hrv: 68 // Simulated
                })
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                const errData = await response.json();
                alert(`Error: ${errData.error || "Failed to save log"}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Connection error. Please check if the server is running.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="bg-primary/10 text-primary p-6 rounded-full ring-8 ring-primary/5">
                    <span className="material-symbols-outlined text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-headline font-extrabold text-on-surface">Insight Captured!</h1>
                    <p className="text-on-surface-variant max-w-sm text-lg mx-auto">
                        Your energy patterns and stress levels have been securely logged. Your AI dashboard is being updated.
                    </p>
                </div>
                <button 
                    onClick={() => window.location.href = '/'} 
                    className="px-10 py-4 bg-primary text-white rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    View Results
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col xl:flex-row gap-12">
            {/* Daily Check-in Form */}
            <section className="flex-1 space-y-12">
                <header>
                    <h1 className="text-4xl lg:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-4">Daily Check-in</h1>
                    <p className="text-on-surface-variant max-w-md text-lg">Detailed logging helps the AI build a more accurate productivity plan for you.</p>
                </header>

                <div className="space-y-10">
                    {/* Sleep & Productivity Sliders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm">
                            <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary">bedtime</span>
                                Sleep Quality
                            </h2>
                            <input 
                                className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer" 
                                max="5" min="1" step="1" type="range" value={sleepScore}
                                onChange={(e) => setSleepScore(Number(e.target.value))}
                            />
                            <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                                <span>Restless</span>
                                <span>Deep Sleep</span>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm">
                            <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">bolt</span>
                                Today's Productivity
                            </h2>
                            <input 
                                className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer" 
                                max="5" min="1" step="1" type="range" value={productivity}
                                onChange={(e) => setProductivity(Number(e.target.value))}
                            />
                            <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                                <span>Low</span>
                                <span>Hyper-focused</span>
                            </div>
                        </div>
                    </div>

                    {/* Mood & Choices */}
                    <div className="p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm">
                        <h2 className="text-lg font-bold text-on-surface mb-8 flex items-center gap-2">
                            <span className="material-symbols-outlined text-tertiary">mood</span>
                            Dominant Mood
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {moods.map((mood) => (
                                <button
                                    key={mood}
                                    onClick={() => setSelectedMood(mood)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                                        selectedMood === mood 
                                        ? 'bg-primary-container text-on-primary-container font-bold' 
                                        : 'bg-surface-container text-on-surface'
                                    }`}
                                >
                                    {mood}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Caffeine & Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm">
                            <h2 className="text-lg font-bold text-on-surface mb-6">Caffeine Intake</h2>
                            <div className="flex gap-2">
                                {['None', 'Moderate', 'Heavy'].map(opt => (
                                    <button 
                                        key={opt}
                                        onClick={() => setCaffeine(opt)}
                                        className={`flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                                            caffeine === opt ? 'border-primary bg-primary/5 text-primary' : 'border-surface-container-high text-on-surface-variant'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm">
                            <h2 className="text-lg font-bold text-on-surface mb-6">Physical Activity</h2>
                            <div className="flex gap-2">
                                {['None', 'Light', 'Active'].map(opt => (
                                    <button 
                                        key={opt}
                                        onClick={() => setActivity(opt)}
                                        className={`flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                                            activity === opt ? 'border-tertiary bg-tertiary/5 text-tertiary' : 'border-surface-container-high text-on-surface-variant'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stress Choice */}
                    <div className="p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm">
                        <h2 className="text-lg font-bold text-on-surface mb-8">Academic Stress Today?</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setStressLevel('Manageable')} className={`flex items-center justify-center gap-2 p-6 rounded-2xl border-2 font-medium transition-all ${stressLevel === 'Manageable' ? 'border-primary bg-primary/5 text-primary' : 'border-surface-container-high text-on-surface-variant'}`}>
                                <span className="material-symbols-outlined">sentiment_satisfied</span> Manageable
                            </button>
                            <button onClick={() => setStressLevel('Heavy Load')} className={`flex items-center justify-center gap-2 p-6 rounded-2xl border-2 font-medium transition-all ${stressLevel === 'Heavy Load' ? 'border-tertiary bg-tertiary/5 text-tertiary' : 'border-surface-container-high text-on-surface-variant'}`}>
                                <span className="material-symbols-outlined">priority_high</span> Heavy Load
                            </button>
                        </div>
                    </div>

                    {/* Action & Feedback */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
                        <button 
                            disabled={loading}
                            onClick={handleCompleteLog}
                            className={`w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Analyzing...' : 'Complete Log'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Sidebar: Simulation & Context */}
            <aside className="w-full xl:w-80 space-y-8">
                {/* Wearable Simulation Card */}
                <div className="bg-surface-container-low p-8 rounded-[2.5rem] sticky top-28 border border-black/[0.03]">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-primary">data_thresholding</span>
                        <h3 className="font-headline font-bold text-on-surface">Prototype: Wearable Sim</h3>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-8 leading-relaxed">
                        Adjust these sliders to simulate real-time biometric data for the dashboard demonstration.
                    </p>
                    
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold text-on-surface">
                                <span>Heart Rate Var (HRV)</span>
                                <span className="text-primary">68 ms</span>
                            </div>
                            <input className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none focus:outline-none" type="range" />
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold text-on-surface">
                                <span>Body Movement</span>
                                <span className="text-secondary">Moderate</span>
                            </div>
                            <input className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none focus:outline-none" type="range" />
                        </div>
                    </div>
                    
                    <div className="mt-10 p-4 bg-white/40 backdrop-blur-md rounded-2xl">
                        <div className="flex gap-4 items-start">
                            <span className="material-symbols-outlined text-tertiary text-lg">info</span>
                            <p className="text-[10px] text-on-surface-variant font-medium leading-normal">
                                This section is only visible in the design prototype to demonstrate integration with biometric sensors.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Visual Anchor */}
                <div className="rounded-[2.5rem] overflow-hidden relative h-64 shadow-xl">
                    <img 
                        alt="Atmospheric abstract texture" 
                        className="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1bjsZSBVKZ3avs_Vb6KaxuS3E2vMuGz8lst-dAKo71Q1_mNCee-zrdZCZPjWvgzFu4veAUJlRImo40EajgqrYaoRNMc2W3MFOl_R_np8kyKZLkYc7GbG8lIgb9T_OE9cCbSRBfmZffG0YUnfw1GSwzGxuhywbMDOABphJs6mvJsMG6-e5uhfWEgJXNa__Tm-M3ZsAglQD0Vmnufz3FesN0LGQoomDGfMA32SltMbUQYJMZJNqJlT33HKs-yLXv_V30j9bU50FssA"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent flex items-end p-6">
                        <p className="text-white font-headline font-bold leading-tight">Finding balance is a daily practice.</p>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default ManualLog;
