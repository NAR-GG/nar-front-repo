// src/components/results/CombinationResults.jsx
import React, { useState } from 'react';
import { Stack, Title, Paper, Group, Text, Button, Collapse, LoadingOverlay, Divider } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import CombinationCard from '../list/CombinationCard';
import MatchHistory from '../detail/MatchHistory';
import { useCombinationResults } from '../../hooks/useCombinationResults';
import { useCombinationDetail } from '../../hooks/useCombinationDetail';

const CombinationResults = ({ selectedChampions, filters, onBackToSelection }) => {
    const [expandedCards, setExpandedCards] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});

    const { data: combinations = [], isLoading, error } = useCombinationResults(selectedChampions, filters);

    const toggleCard = async (index) => {
        const combination = combinations[index];
        const isExpanding = !expandedCards[index];

        // 카드 상태 토글
        setExpandedCards(prev => ({
            ...prev,
            [index]: isExpanding
        }));

        // 확장할 때만 상세정보 로드
        if (isExpanding && combination.combinationId) {
            setLoadingDetails(prev => ({ ...prev, [index]: true }));

            try {
                const response = await fetch(`/api/combinations/${combination.combinationId}/detail`);
                if (!response.ok) {
                    throw new Error('상세정보를 불러오는데 실패했습니다');
                }

                const detailData = await response.json();

                // 조합 데이터에 상세정보 추가
                combinations[index] = {
                    ...combination,
                    gameDetails: detailData.gameDetails || []
                };

            } catch (error) {
                console.error('상세정보 로드 실패:', error);
            } finally {
                setLoadingDetails(prev => ({ ...prev, [index]: false }));
            }
        }
    };

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
                        조합 데이터를 불러오는데 실패했습니다: {error.message}
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
                            {selectedChampions.length}개 챔피언 조합 • {combinations.length}개 결과
                        </Text>
                        <Button
                            variant="light"
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
                    {combinations.length === 0 ? (
                        <Text ta="center" c="dimmed" py="xl">
                            선택한 조합에 대한 데이터가 없습니다.
                        </Text>
                    ) : (
                        combinations.map((combination, index) => (
                            <div key={index}>
                                <div style={{ padding: '12px 0' }}>
                                    <CombinationCard
                                        combination={combination}
                                        isExpanded={expandedCards[index]}
                                        onToggle={() => toggleCard(index)}
                                        selectedChampions={selectedChampions}  // 이 부분이 있는지 확인
                                    />
                                </div>

                                <Collapse in={expandedCards[index]}>
                                    <div style={{ paddingBottom: '12px', position: 'relative' }}>
                                        {loadingDetails[index] && (
                                            <LoadingOverlay visible={true} />
                                        )}
                                        <MatchHistory
                                            champions={combination.champions}
                                            gameDetails={combination.gameDetails || []}
                                        />
                                    </div>
                                </Collapse>

                                {/* 구분선 (마지막 항목 제외) */}
                                {index < combinations.length - 1 && (
                                    <Divider color="#e9ecef" size="sm" />
                                )}
                            </div>
                        ))
                    )}
                </Stack>
            </Stack>
        </Paper>
    );
};

export default CombinationResults;
