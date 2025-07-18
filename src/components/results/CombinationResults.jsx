import React, { useState, useEffect, useRef } from 'react';
import { Stack, Title, Paper, Group, Text, Button, Collapse, LoadingOverlay, Divider } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import CombinationCard from '../list/CombinationCard';
import MatchHistory from '../detail/MatchHistory';
import { useCombinationResults } from '../../hooks/useCombinationResults';

const CombinationResults = ({ selectedChampions = [], filters = {}, onBackToSelection }) => {
    const [expandedCards, setExpandedCards] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});
    const [combinationsWithDetails, setCombinationsWithDetails] = useState([]);

    // 🔥 이전 조합 데이터 참조를 위한 ref
    const previousCombinationsRef = useRef(null);

    // 🔥 안전한 기본값 설정
    const safeSelectedChampions = Array.isArray(selectedChampions) ? selectedChampions : [];
    const safeFilters = filters || {};

    const { data: combinations = [], isLoading, error } = useCombinationResults(safeSelectedChampions, safeFilters);

    // 🔥 조합 데이터가 실제로 변경되었을 때만 상태 업데이트
    useEffect(() => {
        // 이전 데이터와 비교하여 실제로 변경되었는지 확인
        const currentCombinationsString = JSON.stringify(combinations);
        const previousCombinationsString = JSON.stringify(previousCombinationsRef.current);

        if (currentCombinationsString !== previousCombinationsString) {
            // 상태 초기화
            setExpandedCards({});
            setLoadingDetails({});

            // 새로운 조합 데이터로 초기화
            const resetCombinations = Array.isArray(combinations)
                ? combinations.map(combination => ({
                    ...combination,
                    gameDetails: undefined
                }))
                : [];

            setCombinationsWithDetails(resetCombinations);
            previousCombinationsRef.current = combinations;
        }
    }, [combinations]);

    // 🔥 선택된 챔피언이나 필터 변경 시 상태 초기화
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
                <Text ta="center" c="dimmed">
                    유효한 챔피언 데이터가 없습니다.
                </Text>
            </Paper>
        );
    }

    if (isLoading) {
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
                            {safeSelectedChampions.length}개 챔피언 조합 • {combinationsWithDetails.length}개 결과
                        </Text>
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
            </Stack>
        </Paper>
    );
};

export default CombinationResults;
