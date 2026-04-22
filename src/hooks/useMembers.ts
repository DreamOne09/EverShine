import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { fetchPublicMembers } from '../api/members';
import { queryKeys } from '../api/queryKeys';

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
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: queryKeys.members.list,
        queryFn: fetchPublicMembers,
        staleTime: 60_000,
    });

    useEffect(() => {
        const subscription = supabase
            .channel('members_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
                void queryClient.invalidateQueries({ queryKey: queryKeys.members.list });
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [queryClient]);

    return {
        members: query.data ?? [],
        loading: query.isPending,
        error: query.isError ? '無法載入會員資料' : null,
    };
};
