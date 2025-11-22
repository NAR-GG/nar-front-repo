import React, { useMemo, useState, useEffect } from 'react'; // ✅ useEffect 추가
import { useNavigate, useSearchParams } from 'react-router-dom'; // ✅ useSearchParams 추가
import {
    Container,
    Stack,
    Paper,
    Group,
    Text,
    ActionIcon,
    Button,
    Box,
    Card,
    Collapse,
    Flex,
    ScrollArea,
    Center,
    Avatar,
    Loader
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconCalendar, IconChevronDown } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useSchedule } from '../hooks/useSchedule';
import { useChampions } from '../hooks/useChampions';

const teamNameMap = {
    'Bnk Fearx': 'BFX',
    'Dplus Kia': 'DK',
    'Kt Rolster': 'KT',
    'Nongshim Redforce': 'NS',
    'Hanwha Life Esports': 'HLE',
    'Gen.g': 'GEN',
    'T1': 'T1',
    'Oksavingsbank Brion': 'BRO',
    'Drx': 'DRX',
    'Dn Freecs': 'DNF',
};

const formatGameTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

function SchedulePage() {
    // ✅ 1. URL의 쿼리 파라미터를 읽고 쓸 수 있는 훅을 선언합니다.
    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ 2. 페이지가 처음 로드될 때 URL에서 날짜를 읽어 초기 상태를 설정합니다.
    const initializeDate = () => {
        const dateParam = searchParams.get('date');
        // URL에 유효한 날짜 값이 있으면 그 날짜로, 없으면 오늘 날짜로 시작합니다.
        if (dateParam && !isNaN(new Date(dateParam))) {
            return new Date(dateParam);
        }
        return new Date();
    };

    const [selectedDate, setSelectedDate] = useState(initializeDate);
    const [expandedId, setExpandedId] = useState(null);

    const {
        scheduleData,
        matchDetails,
        loading,
        detailLoading,
        error,
        fetchMatchDetail
    } = useSchedule(selectedDate);

    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const { data: champions = [] } = useChampions();

    // ✅ 3. selectedDate 상태가 변경될 때마다 URL의 쿼리 파라미터를 업데이트합니다.
    useEffect(() => {
        // 년, 월, 일을 로컬 시간대 기준으로 가져옵니다.
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`; // 'YYYY-MM-DD' 형식 완성

        if (searchParams.get('date') !== dateString) {
            setSearchParams({ date: dateString });
        }
    }, [selectedDate, searchParams, setSearchParams]);


    const championImageMap = useMemo(() => {
        if (!champions || champions.length === 0) return new Map();
        return new Map(champions.map(c => [c.championNameEn, c.imageUrl]));
    }, [champions]);

    const getChampionImageUrl = (championName) => {
        return championImageMap.get(championName) || `path/to/default/image.png`;
    };

    const getWeek = (d) => {
        const week = [];
        const tmp = new Date(d);
        const day = tmp.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        tmp.setDate(tmp.getDate() + diff);
        for (let i = 0; i < 7; i++) {
            week.push(new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate() + i));
        }
        return week;
    };
    const weekDates = getWeek(selectedDate);

    const handleToggleExpand = (matchId) => {
        const isCurrentlyExpanded = expandedId === matchId;
        if (!isCurrentlyExpanded) {
            fetchMatchDetail(matchId);
        }
        setExpandedId(isCurrentlyExpanded ? null : matchId);
    };

    const handleNavigateToRecord = (gameId) => { navigate(`/record/${gameId}`); };

    return (
        <Container size="xl" px={{ base: 12, sm: 24, md: 32 }}>
            <Stack gap="lg" mt="md">
                <Paper p={{ base: 'md', sm: 'xl' }} withBorder bg="white">
                    <Paper p="sm" mb="md" bg="gray.0" radius="sm">
                        <Group justify="space-between" mb="sm">
                            {/* 날짜 변경 버튼들은 기존과 동일하게 setSelectedDate만 호출하면 됩니다. */}
                            <ActionIcon variant="light" onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}><IconChevronLeft size={18} /></ActionIcon>
                            <Group gap="xs">
                                <IconCalendar size={16} color="var(--mantine-color-blue-6)" />
                                <Text fw={600}>{selectedDate.getFullYear()}.{String(selectedDate.getMonth() + 1).padStart(2, '0')}</Text>
                            </Group>
                            <ActionIcon variant="light" onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}><IconChevronRight size={18} /></ActionIcon>
                        </Group>
                        <Center>
                            <ScrollArea type="never" style={{ width: '100%' }}>
                                <Flex gap="xs" justify="center" wrap="nowrap" style={{ minWidth: 'max-content' }}>
                                    {weekDates.map((date, idx) => {
                                        const isSel = date.toDateString() === selectedDate.toDateString();
                                        const isToday = date.toDateString() === new Date().toDateString();
                                        return (
                                            <Button key={idx} size="sm" variant={isSel ? 'filled' : 'light'} color={isSel ? 'blue' : isToday ? 'blue' : 'gray'} onClick={() => setSelectedDate(date)} style={{ minWidth: 50, height: 60, flexDirection: 'column', padding: 8 }}>
                                                <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
                                                    <Text size="xs" fw={500} c={isSel ? 'white' : isToday ? 'blue' : 'dimmed'} style={{ marginBottom: '2px' }}>{dayNames[idx]}</Text>
                                                    <Text size="sm" fw={700} c={isSel ? 'white' : isToday ? 'blue' : 'dark'}>{date.getDate()}</Text>
                                                    {isToday && !isSel && <Box w={4} h={4} bg="blue" style={{ borderRadius: '50%', margin: '2px auto 0' }} />}
                                                </div>
                                            </Button>
                                        );
                                    })}
                                </Flex>
                            </ScrollArea>
                        </Center>
                        <Text c="dimmed" size="xs" ta="center" mt="xs">
                            경기 데이터는 실제 경기 종료 후 약 24시간 내에 업데이트됩니다.
                        </Text>
                    </Paper>

                    {/* ... (이하 경기 카드 목록 렌더링 코드는 변경 없음) ... */}
                    <Stack gap="sm">
                        {loading ? (
                            <Center p="xl"><Loader /></Center>
                        ) : error ? (
                            <Center p="xl"><Text c="red">{error}</Text></Center>
                        ) : scheduleData.matches.length === 0 ? (
                            <Center p="xl"><Text c="dimmed">해당 날짜에 경기 일정이 없습니다.</Text></Center>
                        ) : (
                            scheduleData.matches.map((m) => (
                                <Card key={m.matchId} p="sm" withBorder radius="sm" bg="gray.0">
                                    <Group justify="space-between" align="center">
                                        <Text fw={600} size="sm" c="blue.6" w={{ base: 45, sm: 50 }}>
                                            {m.scheduledTime}
                                        </Text>
                                        <Flex style={{ flex: 1, minWidth: 0, overflow: 'hidden' }} justify="center" align="center" direction="row" gap={{ base: 4, sm: 'md' }}>
                                            <Group gap={{ base: 4, sm: 'sm' }} justify='flex-end' style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden' }}>
                                                <Text fw={700} size={{ base: 'md', sm: 'lg' }} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right' }}>
                                                    {teamNameMap[m.teamA.teamName] || m.teamA.teamName}
                                                </Text>
                                                <Text fw={700} size={{ base: 'md', sm: 'lg' }} c={m.teamA.score > m.teamB.score ? 'black' : 'gray.5'} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                    {m.teamA.score}
                                                </Text>
                                            </Group>
                                            <Text fw={500} c="gray.6" size="xs" px="xs" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>VS</Text>
                                            <Group gap={{ base: 4, sm: 'sm' }} justify='flex-start' style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden' }}>
                                                <Text fw={700} size={{ base: 'md', sm: 'lg' }} c={m.teamB.score > m.teamA.score ? 'black' : 'gray.5'} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                    {m.teamB.score}
                                                </Text>
                                                <Text fw={700} size={{ base: 'md', sm: 'lg' }} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                                                    {teamNameMap[m.teamB.teamName] || m.teamB.teamName}
                                                </Text>
                                            </Group>
                                        </Flex>
                                        {isMobile ? (
                                            <ActionIcon variant="light" color="gray" onClick={() => handleToggleExpand(m.matchId)}>
                                                <IconChevronDown size={18} />
                                            </ActionIcon>
                                        ) : (
                                            <Button size="xs" variant="outline" onClick={() => handleToggleExpand(m.matchId)}>
                                                상세정보
                                            </Button>
                                        )}
                                    </Group>
                                    <Collapse in={expandedId === m.matchId}>
                                        {detailLoading[m.matchId] ? (
                                            <Center p="md"><Loader size="sm" /></Center>
                                        ) : matchDetails[m.matchId] ? (
                                            <Stack mt="sm" gap="md">
                                                {matchDetails[m.matchId].gameDetails.map((game) => {
                                                    const winnerSide = game.blueTeam.isWin ? 'blue' : 'red';
                                                    return (
                                                        <Paper key={game.gameNumber} p="md" bg="white" radius="md" withBorder>
                                                            <Stack gap="sm">
                                                                <Group justify="space-between" align="center">
                                                                    <Group gap="sm">
                                                                        <Text fw={600} size="sm">Game {game.gameNumber}</Text>
                                                                        <Text size="xs" c="dimmed">{formatGameTime(game.gameLengthSeconds)}</Text>
                                                                    </Group>
                                                                    <Button size="xs" variant="light" color="gray" onClick={() => handleNavigateToRecord(game.id)}>기록</Button>
                                                                </Group>
                                                                <Group justify="center" align="flex-start" gap="md">
                                                                    <Stack gap="xs" align="center">
                                                                        <Group gap="xs" align="center">
                                                                            <Text size="xs" fw={600}>{teamNameMap[game.blueTeam.teamName] || game.blueTeam.teamName} <Text component="span" c={winnerSide === 'blue' ? "blue" : "gray.6"} fw={700}>({winnerSide === 'blue' ? '승' : '패'})</Text></Text>
                                                                        </Group>
                                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                                            {game.blueTeam.players.map((player) => (
                                                                                <div key={player.playerName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' }}>
                                                                                    <Avatar src={getChampionImageUrl(player.championName)} size={32} radius="md" />
                                                                                    <Text size="xs" mt={2} style={{ textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.playerName}</Text>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </Stack>
                                                                    <div style={{ display: 'flex', alignItems: 'center', height: '32px', paddingTop: '16px' }}><Text size="sm" fw={600} c="dimmed">vs</Text></div>
                                                                    <Stack gap="xs" align="center">
                                                                        <Group gap="xs" align="center">
                                                                            <Text size="xs" fw={600}>{teamNameMap[game.redTeam.teamName] || game.redTeam.teamName} <Text component="span" c={winnerSide === 'red' ? "red" : "gray.6"} fw={700}>({winnerSide === 'red' ? '승' : '패'})</Text></Text>
                                                                        </Group>
                                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                                            {game.redTeam.players.map((player) => (
                                                                                <div key={player.playerName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' }}>
                                                                                    <Avatar src={getChampionImageUrl(player.championName)} size={32} radius="md" />
                                                                                    <Text size="xs" mt={2} style={{ textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.playerName}</Text>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </Stack>
                                                                </Group>
                                                            </Stack>
                                                        </Paper>
                                                    );
                                                })}
                                            </Stack>
                                        ) : null}
                                    </Collapse>
                                </Card>
                            ))
                        )}
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
}

export default SchedulePage;