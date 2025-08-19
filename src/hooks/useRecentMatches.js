import { useState, useEffect } from 'react';
import axios from 'axios'; // 1. axios import 추가

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const useRecentMatches = (filters, page, sort) => {
    const [data, setData] = useState({ content: [], totalPages: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 3. async 함수로 변경
        const fetchMatches = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    page: page,
                    size: 10, // 페이지당 10개로 고정 (또는 props로 조절)
                    sort: sort,
                });

                // filters 객체에 키가 존재하고, 배열이 비어있지 않은 경우에만 파라미터 추가
                if (filters.leagueNames && filters.leagueNames.length > 0) {
                    filters.leagueNames.forEach(name => params.append('leagueNames', name));
                }
                if (filters.splitNames && filters.splitNames.length > 0) {
                    filters.splitNames.forEach(name => params.append('splits', name));
                }
                if (filters.teamNames && filters.teamNames.length > 0) {
                    filters.teamNames.forEach(name => params.append('teamNames', name));
                }

                const response = await axios.get(`${API_BASE_URL}/api/games`, { params });
                setData(response.data);

            } catch (err) {
                setError('데이터를 불러오는 데 실패했습니다.');
                console.error("API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [filters, page, sort]);

    return { data, loading, error };
};