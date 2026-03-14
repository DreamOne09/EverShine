import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    diff: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, diff }) => (
    <div className="bg-bg-dark/50 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-2 md:mb-4">
            <div className="text-gray-400 text-xs md:text-sm font-medium leading-tight">{title}</div>
            <div className="p-1.5 md:p-2 bg-white/5 rounded-lg shrink-0 ml-2">{icon}</div>
        </div>
        <div className="text-lg md:text-3xl font-bold text-white mb-1 truncate">{value}</div>
        <div className="text-[10px] md:text-xs text-primary truncate">{diff}</div>
    </div>
);

export default StatsCard;
