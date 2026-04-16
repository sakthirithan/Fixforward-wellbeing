import { useEffect, useState } from 'react';
import { auth } from '../firebase';

const Insights = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const dummyHistory = [
        {
            id: 'd1',
            riskScore: 3,
            loggedAt: new Date().toISOString(),
            analysis: {
                insight: "Consistent sleep patterns and moderate exercise are keeping your stress levels stable.",
                actionPlan: ["Maintain 7h sleep", "Hydrate more", "Continue morning walks"],
                suggestions: ["Evening herbal tea", "5min stretching", "Journaling"]
            }
        },
        {
            id: 'd2',
            riskScore: 7,
            loggedAt: new Date(Date.now() - 86400000).toISOString(),
            analysis: {
                insight: "High academic load detected. Prioritize recovery today.",
                actionPlan: ["Delegate tasks", "Power nap", "No caffeine after 2pm"],
                suggestions: ["Breathing exercise", "Quiet environment", "Warm shower"]
            }
        }
    ];

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) {
                    setHistory(dummyHistory); // Fallback
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logs/history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setHistory(data.length > 0 ? data : dummyHistory);
                } else {
                    setHistory(dummyHistory);
                }
            } catch (error) {
                console.error("Insights fetch error:", error);
                setHistory(dummyHistory);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const latest = history[0];

    if (loading) return <div className="p-10 text-on-surface-variant italic">Aggregating neuro-insights...</div>;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1 space-y-8">
                    <header>
                        <p className="text-xs font-bold text-secondary tracking-widest uppercase mb-2">Deep Intelligence Report</p>
                        <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">
                            Personalized <br/> <span className="text-primary">Neuro-Insights</span>
                        </h1>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                        <div className="p-8 bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-black/[0.02]">
                            <p className="text-sm text-on-surface-variant font-medium mb-2">Weekly Risk Intensity</p>
                            <h2 className="text-6xl font-headline font-extrabold flex items-baseline gap-2">
                                {latest?.riskScore ? latest.riskScore * 10 : '--'} 
                                <span className="text-xl text-on-surface-variant/30 font-bold uppercase tracking-widest">Index</span>
                            </h2>
                            <p className="text-sm text-on-surface-variant mt-6 leading-relaxed">
                                {latest?.analysis?.insight || "Complete your first daily log to generate a comprehensive risk profile."}
                            </p>
                        </div>
                        
                        <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
                            <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">verified</span>
                                AI Strategy
                            </h3>
                            <ul className="space-y-4">
                                {(latest?.analysis?.actionPlan || ["Identify patterns", "Adjust habits", "Improve sleep"]).map((step: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4 text-sm font-medium text-on-surface">
                                        <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-96 space-y-8">
                    <div className="bg-surface-container-high p-8 rounded-[3rem] sticky top-28">
                        <h3 className="font-headline font-bold text-xl mb-6">Longitudinal History</h3>
                        <div className="space-y-6">
                            {history.length > 0 ? history.map((log) => (
                                <div key={log.id} className="group cursor-default">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-on-surface-variant">
                                            {new Date(log.loggedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${
                                            log.riskScore >= 7 ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
                                        }`}>
                                            Risk: {log.riskScore}/10
                                        </span>
                                    </div>
                                    <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${log.riskScore >= 7 ? 'bg-error' : 'bg-secondary'}`}
                                            style={{ width: `${log.riskScore * 10}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-xs text-on-surface-variant italic">No historical data recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <section className="pt-8">
                <h3 className="text-2xl font-headline font-bold text-on-surface mb-8">Personalized Recovery Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(latest?.analysis?.suggestions || ["Hydrate frequently", "Prioritize sleep", "Mindful breathing"]).map((tip: string, i: number) => (
                        <div key={i} className="p-6 bg-surface-container border border-black/[0.04] rounded-3xl hover:bg-surface-container-highest transition-colors">
                            <span className="material-symbols-outlined text-primary mb-4">auto_awesome</span>
                            <p className="font-medium text-on-surface">{tip}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Insights;
