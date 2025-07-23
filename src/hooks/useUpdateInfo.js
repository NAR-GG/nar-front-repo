import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetchUpdateInfo = async () => {

    const response = await fetch(`${API_BASE_URL}/api/combinations/stat`);
    if (!response.ok) {
        throw new Error('업데이트 정보 불러오기 실패');
    }
    return response.json();
};

export const useUpdateInfo = () => {
    return useQuery({
        queryKey: ['updateInfo'],
        queryFn: fetchUpdateInfo,
        staleTime: 30 * 60 * 1000,  // 30분 캐싱
        placeholderData: { lastUpdateTime: null}
    });
};