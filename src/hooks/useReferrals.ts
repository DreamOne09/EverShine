import { useQuery } from '@tanstack/react-query';
import { fetchReferralsForDisplay } from '../api/referrals';
import { queryKeys } from '../api/queryKeys';

export const useReferrals = () => {
    const query = useQuery({
        queryKey: queryKeys.referrals.list,
        queryFn: fetchReferralsForDisplay,
        staleTime: 60_000,
    });

    return {
        referrals: query.data ?? [],
        loading: query.isPending,
        error: query.isError ? '無法載入引薦資料' : null,
    };
};
