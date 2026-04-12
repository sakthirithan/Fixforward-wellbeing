const InstitutionalView = () => {
    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-headline font-bold text-on-surface">Institutional Insights</h1>
                <p className="text-on-surface-variant font-inter">Department of Computer Science • Q4 2026 Analysis</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-black/[0.03]">
                    <div className="flex justify-between items-center mb-4">
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                        <span className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full font-bold">+12%</span>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-1">Total Students Opted-In</p>
                    <h2 className="text-4xl font-headline font-extrabold text-on-surface">1,248</h2>
                    <p className="text-[10px] text-on-surface-variant/70 mt-4">Representing 84% of total department enrollment.</p>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-black/[0.03]">
                    <div className="flex justify-between items-center mb-4">
                        <div className="bg-error/10 text-error p-2 rounded-lg">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-1">Avg. Campus Risk Level</p>
                    <h2 className="text-4xl font-headline font-extrabold text-on-surface">22 <span className="text-xl text-on-surface-variant">/ 100</span></h2>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full mt-4">
                        <div className="h-full bg-secondary rounded-full" style={{ width: '22%' }}></div>
                    </div>
                    <p className="text-[10px] text-error font-bold mt-2">STABLE: Within expected safety margins.</p>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-black/[0.03]">
                    <h3 className="font-headline font-bold text-sm mb-4">Top Stress Factors</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span>Exam Week Preparation</span>
                                <span className="font-bold">68%</span>
                            </div>
                            <div className="w-full h-2 bg-surface-container-highest rounded-full">
                                <div className="h-full bg-primary rounded-full" style={{ width: '68%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span>Late Night Activity</span>
                                <span className="font-bold">42%</span>
                            </div>
                            <div className="w-full h-2 bg-surface-container-highest rounded-full">
                                <div className="h-full bg-primary-container rounded-full" style={{ width: '42%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span>Job Market Uncertainty</span>
                                <span className="font-bold">31%</span>
                            </div>
                            <div className="w-full h-2 bg-surface-container-highest rounded-full">
                                <div className="h-full bg-secondary rounded-full" style={{ width: '31%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* The rest of the page would contain Monthly Trend Analysis and Year-Group Snapshot */}
        </div>
    );
};

export default InstitutionalView;
