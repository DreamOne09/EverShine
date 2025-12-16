import { useState, useEffect } from 'react';

interface Metric {
    amount: string;
    type: string;
}

interface MemberInfo {
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
    metrics: Metric;
    referrer: MemberInfo;
    referee: MemberInfo;
}

interface ReferralsData {
    referrals: Referral[];
}

export const useReferrals = () => {
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both referrals and members data in parallel
                const [referralsRes, membersRes] = await Promise.all([
                    fetch('/data/referrals.json'),
                    fetch('/data/members.json')
                ]);

                if (!referralsRes.ok) throw new Error('Failed to fetch referrals');
                // Members fetch failure is non-fatal for referrals, but we should log it

                const referralsData: ReferralsData = await referralsRes.json();
                let membersData: any[] = [];

                if (membersRes.ok) {
                    const mData = await membersRes.json();
                    membersData = Array.isArray(mData) ? mData : (mData.members || []);
                }

                // Merge member data into referrals
                const mergedReferrals = referralsData.referrals.map(ref => {
                    // Update referrer
                    const referrerMember = membersData.find(m => m.name === ref.referrer.name);
                    const updatedReferrer = referrerMember ? {
                        ...ref.referrer,
                        photo: referrerMember.photo || ref.referrer.photo,
                        industry: referrerMember.industry || ref.referrer.industry,
                        // Could also update company/title if needed
                    } : ref.referrer;

                    // Update referee
                    const refereeMember = membersData.find(m => m.name === ref.referee.name);
                    const updatedReferee = refereeMember ? {
                        ...ref.referee,
                        photo: refereeMember.photo || ref.referee.photo,
                        industry: refereeMember.industry || ref.referee.industry,
                    } : ref.referee;

                    return {
                        ...ref,
                        referrer: updatedReferrer,
                        referee: updatedReferee
                    };
                });

                setReferrals(mergedReferrals);
            } catch (err) {
                console.error("Error fetching referrals:", err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { referrals, loading, error };
};
