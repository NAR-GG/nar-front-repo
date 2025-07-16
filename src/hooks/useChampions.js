import { useQuery } from '@tanstack/react-query';

const fetchChampions = async () => {
    const response = await fetch('/api/champions');
    if (!response.ok) {
        throw new Error('챔피언 데이터를 가져오는데 실패했습니다');
    }
    return response.json();
};

export const useChampions = () => {
    return useQuery({
        queryKey: ['champions'],
        queryFn: fetchChampions,
        staleTime: 5 * 60 * 1000, // 5분 캐시
        cacheTime: 10 * 60 * 1000, // 10분 캐시
    });
};

// 검색용 훅
export const useChampionSearch = (keyword) => {
    return useQuery({
        queryKey: ['champions', 'search', keyword],
        queryFn: async () => {
            const response = await fetch(`/api/champions/search?keyword=${keyword}`);
            if (!response.ok) throw new Error('검색 실패');
            return response.json();
        },
        enabled: !!keyword && keyword.length > 0,
        staleTime: 2 * 60 * 1000,
    });
};
