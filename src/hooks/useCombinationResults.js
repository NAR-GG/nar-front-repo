import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchCombinationResults = async (selectedChampions, filters, queryClient) => {
    console.log('🔍 Selected champions:', selectedChampions);
    console.log('🔍 Filters:', filters);

    const params = new URLSearchParams();

    // 🔥 안전성 검사
    if (!selectedChampions || !Array.isArray(selectedChampions) || selectedChampions.length === 0) {
        throw new Error('선택된 챔피언이 없습니다.');
    }

    // 챔피언 객체에서 영어 이름만 추출
    selectedChampions.forEach(champion => {
        if (champion) {
            const championName = typeof champion === 'string' ? champion : champion.championNameEn;
            if (championName) {
                params.append('champions', championName);
            }
        }
    });

    // 기본값으로 2025 추가
    const year = filters?.year || 2025;
    params.append('year', year);

    // 🔥 수정: v2 API 파라미터 이름에 맞게 변경
    if (filters?.splitNames && Array.isArray(filters.splitNames) && filters.splitNames.length > 0) {
        filters.splitNames.forEach(split => {
            if (split) {
                params.append('splits', split); // 🔥 'splits' 복수형
            }
        });
    }

    if (filters?.leagueNames && Array.isArray(filters.leagueNames) && filters.leagueNames.length > 0) {
        filters.leagueNames.forEach(league => {
            if (league) {
                params.append('leagueNames', league); // 🔥 'leagueNames' 복수형
            }
        });
    }

    if (filters?.teamNames && Array.isArray(filters.teamNames) && filters.teamNames.length > 0) {
        filters.teamNames.forEach(team => {
            if (team) {
                params.append('teamNames', team); // 🔥 'teamNames' 복수형
            }
        });
    }

    if (filters?.patch) {
        params.append('patch', filters.patch);
    }

    console.log('🔥 Final URL:', `/api/combinations/v2?${params.toString()}`);

    try {
        // v2 API 호출
        const response = await fetch(`/api/combinations/v2?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('🔍 API Response:', data);

        // 🔥 응답 데이터 검증
        if (!Array.isArray(data)) {
            console.warn('API 응답이 배열이 아닙니다:', data);
            return [];
        }

        // 🔥 캐시된 챔피언 데이터 가져오기
        const championData = queryClient.getQueryData(['champions']) || [];
        const championMap = new Map();

        // 챔피언 데이터 매핑
        if (Array.isArray(championData)) {
            championData.forEach(champion => {
                if (champion && champion.championNameEn) {
                    championMap.set(champion.championNameEn, champion);
                }
            });
        }

        // 백엔드 응답 데이터를 프론트엔드 형태로 변환
        return data.map((item, index) => ({
            combinationId: item?.combinationId || `temp-${index}`,
            rank: item?.rank || index + 1,
            champions: (item?.champions || []).map(champName => {
                if (!champName) return null;

                // 🔥 캐시된 챔피언 데이터에서 정보 가져오기
                const championInfo = championMap.get(champName);
                return {
                    championNameKr: championInfo?.championNameKr || champName,
                    championNameEn: champName,
                    imageUrl: championInfo?.imageUrl || `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${champName}.png`
                };
            }).filter(Boolean), // null 값 제거
            winRate: Math.round((item?.winRate || 0) * 100) / 100,
            wins: item?.winCount || 0,
            losses: item?.lossCount || 0,
            recentGame: item?.latestGameDate || '날짜 없음',
            recentPatch: (Array.isArray(item?.recentPatches) ? item.recentPatches[0] : null) || '알 수 없음',
            frequency: item?.frequency || 0,
            matches: []
        }));
    } catch (error) {
        console.error('🔍 API Error:', error);
        throw error;
    }
};

export const useCombinationResults = (selectedChampions, filters) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['combinations', selectedChampions, filters],
        queryFn: () => fetchCombinationResults(selectedChampions, filters, queryClient),
        enabled: Array.isArray(selectedChampions) && selectedChampions.length > 0,
        staleTime: 5 * 60 * 1000,
        retry: 3,
        retryDelay: 1000,
        // 🔥 기본값 설정
        placeholderData: []
    });
};
