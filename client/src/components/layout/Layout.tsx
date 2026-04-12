import { type ReactNode } from 'react';
import TopNavBar from './TopNavBar';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-surface">
            <TopNavBar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 lg:ml-64 p-4 md:p-8 space-y-8">
                    {children}
                </main>
            </div>
            <footer className="w-full border-t border-black/[0.05] dark:border-white/[0.05] bg-[#fbf9f5] dark:bg-stone-900 mt-12 lg:ml-64 lg:w-[calc(100%-16rem)]">
                <div className="flex flex-col md:flex-row justify-between items-center px-12 py-8 w-full">
                    <p className="font-inter text-xs tracking-wide opacity-70 text-[#31332f] dark:text-stone-400">© 2026 FixForward Mental Health. Editorial Authority & Care.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="font-inter text-xs tracking-wide opacity-70 text-[#31332f] dark:text-stone-400 hover:text-[#2D7D9A] underline-offset-4 hover:underline transition-opacity">Privacy Policy</a>
                        <a href="#" className="font-inter text-xs tracking-wide opacity-70 text-[#31332f] dark:text-stone-400 hover:text-[#2D7D9A] underline-offset-4 hover:underline transition-opacity">Support Center</a>
                        <a href="#" className="font-inter text-xs tracking-wide opacity-70 text-[#31332f] dark:text-stone-400 hover:text-[#2D7D9A] underline-offset-4 hover:underline transition-opacity">Clinical Ethics</a>
                        <a href="#" className="font-inter text-xs tracking-wide opacity-70 text-[#31332f] dark:text-stone-400 hover:text-[#2D7D9A] underline-offset-4 hover:underline transition-opacity">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
