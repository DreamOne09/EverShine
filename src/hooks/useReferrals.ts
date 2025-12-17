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
                // 1. Get referral cases
                const { data: refsData, error: refsError } = await supabase
                    .from('referral_cases')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (refsError) {
                    // If table doesn't exist yet, we might want to handle gracefully or show error
                    // For now, throw to show error message
                    throw refsError;
                }

                if (!refsData || refsData.length === 0) {
                    setReferrals([]);
                    return;
                }

                // 2. Identify all involved member IDs
                const memberIds = new Set<string>();
                refsData.forEach((r: any) => {
                    if (r.referrer_id) memberIds.add(String(r.referrer_id));
                    if (r.referee_id) memberIds.add(String(r.referee_id));
                });

                // 3. Fetch member details
                const { data: membersData, error: membersError } = await supabase
                    .from('members')
                    .select('id, name, industry, photo, fullIntro') // Fetch fullIntro or story if needed
                    .in('id', Array.from(memberIds));

                if (membersError) throw membersError;

                const membersMap = new Map();
                membersData?.forEach(m => {
                    membersMap.set(String(m.id), m);
                });

                // 4. Format data
                const formattedReferrals: Referral[] = refsData.map((ref: any) => {
                    const referrer = membersMap.get(String(ref.referrer_id));
                    const referee = membersMap.get(String(ref.referee_id));

                    return {
                        id: ref.id,
                        title: ref.title,
                        description: ref.description,
                        metrics: {
                            amount: ref.amount || '0',
                            type: ref.amount_type || 'TWD'
                        },
                        referrer: {
                            name: referrer?.name || 'Unknown',
                            industry: referrer?.industry || '',
                            photo: referrer?.photo || '',
                            story: ref.story // Use story from referral_cases, or fallback to referrer profile? Assuming story is specific to the case.
                        },
                        referee: {
                            name: referee?.name || 'Unknown',
                            industry: referee?.industry || '',
                            photo: referee?.photo || '',
                            value: '' // Optional
                        }
                    };
                });

                setReferrals(formattedReferrals);
            } catch (err: any) {
                console.error("Error loading referrals:", err);
                // Only set error if it's not a 'table not found' type which might happen before migration
                // But generally we want to show it.
                setError(err.message || '無法載入引薦資料');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { referrals, loading, error };
};
