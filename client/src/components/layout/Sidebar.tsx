import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { to: '/', icon: 'dashboard', label: 'Dashboard' },
    { to: '/insights', icon: 'insights', label: 'Insights' },
    { to: '/manual-log', icon: 'edit_note', label: 'Daily Check-in' },
    { to: '/institutional', icon: 'account_balance', label: 'Institutional' },
];

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    return (
        <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-white border-r border-slate-100 p-5 pt-20 z-40">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <span className="material-symbols-outlined text-white text-lg">favorite</span>
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-800">FixForward</h2>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <p className="text-[10px] text-slate-400 font-medium">AI Active</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 flex-1">
                {navItems.map(({ to, icon, label }) => {
                    const isActive = location.pathname === to;
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? 'bg-indigo-50 text-indigo-600 border-l-[3px] border-indigo-500 pl-[13px]'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                            }`}
                        >
                            <span className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-500' : ''}`}
                                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                                {icon}
                            </span>
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link to="/crisis" className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/crisis'
                        ? 'bg-rose-50 text-rose-600 border-l-[3px] border-rose-500 pl-[13px]'
                        : 'text-slate-500 hover:bg-rose-50 hover:text-rose-500'
                }`}>
                    <span className={`material-symbols-outlined text-xl ${location.pathname === '/crisis' ? 'text-rose-500' : ''}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        support_agent
                    </span>
                    Crisis Support
                    <span className="ml-auto text-[10px] font-bold bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full">AI</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
