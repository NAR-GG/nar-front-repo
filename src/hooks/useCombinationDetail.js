// src/hooks/useCombinationDetail.js
import { useQuery } from '@tanstack/react-query';

const fetchCombinationDetail = async (combinationId) => {
    const response = await fetch(`/api/combinations/${combinationId}/detail`);

    if (!response.ok) {
        throw new Error('조합 상세정보를 불러오는데 실패했습니다');
    }

    return response.json();
};

export const useCombinationDetail = (combinationId) => {
    return useQuery({
        queryKey: ['combination-detail', combinationId],
        queryFn: () => fetchCombinationDetail(combinationId),
        enabled: !!combinationId,
        staleTime: 5 * 60 * 1000,
        retry: 3,
        retryDelay: 1000
    });
};