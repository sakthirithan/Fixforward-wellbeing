import { Link } from 'react-router-dom';

const TopNavBar = () => {
    return (
        <nav className="bg-[#fbf9f5]/80 dark:bg-stone-900/80 backdrop-blur-xl docked full-width top-0 sticky shadow-[0_40px_40px_rgba(49,51,47,0.05)] z-50">
            <div className="flex justify-between items-center w-full px-8 py-4 max-w-full mx-auto">
                <div className="flex items-center gap-8">
                    <span className="text-xl font-bold tracking-tight text-[#31332f] dark:text-stone-100 flex items-center gap-2">
                        FixForward
                    </span>
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-[#056783] dark:text-[#95deff] font-bold border-b-2 border-[#056783] pb-1 font-inter text-sm">Dashboard</Link>
                        <Link to="/insights" className="text-[#31332f]/60 dark:text-stone-400 hover:text-[#056783] hover:scale-[1.02] transition-all font-inter text-sm">Insights</Link>
                        <Link to="/manual-log" className="text-[#31332f]/60 dark:text-stone-400 hover:text-[#056783] hover:scale-[1.02] transition-all font-inter text-sm">Manual Log</Link>
                        <Link to="/institutional" className="text-[#31332f]/60 dark:text-stone-400 hover:text-[#056783] hover:scale-[1.02] transition-all font-inter text-sm">Institutional View</Link>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-container/30 rounded-full">
                        <span className="material-symbols-outlined text-sm text-[#2D7D9A]" data-icon="sync">sync</span>
                        <span className="text-xs font-semibold text-[#2D7D9A]">Data Syncing</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="material-symbols-outlined text-[#31332f]/70 hover:scale-[1.02] transition-transform" data-icon="notifications">notifications</button>
                        <button className="material-symbols-outlined text-[#31332f]/70 hover:scale-[1.02] transition-transform" data-icon="settings">settings</button>
                        <img alt="User profile avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvpsADTS65ifqNjxy3dwYAgQO6Imu383ZubAMoLkiobJMCKouBvLJI_hLzET7gqUMByy8Gv1bx-hpA1hGf-tHX3pqZtR4IAe78vm63K5LTz3926GZI0hUwRh3aEwnRpsszLXvLfGA_Wm4HmOeqA_17zcAslgSoyHuxUE3FFnbTYScmGsc0FaCEwUKw_ikr2ly6zNtFCAHDqp_sS8Eh7D6i2nK_ozJePJ7_4j1lvlL99D_elCldyVPXI4rLsChq93nSkxrZ10rMiVE" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavBar;
