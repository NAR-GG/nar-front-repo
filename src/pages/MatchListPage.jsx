import React, { useState, useMemo } from 'react';
import { Container, Stack, Paper, Loader, Center, Text, Pagination, Group, Divider } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import FilterSection from '../components/layout/FilterSection';
import GameRow from '../components/list/GameRow';
import { useRecentMatches } from '../hooks/useRecentMatches';
import { useChampions } from '../hooks/useChampions';

const DateHeader = ({ date }) => (
    <Group gap="xs" my="md">
        <Text size="md" fw={700} c="dark.2">
            {date}
        </Text>
    </Group>
);

const MatchListPage = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        leagueNames: ['LCK'],
        splitNames: [],
        teamNames: []
    });
    const [activePage, setActivePage] = useState(1);
    const [sort, setSort] = useState('DESC');

    const { data: matchData, loading, error } = useRecentMatches(filters, activePage - 1, sort);
    const { data: champions = [] } = useChampions();

    const championImageMap = useMemo(() => {
        if (!champions || champions.length === 0) return new Map();
        return new Map(champions.map(c => [c.championNameEn, c.imageUrl]));
    }, [champions]);

    const getChampionImageUrl = (championName) => {
        const imageNameMap = { 'Jarvaniv': 'JarvanIV', 'Monkeyking': 'MonkeyKing', };
        const mappedName = imageNameMap[championName] || championName;
        return championImageMap.get(mappedName) || `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${mappedName}.png`;
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
        setActivePage(1);
    };

    const handleNavigateToRecord = (gameId) => {
        navigate(`/record/${gameId}`);
    };

    const renderGameRows = () => {
        if (!matchData?.content) return null;

        let lastDate = null;
        const elements = [];

        matchData.content.forEach(game => {
            const gameDateStr = new Date(game.gameDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (gameDateStr !== lastDate) {
                elements.push(<DateHeader key={gameDateStr} date={gameDateStr} />);
                lastDate = gameDateStr;
            }

            // GameRow 추가
            elements.push(
                <GameRow
                    key={game.gameId}
                    game={game}
                    getChampionImageUrl={getChampionImageUrl}
                    onNavigateToRecord={handleNavigateToRecord}
                />
            );
        });

        return elements;
    };


    return (
        <Container size="xl" px={{ base: 16, sm: 24, md: 32 }}>
            <Stack gap="xl" my="md">
                <FilterSection
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    isSearchable={false} // "조합 보기" 버튼 숨김
                    sort={sort}           // 현재 정렬 상태 전달
                    onSortChange={setSort}  // 정렬 변경 시 setSort 함수 호출
                />

                <Stack gap="md">
                    {loading && <Center p="xl"><Loader /></Center>}
                    {error && <Center p="xl"><Text c="red">{error}</Text></Center>}
                    {!loading && !error && matchData.content.length === 0 && (
                        <Paper withBorder p="xl" radius="md">
                            <Center><Text c="dimmed">조건에 맞는 경기 기록이 없습니다.</Text></Center>
                        </Paper>
                    )}
                    {!loading && !error && renderGameRows()}
                </Stack>

                {matchData.totalPages > 1 && (
                    <Group justify="center">
                        <Pagination
                            total={matchData.totalPages}
                            value={activePage}
                            onChange={setActivePage}
                        />
                    </Group>
                )}
            </Stack>
        </Container>
    );
};

export default MatchListPage;