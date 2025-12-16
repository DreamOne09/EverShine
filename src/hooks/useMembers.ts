import { useState, useEffect } from 'react';
import type { Member } from '../types';

export const useMembers = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                // Add timestamp to prevent caching
                const response = await fetch(`/data/members.json?t=${new Date().getTime()}`);
                if (!response.ok) throw new Error('Failed to fetch members');
                const data = await response.json();
                setMembers(Array.isArray(data) ? data : data.members || []);
            } catch (err) {
                console.error("Error fetching members:", err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    return { members, loading, error };
};
