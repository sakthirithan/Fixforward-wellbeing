const NudgeCard = ({ message, actionText }: { message?: string, actionText?: string }) => {
    return (
        <section className="max-w-4xl">
            <div className="relative overflow-hidden bg-surface-container-lowest rounded-2xl p-6 shadow-[0_40px_40px_rgba(49,51,47,0.05)] border border-black/[0.03] group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl" data-icon="tips_and_updates">tips_and_updates</span>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container shadow-sm">
                        <span className="material-symbols-outlined" data-icon="smart_toy" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-headline font-bold text-[#056783]">AI Wellness Assistant</h3>
                        <p className="text-on-surface font-inter text-sm md:text-base leading-relaxed">
                            {message || "Loading your daily wellness strategy..."}
                        </p>
                    </div>
                    <button 
                        onClick={() => !message && (window.location.href = '/manual-log')}
                        className="px-5 py-2.5 bg-[#056783] text-white rounded-xl text-sm font-bold shadow-md hover:scale-[1.02] transition-all active:opacity-80"
                    >
                        {actionText || "Get Started"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NudgeCard;
