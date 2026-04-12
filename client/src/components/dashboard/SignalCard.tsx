import { ReactNode } from "react";

interface SignalCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    status: 'High' | 'Normal' | 'Low';
    statusColorClass: string;
    iconContainerClass: string;
}

const SignalCard = ({ title, value, subtitle, icon, status, statusColorClass, iconContainerClass }: SignalCardProps) => {
    return (
        <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between group hover:bg-white transition-all border border-transparent hover:border-black/[0.05]">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${iconContainerClass}`}>
                    <span className="material-symbols-outlined" data-icon={icon} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${statusColorClass}`}>{status}</span>
            </div>
            <div className="mt-4">
                <h4 className="text-on-surface-variant text-xs font-semibold">{title}</h4>
                <p className="text-2xl font-headline font-bold text-on-surface mt-1">{value}</p>
                <p className="text-[10px] text-on-surface-variant/70 mt-1">{subtitle}</p>
            </div>
        </div>
    );
};

export default SignalCard;
