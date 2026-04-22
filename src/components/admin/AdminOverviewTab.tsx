import React from 'react';
import { Users, Activity, DollarSign, Calendar, Shield } from 'lucide-react';
import StatsCard from '../common/StatsCard';
import { EmptyState, SmartImage } from '../loading';
import { siteConfig } from '../../config/site.config';

export interface AdminOverviewTabProps {
    stats: {
        totalMembers: number;
        totalReferrals: number;
        totalValue: number;
        monthlyVisits: number;
        topIndustry: string;
        completionRate: string;
    };
    recentUpdates: Record<string, unknown>[];
    marketingStats: { socialClicks: number };
}

const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ stats, recentUpdates, marketingStats }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <StatsCard title="總會員數" value={stats.totalMembers} icon={<Users className="text-blue-400" />} diff="活躍中" />
            <StatsCard title="資料完整度" value={stats.completionRate} icon={<Activity className="text-pink-400" />} diff="會員有照片比例" />
            <StatsCard title="最大產業佔比" value={stats.topIndustry} icon={<Users className="text-purple-400" />} diff="最熱門產業" />
            <StatsCard title="總引薦單數" value={stats.totalReferrals.toLocaleString()} icon={<Calendar className="text-green-400" />} diff="歷史累計" />
            <StatsCard
                title="總交易價值"
                value={`$${(stats.totalValue / 100000000).toFixed(1)}億`}
                icon={<DollarSign className="text-yellow-400" />}
                diff="歷史累計"
            />
            <StatsCard title="本月網站瀏覽" value={stats.monthlyVisits.toLocaleString()} icon={<Activity className="text-purple-400" />} diff="+15% 上月" />
            <StatsCard title="社群連結點擊" value={marketingStats.socialClicks.toLocaleString()} icon={<Users className="text-pink-500" />} diff="本月累計" />

            <div className="col-span-2 lg:col-span-3 bg-bg-dark/50 border border-white/10 rounded-2xl p-4 md:p-6 min-h-[280px]">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-primary" /> 最近更新紀錄
                </h3>
                <div className="grid gap-4">
                    {recentUpdates.length === 0 ? (
                        <EmptyState
                            title="尚無更新紀錄"
                            description="會員編輯後，近期異動會顯示於此。"
                            className="border-white/5 bg-transparent py-10"
                        />
                    ) : (
                        recentUpdates.map((item) => (
                            <div
                                key={String(item.id)}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                                        <SmartImage
                                            src={(item.photo as string) || siteConfig.defaultPhoto}
                                            alt={String(item.name)}
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{String(item.name)}</div>
                                        <div className="text-xs text-gray-400">{(item.company as string) || '未填寫公司'}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-primary font-mono text-sm">
                                        {(() => {
                                            const ts = item.updatedAt || item.updated_at || item.createdAt || item.created_at;
                                            return ts ? new Date(String(ts)).toLocaleDateString() : '—';
                                        })()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {(() => {
                                            const ts = item.updatedAt || item.updated_at || item.createdAt || item.created_at;
                                            return ts
                                                ? new Date(String(ts)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : '';
                                        })()}{' '}
                                        更新
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="col-span-2 lg:col-span-1 bg-primary/5 border border-primary/20 rounded-2xl p-4 md:p-6 min-h-[280px] flex flex-col">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield size={20} className="text-primary" /> 系統維運團隊
                </h3>
                <div className="space-y-4 flex-grow">
                    {['呂學承', '彭顯智', '潘芷盈'].map((name) => (
                        <div key={name} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold border border-primary/30">
                                {name[0]}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">{name}</div>
                                <div className="text-[10px] text-primary/70 uppercase tracking-widest font-medium">系統管理員</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-[10px] text-gray-500 text-center uppercase tracking-widest">EverShine Tech Support</div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverviewTab;
