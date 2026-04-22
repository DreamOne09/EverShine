import { supabase } from '../lib/supabase';
import type { Referral } from '../types';

async function fetchReferralsRaw(): Promise<Record<string, unknown>[]> {
    let { data: refsData, error: refsError } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });

    if (refsError) {
        const altRes = await supabase.from('referrals').select('*').order('createdAt', { ascending: false });
        if (!altRes.error) {
            refsData = altRes.data;
            refsError = null;
        }
    }
    if (refsError) {
        const fallbackRes = await supabase.from('referrals').select('*');
        if (!fallbackRes.error) {
            refsData = fallbackRes.data;
            refsError = null;
        }
    }
    if (refsError) throw refsError;
    return (refsData || []) as Record<string, unknown>[];
}

/** 引薦頁用：合併 members 頭像／產業 */
export async function fetchReferralsForDisplay(): Promise<Referral[]> {
    const refsData = await fetchReferralsRaw();
    if (refsData.length === 0) return [];

    const { data: membersData } = await supabase.from('members').select('name, industry, photo');
    const membersMap = new Map(membersData?.map((m) => [m.name, m]));

    return refsData.map((ref) => {
        const referrerDetails = membersMap.get(ref.referrer_name as string);
        const refereeDetails = membersMap.get(ref.referee_name as string);
        return {
            id: String(ref.id),
            title: (ref.title as string) || '',
            description: (ref.description as string) || '',
            metrics: (ref.metrics as Referral['metrics']) || { amount: '0', type: 'TWD' },
            referrer: {
                name: ref.referrer_name as string,
                industry: referrerDetails?.industry || 'Unknown',
                photo: referrerDetails?.photo || '',
                story: ref.referrer_story as string | undefined,
                testimonial: ref.referrer_testimonial as string | undefined,
            },
            referee: {
                name: ref.referee_name as string,
                industry: refereeDetails?.industry || 'Unknown',
                photo: refereeDetails?.photo || '',
                story: ref.referee_story as string | undefined,
                value: (ref.referee_value as string) || '',
            },
        } satisfies Referral;
    });
}
