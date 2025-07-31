import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetchCombinationResults = async (selectedChampions, filters, queryClient, page = 0, size = 10, sort = 'frequency') => {
    console.log('🔍 Selected champions:', selectedChampions);
    console.log('🔍 Filters:', filters);
    console.log('🔍 Pagination:', { page, size, sort });

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

    // 🔥 페이징 및 정렬 파라미터 추가
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (sort) {
        params.append('sort', sort);
    }

    console.log('🔥 Final URL:', `/api/combinations/?${params.toString()}`);

    try {
        // v2 API 호출
        const response = await fetch(`${API_BASE_URL}/api/combinations/?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('🔍 API Response:', data);

        // 🔥 응답 데이터 검증 (PageCombinationResponse 구조)
        if (!data || typeof data !== 'object' || !Array.isArray(data.content)) {
            console.warn('API 응답이 예상 구조가 아닙니다:', data);
            return { content: [], hasNext: false, totalCount: 0 };
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

        // 백엔드 응답 데이터를 프론트엔드 형태로 변환 (data.content 사용)
        const transformedData = data.content.map((item, index) => ({
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
            winRate: Math.round((item?.winRate || 0)) / 100,
            wins: item?.winCount || 0,
            losses: item?.lossCount || 0,
            recentGame: item?.latestGameDate || '날짜 없음',
            latestPatch: item.latestPatch || '알 수 없음',
            frequency: item?.frequency || 0,
            matches: []
        }));

        // PageCombinationResponse의 구조를 반환 (content 변환 후)
        return {
            content: transformedData,
            hasNext: data.hasNext,
            totalCount: data.totalCount
        };
    } catch (error) {
        console.error('🔍 API Error:', error);
        throw error;
    }
};

export const useCombinationResults = (selectedChampions, filters) => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [size] = useState(10);  // 페이지 크기 고정 (필요 시 동적 변경)
    const [sort, internalSetSort] = useState('frequency');  // 기본 정렬: 최신순 (UI에서 변경 가능)
    const [allData, setAllData] = useState([]);  // 누적 데이터
    const [hasMore, setHasMore] = useState(true);  // 다음 페이지 여부
    const [totalCount, setTotalCount] = useState(0);  // 총 개수

    // 🔥 sort 변경 함수 (UI에서 호출 가능)
    const setSort = (newSort) => {
        if (newSort !== sort) {
            internalSetSort(newSort);
            setPage(0);  // sort 변경 시 페이지 초기화
            setAllData([]);  // 데이터 초기화
            setHasMore(true);
            setTotalCount(0);
        }
    };

    const query = useQuery({
        queryKey: ['combinations', selectedChampions, filters, page, size, sort],
        queryFn: () => fetchCombinationResults(selectedChampions, filters, queryClient, page, size, sort),
        enabled: Array.isArray(selectedChampions) && selectedChampions.length > 0,
        staleTime: 5 * 60 * 1000,
        retry: 3,
        retryDelay: 1000,
        // 🔥 placeholderData 제거: 초기 로딩 중 data가 undefined로 유지되도록 함
    });

    // 데이터 누적 로직 (필터/챔피언/sort 변경 시 초기화)
    useEffect(() => {
        setPage(0);  // 필터 변경 시 페이지 초기화
        setAllData([]);  // 데이터 초기화
        setHasMore(true);  // hasMore 초기화
        setTotalCount(0);  // totalCount 초기화
    }, [selectedChampions, filters, sort]);  // 🔥 sort 추가: 변경 시 재초기화

    useEffect(() => {
        if (query.data) {
            setAllData(prev => {
                // 현재 페이지가 0이면 새 데이터로 덮어쓰기, 아니면 누적
                return page === 0 ? query.data.content : [...prev, ...query.data.content];
            });
            setHasMore(query.data.hasNext);
            setTotalCount(query.data.totalCount);
        }
    }, [query.data, page]);

    // "더 보기" 함수 (다음 페이지 요청)
    const loadMore = () => {
        if (hasMore && !query.isFetching) {
            setPage(prev => prev + 1);  // 다음 페이지로 이동
        }
    };

    return {
        ...query,
        data: allData,  // 누적된 데이터 반환
        hasMore,        // 다음 페이지 여부
        totalCount,     // 총 개수
        loadMore,       // 더 보기 함수
        setSort         // 🔥 정렬 변경 함수 반환 (UI에서 사용)
    };
};
