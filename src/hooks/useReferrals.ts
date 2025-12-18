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
                // 1. Get raw referrals data
                const { data: refsData, error: refsError } = await supabase
                    .from('referrals')
                    .select('*')
                    .order('created_at', { ascending: false });

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
                const formattedReferrals: Referral[] = refsData.map((ref: any) => {
                    const referrerDetails = membersMap.get(ref.referrer_name);
                    const refereeDetails = membersMap.get(ref.referee_name);

                    return {
                        id: ref.id,
                        title: ref.title,
                        description: ref.description,
                        metrics: ref.metrics || { amount: '0', type: 'TWD' },
                        referrer: {
                            name: ref.referrer_name,
                            industry: referrerDetails?.industry || 'Unknown',
                            photo: referrerDetails?.photo || '',
                            story: ref.referrer_story,
                            testimonial: ref.referrer_testimonial
                        },
                        referee: {
                            name: ref.referee_name,
                            industry: refereeDetails?.industry || 'Unknown',
                            photo: refereeDetails?.photo || '',
                            story: ref.referee_story,
                            value: ref.referee_value || ''
                        }
                    };
                });

                setReferrals(formattedReferrals);
            } catch (err: any) {
                console.error("Error loading referrals:", err);
                setError(err.message || '無法載入引薦資料');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { referrals, loading, error };
};
