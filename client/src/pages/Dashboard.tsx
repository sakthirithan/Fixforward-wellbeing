import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

const getRiskConfig = (score: number) => {
    if (score <= 3) return { label: 'Safe', color: 'emerald', bar: 'bg-emerald-400', text: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200' };
    if (score <= 6) return { label: 'Moderate', color: 'amber', bar: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-200' };
    if (score <= 8) return { label: 'High', color: 'orange', bar: 'bg-orange-400', text: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-200' };
    return { label: 'Critical', color: 'rose', bar: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50', ring: 'ring-rose-200' };
};

const StatCard = ({ icon, label, value, sub, colorClass }: any) => (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
            <span className={`material-symbols-outlined text-xl ${colorClass}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-slate-50 text-slate-400`}>{sub}</span>
        </div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
);

const Dashboard = () => {
    const [latestLog, setLatestLog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [animatedScore, setAnimatedScore] = useState(0);

    const dummyData = {
        riskScore: 3,
        sleepScore: 4,
        hrv: 72,
        mood: 'Focused',
        stressLevel: 'Manageable',
        productivity: 4,
        activity: 'Light',
        loggedAt: new Date().toISOString(),
        analysis: {
            insight: "You're showing strong cognitive focus today. Maintain this momentum with short 5-minute movement breaks every hour.",
            tasks: ["Complete high-priority tasks first", "Take a 20-min walk at lunch", "Sleep by 10:30 PM tonight"],
            suggestions: ["Limit blue light after 9 PM", "Hydrate — drink 500ml now", "5min deep breathing before studying"],
            riskLevel: "Low",
            warning: null,
            actionPlan: ["Review your top 3 tasks for today", "Block 2-hour deep work sessions", "Set a wind-down alarm at 9 PM"]
        }
    };

    useEffect(() => {
        const fetchLatestLog = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) { setLatestLog(dummyData); setLoading(false); return; }

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logs/history`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );

                if (response.ok) {
                    const data = await response.json();
                    setLatestLog(data?.length > 0 ? data[0] : dummyData);
                } else {
                    setLatestLog(dummyData);
                }
            } catch {
                setLatestLog(dummyData);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestLog();
    }, []);

    // Animate risk score bar
    useEffect(() => {
        if (latestLog) {
            const target = latestLog.riskScore || 0;
            let current = 0;
            const step = () => {
                current = Math.min(current + 0.3, target);
                setAnimatedScore(current);
                if (current < target) requestAnimationFrame(step);
            };
            setTimeout(() => requestAnimationFrame(step), 300);
        }
    }, [latestLog]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-400 font-medium">Syncing your wellness data...</p>
                </div>
            </div>
        );
    }

    const risk = getRiskConfig(latestLog?.riskScore || 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative">
                    <p className="text-indigo-200 text-sm font-medium mb-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <h2 className="text-2xl font-bold mb-2">
                        {latestLog?.analysis?.insight || "Welcome back! Log your day to see AI insights."}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Link to="/manual-log">
                            <button className="px-4 py-2 bg-white text-indigo-600 text-xs font-bold rounded-xl hover:scale-105 transition-transform shadow-sm">
                                + Log Today
                            </button>
                        </Link>
                        <Link to="/crisis">
                            <button className="px-4 py-2 bg-white/20 text-white text-xs font-bold rounded-xl hover:bg-white/30 transition-colors">
                                Talk to Aria
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Risk Index Card */}
            <div className={`bg-white rounded-2xl p-6 border shadow-sm ${risk.ring} ring-1`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Burnout Risk Index</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-4xl font-bold text-slate-800">{latestLog?.riskScore || 0}</span>
                            <span className="text-slate-400 text-sm">/10</span>
                            <span className={`text-sm font-bold ${risk.text} ${risk.bg} px-2 py-0.5 rounded-full`}>{risk.label}</span>
                        </div>
                    </div>
                    {latestLog?.analysis?.warning && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl max-w-xs">
                            <span className="material-symbols-outlined text-amber-500 text-sm flex-shrink-0">warning</span>
                            <p className="text-xs text-amber-700">{latestLog.analysis.warning}</p>
                        </div>
                    )}
                </div>
                {/* Animated Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${risk.bar}`}
                        style={{ width: `${(animatedScore / 10) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-2">
                    <span>🟢 Safe (0–3)</span>
                    <span>🟡 Moderate (4–6)</span>
                    <span>🔴 Critical (7–10)</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="bedtime" label="Sleep Quality" value={`${latestLog?.sleepScore || '--'}/5`} sub="Last Log" colorClass="text-indigo-400" />
                <StatCard icon="mood" label="Mood" value={latestLog?.mood || '---'} sub="Captured" colorClass="text-purple-400" />
                <StatCard icon="bolt" label="Productivity" value={`${latestLog?.productivity || '--'}/5`} sub="Today" colorClass="text-amber-400" />
                <StatCard icon="monitor_heart" label="HRV" value={latestLog?.hrv ? `${latestLog.hrv}ms` : '---'} sub="Simulated" colorClass="text-rose-400" />
            </div>

            {/* AI Action Plan + Suggestions */}
            {latestLog?.analysis && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Tasks */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-indigo-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                            AI Action Plan
                        </h3>
                        <div className="space-y-2">
                            {(latestLog.analysis.tasks || latestLog.analysis.actionPlan || []).map((task: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                                    <p className="text-sm text-slate-600">{task}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-purple-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                            Wellness Nudges
                        </h3>
                        <div className="space-y-2">
                            {(latestLog.analysis.suggestions || []).map((s: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                                    <span className="material-symbols-outlined text-purple-400 text-sm flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    <p className="text-sm text-slate-600">{s}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { to: '/manual-log', icon: 'edit_note', label: 'Log Day', color: 'bg-indigo-50 text-indigo-600' },
                    { to: '/insights', icon: 'insights', label: 'View Trends', color: 'bg-purple-50 text-purple-600' },
                    { to: '/crisis', icon: 'support_agent', label: 'Talk to Aria', color: 'bg-rose-50 text-rose-600' },
                    { to: '/institutional', icon: 'account_balance', label: 'Institution', color: 'bg-slate-50 text-slate-600' },
                ].map(({ to, icon, label, color }) => (
                    <Link key={to} to={to}>
                        <div className={`${color} rounded-2xl p-4 flex flex-col items-center gap-2 border border-transparent hover:scale-105 transition-transform cursor-pointer`}>
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                            <span className="text-xs font-bold">{label}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
