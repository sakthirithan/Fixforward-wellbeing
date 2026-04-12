const Insights = () => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-8">
                    <header>
                        <p className="text-xs font-bold text-secondary tracking-widest uppercase mb-2">Current Wellness State</p>
                        <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Your Insight</h1>
                        <h1 className="text-5xl font-headline font-extrabold text-primary tracking-tight">Summary</h1>
                    </header>

                    <div className="flex flex-col sm:flex-row gap-6 mt-8">
                        <div>
                            <p className="text-sm text-on-surface-variant font-medium mb-1">Risk Score Contribution</p>
                            <h2 className="text-5xl font-headline font-extrabold">34 <span className="text-2xl text-on-surface-variant/50">/ 100</span></h2>
                            <div className="flex gap-1 mt-4">
                                <div className="h-2 flex-[2] bg-secondary rounded-l-full"></div>
                                <div className="h-2 flex-[1] bg-secondary-container"></div>
                                <div className="h-2 flex-[5] bg-surface-container-highest rounded-r-full"></div>
                            </div>
                            <p className="text-xs text-on-surface-variant mt-4 leading-relaxed max-w-xs">
                                Your risk levels remain <strong className="text-on-surface">Low</strong>. Academic stress and late-night activity are the primary contributors this week.
                            </p>
                        </div>
                        
                        <div className="bg-surface-container-low p-6 rounded-2xl flex-1 border border-black/[0.03]">
                            <h3 className="font-bold text-sm mb-4">Key Stressors</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-xs">
                                    <span className="w-2 h-2 rounded-full bg-error"></span>
                                    <span>Sleep Consistency (-12%)</span>
                                </li>
                                <li className="flex items-center gap-3 text-xs">
                                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                    <span>Social Engagement (+8%)</span>
                                </li>
                                <li className="flex items-center gap-3 text-xs">
                                    <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                                    <span>Campus Mobility (Stable)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-80 bg-surface-container p-6 rounded-3xl">
                    <h3 className="font-headline font-bold text-lg">Social Activity</h3>
                    <p className="text-xs text-on-surface-variant mb-6">Your Week vs. Regional Normal</p>
                    
                    <div className="h-48 flex items-end justify-between gap-4 mt-8">
                        {/* A rough bar chart representation */}
                        <div className="flex-1 flex gap-1 items-end h-full">
                            <div className="w-1/2 bg-surface-container-highest h-[80%] rounded-t-sm"></div>
                            <div className="w-1/2 bg-primary-dim h-[60%] rounded-t-sm"></div>
                        </div>
                        <div className="flex-1 flex gap-1 items-end h-full">
                            <div className="w-1/2 bg-surface-container-highest h-[70%] rounded-t-sm"></div>
                            <div className="w-1/2 bg-primary-dim h-[85%] rounded-t-sm"></div>
                        </div>
                        <div className="flex-1 flex gap-1 items-end h-full">
                            <div className="w-1/2 bg-surface-container-highest h-[85%] rounded-t-sm"></div>
                            <div className="w-1/2 bg-primary-dim h-[40%] rounded-t-sm"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Nudge History & Action Plan would go here */}
        </div>
    );
};

export default Insights;
