import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    diff: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, diff }) => (
    <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-4">
            <div className="text-gray-400 text-sm font-medium">{title}</div>
            <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-primary">{diff}</div>
    </div>
);

export default StatsCard;
