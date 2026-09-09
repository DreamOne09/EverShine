import extraReferralCases from '../data/referral-cases-extra.json' with { type: 'json' };
import { extraCasesToRows, mergeReferralRows, type ExtraReferralCase } from '../lib/mergeReferralRows';
import { supabase } from '../lib/supabase';
import type { Referral } from '../types';
import { dedupeReferralsForDisplay, resolveReferralMemberPhoto } from '../lib/referralDedupe';

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
    const refsData = mergeReferralRows(
        await fetchReferralsRaw(),
        extraCasesToRows(extraReferralCases as ExtraReferralCase[])
    );
    if (refsData.length === 0) return [];

    const { data: membersData } = await supabase.from('members').select('name, industry, photo, photoPosition');
    const membersMap = new Map(membersData?.map((m) => [m.name, m]));

    return dedupeReferralsForDisplay(
        refsData.map((ref) => {
        const referrerDetails = membersMap.get(ref.referrer_name as string) as Record<string, unknown> | undefined;
        const refereeDetails = membersMap.get(ref.referee_name as string) as Record<string, unknown> | undefined;
        const refPos = (row: Record<string, unknown> | undefined) =>
            (row?.photoPosition ?? row?.photo_position) as string | undefined;
        const referrerName = ref.referrer_name as string;
        const refereeName = ref.referee_name as string;
        return {
            id: String(ref.id),
            title: (ref.title as string) || '',
            description: (ref.description as string) || '',
            metrics: (ref.metrics as Referral['metrics']) || { amount: '0', type: 'TWD' },
            referrer: {
                name: referrerName,
                industry: (referrerDetails?.industry as string) || '',
                photo: resolveReferralMemberPhoto(referrerName, referrerDetails?.photo as string | undefined),
                photoPosition: refPos(referrerDetails),
                story: ref.referrer_story as string | undefined,
                testimonial: ref.referrer_testimonial as string | undefined,
            },
            referee: {
                name: refereeName,
                industry: (refereeDetails?.industry as string) || '',
                photo: resolveReferralMemberPhoto(refereeName, refereeDetails?.photo as string | undefined),
                photoPosition: refPos(refereeDetails),
                story: ref.referee_story as string | undefined,
                value: (ref.referee_value as string) || '',
            },
        } satisfies Referral;
        })
    );
}
