
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
    Users, Activity, DollarSign, Calendar,
    Trash2, Plus, Save, Search
} from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import MemberList from '../components/admin/MemberList';


const Admin: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalReferrals: 0,
        totalValue: 0,
        monthlyVisits: 0,
        topIndustry: '',
        completionRate: ''
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

    // Referrals Data
    const [referrals, setReferrals] = useState<any[]>([]);

    // Marketing Stats
    const [marketingStats, setMarketingStats] = useState({
        socialClicks: 0
    });

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

        try {
            // Parallel Fetching for O(1) perceived latency (limited by slowest request)
            const [
                membersRes,
                homeStatsRes,
                pageViewsRes,
                referralsRes,
                socialClicksRes
            ] = await Promise.all([
                // 1. Members - Resilient Fetching
                (async () => {
                    // Try createdAt first
                    let res = await supabase.from('members').select('*').order('createdAt', { ascending: false });
                    if (res.error) {
                        console.warn('Attempted createdAt order failed, trying created_at...', res.error.message);
                        res = await supabase.from('members').select('*').order('created_at', { ascending: false });
                    }
                    if (res.error) {
                        console.warn('Attempted created_at order failed, trying default order...', res.error.message);
                        res = await supabase.from('members').select('*');
                    }
                    return res;
                })(),
                // 2. Homepage Stats
                supabase.from('homepage_stats').select('*').order('month', { ascending: false }).limit(1).maybeSingle(),
                // 3. Page Views - Fail-safe
                (async () => {
                    try { return await supabase.from('page_views').select('*', { count: 'exact', head: true }); }
                    catch { return { count: 0, data: null, error: null }; }
                })(),
                // 4. Referrals
                supabase.from('referrals').select('*').order('created_at', { ascending: false }),
                // 5. Social Clicks - Fail-safe
                (async () => {
                    try { return await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'click_social'); }
                    catch { return { count: 0, data: null, error: null }; }
                })()
            ]);

            // Process Members
            if (membersRes.error) console.error('Members fetch error:', membersRes.error);
            const membersData = membersRes.data || [];
            setMembers(membersData);

            // Derive Recent Updates (Avoid extra API call - O(N log N) sort client side is fast for <10k records)
            // Look for updatedAt or updated_at
            const sortedByUpdate = [...membersData].sort((a, b) => {
                const dateA = new Date(a.updatedAt || a.updated_at || 0).getTime();
                const dateB = new Date(b.updatedAt || b.updated_at || 0).getTime();
                return dateB - dateA;
            });
            setRecentUpdates(sortedByUpdate.slice(0, 5));

            // Process Home Stats
            const homeStatsData = homeStatsRes.data;
            if (homeStatsData) {
                setHomeStats({
                    month: homeStatsData.month,
                    referral_count: homeStatsData.referral_count,
                    referral_value: homeStatsData.referral_value
                });
            }

            // Process Referrals
            // Handle lowercase/uppercase difference in DB 'createdAt' vs 'created_at' if any
            const refData = referralsRes.data || [];
            setReferrals(refData);

            // Stats Calculation (O(N))
            const visitsCount = pageViewsRes.count || 0;
            const socialClicksCount = socialClicksRes.count || 0;

            const industryCounts: { [key: string]: number } = {};
            let hasPhotoCount = 0;
            membersData.forEach((m: any) => {
                const ind = m.industry || '未分類';
                industryCounts[ind] = (industryCounts[ind] || 0) + 1;
                if (m.photo && m.photo.length > 10) hasPhotoCount++;
            });

            const topIndustry = Object.entries(industryCounts).sort((a, b) => b[1] - a[1])[0];
            const completionRate = membersData.length ? Math.round((hasPhotoCount / membersData.length) * 100) : 0;

            setStats({
                totalMembers: membersData.length,
                totalReferrals: homeStatsData?.referral_count || 0,
                totalValue: homeStatsData?.referral_value || 0,
                monthlyVisits: visitsCount,
                topIndustry: topIndustry ? `${topIndustry[0]} (${topIndustry[1]})` : '無資料',
                completionRate: `${completionRate}%`
            });

            setMarketingStats({ socialClicks: socialClicksCount });

        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async () => {
        const name = prompt('請輸入新會員姓名:');
        if (!name) return;

        try {
            const { data, error } = await supabase.from('members').insert({
                name,
                industry: '新產業',
                company: '新公司',
                photo: '/images/assets/logo/白色正方形logo.png',
                createdAt: new Date().toISOString()
            }).select().single();

            if (error) throw error;
            alert(`已新增會員 ${name}，請點擊編輯按鈕完善資料。`);
            fetchDashboardData();
        } catch (e: any) {
            alert('新增失敗: ' + e.message);
        }
    };

    const handleDeleteReferral = async (id: string) => {
        if (!confirm('確定要刪除這筆引薦單嗎？此動作無法復原。')) return;
        try {
            const { error } = await supabase.from('referrals').delete().eq('id', id);
            if (error) throw error;
            setReferrals(referrals.filter(r => r.id !== id));
            alert('已刪除');
        } catch (e: any) {
            alert('刪除失敗: ' + e.message);
        }
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
                        { id: 'referrals', label: '引薦案例管理' },
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
                        <StatsCard
                            title="社群連結點擊"
                            value={marketingStats.socialClicks.toLocaleString()}
                            icon={<Users className="text-pink-500" />}
                            diff="本月累計"
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
                                                    {new Date(item.updatedAt || item.updated_at || item.createdAt || item.created_at || Date.now()).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(item.updatedAt || item.updated_at || item.createdAt || item.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 更新
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
                            <button
                                onClick={handleAddMember}
                                className="flex items-center gap-2 bg-primary text-bg-dark px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                            >
                                <Plus size={18} /> 新增會員
                            </button>
                        </div>

                        <MemberList
                            members={filteredMembers}
                            loading={loading}
                            onRefresh={fetchDashboardData}
                        />
                    </div>
                )}

                {/* REFERRALS TAB */}
                {activeTab === 'referrals' && (
                    <div className="space-y-6">
                        {/* Add New Case Form */}
                        <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Plus size={20} className="text-primary" /> 新增引薦案例
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">引薦案例標題</label>
                                    <input
                                        type="text"
                                        id="ref_title"
                                        placeholder="例如：【💼 合作共創新價值】"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">簡短描述</label>
                                    <input
                                        type="text"
                                        id="ref_desc"
                                        placeholder="例如：生醫公司新產品線包裝設計引薦"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">引薦人姓名</label>
                                    <input
                                        type="text"
                                        id="ref_referrer"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">被引薦人姓名</label>
                                    <input
                                        type="text"
                                        id="ref_referee"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 text-sm mb-1">引薦人自述 (Referrer Story)</label>
                                    <textarea
                                        id="ref_referrer_story"
                                        rows={3}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 text-sm mb-1">被引薦人自述 (Referee Story)</label>
                                    <textarea
                                        id="ref_referee_story"
                                        rows={3}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={async () => {
                                        const title = (document.getElementById('ref_title') as HTMLInputElement).value;
                                        const description = (document.getElementById('ref_desc') as HTMLInputElement).value;
                                        const referrer_name = (document.getElementById('ref_referrer') as HTMLInputElement).value;
                                        const referee_name = (document.getElementById('ref_referee') as HTMLInputElement).value;
                                        const referrer_story = (document.getElementById('ref_referrer_story') as HTMLTextAreaElement).value;
                                        const referee_story = (document.getElementById('ref_referee_story') as HTMLTextAreaElement).value;

                                        if (!title || !referrer_name || !referee_name) {
                                            alert('請填寫必填欄位');
                                            return;
                                        }

                                        const { error } = await supabase.from('referrals').insert({
                                            title,
                                            description,
                                            referrer_name,
                                            referee_name,
                                            referrer_story,
                                            referee_story,
                                            metrics: { amount: '洽談中', type: '專案合作' }
                                        });

                                        if (error) {
                                            alert('新增失敗: ' + error.message);
                                        } else {
                                            alert('新增成功！');
                                            fetchDashboardData();
                                            // Reset fields
                                            (document.getElementById('ref_title') as HTMLInputElement).value = '';
                                            (document.getElementById('ref_desc') as HTMLInputElement).value = '';
                                            (document.getElementById('ref_referrer') as HTMLInputElement).value = '';
                                            (document.getElementById('ref_referee') as HTMLInputElement).value = '';
                                            (document.getElementById('ref_referrer_story') as HTMLTextAreaElement).value = '';
                                            (document.getElementById('ref_referee_story') as HTMLTextAreaElement).value = '';
                                        }
                                    }}
                                    className="px-6 py-3 bg-primary text-bg-dark font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    <Plus size={18} /> 提交引薦案例
                                </button>
                            </div>
                        </div>

                        {/* Existing Referrals List */}
                        <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-6 overflow-hidden">
                            <h3 className="text-xl font-bold text-white mb-6">引薦案例列表</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-gray-400 text-sm border-b border-white/10">
                                            <th className="p-4">日期</th>
                                            <th className="p-4">引薦人</th>
                                            <th className="p-4">被引薦人/產業</th>
                                            <th className="p-4">標題/內容</th>
                                            <th className="p-4 text-right">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referrals.length === 0 ? (
                                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">尚無引薦單資料</td></tr>
                                        ) : referrals.map(ref => (
                                            <tr key={ref.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-gray-300 text-sm">
                                                    {new Date(ref.createdAt || ref.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-white font-medium">
                                                    {ref.referrer_name}
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-white text-sm">{ref.referee_name}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-white text-sm">{ref.title}</div>
                                                    <div className="text-xs text-gray-400 line-clamp-1">{ref.description}</div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteReferral(ref.id)}
                                                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-colors"
                                                        title="刪除"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {
                    activeTab === 'settings' && (
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
                    )
                }
            </div >
        </div >
    );
};

export default Admin;
