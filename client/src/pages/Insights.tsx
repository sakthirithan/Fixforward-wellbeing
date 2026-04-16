import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { auth } from '../firebase';

const dummyHistory = [
    { id: 'd1', riskScore: 2, sleepScore: 4, productivity: 4, mood: 'Focused', stressLevel: 'Manageable', loggedAt: new Date(Date.now() - 6 * 86400000).toISOString(), analysis: { insight: "Great energy levels. Keep this momentum going.", riskLevel: "Low", suggestions: ["Morning stretching", "Stay hydrated"], actionPlan: ["Review goals", "Deep work block"] } },
    { id: 'd2', riskScore: 5, sleepScore: 3, productivity: 3, mood: 'Anxious', stressLevel: 'Heavy Load', loggedAt: new Date(Date.now() - 5 * 86400000).toISOString(), analysis: { insight: "Stress is rising. Consider taking short breaks.", riskLevel: "Moderate", suggestions: ["Breathing exercises", "Limit caffeine"], actionPlan: ["Prioritize tasks", "15min walk"] } },
    { id: 'd3', riskScore: 7, sleepScore: 2, productivity: 2, mood: 'Low Energy', stressLevel: 'Heavy Load', loggedAt: new Date(Date.now() - 4 * 86400000).toISOString(), analysis: { insight: "Burnout indicators detected. Recovery is needed today.", riskLevel: "High", suggestions: ["Rest is productive", "Call a friend"], actionPlan: ["Cancel non-essentials", "Sleep 8+ hours"] } },
    { id: 'd4', riskScore: 6, sleepScore: 3, productivity: 3, mood: 'Calm', stressLevel: 'Manageable', loggedAt: new Date(Date.now() - 3 * 86400000).toISOString(), analysis: { insight: "Slight recovery. Maintain lower stress today.", riskLevel: "Moderate", suggestions: ["Gentle yoga", "Journaling"], actionPlan: ["Start with easy tasks", "No late nights"] } },
    { id: 'd5', riskScore: 4, sleepScore: 4, productivity: 3, mood: 'Calm', stressLevel: 'Manageable', loggedAt: new Date(Date.now() - 2 * 86400000).toISOString(), analysis: { insight: "Consistent recovery trend. You're bouncing back.", riskLevel: "Low", suggestions: ["Continue good sleep habits"], actionPlan: ["Plan tomorrow's tasks"] } },
    { id: 'd6', riskScore: 3, sleepScore: 4, productivity: 4, mood: 'Focused', stressLevel: 'Manageable', loggedAt: new Date(Date.now() - 86400000).toISOString(), analysis: { insight: "Excellent recovery arc. Cognitive function improving.", riskLevel: "Low", suggestions: ["Keep this routine"], actionPlan: ["Deep work in the morning"] } },
    { id: 'd7', riskScore: 2, sleepScore: 5, productivity: 5, mood: 'Grateful', stressLevel: 'Manageable', loggedAt: new Date().toISOString(), analysis: { insight: "Peak performance state detected. This is your optimal zone.", riskLevel: "Low", suggestions: ["Tackle hardest tasks first", "Social connection boosts this further"], actionPlan: ["Ship important work", "Share gratitude with someone"] } },
];

const riskColors: Record<string, string> = { Low: 'text-emerald-600 bg-emerald-50', Moderate: 'text-amber-600 bg-amber-50', High: 'text-orange-600 bg-orange-50', Critical: 'text-rose-600 bg-rose-50' };

const Insights = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'risk' | 'sleep' | 'mood'>('risk');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) { setHistory(dummyHistory); setLoading(false); return; }

                const res = await fetch(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logs/history`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );

                if (res.ok) {
                    const data = await res.json();
                    setHistory(data.length > 0 ? data : dummyHistory);
                } else {
                    setHistory(dummyHistory);
                }
            } catch {
                setHistory(dummyHistory);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    const chartData = [...history].reverse().map((log) => ({
        day: new Date(log.loggedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        risk: log.riskScore,
        sleep: log.sleepScore,
        productivity: log.productivity || 3,
    }));

    const latestLog = history[0];
    const avgRisk = (history.reduce((a, b) => a + (b.riskScore || 0), 0) / history.length).toFixed(1);
    const avgSleep = (history.reduce((a, b) => a + (b.sleepScore || 0), 0) / history.length).toFixed(1);
    const trend = history.length > 1
        ? (history[0].riskScore || 0) < (history[1].riskScore || 0) ? 'Improving 📈' : 'Needs Attention 📉'
        : 'Not enough data';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* AI Summary */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-2">AI Weekly Summary</p>
                <h2 className="text-xl font-bold mb-1">
                    {latestLog?.analysis?.insight || "Keep logging to generate AI insights."}
                </h2>
                <div className="flex flex-wrap gap-3 mt-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">Avg Risk: {avgRisk}/10</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">Avg Sleep: {avgSleep}/5</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">Trend: {trend}</span>
                </div>
            </div>

            {/* Charts */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6">
                    <h3 className="font-bold text-slate-800 mr-2">Analytics</h3>
                    {(['risk', 'sleep', 'mood'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                                activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}>
                            {tab === 'risk' ? '🔴 Risk Index' : tab === 'sleep' ? '😴 Sleep' : '⚡ Productivity'}
                        </button>
                    ))}
                </div>

                <ResponsiveContainer width="100%" height={220}>
                    {activeTab === 'risk' ? (
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                            <Area type="monotone" dataKey="risk" stroke="#6366f1" strokeWidth={2.5} fill="url(#riskGrad)" dot={{ r: 4, fill: '#6366f1' }} />
                        </AreaChart>
                    ) : activeTab === 'sleep' ? (
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                            <Bar dataKey="sleep" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    ) : (
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                            <Line type="monotone" dataKey="productivity" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Log History Timeline */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                    Wellness Log Timeline
                </h3>
                <div className="space-y-3">
                    {history.map((log) => (
                        <div key={log.id || log.loggedAt} className="flex items-start gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                            {/* Risk indicator dot */}
                            <div className={`w-2 mt-2 flex-shrink-0 rounded-full h-8 ${
                                (log.riskScore || 0) <= 3 ? 'bg-emerald-400' :
                                (log.riskScore || 0) <= 6 ? 'bg-amber-400' : 'bg-rose-400'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-xs font-semibold text-slate-500">
                                        {new Date(log.loggedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${riskColors[log.analysis?.riskLevel || 'Low'] || 'text-slate-500 bg-slate-50'}`}>
                                        {log.analysis?.riskLevel || 'No Analysis Yet'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">Risk: {log.riskScore}/10 · Sleep: {log.sleepScore}/5 · Mood: {log.mood}</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed truncate">
                                    {log.analysis?.insight || 'AI analysis will appear shortly after logging.'}
                                </p>
                                {log.analysis?.suggestions && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {(log.analysis.suggestions || []).slice(0, 2).map((s: string, j: number) => (
                                            <span key={j} className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded-full">{s}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Insights;
