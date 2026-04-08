import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Simplified type for what we need in UI
export interface MemberInfo {
    name: string;
    industry: string;
    photo: string;
    story?: string;
    testimonial?: string;
    value?: string;
}

export interface Referral {
    id: string;
    title: string;
    description: string;
    metrics: { amount: string; type: string };
    referrer: MemberInfo;
    referee: MemberInfo;
}

export const useReferrals = () => {
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                // 1. Get raw referrals data with resilient ordering
                let { data: refsData, error: refsError } = await supabase
                    .from('referrals')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (refsError) {
                    // Try alternative column name
                    const altRes = await supabase
                        .from('referrals')
                        .select('*')
                        .order('createdAt', { ascending: false });

                    if (!altRes.error) {
                        refsData = altRes.data;
                        refsError = null;
                    }
                }

                if (refsError) {
                    // Try without ordering if both fail
                    const fallbackRes = await supabase.from('referrals').select('*');
                    if (!fallbackRes.error) {
                        refsData = fallbackRes.data;
                        refsError = null;
                    }
                }

                if (refsError) throw refsError;

                if (!refsData || refsData.length === 0) {
                    setReferrals([]);
                    return;
                }

                // 2. Get basic member info for mapping (Photo, Industry)
                const { data: membersData } = await supabase
                    .from('members')
                    .select('name, industry, photo');

                // Map by Name for quick lookup
                const membersMap = new Map(membersData?.map(m => [m.name, m]));

                // 3. Format data structure
                const formattedReferrals: Referral[] = refsData.map((ref: Record<string, unknown>) => {
                    const referrerName = String(ref.referrer_name ?? '');
                    const refereeName = String(ref.referee_name ?? '');
                    const referrerDetails = membersMap.get(referrerName);
                    const refereeDetails = membersMap.get(refereeName);
                    const metrics = ref.metrics as { amount?: string; type?: string } | undefined;

                    return {
                        id: String(ref.id),
                        title: String(ref.title ?? ''),
                        description: String(ref.description ?? ''),
                        metrics: {
                            amount: metrics?.amount ?? '0',
                            type: metrics?.type ?? 'TWD',
                        },
                        referrer: {
                            name: referrerName,
                            industry: referrerDetails?.industry || 'Unknown',
                            photo: referrerDetails?.photo || '',
                            story: ref.referrer_story as string | undefined,
                            testimonial: ref.referrer_testimonial as string | undefined,
                        },
                        referee: {
                            name: refereeName,
                            industry: refereeDetails?.industry || 'Unknown',
                            photo: refereeDetails?.photo || '',
                            story: ref.referee_story as string | undefined,
                            value: (ref.referee_value as string) || '',
                        },
                    };
                });

                setReferrals(formattedReferrals);
            } catch (err: unknown) {
                console.error('Error loading referrals:', err);
                const code =
                    err && typeof err === 'object' && 'code' in err
                        ? String((err as { code: string }).code)
                        : '';
                const message =
                    err && typeof err === 'object' && 'message' in err
                        ? String((err as { message: string }).message)
                        : '無法載入引薦資料';
                if (code === 'PGRST116' || code === '42P01' || code === 'PGRST204') {
                    setReferrals([]);
                    setError(null);
                } else {
                    setReferrals([]);
                    setError(message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { referrals, loading, error };
};
