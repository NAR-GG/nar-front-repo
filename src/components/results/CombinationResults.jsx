// CombinationResults 컴포넌트
import React, { useState, useEffect } from 'react';
import { Stack, Title, Paper, Group, Text, Button, Collapse, LoadingOverlay, Divider, ActionIcon, Select } from '@mantine/core';
import { IconArrowLeft, IconChevronDown } from '@tabler/icons-react';
import CombinationCard from '../list/CombinationCard';
import MatchHistory from '../detail/MatchHistory';
import { useCombinationResults } from '../../hooks/useCombinationResults';

const CombinationResults = ({ selectedChampions = [], filters = {}, onBackToSelection }) => {
    const [expandedCards, setExpandedCards] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});
    const [combinationsWithDetails, setCombinationsWithDetails] = useState([]);

    // 🔥 안전한 기본값 설정
    const safeSelectedChampions = Array.isArray(selectedChampions) ? selectedChampions : [];
    const safeFilters = filters || {};

    // 🔥 useCombinationResults 훅 사용 (페이징 데이터 가져오기) - sort를 여기서 전달
    const { data, isLoading, error, hasMore, totalCount, loadMore, setSort } = useCombinationResults(safeSelectedChampions, safeFilters);

    // 🔥 데이터 업데이트 (gameDetails 포함)
    useEffect(() => {
        // 새로운 데이터로 상태 초기화
        const updatedCombinations = Array.isArray(data)
            ? data.map(combination => ({
                ...combination,
                gameDetails: combination.gameDetails || undefined
            }))
            : [];
        setCombinationsWithDetails(updatedCombinations);
        setExpandedCards({});
        setLoadingDetails({});
    }, [data]);

    // 🔥 선택된 챔피언이나 필터 변경 시 상태 초기화 (훅에서 이미 처리됨, 추가 초기화 필요 시)
    useEffect(() => {
        setExpandedCards({});
        setLoadingDetails({});
    }, [safeSelectedChampions, safeFilters]);

    const toggleCard = async (index) => {
        const combination = combinationsWithDetails[index];
        if (!combination) return;

        const isExpanding = !expandedCards[index];

        // 카드 상태 토글
        setExpandedCards(prev => ({
            ...prev,
            [index]: isExpanding
        }));

        // 확장할 때만 상세정보 로드
        if (isExpanding && combination.combinationId) {
            // 이미 gameDetails가 있으면 API 호출하지 않음
            if (combination.gameDetails && Array.isArray(combination.gameDetails) && combination.gameDetails.length > 0) {
                return;
            }

            setLoadingDetails(prev => ({ ...prev, [index]: true }));

            try {
                const response = await fetch(`/api/combinations/${combination.combinationId}/detail`);
                if (!response.ok) {
                    throw new Error('상세정보를 불러오는데 실패했습니다');
                }

                const detailData = await response.json();

                // 🔥 상태로 관리하는 조합 데이터 업데이트
                setCombinationsWithDetails(prev => {
                    const updated = [...prev];
                    updated[index] = {
                        ...combination,
                        gameDetails: Array.isArray(detailData.gameDetails) ? detailData.gameDetails : []
                    };
                    return updated;
                });

            } catch (error) {
                console.error('상세정보 로드 실패:', error);
                // 에러 발생 시 해당 카드 접기
                setExpandedCards(prev => ({
                    ...prev,
                    [index]: false
                }));
            } finally {
                setLoadingDetails(prev => ({ ...prev, [index]: false }));
            }
        }
    };

    // 🔥 Early return for invalid props
    if (!Array.isArray(safeSelectedChampions) || safeSelectedChampions.length === 0) {
        return (
            <Paper p="md" withBorder radius="md">
                <Stack gap="md" align="center">
                    <Text ta="center" c="dimmed">
                        유효한 챔피언 데이터가 없습니다.
                    </Text>
                    <Button
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={onBackToSelection}
                        variant="light"
                    >
                        챔피언 선택하러 가기
                    </Button>
                </Stack>
            </Paper>
        );
    }

    if (isLoading && combinationsWithDetails.length === 0) {  // 초기 로딩 시
        return (
            <Paper p="md" withBorder radius="md" style={{ position: 'relative', minHeight: '400px' }}>
                <LoadingOverlay visible={true} />
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper p="md" withBorder radius="md">
                <Stack gap="md">
                    <Text c="red" ta="center">
                        조합 데이터를 불러오는데 실패했습니다: {error?.message || '알 수 없는 오류'}
                    </Text>
                    <Button onClick={onBackToSelection} variant="light">
                        다시 시도하기
                    </Button>
                </Stack>
            </Paper>
        );
    }

    return (
        <Paper p="md" withBorder radius="md">
            <Stack gap="sm">
                {/* 헤더 */}
                <Group justify="space-between" align="center">
                    <Title order={2} c="dark">
                        조합 분석 결과
                    </Title>
                    <Group>
                        <Text size="sm" c="dimmed">
                            {safeSelectedChampions.length}개 챔피언 조합 • 총 {totalCount}개 중 {combinationsWithDetails.length}개 로드
                        </Text>
                        {/* 🔥 정렬 카테고리 추가: Select 컴포넌트 */}
                        <Select
                            size="sm"
                            placeholder="정렬 기준"
                            data={[
                                { value: 'recency', label: '최신순' },
                                { value: 'frequency', label: '빈도순' },
                                { value: 'patch', label: '패치순' }
                            ]}
                            defaultValue="frequency"
                            onChange={(value) => setSort(value)}  // 훅의 setSort 호출
                            styles={{ input: { width: '120px' } }}  // 크기 조정
                        />
                        <Button
                            size="sm"
                            color="gray"
                            leftSection={<IconArrowLeft size={16} />}
                            onClick={onBackToSelection}
                        >
                            돌아가기
                        </Button>
                    </Group>
                </Group>

                {/* 헤더 구분선 */}
                <Divider color="#e9ecef" size="sm" />

                {/* 조합 리스트 */}
                <Stack gap={0}>
                    {combinationsWithDetails.length === 0 ? (
                        <Text ta="center" c="dimmed" py="xl">
                            선택한 조합에 대한 데이터가 없습니다.
                        </Text>
                    ) : (
                        combinationsWithDetails.map((combination, index) => {
                            // 🔥 각 조합에 대한 안전성 검사
                            if (!combination) return null;

                            return (
                                <div key={`combination-${index}-${combination.combinationId}`}>
                                    <div style={{ padding: '12px 0' }}>
                                        <CombinationCard
                                            combination={combination}
                                            isExpanded={expandedCards[index] || false}
                                            onToggle={() => toggleCard(index)}
                                            selectedChampions={safeSelectedChampions}
                                        />
                                    </div>

                                    <Collapse in={expandedCards[index] || false}>
                                        <div style={{ paddingBottom: '12px', position: 'relative' }}>
                                            {loadingDetails[index] && (
                                                <LoadingOverlay visible={true} />
                                            )}

                                            {/* 🔥 조건부 렌더링 개선 */}
                                            {expandedCards[index] && (
                                                <>
                                                    {loadingDetails[index] ? (
                                                        <Text size="sm" c="dimmed" ta="center" py="sm">
                                                            매치 기록을 불러오는 중...
                                                        </Text>
                                                    ) : combination.gameDetails && Array.isArray(combination.gameDetails) && combination.gameDetails.length > 0 ? (
                                                        <MatchHistory
                                                            champions={combination.champions || []}
                                                            gameDetails={combination.gameDetails}
                                                        />
                                                    ) : (
                                                        <Text size="sm" c="dimmed" ta="center" py="sm">
                                                            매치 기록이 없습니다.
                                                        </Text>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </Collapse>

                                    {/* 구분선 (마지막 항목 제외) */}
                                    {index < combinationsWithDetails.length - 1 && (
                                        <Divider color="#e9ecef" size="sm" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </Stack>

                {/* 🔥 Load More: 작은 아래 화살표 아이콘 */}
                {hasMore && (
                    <Group justify="center" mt="md">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="xl"
                            radius="xl"
                            onClick={loadMore}
                            loading={isLoading}
                        >
                            <IconChevronDown size={24} />
                        </ActionIcon>
                    </Group>
                )}
            </Stack>
        </Paper>
    );
};

export default CombinationResults;
