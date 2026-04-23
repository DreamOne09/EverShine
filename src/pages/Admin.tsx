import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Activity, RefreshCw } from 'lucide-react';
import SEO from '../components/common/SEO';
import {
    MainLayoutSkeleton,
    ErrorFallback,
    TopProgressBar,
} from '../components/loading';
import { sanitizeText } from '../lib/sanitize';
import { fetchAdminDashboardBundle, deriveAdminDerivedState } from '../api/dashboard';
import { queryKeys } from '../api/queryKeys';
import AdminOverviewTab from '../components/admin/AdminOverviewTab';
import AdminMembersTab from '../components/admin/AdminMembersTab';
import AdminReferralsTab from '../components/admin/AdminReferralsTab';
import type { ReferralFormState } from '../components/admin/AdminReferralsTab';
import AdminSettingsTab from '../components/admin/AdminSettingsTab';
import AdminHelpBanner from '../components/admin/AdminHelpBanner';
import AdminMemberModal from '../components/admin/AdminMemberModal';

const createEmptyReferralForm = (): ReferralFormState => ({
    title: '',
    description: '',
    referrer_name: '',
    referee_name: '',
    referrer_story: '',
    referee_story: '',
    metrics_amount: '洽談中',
    metrics_type: '專案合作',
});

const Admin: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [initialLoad, setInitialLoad] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'referrals' | 'settings'>('overview');
    const [memberSearch, setMemberSearch] = useState('');
    const [homeStats, setHomeStats] = useState({
        referral_count: 0,
        referral_value: 0,
        month: new Date().toISOString().slice(0, 7),
    });
    const [referralForm, setReferralForm] = useState<ReferralFormState>(createEmptyReferralForm);
    const [editingReferralId, setEditingReferralId] = useState<string | null>(null);
    const [memberModalOpen, setMemberModalOpen] = useState(false);

    const dashboardQuery = useQuery({
        queryKey: queryKeys.admin.dashboard,
        queryFn: fetchAdminDashboardBundle,
        enabled: !!user,
        staleTime: 30_000,
    });

    useEffect(() => {
        if (dashboardQuery.data) setInitialLoad(false);
    }, [dashboardQuery.data]);

    const checkAdmin = useCallback(async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const { data, error } = await supabase.from('members').select('is_admin').eq('user_id', user.id).single();
            if (error || !data?.is_admin) navigate('/');
        } catch {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        void checkAdmin();
    }, [checkAdmin]);

    const members = (dashboardQuery.data?.members ?? []) as Record<string, unknown>[];
    const referrals = (dashboardQuery.data?.referrals ?? []) as Record<string, unknown>[];

    useEffect(() => {
        const hs = dashboardQuery.data?.homeStats;
        if (hs) {
            setHomeStats({
                month: hs.month,
                referral_count: hs.referral_count,
                referral_value: hs.referral_value,
            });
        }
    }, [dashboardQuery.data?.homeStats]);

    const derived = dashboardQuery.data ? deriveAdminDerivedState(dashboardQuery.data) : null;

    const refetchDashboard = () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });

    const saveReferralMutation = useMutation({
        mutationFn: async (payload: { row: Record<string, unknown>; id?: string }) => {
            if (payload.id) {
                const { error } = await supabase.from('referrals').update(payload.row).eq('id', payload.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('referrals').insert(payload.row);
                if (error) throw error;
            }
        },
        onSuccess: (_, v) => {
            alert(v.id ? '引薦案例已更新（前台引薦頁將顯示此內容）' : '引薦案例已新增');
            setReferralForm(createEmptyReferralForm());
            setEditingReferralId(null);
            void queryClient.invalidateQueries({ queryKey: queryKeys.referrals.list });
            void refetchDashboard();
        },
        onError: (e: Error) => alert('儲存失敗: ' + e.message),
    });

    const submitReferralForm = () => {
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
        saveReferralMutation.mutate({ row, id: editingReferralId || undefined });
    };

    const startEditReferral = (ref: Record<string, unknown>) => {
        const m = ref.metrics && typeof ref.metrics === 'object' ? (ref.metrics as Record<string, string>) : {};
        setEditingReferralId(String(ref.id));
        setReferralForm({
            title: (ref.title as string) || '',
            description: (ref.description as string) || '',
            referrer_name: (ref.referrer_name as string) || '',
            referee_name: (ref.referee_name as string) || '',
            referrer_story: (ref.referrer_story as string) || '',
            referee_story: (ref.referee_story as string) || '',
            metrics_amount: m.amount ?? '洽談中',
            metrics_type: m.type ?? '專案合作',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteReferral = async (id: string) => {
        if (!confirm('確定要刪除這筆引薦單嗎？此動作無法復原。')) return;
        try {
            const { error } = await supabase.from('referrals').delete().eq('id', id);
            if (error) throw error;
            alert('已刪除');
            void queryClient.invalidateQueries({ queryKey: queryKeys.referrals.list });
            void refetchDashboard();
        } catch (e: unknown) {
            alert('刪除失敗: ' + (e instanceof Error ? e.message : String(e)));
        }
    };

    const saveHomeStatsMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase.from('homepage_stats').upsert(homeStats, { onConflict: 'month' });
            if (error) throw error;
        },
        onSuccess: () => {
            alert('首頁數據已更新！');
            void refetchDashboard();
        },
        onError: (e: Error) => alert('更新失敗: ' + e.message),
    });

    const filteredMembers = members.filter(
        (m) =>
            String(m.name || '')
                .toLowerCase()
                .includes(memberSearch.toLowerCase()) ||
            String(m.company || '')
                .toLowerCase()
                .includes(memberSearch.toLowerCase()) ||
            String(m.industry || '')
                .toLowerCase()
                .includes(memberSearch.toLowerCase())
    );

    const loading = dashboardQuery.isFetching;
    const dashboardError = dashboardQuery.isError ? (dashboardQuery.error as Error).message : null;

    if (loading && initialLoad && !dashboardQuery.data) {
        return <MainLayoutSkeleton />;
    }

    if (dashboardError && !dashboardQuery.data) {
        return (
            <div className="min-h-dvh pt-24 md:pt-32 pb-24 px-4 container mx-auto flex items-start justify-center">
                <SEO title="管理後台" noindex />
                <ErrorFallback className="max-w-lg w-full mt-8" message={dashboardError} onRetry={() => void dashboardQuery.refetch()} />
            </div>
        );
    }

    const stats = derived?.stats ?? {
        totalMembers: 0,
        totalReferrals: 0,
        totalValue: 0,
        monthlyVisits: 0,
        industryCount: 0,
        completionRate: '0%',
    };
    const recentUpdates = derived?.recentUpdates ?? [];
    const marketingStats = derived?.marketingStats ?? { socialClicks: 0 };

    return (
        <div className="min-h-dvh pt-24 md:pt-32 pb-24 md:pb-12 px-4 container mx-auto">
            <TopProgressBar active={dashboardQuery.isFetching && !!dashboardQuery.data} />
            <SEO title="管理後台" noindex />
            <AdminHelpBanner />
            <AdminMemberModal
                open={memberModalOpen}
                onClose={() => setMemberModalOpen(false)}
                onCreated={() => {
                    void queryClient.invalidateQueries({ queryKey: queryKeys.members.list });
                    void refetchDashboard();
                }}
            />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3 flex-wrap">
                    <Activity className="text-primary" size={24} /> 管理後台
                    <button
                        type="button"
                        onClick={() => void refetchDashboard()}
                        className={`p-2 rounded-full hover:bg-white/10 transition-all ${loading ? 'animate-spin text-primary' : 'text-gray-400'}`}
                        title="重新整理數據"
                    >
                        <RefreshCw size={18} />
                    </button>
                </h1>
                <div className="w-full md:w-auto overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    <div className="flex bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/10 min-w-max">
                        {(
                            [
                                { id: 'overview', label: '總覽' },
                                { id: 'members', label: '會員' },
                                { id: 'referrals', label: '引薦' },
                                { id: 'settings', label: '設定' },
                            ] as const
                        ).map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors whitespace-nowrap ${
                                    activeTab === tab.id ? 'bg-primary text-bg-dark' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {activeTab === 'overview' && (
                    <AdminOverviewTab stats={stats} recentUpdates={recentUpdates} marketingStats={marketingStats} />
                )}
                {activeTab === 'members' && (
                    <AdminMembersTab
                        memberSearch={memberSearch}
                        onMemberSearch={setMemberSearch}
                        onAddMember={() => setMemberModalOpen(true)}
                        filteredMembers={filteredMembers}
                        loading={loading}
                        onRefresh={() => void refetchDashboard()}
                    />
                )}
                {activeTab === 'referrals' && (
                    <AdminReferralsTab
                        referrals={referrals}
                        referralForm={referralForm}
                        onReferralFormChange={setReferralForm}
                        editingReferralId={editingReferralId}
                        onCancelEdit={() => {
                            setEditingReferralId(null);
                            setReferralForm(createEmptyReferralForm());
                        }}
                        onSubmitReferral={submitReferralForm}
                        onEditReferral={startEditReferral}
                        onDeleteReferral={handleDeleteReferral}
                    />
                )}
                {activeTab === 'settings' && (
                    <AdminSettingsTab
                        homeStats={homeStats}
                        onHomeStatsChange={setHomeStats}
                        onSaveHomeStats={() => saveHomeStatsMutation.mutate()}
                    />
                )}
            </div>
        </div>
    );
};

export default Admin;
