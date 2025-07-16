import React, { useState, useEffect } from 'react';
import { Container, Stack, Title, Paper, Group, Text, Button, Collapse, LoadingOverlay, Alert } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconArrowLeft } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import CombinationCard from '../components/list/CombinationCard';
import MatchHistory from '../components/detail/MatchHistory';
import { useCombinationResults } from '../hooks/useCombinationResults';

const CombinationResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [expandedCards, setExpandedCards] = useState({});

    // state가 없으면 홈으로 리다이렉트
    const { selectedChampions = [], filters = {} } = location.state || {};

    useEffect(() => {
        if (!location.state || !selectedChampions || selectedChampions.length === 0) {
            navigate('/');
        }
    }, [location.state, selectedChampions, navigate]);

    const { data: combinations = [], isLoading, error } = useCombinationResults(selectedChampions, filters);

    const toggleCard = (index) => {
        setExpandedCards(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // 홈으로 돌아가기
    const handleGoBack = () => {
        navigate('/');
    };

    if (!location.state || !selectedChampions || selectedChampions.length === 0) {
        return (
            <Container size="xl" px={{ base: 16, sm: 24, md: 32 }}>
                <Alert color="yellow" title="잘못된 접근">
                    챔피언을 선택한 후 다시 시도해주세요.
                </Alert>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container size="xl" px={{ base: 16, sm: 24, md: 32 }}>
                <Paper p="md" withBorder radius="md" style={{ position: 'relative', minHeight: '400px' }}>
                    <LoadingOverlay visible={true} />
                </Paper>
            </Container>
        );
    }

    if (error) {
        return (
            <Container size="xl" px={{ base: 16, sm: 24, md: 32 }}>
                <Paper p="md" withBorder radius="md">
                    <Stack gap="md">
                        <Text c="red" ta="center">
                            조합 데이터를 불러오는데 실패했습니다: {error.message}
                        </Text>
                        <Button onClick={handleGoBack} variant="light">
                            다시 시도하기
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="xl" px={{ base: 16, sm: 24, md: 32 }}>
            <Stack gap="lg">
                {/* 헤더 */}
                <Paper p="md" withBorder radius="md">
                    <Group justify="space-between" align="center">
                        <Group>
                            <Button
                                variant="light"
                                size="sm"
                                leftSection={<IconArrowLeft size={16} />}
                                onClick={handleGoBack}
                            >
                                돌아가기
                            </Button>
                            <Title order={2} c="#4c6ef5">
                                조합 분석 결과
                            </Title>
                        </Group>
                        <Text size="sm" c="dimmed">
                            {selectedChampions.length}개 챔피언 조합 • {combinations.length}개 결과
                        </Text>
                    </Group>
                </Paper>

                {/* 조합 리스트 */}
                <Stack gap="md">
                    {combinations.length === 0 ? (
                        <Paper p="md" withBorder radius="md">
                            <Text ta="center" c="dimmed">
                                선택한 조합에 대한 데이터가 없습니다.
                            </Text>
                        </Paper>
                    ) : (
                        combinations.map((combination, index) => (
                            <Paper key={index} p="md" withBorder radius="md">
                                <Stack gap="md">
                                    <CombinationCard
                                        combination={combination}
                                        isExpanded={expandedCards[index]}
                                        onToggle={() => toggleCard(index)}
                                    />

                                    <Collapse in={expandedCards[index]}>
                                        <MatchHistory
                                            champions={combination.champions}
                                            matches={combination.matches}
                                        />
                                    </Collapse>
                                </Stack>
                            </Paper>
                        ))
                    )}
                </Stack>
            </Stack>
        </Container>
    );
};

export default CombinationResultPage;
