
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
    Users, Activity, DollarSign, Calendar,
    Trash2, Plus, Save, Search, Shield, RefreshCw, FileEdit, Pencil
} from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import MemberList from '../components/admin/MemberList';
import SEO from '../components/common/SEO';
import {
    MainLayoutSkeleton,
    EmptyState,
    ErrorFallback,
    SmartImage,
    TopProgressBar,
    TableSkeleton,
} from '../components/loading';
import { siteConfig } from '../config/site.config';
import { sanitizeText } from '../lib/sanitize';


const Admin: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    /** 第一次進入後台：全頁骨架；之後僅顯示頂部進度條 */
    const [initialLoad, setInitialLoad] = useState(true);
    const [dashboardError, setDashboardError] = useState<string | null>(null);
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
    const createEmptyReferralForm = () => ({
        title: '',
        description: '',
        referrer_name: '',
        referee_name: '',
        referrer_story: '',
        referee_story: '',
        metrics_amount: '洽談中',
        metrics_type: '專案合作',
    });
    const [referralForm, setReferralForm] = useState(createEmptyReferralForm);
    const [editingReferralId, setEditingReferralId] = useState<string | null>(null);

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

        try {
            const { data, error } = await supabase
                .from('members')
                .select('is_admin')
                .eq('user_id', user.id)
                .single();

            if (error || !data?.is_admin) {
                navigate('/');
            }
        } catch {
            navigate('/');
        }
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        setDashboardError(null);

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
                // 2. Homepage Stats - Fail-safe
                (async () => {
                    try { return await supabase.from('homepage_stats').select('*').order('month', { ascending: false }).limit(1).maybeSingle(); }
                    catch { return { data: null, error: null }; }
                })(),
                // 3. Page Views - Fail-safe
                (async () => {
                    try { return await supabase.from('page_views').select('*', { count: 'exact', head: true }); }
                    catch { return { count: 0, data: null, error: null }; }
                })(),
                // 4. Referrals - Resilient Fetching
                (async () => {
                    try {
                        let res = await supabase.from('referrals').select('*').order('created_at', { ascending: false });
                        if (res.error) res = await supabase.from('referrals').select('*').order('createdAt', { ascending: false });
                        if (res.error) res = await supabase.from('referrals').select('*');
                        return res;
                    } catch { return { data: [], error: null }; }
                })(),
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

            // Process Referrals
            if (referralsRes.error) console.error('Referrals fetch error:', referralsRes.error);
            const refData = referralsRes.data || [];
            setReferrals(refData);

            // Derive Recent Updates (Avoid extra API call)
            const systemNames = ['呂學承', '彭顯智', '潘芷盈'];
            const sortedByUpdate = [...membersData]
                .filter(m => !systemNames.includes(m.name))
                .sort((a, b) => {
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
            setDashboardError(error instanceof Error ? error.message : '載入後台資料時發生錯誤');
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    };

    const handleAddMember = async () => {
        const rawName = prompt('請輸入新會員姓名:');
        if (!rawName) return;
        const name = sanitizeText(rawName, 50);
        if (!name) { alert('名稱無效'); return; }

        try {
            const { error } = await supabase.from('members').insert({
                name,
                industry: '新產業',
                company: '新公司',
                photo: siteConfig.defaultPhoto,
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

    const submitReferralForm = async () => {
        const metrics = {
            amount: referralForm.metrics_amount || '洽談中',
            type: referralForm.metrics_type || '專案合作',
        };
        const row = {
            title: sanitizeText(referralForm.title, 200),
            description: sanitizeText(referralForm.description, 500),
            referrer_name: sanitizeText(referralForm.referrer_name, 50),
            referee_name: sanitizeText(referralForm.referee_name, 50),
            referrer_story: sanitizeText(referralForm.referrer_story, 4000),
            referee_story: sanitizeText(referralForm.referee_story, 4000),
            metrics,
        };
        if (!row.title || !row.referrer_name || !row.referee_name) {
            alert('請填寫標題與引薦人／被引薦人姓名');
            return;
        }
        try {
            if (editingReferralId) {
                const { error } = await supabase.from('referrals').update(row).eq('id', editingReferralId);
                if (error) throw error;
                alert('引薦案例已更新（前台引薦頁將顯示此內容）');
            } else {
                const { error } = await supabase.from('referrals').insert(row);
                if (error) throw error;
                alert('引薦案例已新增');
            }
            setReferralForm(createEmptyReferralForm());
            setEditingReferralId(null);
            fetchDashboardData();
        } catch (e: any) {
            alert('儲存失敗: ' + e.message);
        }
    };

    const startEditReferral = (ref: any) => {
        const m = ref.metrics && typeof ref.metrics === 'object' ? ref.metrics : {};
        setEditingReferralId(ref.id);
        setReferralForm({
            title: ref.title || '',
            description: ref.description || '',
            referrer_name: ref.referrer_name || '',
            referee_name: ref.referee_name || '',
            referrer_story: ref.referrer_story || '',
            referee_story: ref.referee_story || '',
            metrics_amount: (m as { amount?: string }).amount ?? '洽談中',
            metrics_type: (m as { type?: string }).type ?? '專案合作',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    if (loading && initialLoad) {
        return <MainLayoutSkeleton />;
    }

    if (dashboardError) {
        return (
            <div className="min-h-dvh pt-24 md:pt-32 pb-24 px-4 container mx-auto flex items-start justify-center">
                <SEO title="管理後台" noindex />
                <ErrorFallback
                    className="max-w-lg w-full mt-8"
                    message={dashboardError}
                    onRetry={fetchDashboardData}
                />
            </div>
        );
    }

    return (
        <div className="min-h-dvh pt-24 md:pt-32 pb-24 md:pb-12 px-4 container mx-auto">
            <TopProgressBar active={loading && !initialLoad} />
            <SEO title="管理後台" noindex />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3 flex-wrap">
                    <Activity className="text-primary" size={24} /> 管理後台
                    <button
                        onClick={fetchDashboardData}
                        className={`p-2 rounded-full hover:bg-white/10 transition-all ${loading ? 'animate-spin text-primary' : 'text-gray-400'}`}
                        title="重新整理數據"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <Link
                        to="/admin/cms"
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-white border border-primary/40 rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors"
                    >
                        <FileEdit size={16} /> CMS
                    </Link>
                </h1>
                <div className="w-full md:w-auto overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    <div className="flex bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/10 min-w-max">
                        {[
                            { id: 'overview', label: '總覽' },
                            { id: 'members', label: '會員' },
                            { id: 'referrals', label: '引薦' },
                            { id: 'settings', label: '設定' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-primary text-bg-dark'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-6">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
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
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                                                    <SmartImage
                                                        src={item.photo || siteConfig.defaultPhoto}
                                                        alt={item.name}
                                                        className="w-full h-full"
                                                    />
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

                        {/* System Support Team */}
                        <div className="col-span-2 lg:col-span-1 bg-primary/5 border border-primary/20 rounded-2xl p-4 md:p-6 min-h-[280px] flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Shield size={20} className="text-primary" /> 系統維運團隊
                            </h3>
                            <div className="space-y-4 flex-grow">
                                {['呂學承', '彭顯智', '潘芷盈'].map(name => (
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
                                <div className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
                                    EverShine Tech Support
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MEMBERS TAB */}
                {activeTab === 'members' && (
                    <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-4 md:p-6 overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
                            <div className="relative flex-1 sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="搜尋會員..."
                                    value={memberSearch}
                                    onChange={e => setMemberSearch(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <button
                                onClick={handleAddMember}
                                className="flex items-center justify-center gap-2 bg-primary text-bg-dark px-4 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors shrink-0"
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
                        <p className="text-sm text-gray-400 -mt-2 mb-2">
                            此處管理<strong className="text-primary">引薦案例</strong>（前台 <Link to="/referrals" className="text-primary hover:underline">/referrals</Link>）。
                            首頁「引薦成果」數字請至<strong className="text-white">設定</strong>分頁更新。
                        </p>
                        {/* Add / Edit Case Form */}
                        <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-4 md:p-6">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 flex-wrap">
                                {editingReferralId ? (
                                    <>
                                        <Pencil size={20} className="text-primary" /> 編輯引薦案例
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} className="text-primary" /> 新增引薦案例
                                    </>
                                )}
                            </h3>
                            {editingReferralId && (
                                <p className="text-xs text-amber-200/90 mb-4">編輯中：儲存後將更新資料庫並同步至引薦案例頁。</p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">引薦案例標題</label>
                                    <input
                                        type="text"
                                        value={referralForm.title}
                                        onChange={(e) => setReferralForm({ ...referralForm, title: e.target.value })}
                                        placeholder="例如：【💼 合作共創新價值】"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">簡短描述</label>
                                    <input
                                        type="text"
                                        value={referralForm.description}
                                        onChange={(e) => setReferralForm({ ...referralForm, description: e.target.value })}
                                        placeholder="例如：生醫公司新產品線包裝設計引薦"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">引薦人姓名（需與會員名錄一致以顯示頭像）</label>
                                    <input
                                        type="text"
                                        value={referralForm.referrer_name}
                                        onChange={(e) => setReferralForm({ ...referralForm, referrer_name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">被引薦人姓名</label>
                                    <input
                                        type="text"
                                        value={referralForm.referee_name}
                                        onChange={(e) => setReferralForm({ ...referralForm, referee_name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">成效（顯示於案例卡）</label>
                                    <input
                                        type="text"
                                        value={referralForm.metrics_amount}
                                        onChange={(e) => setReferralForm({ ...referralForm, metrics_amount: e.target.value })}
                                        placeholder="例如：洽談中、$120萬"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">類型</label>
                                    <input
                                        type="text"
                                        value={referralForm.metrics_type}
                                        onChange={(e) => setReferralForm({ ...referralForm, metrics_type: e.target.value })}
                                        placeholder="例如：專案合作"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 text-sm mb-1">引薦人自述 (Referrer Story)</label>
                                    <textarea
                                        rows={3}
                                        value={referralForm.referrer_story}
                                        onChange={(e) => setReferralForm({ ...referralForm, referrer_story: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 text-sm mb-1">被引薦人自述 (Referee Story)</label>
                                    <textarea
                                        rows={3}
                                        value={referralForm.referee_story}
                                        onChange={(e) => setReferralForm({ ...referralForm, referee_story: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex flex-wrap justify-end gap-3">
                                {editingReferralId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingReferralId(null);
                                            setReferralForm(createEmptyReferralForm());
                                        }}
                                        className="px-5 py-3 border border-white/20 text-gray-300 rounded-lg hover:bg-white/5"
                                    >
                                        取消編輯
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={submitReferralForm}
                                    className="px-6 py-3 bg-primary text-bg-dark font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    {editingReferralId ? <Save size={18} /> : <Plus size={18} />}
                                    {editingReferralId ? '儲存變更' : '提交引薦案例'}
                                </button>
                            </div>
                        </div>

                        {/* Existing Referrals List */}
                        <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-4 md:p-6 overflow-hidden">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">引薦案例列表</h3>

                            {/* Mobile: Card Layout */}
                            <div className="md:hidden space-y-3">
                                {referrals.length === 0 ? (
                                    <EmptyState
                                        title="尚無引薦單資料"
                                        description="建立第一筆引薦案例後會顯示於此列表。"
                                        className="border-white/5 bg-transparent py-8"
                                    />
                                ) : referrals.map(ref => (
                                    <div key={ref.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <div className="text-sm font-bold text-white line-clamp-1 flex-1 mr-2">{ref.title}</div>
                                            <div className="flex gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => startEditReferral(ref)}
                                                    className="p-1.5 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                                                    title="編輯"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteReferral(ref.id)}
                                                    className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                    title="刪除"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 mb-2 line-clamp-1">{ref.description}</div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-primary">{ref.referrer_name} → {ref.referee_name}</span>
                                            <span className="text-gray-500">{new Date(ref.createdAt || ref.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop: Table Layout */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-gray-400 text-sm border-b border-white/10">
                                            <th className="p-4">日期</th>
                                            <th className="p-4">引薦人</th>
                                            <th className="p-4">被引薦人</th>
                                            <th className="p-4">標題/內容</th>
                                            <th className="p-4 text-right">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referrals.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-6">
                                                    <EmptyState
                                                        title="尚無引薦單資料"
                                                        description="於上方表單新增案例後，將出現在此表格。"
                                                        className="border-white/5 bg-transparent py-8"
                                                    />
                                                </td>
                                            </tr>
                                        ) : referrals.map(ref => (
                                            <tr key={ref.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-gray-300 text-sm">
                                                    {new Date(ref.createdAt || ref.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-white font-medium">{ref.referrer_name}</td>
                                                <td className="p-4 text-white text-sm">{ref.referee_name}</td>
                                                <td className="p-4">
                                                    <div className="text-white text-sm">{ref.title}</div>
                                                    <div className="text-xs text-gray-400 line-clamp-1">{ref.description}</div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEditReferral(ref)}
                                                            className="p-2 hover:bg-primary/20 text-primary rounded-full transition-colors"
                                                            title="編輯"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteReferral(ref.id)}
                                                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-colors"
                                                            title="刪除"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
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
            </div>
        </div>
    );
};

export default Admin;
