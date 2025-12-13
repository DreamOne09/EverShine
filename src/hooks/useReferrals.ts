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
        const fetchReferrals = async () => {
            try {
                const response = await fetch('/data/referrals.json');
                if (!response.ok) throw new Error('Failed to fetch referrals');
                const data: ReferralsData = await response.json();
                setReferrals(data.referrals);
            } catch (err) {
                console.error("Error fetching referrals:", err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchReferrals();
    }, []);

    return { referrals, loading, error };
};
