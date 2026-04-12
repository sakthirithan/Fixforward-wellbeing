import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#f5f4ef] dark:bg-stone-800 p-6 space-y-4 pt-24">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#056783] flex items-center justify-center text-white">
                        <span className="material-symbols-outlined" data-icon="spa">spa</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-[#056783] dark:text-[#95deff] leading-none">Student Wellness</h2>
                        <p className="text-[10px] opacity-60 font-inter">System Status: Syncing</p>
                    </div>
                </div>
            </div>
            <nav className="flex flex-col gap-2">
                <Link to="/" className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-stone-700 text-[#056783] dark:text-[#95deff] rounded-xl shadow-sm scale-102 transition-transform font-manrope font-medium text-sm">
                    <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span> Dashboard
                </Link>
                <Link to="/insights" className="flex items-center gap-3 px-4 py-3 text-[#31332f]/70 dark:text-stone-400 hover:bg-[#fbf9f5]/50 transition-colors font-manrope font-medium text-sm">
                    <span className="material-symbols-outlined" data-icon="insights">insights</span> Insights
                </Link>
                <Link to="/manual-log" className="flex items-center gap-3 px-4 py-3 text-[#31332f]/70 dark:text-stone-400 hover:bg-[#fbf9f5]/50 transition-colors font-manrope font-medium text-sm">
                    <span className="material-symbols-outlined" data-icon="edit_note">edit_note</span> Manual Log
                </Link>
                <Link to="/institutional" className="flex items-center gap-3 px-4 py-3 text-[#31332f]/70 dark:text-stone-400 hover:bg-[#fbf9f5]/50 transition-colors font-manrope font-medium text-sm">
                    <span className="material-symbols-outlined" data-icon="account_balance">account_balance</span> Institutional View
                </Link>
            </nav>
            <div className="mt-auto pt-6 border-t border-black/[0.05]">
                <button className="w-full py-3 bg-gradient-to-br from-[#056783] to-[#95deff] text-white rounded-xl font-bold text-sm shadow-lg hover:scale-[1.02] transition-transform">
                    Crisis Support
                </button>
                <div className="mt-6 flex flex-col gap-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-[#31332f]/70 text-xs font-inter opacity-70 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-sm" data-icon="shield">shield</span> Privacy
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-[#31332f]/70 text-xs font-inter opacity-70 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-sm" data-icon="help">help</span> Support
                    </a>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
