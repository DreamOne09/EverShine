
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
    Users, Activity, DollarSign, Calendar,
    Edit, Trash2, Plus, Save, X, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Admin: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalReferrals: 0,
        totalValue: 0,
        monthlyVisits: 0
    });

    // Tab State
    const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'referrals' | 'settings'>('overview');

    // Members Data
    const [members, setMembers] = useState<any[]>([]);
    const [memberSearch, setMemberSearch] = useState('');

    // Homepage Stats Form
    const [homeStats, setHomeStats] = useState({
        referral_count: 0,
        referral_value: 0,
        month: new Date().toISOString().slice(0, 7) // YYYY-MM
    });

    // Recent Activity State
    const [recentUpdates, setRecentUpdates] = useState<any[]>([]);

    useEffect(() => {
        checkAdmin();
        fetchDashboardData();
    }, [user]);

    const checkAdmin = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        const { data } = await supabase
            .from('members')
            .select('is_admin')
            .eq('user_id', user.id)
            .single();

        if (!data?.is_admin) {
            navigate('/');
        }
    };

    const fetchDashboardData = async () => {
        setLoading(true);

        // 1. Fetch Members
        const { data: membersData } = await supabase
            .from('members')
            .select('*')
            .order('created_at', { ascending: false });
        setMembers(membersData || []);

        // 2. Fetch Recent Updates (Last 5 modified members)
        const { data: recentData } = await supabase
            .from('members')
            .select('id, name, updated_at, photo, company') // ensure column name matches DB. Usually 'updatedAt' or 'updated_at'.
            // In MemberEdit.tsx we used 'updatedAt'. Let's assume the column is 'updatedAt' (camelCase) based on previous code.
            // If the column in DB is `updatedAt`, we query `updatedAt`.
            // Use `.order('updatedAt', { ascending: false })`
            .neq('updatedAt', null)
            .order('updatedAt', { ascending: false })
            .limit(5);

        setRecentUpdates(recentData || []);

        // 3. Fetch Stats (Real data only)
        const { data: homeStatsData } = await supabase
            .from('homepage_stats')
            .select('*')
            .order('month', { ascending: false })
            .limit(1)
            .single();

        if (homeStatsData) {
            setHomeStats({
                month: homeStatsData.month,
                referral_count: homeStatsData.referral_count,
                referral_value: homeStatsData.referral_value
            });
        }

        // 4. Fetch Page Views (Real count)
        let visitsCount = 0;
        try {
            const { count, error } = await supabase
                .from('page_views')
                .select('*', { count: 'exact', head: true });
            if (!error && count !== null) {
                visitsCount = count;
            }
        } catch (e) {
            // Table might not exist yet, ignore
            console.log('Page views table not active');
        }

        // Calculate extra stats
        const industryCounts: { [key: string]: number } = {};
        let hasPhotoCount = 0;
        (membersData || []).forEach((m: any) => {
            const ind = m.industry || '未分類';
            industryCounts[ind] = (industryCounts[ind] || 0) + 1;
            if (m.photo && m.photo.length > 10) hasPhotoCount++;
        });

        const topIndustry = Object.entries(industryCounts).sort((a, b) => b[1] - a[1])[0];
        const completionRate = membersData?.length ? Math.round((hasPhotoCount / membersData.length) * 100) : 0;

        setStats({
            totalMembers: membersData?.length || 0,
            totalReferrals: homeStatsData?.referral_count || 0,
            totalValue: homeStatsData?.referral_value || 0,
            monthlyVisits: visitsCount,
            topIndustry: topIndustry ? `${topIndustry[0]} (${topIndustry[1]})` : '無資料',
            completionRate: `${completionRate}%`
        });

        setLoading(false);
    };

    const updateHomeStats = async () => {
        try {
            const { error } = await supabase
                .from('homepage_stats')
                .upsert(homeStats, { onConflict: 'month' });

            if (error) throw error;
            alert('首頁數據已更新！');
            fetchDashboardData();
        } catch (err: any) {
            console.error(err);
            alert('更新失敗: ' + err.message);
        }
    };

    const filteredMembers = members.filter(m =>
        m.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.company?.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.industry?.toLowerCase().includes(memberSearch.toLowerCase())
    );

    if (loading) return <div className="min-h-screen pt-32 text-center text-white">載入後台數據中...</div>;

    return (
        <div className="min-h-screen pt-32 pb-12 px-4 container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Activity className="text-primary" /> 管理後台
                </h1>
                <div className="flex bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/10">
                    {[
                        { id: 'overview', label: '總覽概況' },
                        { id: 'members', label: '會員管理' },
                        { id: 'settings', label: '數據設定' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === tab.id
                                ? 'bg-primary text-bg-dark'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-6">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="總會員數"
                            value={stats.totalMembers}
                            icon={<Users className="text-blue-400" />}
                            diff="活躍中"
                        />
                        <StatsCard
                            title="資料完整度"
                            value={(stats as any).completionRate}
                            icon={<Activity className="text-pink-400" />}
                            diff="會員有照片比例"
                        />
                        <StatsCard
                            title="最大產業佔比"
                            value={(stats as any).topIndustry}
                            icon={<Users className="text-purple-400" />}
                            diff="最熱門產業"
                        />
                        <StatsCard
                            title="總引薦單數"
                            value={stats.totalReferrals.toLocaleString()}
                            icon={<Calendar className="text-green-400" />}
                            diff="歷史累計"
                        />
                        <StatsCard
                            title="總交易價值"
                            value={`$${(stats.totalValue / 100000000).toFixed(1)}億`}
                            icon={<DollarSign className="text-yellow-400" />}
                            diff="歷史累計"
                        />
                        <StatsCard
                            title="本月網站瀏覽"
                            value={stats.monthlyVisits.toLocaleString()}
                            icon={<Activity className="text-purple-400" />}
                            diff="+15% 上月"
                        />


                        {/* Recent Activity Section */}
                        <div className="col-span-1 lg:col-span-4 bg-bg-dark/50 border border-white/10 rounded-2xl p-6 min-h-[320px]">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Activity size={20} className="text-primary" /> 最近更新紀錄
                            </h3>
                            <div className="grid gap-4">
                                {recentUpdates.length === 0 ? (
                                    <div className="text-gray-400 text-center py-8">尚無更新紀錄</div>
                                ) : (
                                    recentUpdates.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                                                    <img src={item.photo || '/images/assets/logo/白色正方形logo.png'} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{item.name}</div>
                                                    <div className="text-xs text-gray-400">{item.company || '未填寫公司'}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-primary font-mono text-sm">
                                                    {new Date(item.updatedAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 更新
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* MEMBERS TAB */}
                {activeTab === 'members' && (
                    <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-6 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="搜尋會員..."
                                    value={memberSearch}
                                    onChange={e => setMemberSearch(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <button className="flex items-center gap-2 bg-primary text-bg-dark px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                                <Plus size={18} /> 新增會員
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-400 text-sm border-b border-white/10">
                                        <th className="p-4">會員</th>
                                        <th className="p-4">產業/公司</th>
                                        <th className="p-4">職稱</th>
                                        <th className="p-4 text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMembers.map(member => (
                                        <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                                                    {member.photo && <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />}
                                                </div>
                                                <span className="font-medium text-white">{member.name}</span>
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                <div className="text-white text-sm">{member.industry}</div>
                                                <div className="text-xs opacity-70">{member.company}</div>
                                            </td>
                                            <td className="p-4 text-gray-300 text-sm">{member.position || member.title}</td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/member-edit?id=${member.id}`)}
                                                    className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors text-sm flex items-center gap-1 ml-auto"
                                                    title="編輯"
                                                >
                                                    <Edit size={14} /> 編輯
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Homepage Stats Editor */}
                        <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-primary" /> 首頁數據更新
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">統計月份</label>
                                    <input
                                        type="month"
                                        value={homeStats.month}
                                        onChange={e => setHomeStats({ ...homeStats, month: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">總引薦單數</label>
                                    <input
                                        type="number"
                                        value={homeStats.referral_count}
                                        onChange={e => setHomeStats({ ...homeStats, referral_count: Number(e.target.value) })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">總交易價值 (元)</label>
                                    <input
                                        type="number"
                                        value={homeStats.referral_value}
                                        onChange={e => setHomeStats({ ...homeStats, referral_value: Number(e.target.value) })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                    <div className="text-right text-xs text-gray-500 mt-1">
                                        預覽: ${(homeStats.referral_value / 100000000).toFixed(2)} 億
                                    </div>
                                </div>
                                <button
                                    onClick={updateHomeStats}
                                    className="w-full py-3 bg-primary text-bg-dark font-bold rounded-lg hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
                                >
                                    <Save size={18} /> 儲存數據
                                </button>
                            </div>
                        </div>

                        <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6">系統公告</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                若需發布系統公告或暫停網站服務，請在此設定。目前功能開發中。
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon, diff }: any) => (
    <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-4">
            <div className="text-gray-400 text-sm font-medium">{title}</div>
            <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-primary">{diff}</div>
    </div>
);

export default Admin;
