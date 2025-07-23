import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetchChampions = async () => {
    const response = await fetch(`${API_BASE_URL}/api/champions`);
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

