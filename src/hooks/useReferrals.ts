import { useState, useEffect } from 'react';
import type { Referral } from '../types';

export const useReferrals = () => {
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const response = await fetch('/data/referrals.json');
                if (!response.ok) throw new Error('Failed to fetch referrals');
                const data = await response.json();
                // Ensure data is sorted by date if possible, but JSON structure might vary
                // For now, reverse to show newest first if it's a list
                setReferrals(Array.isArray(data) ? data.reverse() : []);
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
