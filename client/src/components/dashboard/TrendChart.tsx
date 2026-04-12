const TrendChart = () => {
    return (
        <div className="lg:col-span-12 bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_40px_40px_rgba(49,51,47,0.05)] border border-black/[0.02]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h3 className="font-headline text-2xl font-bold text-on-surface">7-Day Trend</h3>
                    <p className="text-on-surface-variant text-sm font-inter">Tracking your Deterioration Risk Index evolution</p>
                </div>
                <div className="flex bg-surface-container p-1 rounded-lg">
                    <button className="px-4 py-1.5 text-xs font-bold bg-white text-primary rounded-md shadow-sm">Index</button>
                    <button className="px-4 py-1.5 text-xs font-medium text-on-surface-variant hover:text-primary transition-colors">Comparison</button>
                </div>
            </div>
            <div className="relative h-64 w-full flex items-end justify-between px-4 pb-8 group">
                {/* Simulated Chart Content */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <span className="material-symbols-outlined text-[15rem]" data-icon="show_chart">show_chart</span>
                </div>
                {/* Simple Visual Representation */}
                <div className="flex-1 h-full flex items-end justify-around gap-2 md:gap-8">
                    <div className="flex flex-col items-center gap-4 w-full h-[30%]">
                        <div className="w-full bg-secondary/10 rounded-t-xl transition-all hover:bg-secondary/20 h-full"></div>
                        <span className="text-[10px] font-bold text-on-surface-variant/60">MON</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 w-full h-[35%]">
                        <div className="w-full bg-secondary/10 rounded-t-xl transition-all hover:bg-secondary/20 h-full"></div>
                        <span className="text-[10px] font-bold text-on-surface-variant/60">TUE</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 w-full h-[32%]">
                        <div className="w-full bg-secondary/10 rounded-t-xl transition-all hover:bg-secondary/20 h-full"></div>
                        <span className="text-[10px] font-bold text-on-surface-variant/60">WED</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 w-full h-[28%]">
                        <div className="w-full bg-secondary/10 rounded-t-xl transition-all hover:bg-secondary/20 h-full"></div>
                        <span className="text-[10px] font-bold text-on-surface-variant/60">THU</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 w-full h-[45%] border-t-2 border-tertiary/50">
                        <div className="w-full bg-tertiary/20 rounded-t-xl transition-all hover:bg-tertiary/30 h-full"></div>
                        <span className="text-[10px] font-bold text-on-surface-variant/60">FRI</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 w-full h-[55%] border-t-2 border-tertiary">
                        <div className="w-full bg-tertiary/30 rounded-t-xl transition-all hover:bg-tertiary/40 h-full"></div>
                        <span className="text-[10px] font-bold text-on-surface">SAT</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 w-full h-[68%] border-t-2 border-tertiary animate-pulse z-10">
                        <div className="w-full bg-tertiary/40 rounded-t-xl transition-all hover:bg-tertiary/50 h-full"></div>
                        <span className="text-[10px] font-black text-primary">TODAY</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendChart;
