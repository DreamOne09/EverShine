import { supabase } from '../lib/supabase';

export interface AdminDashboardFetchResult {
    members: Record<string, unknown>[];
    referrals: Record<string, unknown>[];
    homeStats: {
        month: string;
        referral_count: number;
        referral_value: number;
    } | null;
    pageViewsCount: number;
    socialClicks: number;
}

/** 後台儀表板一次載入（與原 Admin fetchDashboardData 平行邏輯一致） */
export async function fetchAdminDashboardBundle(): Promise<AdminDashboardFetchResult> {
    const [
        membersRes,
        homeStatsRes,
        pageViewsRes,
        referralsRes,
        socialClicksRes,
    ] = await Promise.all([
        (async () => {
            let res = await supabase.from('members').select('*').order('createdAt', { ascending: false });
            if (res.error) {
                res = await supabase.from('members').select('*').order('created_at', { ascending: false });
            }
            if (res.error) {
                res = await supabase.from('members').select('*');
            }
            return res;
        })(),
        (async () => {
            try {
                return await supabase.from('homepage_stats').select('*').order('month', { ascending: false }).limit(1).maybeSingle();
            } catch {
                return { data: null, error: null };
            }
        })(),
        (async () => {
            try {
                return await supabase.from('page_views').select('*', { count: 'exact', head: true });
            } catch {
                return { count: 0, data: null, error: null };
            }
        })(),
        (async () => {
            try {
                let res = await supabase.from('referrals').select('*').order('created_at', { ascending: false });
                if (res.error) res = await supabase.from('referrals').select('*').order('createdAt', { ascending: false });
                if (res.error) res = await supabase.from('referrals').select('*');
                return res;
            } catch {
                return { data: [], error: null };
            }
        })(),
        (async () => {
            try {
                return await supabase
                    .from('analytics_events')
                    .select('*', { count: 'exact', head: true })
                    .eq('event_name', 'click_social');
            } catch {
                return { count: 0, data: null, error: null };
            }
        })(),
    ]);

    if (membersRes.error) console.error('Members fetch error:', membersRes.error);
    if (referralsRes.error) console.error('Referrals fetch error:', referralsRes.error);

    const homeRow = homeStatsRes.data as Record<string, unknown> | null;
    const homeStats = homeRow
        ? {
              month: String(homeRow.month || ''),
              referral_count: Number(homeRow.referral_count) || 0,
              referral_value: Number(homeRow.referral_value) || 0,
          }
        : null;

    return {
        members: (membersRes.data || []) as Record<string, unknown>[],
        referrals: (referralsRes.data || []) as Record<string, unknown>[],
        homeStats,
        pageViewsCount: pageViewsRes.count || 0,
        socialClicks: socialClicksRes.count || 0,
    };
}

export interface AdminStaffItem {
    id: string;
    name: string;
    photo?: string;
    photoPosition?: string;
    position?: string;
    title?: string;
}

export function deriveAdminDerivedState(bundle: AdminDashboardFetchResult) {
    const membersData = bundle.members;
    const homeStatsData = bundle.homeStats;
    const visitsCount = bundle.pageViewsCount;
    const socialClicksCount = bundle.socialClicks;

    const isActive = (m: Record<string, unknown>) =>
        ((m.status as string | undefined) || 'active') === 'active';

    const activeMembers = membersData.filter(isActive);

    // 涵蓋產業數 / 完整度 / 最近更新 — 只計在籍
    const industrySet = new Set<string>();
    let hasPhotoCount = 0;
    activeMembers.forEach((m) => {
        const ind = ((m.industry as string) || '').trim();
        if (ind && ind !== '未分類') industrySet.add(ind);
        const photo = m.photo as string | undefined;
        if (photo && photo.length > 10) hasPhotoCount++;
    });

    const industryCount = industrySet.size;
    const completionRate = activeMembers.length
        ? Math.round((hasPhotoCount / activeMembers.length) * 100)
        : 0;

    // 系統維運團隊：從會員資料表 is_admin=true 動態取得（含冷凍者不列）
    const admins: AdminStaffItem[] = activeMembers
        .filter((m) => m.is_admin === true)
        .map((m) => ({
            id: String(m.id),
            name: String(m.name || ''),
            photo: (m.photo as string) || undefined,
            photoPosition:
                (m.photoPosition as string | undefined) ||
                (m.photo_position as string | undefined),
            position: (m.position as string | undefined),
            title: (m.title as string | undefined),
        }))
        .filter((a) => a.name);

    // 最近更新：排除系統管理員避免洗版
    const adminIds = new Set(admins.map((a) => a.id));
    const sortedByUpdate = [...activeMembers]
        .filter((m) => !adminIds.has(String(m.id)))
        .sort((a, b) => {
            const dateA = new Date((a.updatedAt || a.updated_at || 0) as string).getTime();
            const dateB = new Date((b.updatedAt || b.updated_at || 0) as string).getTime();
            return dateB - dateA;
        });

    return {
        stats: {
            totalMembers: activeMembers.length,
            totalReferrals: homeStatsData?.referral_count || 0,
            totalValue: homeStatsData?.referral_value || 0,
            monthlyVisits: visitsCount,
            industryCount,
            completionRate: `${completionRate}%`,
        },
        recentUpdates: sortedByUpdate.slice(0, 5),
        marketingStats: { socialClicks: socialClicksCount },
        admins,
    };
}
