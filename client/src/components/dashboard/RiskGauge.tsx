const RiskGauge = ({ value, trendText }: { value: number, trendText: string }) => {
    const dashOffset = ((100 - value) / 100) * 214;

    return (
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_40px_40px_rgba(49,51,47,0.05)] flex flex-col items-center justify-center text-center relative overflow-hidden border border-black/[0.02]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-tertiary-container/10 rounded-full blur-3xl"></div>
            <h3 className="font-headline text-lg font-bold text-on-surface-variant mb-8">Risk Intensity</h3>
            <div className="relative w-56 h-56 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle className="risk-gauge-track" cx="112" cy="112" fill="transparent" r="100" strokeWidth="12"></circle>
                    <circle className="risk-gauge-progress" cx="112" cy="112" fill="transparent" r="100" strokeLinecap="round" strokeWidth="14" style={{ strokeDashoffset: dashOffset }}></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-headline font-extrabold text-on-surface">{value}</span>
                    <span className="text-sm font-bold text-tertiary tracking-widest uppercase">Medium Risk</span>
                </div>
            </div>
            <div className="mt-8 space-y-2">
                <p className="text-xs text-on-surface-variant max-w-[200px] leading-relaxed">{trendText}</p>
                <div className="flex items-center justify-center gap-1 text-tertiary font-bold text-sm">
                    <span className="material-symbols-outlined text-base" data-icon="trending_up">trending_up</span>
                    <span>Significant Change</span>
                </div>
            </div>
        </div>
    );
};

export default RiskGauge;
