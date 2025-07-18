// useCombinationResults.js
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchCombinationResults = async (selectedChampions, filters, queryClient) => {
    console.log('🔍 Selected champions:', selectedChampions);
    console.log('🔍 Filters:', filters);

    const params = new URLSearchParams();

    // 챔피언 객체에서 영어 이름만 추출
    selectedChampions.forEach(champion => {
        const championName = typeof champion === 'string' ? champion : champion.championNameEn;
        params.append('champions', championName);
    });

    // 기본값으로 2025 추가
    const year = filters.year || 2025;
    params.append('year', year);

    // 다중 스플릿 처리
    if (filters.splitNames && filters.splitNames.length > 0) {
        filters.splitNames.forEach(split => {
            params.append('split', split);
        });
    }

    // 다중 리그 처리
    if (filters.leagueNames && filters.leagueNames.length > 0) {
        filters.leagueNames.forEach(league => {
            params.append('leagueName', league);
        });
    }

    // 다중 팀 처리
    if (filters.teamNames && filters.teamNames.length > 0) {
        filters.teamNames.forEach(team => {
            params.append('teamName', team);
        });
    }

    console.log('🔍 Final URL:', `/api/combinations?${params.toString()}`);

    // 조합 데이터 가져오기
    const response = await fetch(`/api/combinations?${params.toString()}`);

    if (!response.ok) {
        throw new Error('조합 데이터를 불러오는데 실패했습니다');
    }

    const data = await response.json();
    console.log('🔍 API Response:', data);

    // 캐시된 챔피언 데이터 가져오기
    const championData = queryClient.getQueryData(['champions']) || [];

    // 챔피언 이름으로 빠른 검색을 위한 Map 생성
    const championMap = new Map();
    championData.forEach(champion => {
        championMap.set(champion.championNameEn, champion);
    });

    // 백엔드 응답 데이터를 프론트엔드 형태로 변환
    return data.map(item => ({
        combinationId: item.combinationId,
        rank: item.rank,
        champions: item.champions.map(champName => {
            const championInfo = championMap.get(champName);
            return {
                championNameKr: championInfo?.championNameKr || champName,
                championNameEn: champName,
                imageUrl: championInfo?.imageUrl || `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${champName}.png`
            };
        }),
        winRate: Math.round(item.winRate * 100) / 100,
        wins: item.winCount,
        losses: item.lossCount,
        recentGame: item.latestGameDate,
        recentPatch: item.recentPatches?.[0] || '알 수 없음',
        frequency: item.frequency,
        matches: []
    }));
};

export const useCombinationResults = (selectedChampions, filters) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['combinations', selectedChampions, filters],
        queryFn: () => fetchCombinationResults(selectedChampions, filters, queryClient),
        enabled: Array.isArray(selectedChampions) && selectedChampions.length > 0,
        staleTime: 5 * 60 * 1000,
        retry: 3,
        retryDelay: 1000
    });
};
