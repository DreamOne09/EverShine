import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Member {
    id: number;
    name: string;
    industry: string;
    photo: string;
    photoPosition?: string;
    category: string;
    title: string;
    company: string;
    shortIntro: string;
    fullIntro: string;
    services: string[];
    hashtags: string[];
    links: { [key: string]: string } | { type: string; url: string; icon?: string }[];

    editCount?: number;
    updatedAt?: string;
    phone?: string;
    email?: string;
}

export const useMembers = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('members')
                    .select('*')
                    .order('id', { ascending: true });

                if (error) throw error;
                setMembers(data || []);
            } catch (err) {
                console.error('Error fetching members:', err);
                setError('無法載入會員資料');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();

        // Optional: Realtime subscription
        const subscription = supabase
            .channel('members_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchMembers)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { members, loading, error };
};
