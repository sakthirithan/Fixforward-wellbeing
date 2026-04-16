import { type ReactNode } from 'react';
import TopNavBar from './TopNavBar';
import Sidebar from './Sidebar';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen bg-slate-50">
            <TopNavBar />
            <Sidebar />
            <main className="lg:pl-64 pt-16">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
