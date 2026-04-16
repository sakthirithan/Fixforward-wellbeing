import { useEffect, useState } from 'react';
import NudgeCard from '../components/dashboard/NudgeCard';
import RiskGauge from '../components/dashboard/RiskGauge';
import SignalCard from '../components/dashboard/SignalCard';
import TrendChart from '../components/dashboard/TrendChart';
import { auth } from '../firebase';

const Dashboard = () => {
    const [latestLog, setLatestLog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const dummyData = {
        riskScore: 3,
        sleepScore: 4,
        hrv: 72,
        mood: 'Focused',
        stressLevel: 'Manageable',
        loggedAt: new Date().toISOString(),
        analysis: {
            insight: "You're showing strong cognitive focus today. Maintain this momentum with short 5-minute movement breaks every hour.",
            tasks: ["Complete high-priority tasks", "Evening reflection", "7h Sleep goal"],
            suggestions: ["Limit blue light after 9 PM", "Hydrate with 500ml water now", "10min Guided Meditation"],
            riskLevel: "Low",
            warning: "Late night activity detected yesterday. Prioritize early rest tonight."
        }
    };

    useEffect(() => {
        const fetchLatestLog = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) {
                    setLatestLog(dummyData); // Fallback for signed-out/new
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logs/history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setLatestLog(data[0]);
                    } else {
                        setLatestLog(dummyData); // Use dummy if first time
                    }
                } else {
                    setLatestLog(dummyData);
                }
            } catch (error) {
                console.error("Dashboard fetch error:", error);
                setLatestLog(dummyData); // Safe fallback
            } finally {
                setLoading(false);
            }
        };

        fetchLatestLog();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-[40vh] text-on-surface-variant font-medium">Synchronizing biometric data...</div>;
    }

    const wellnessMessage = latestLog?.analysis?.insight || "Welcome back! Start your daily check-in to see personalized AI neuro-insights.";
    const riskValue = latestLog ? latestLog.riskScore * 10 : 0; // Scale 0-10 to 0-100
    const sleepText = latestLog ? `${latestLog.sleepScore}/5 quality` : "No data yet";
    const moodText = latestLog ? latestLog.mood : "Neutral";
    const stressText = latestLog ? latestLog.stressLevel : "Unknown";

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <NudgeCard message={wellnessMessage} actionText={latestLog ? "View Analysis" : "Start Log"} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl">
                <RiskGauge 
                    value={riskValue} 
                    trendText={latestLog?.analysis?.warning || "Your risk index is calculated based on sleep, mood, and stress thresholds."} 
                />
                
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SignalCard
                        title="Sleep Quality"
                        value={sleepText}
                        subtitle={latestLog ? "Based on your last log" : "Click '+' to log your sleep"}
                        icon="bedtime"
                        status={latestLog?.sleepScore < 3 ? "Low" : "Optimal"}
                        statusColorClass={latestLog?.sleepScore < 3 ? "text-error bg-error/10" : "text-secondary bg-secondary/10"}
                        iconContainerClass="bg-primary-container/40 text-on-primary-container"
                    />
                    <SignalCard
                        title="Current Mood"
                        value={moodText}
                        subtitle="Subjective emotional state"
                        icon="mood"
                        status="Captured"
                        statusColorClass="text-secondary bg-secondary/10"
                        iconContainerClass="bg-tertiary-container/40 text-on-tertiary-container"
                    />
                    <SignalCard
                        title="Stress Load"
                        value={stressText}
                        subtitle="Academic & mental pressure"
                        icon="school"
                        status={latestLog?.stressLevel === 'Heavy Load' ? "High" : "Stable"}
                        statusColorClass={latestLog?.stressLevel === 'Heavy Load' ? "text-error bg-error/10" : "text-secondary bg-secondary/10"}
                        iconContainerClass="bg-secondary-container/40 text-on-secondary-container"
                    />
                    <SignalCard
                        title="Biometric HRV"
                        value={latestLog ? `${latestLog.hrv} ms` : "---"}
                        subtitle="Simulated wearable data"
                        icon="monitor_heart"
                        status="Stable"
                        statusColorClass="text-secondary bg-secondary/10"
                        iconContainerClass="bg-surface-container-highest text-on-surface"
                    />
                </div>
                <TrendChart />
            </div>
        </div>
    );
};

export default Dashboard;
