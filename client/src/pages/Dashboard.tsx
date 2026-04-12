import NudgeCard from '../components/dashboard/NudgeCard';
import RiskGauge from '../components/dashboard/RiskGauge';
import SignalCard from '../components/dashboard/SignalCard';
import TrendChart from '../components/dashboard/TrendChart';

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <NudgeCard />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl">
                <RiskGauge value={34} trendText="Your risk index has risen by 14 points in the last 48 hours." />
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SignalCard
                        title="HRV (Stress)"
                        value="42 ms"
                        subtitle="12% below your average"
                        icon="monitor_heart"
                        status="Low"
                        statusColorClass="text-error bg-error/10"
                        iconContainerClass="bg-secondary-container/40 text-on-secondary-container"
                    />
                    <SignalCard
                        title="Screen Time"
                        value="8.5 hrs"
                        subtitle="Primarily social media (late night)"
                        icon="smartphone"
                        status="High"
                        statusColorClass="text-tertiary bg-tertiary/10"
                        iconContainerClass="bg-tertiary-container/40 text-on-tertiary-container"
                    />
                    <SignalCard
                        title="Sleep Duration"
                        value="6 hrs"
                        subtitle="Deep sleep reduced by 30%"
                        icon="bedtime"
                        status="Low"
                        statusColorClass="text-error bg-error/10"
                        iconContainerClass="bg-primary-container/40 text-on-primary-container"
                    />
                    <SignalCard
                        title="Typing Speed"
                        value="Stable"
                        subtitle="No cognitive lag detected"
                        icon="keyboard"
                        status="Normal"
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
