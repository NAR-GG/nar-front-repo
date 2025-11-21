// src/hooks/useMatchupResults.js
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetchMatchupResults = async (champion1, champion2, filters, page = 0, size = 10) => {
    const queryParams = new URLSearchParams();

    // 챔피언 파라미터
    queryParams.append('champion1', champion1);
    queryParams.append('champion2', champion2);

    // 필터 파라미터
    if (filters.year) {
        queryParams.append('year', filters.year);
    }

    if (filters.splitNames && filters.splitNames.length > 0) {
        filters.splitNames.forEach(split => {
            queryParams.append('splits', split);
        });
    }

    if (filters.leagueNames && filters.leagueNames.length > 0) {
        filters.leagueNames.forEach(league => {
            queryParams.append('leagueNames', league);
        });
    }

    if (filters.teamNames && filters.teamNames.length > 0) {
        filters.teamNames.forEach(team => {
            queryParams.append('teamNames', team);
        });
    }

    if (filters.patch) {
        queryParams.append('patch', filters.patch);
    }

    // 페이지네이션 파라미터
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());


    const response = await fetch(`${API_BASE_URL}/api/combinations/matchups/1v1?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`매치업 데이터를 가져오는데 실패했습니다. (${response.status})`);
    }

    const result = await response.json();
    return result;
};

export const useMatchupResults = (champion1, champion2, filters, page = 0, size = 10) => {
    const serializedFilters = useMemo(() => {
        return JSON.stringify({
            year: filters?.year || 2025,
            splitNames: filters?.splitNames?.sort() || [],
            leagueNames: filters?.leagueNames?.sort() || [],
            teamNames: filters?.teamNames?.sort() || [],
            patch: filters?.patch
        });
    }, [filters]);

    const queryKey = ['matchup', champion1, champion2, serializedFilters, page, size];


    return useQuery({
        queryKey,
        queryFn: () => fetchMatchupResults(champion1, champion2, filters, page, size),
        enabled: Boolean(champion1 && champion2), // 명시적으로 Boolean 변환
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 30, // 30분 (React Query v5)
        retry: 3,
        retryDelay: 1000,
    });
};
