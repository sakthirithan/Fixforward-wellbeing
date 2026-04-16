import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TopNavBar = () => {
    const location = useLocation();
    const { currentUser } = useAuth();

    const pageTitles: Record<string, string> = {
        '/': 'Dashboard',
        '/insights': 'Insights & Analytics',
        '/manual-log': 'Daily Check-in',
        '/institutional': 'Institutional View',
        '/crisis': 'Crisis Support',
    };

    const title = pageTitles[location.pathname] || 'FixForward';

    return (
        <nav className="bg-white/90 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 border-b border-slate-100">
            <div className="flex justify-between items-center px-6 py-3 lg:pl-72">
                {/* Page Title */}
                <div>
                    <h1 className="text-base font-bold text-slate-800">{title}</h1>
                    <p className="text-xs text-slate-400">Student Wellness Platform</p>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3">
                    <Link to="/manual-log">
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm shadow-indigo-200">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Log Today
                        </button>
                    </Link>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border border-indigo-100">
                        <span className="text-sm font-bold text-indigo-600">
                            {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavBar;
