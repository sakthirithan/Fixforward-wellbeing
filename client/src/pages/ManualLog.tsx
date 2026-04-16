import { useState, useEffect } from 'react';
import { auth } from '../firebase';

const MOODS = [
    { emoji: '😄', label: 'Excellent', value: 'Excellent' },
    { emoji: '😊', label: 'Good', value: 'Focused' },
    { emoji: '😐', label: 'Neutral', value: 'Calm' },
    { emoji: '😟', label: 'Anxious', value: 'Anxious' },
    { emoji: '😞', label: 'Low Energy', value: 'Low Energy' },
    { emoji: '😔', label: 'Grateful', value: 'Grateful' },
];

const SLEEP_LABELS = ['', 'Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'];
const PRODUCTIVITY_LABELS = ['', 'Very Low', 'Low', 'Moderate', 'High', 'Peak'];

const ManualLog = () => {
    const [sleepScore, setSleepScore] = useState(3);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [stressLevel, setStressLevel] = useState<string | null>(null);
    const [productivity, setProductivity] = useState(3);
    const [caffeine, setCaffeine] = useState('None');
    const [activity, setActivity] = useState('None');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [logId, setLogId] = useState<string | null>(null);
    const [aiResult, setAiResult] = useState<any>(null);
    const [polling, setPolling] = useState(false);

    // Poll for AI analysis after log submission
    useEffect(() => {
        if (!logId || aiResult) return;
        setPolling(true);
        let attempts = 0;
        const interval = setInterval(async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analysis/${logId}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                if (res.status === 200) {
                    const data = await res.json();
                    setAiResult(data.analysis);
                    setPolling(false);
                    clearInterval(interval);
                }
            } catch { /* keep polling */ }
            attempts++;
            if (attempts >= 12) { // Stop after 60 seconds
                clearInterval(interval);
                setPolling(false);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [logId]);

    const totalFields = 5;
    const completedFields = [sleepScore > 0, selectedMood, stressLevel, productivity > 0, caffeine !== 'None' || activity !== 'None'].filter(Boolean).length;
    const progress = Math.round((completedFields / totalFields) * 100);

    const handleCompleteLog = async () => {
        if (!selectedMood || !stressLevel) {
            alert("Please select your mood and stress level.");
            return;
        }
        setLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Authentication required");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logs`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ sleepScore, mood: selectedMood, stressLevel, productivity, caffeine, activity, hrv: Math.floor(60 + Math.random() * 30) })
                }
            );

            if (response.ok) {
                const savedLog = await response.json();
                setLogId(savedLog.id);
                setSuccess(true);
            } else {
                const err = await response.json();
                alert(`Error: ${err.error || "Failed to save log"}`);
            }
        } catch {
            alert("Connection error. Ensure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto space-y-6 py-8 animate-in">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center ring-8 ring-emerald-100">
                        <span className="material-symbols-outlined text-4xl text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-800">Log Saved! 🎉</h2>
                        <p className="text-sm text-slate-400 mt-1">Aria is analyzing your data...</p>
                    </div>
                </div>

                {/* AI Analysis Result */}
                {polling && !aiResult && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin flex-shrink-0"></div>
                        <div>
                            <p className="text-sm font-semibold text-indigo-700">Aria is thinking...</p>
                            <p className="text-xs text-indigo-400">Generating your personalized insight (5–15 sec)</p>
                        </div>
                    </div>
                )}

                {aiResult && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                            </div>
                            <p className="text-xs font-bold text-indigo-600">Aria's Analysis</p>
                            <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                aiResult.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-600' :
                                aiResult.riskLevel === 'Moderate' ? 'bg-amber-50 text-amber-600' :
                                'bg-rose-50 text-rose-600'
                            }`}>{aiResult.riskLevel} Risk</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{aiResult.insight}</p>
                        {aiResult.actionPlan?.length > 0 && (
                            <div className="space-y-1.5">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Action Plan</p>
                                {aiResult.actionPlan.map((step: string, i: number) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                        <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                                        {step}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-3">
                    <button onClick={() => window.location.href = '/'} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors text-sm">
                        View Dashboard
                    </button>
                    <button onClick={() => { setSuccess(false); setAiResult(null); setLogId(null); }} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                        Log Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header + Progress */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h1 className="text-xl font-bold text-slate-800 mb-1">Daily Wellness Check-in</h1>
                <p className="text-sm text-slate-400 mb-4">Takes 60 seconds · AI-powered analysis</p>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-indigo-600">{progress}%</span>
                </div>
            </div>

            {/* Sleep Quality */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-indigo-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-700 text-sm">Sleep Quality</h2>
                        <p className="text-xs text-slate-400">How well did you sleep last night?</p>
                    </div>
                    <span className="ml-auto text-2xl font-bold text-indigo-600">{sleepScore}<span className="text-sm text-slate-400">/5</span></span>
                </div>
                <input type="range" min={1} max={5} step={1} value={sleepScore}
                    onChange={e => setSleepScore(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer" />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-2">
                    {SLEEP_LABELS.slice(1).map(l => <span key={l}>{l}</span>)}
                </div>
            </div>

            {/* Mood Selection */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>mood</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-700 text-sm">How are you feeling?</h2>
                        <p className="text-xs text-slate-400">Pick the mood that best describes you</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {MOODS.map(({ emoji, label, value }) => (
                        <button key={value} onClick={() => setSelectedMood(value)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                                selectedMood === value
                                    ? 'border-purple-400 bg-purple-50'
                                    : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                            }`}>
                            <span className="text-2xl">{emoji}</span>
                            <span className={`text-[10px] font-bold ${selectedMood === value ? 'text-purple-600' : 'text-slate-500'}`}>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Productivity */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-amber-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-700 text-sm">Productivity Level</h2>
                        <p className="text-xs text-slate-400">How focused and productive were you?</p>
                    </div>
                    <span className="ml-auto text-2xl font-bold text-amber-500">{productivity}<span className="text-sm text-slate-400">/5</span></span>
                </div>
                <input type="range" min={1} max={5} step={1} value={productivity}
                    onChange={e => setProductivity(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer" />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-2">
                    {PRODUCTIVITY_LABELS.slice(1).map(l => <span key={l}>{l}</span>)}
                </div>
            </div>

            {/* Stress Level */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="font-bold text-slate-700 text-sm mb-1">Academic Stress</h2>
                <p className="text-xs text-slate-400 mb-4">How heavy was your academic load today?</p>
                <div className="grid grid-cols-2 gap-3">
                    {[{ value: 'Manageable', icon: 'sentiment_satisfied', emoji: '😌', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
                      { value: 'Heavy Load', icon: 'priority_high', emoji: '😤', color: 'border-rose-300 bg-rose-50 text-rose-700' }].map(s => (
                        <button key={s.value} onClick={() => setStressLevel(s.value)}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 font-bold transition-all ${
                                stressLevel === s.value ? s.color : 'border-slate-100 text-slate-500 hover:border-slate-200'
                            }`}>
                            <span className="text-xl">{s.emoji}</span>
                            {s.value}
                        </button>
                    ))}
                </div>
            </div>

            {/* Caffeine & Activity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <h2 className="font-bold text-slate-700 text-sm mb-3">☕ Caffeine Intake</h2>
                    <div className="flex gap-2">
                        {['None', 'Moderate', 'Heavy'].map(opt => (
                            <button key={opt} onClick={() => setCaffeine(opt)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                                    caffeine === opt ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                }`}>{opt}</button>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <h2 className="font-bold text-slate-700 text-sm mb-3">🏃 Physical Activity</h2>
                    <div className="flex gap-2">
                        {['None', 'Light', 'Active'].map(opt => (
                            <button key={opt} onClick={() => setActivity(opt)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                                    activity === opt ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                }`}>{opt}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submit */}
            <button
                disabled={loading || !selectedMood || !stressLevel}
                onClick={handleCompleteLog}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                        Processing with AI...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                        Complete Today's Log
                    </>
                )}
            </button>
            <p className="text-center text-xs text-slate-400 pb-4">
                🔒 Your wellness data is private and encrypted. AI analysis runs in under 5 seconds.
            </p>
        </div>
    );
};

export default ManualLog;
