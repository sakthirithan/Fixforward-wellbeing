import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { currentUser, loading } = useAuth();

    // Show a full-screen loader while Firebase resolves auth state
    // (critical for Google redirect sign-in to work correctly)
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 font-medium">Loading FixForward...</p>
            </div>
        );
    }

    return currentUser ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
