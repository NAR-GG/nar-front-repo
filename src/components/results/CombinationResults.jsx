import React, { useState } from 'react';
import {
    Stack,
    Title,
    Paper,
    Group,
    Text,
    Button,
    Collapse,
    LoadingOverlay,
    Divider,
    ActionIcon,
    Select,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowLeft, IconChevronDown } from '@tabler/icons-react';

// 역할에 맞는 컴포넌트 및 훅 import
import CombinationCard from '../list/CombinationCard';
import CombinationDetail from '../detail/CombinationDetail'; // 상세 정보 표시를 책임지는 자식 컴포넌트
import { useCombinationResults } from '../../hooks/useCombinationResults';

/**
 * 조합 '리스트' 렌더링과 사용자 인터랙션(정렬, 더보기 등)을 책임지는 컴포넌트.
 *
 * @param {Array} selectedChampions - 사용자가 선택한 챔피언 목록
 * @param {Object} filters - 적용된 필터 (예: 티어, 지역)
 * @param {Function} onBackToSelection - '돌아가기' 버튼 클릭 시 실행될 함수
 */
const CombinationResults = ({ selectedChampions = [], filters = {}, onBackToSelection }) => {
    const [expandedCards, setExpandedCards] = useState({});
    const isMobile = useMediaQuery('(max-width: 768px)');

    const safeSelectedChampions = Array.isArray(selectedChampions) ? selectedChampions : [];
    const safeFilters = filters || {};

    // 조합 '목록'을 가져오는 책임은 useCombinationResults 훅이 담당
    const {
        data: combinations = [],
        isLoading,
        error,
        hasMore,
        totalCount,
        loadMore,
        setSort,
    } = useCombinationResults(safeSelectedChampions, safeFilters);

    // 카드의 확장/축소 상태만 관리하는 간단한 토글 함수
    const toggleCard = (index) => {
        setExpandedCards((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // 1. 유효성 검사
    if (!safeSelectedChampions.length) {
        return (
            <Paper p="md" withBorder radius="md">
                <Stack gap="md" align="center">
                    <Text ta="center" c="dimmed">
                        유효한 챔피언 데이터가 없습니다.
                    </Text>
                    <Button leftSection={<IconArrowLeft size={16} />} onClick={onBackToSelection} variant="light">
                        챔피언 선택하러 가기
                    </Button>
                </Stack>
            </Paper>
        );
    }

    // 3. 목록 조회 에러 처리 (초기 로딩 if는 제거하고 아래에서 처리)
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

    // 헤더 렌더링 함수
    const renderHeader = () => {
        const loadText = (
            <Text size="sm" c="dimmed">
                {safeSelectedChampions.length}개 챔피언 조합 • 총 {totalCount}개 중 {combinations.length}개 로드
            </Text>
        );

        const sortSelect = (
            <Select
                size="sm"
                placeholder="정렬 기준"
                data={[
                    { value: 'frequency', label: '빈도순' },
                    { value: 'recency', label: '최신순' },
                    { value: 'patch', label: '패치순' },
                ]}
                defaultValue="frequency"
                onChange={(value) => setSort(value || 'frequency')}
                styles={{ input: { width: '120px' } }}
                allowDeselect={false}
            />
        );

        const backButton = (
            <Button size="sm" color="gray" leftSection={<IconArrowLeft size={16} />} onClick={onBackToSelection}>
                돌아가기
            </Button>
        );

        if (isMobile) {
            return (
                <Stack gap="xs">
                    <Title order={2} c="dark">조합 분석 결과</Title>
                    {loadText}
                    <Group justify="flex-end" gap="xs">
                        {sortSelect}
                        {backButton}
                    </Group>
                </Stack>
            );
        }

        return (
            <Group justify="space-between" align="center">
                <Title order={2} c="dark">조합 분석 결과</Title>
                <Group>
                    {loadText}
                    {sortSelect}
                    {backButton}
                </Group>
            </Group>
        );
    };

    // 4. 최종 UI 렌더링
    return (
        <Paper p="md" withBorder radius="md" style={{ position: 'relative', minHeight: '400px' }}>
            <LoadingOverlay visible={isLoading && !combinations.length} />

            {!(isLoading && !combinations.length) && (
                <Stack gap="sm">
                    {renderHeader()}

                    <Divider color="#e9ecef" size="sm" />

                    <Stack gap={0}>
                        {!isLoading && !combinations.length ? (
                            <Text ta="center" c="dimmed" py="xl">
                                선택한 조합에 대한 데이터가 없습니다.
                            </Text>
                        ) : (
                            combinations.map((combination, index) => {
                                if (!combination) return null; // 데이터 안정성 확보
                                const isExpanded = expandedCards[index] || false;

                                return (
                                    <div key={`combination-${index}-${combination.combinationId}`}>
                                        <div style={{ padding: '12px 0', cursor: 'pointer' }} onClick={() => toggleCard(index)}>
                                            <CombinationCard
                                                combination={combination}
                                                isExpanded={isExpanded}
                                                selectedChampions={safeSelectedChampions}
                                            />
                                        </div>
                                        <Collapse in={isExpanded}>
                                            <div style={{ padding: '0 8px 12px 8px' }}>
                                                {/* ✅ 역할 위임: 카드가 확장되었을 때만 CombinationDetail 렌더링 */}
                                                {isExpanded && <CombinationDetail combination={combination} />}
                                            </div>
                                        </Collapse>
                                        {index < combinations.length - 1 && <Divider color="#e9ecef" size="sm" />}
                                    </div>
                                );
                            })
                        )}
                    </Stack>

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
            )}
        </Paper>
    );
};

export default CombinationResults;
