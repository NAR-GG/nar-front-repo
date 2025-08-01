import React, {useMemo, useState} from 'react';
import { useNavigate } from 'react-router-dom';
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

// 헬퍼 함수: 초를 '분:초' 형식으로 변환
const formatGameTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

/* ────────────────────────────── COMPONENT ────────────────────────────── */
function SchedulePage() {
    // UI 관련 상태는 컴포넌트에 유지
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [expandedId, setExpandedId] = useState(null);

    // ✅ 데이터 관련 로직은 커스텀 훅에 위임
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
    const { data: champions = [], isLoading: championsLoading } = useChampions();

    const championImageMap = useMemo(() => {
        if (!champions || champions.length === 0) return new Map();
        // 백엔드에서 정규화된 영문 이름을 키로 사용
        return new Map(champions.map(c => [c.championNameEn, c.imageUrl]));
    }, [champions]);

    const getChampionImageUrl = (championName) => {
        // Map에서 직접 이미지를 찾고, 없으면 기본 이미지 경로 반환 (안전장치)
        return championImageMap.get(championName) || 'path/to/default/image.png';
    };


    // 주간 날짜 계산 로직
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

    // 상세 정보 펼치기/접기 핸들러
    const handleToggleExpand = (matchId) => {
        const isCurrentlyExpanded = expandedId === matchId;
        if (!isCurrentlyExpanded) {
            fetchMatchDetail(matchId);
        }
        setExpandedId(isCurrentlyExpanded ? null : matchId);
    };

    const handleNavigateToRecord = (gameId) => { navigate(`/record/${gameId}`); };

    /* 렌더링 ----------------------------------------------------------- */
    return (
        <Container size="xl" px={{ base: 12, sm: 24, md: 32 }}>
            <Stack gap="lg" mt="md">
                <Paper p={{ base: 'md', sm: 'xl' }} withBorder bg="white">

                    {/* ─── 주간 캘린더 ─── */}
                    <Paper p="sm" mb="md" bg="gray.0" radius="sm">
                        <Group justify="space-between" mb="sm">
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
                    </Paper>

                    {/* ─── 경기 카드 목록 ─── */}
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

                                        {/* 중앙 매치 정보 */}
                                        {/* Flex 컨테이너 조정 및 내부 Group들의 유연성 확보 */}
                                        <Flex
                                            style={{ flex: 1, minWidth: 0, overflow: 'hidden' }} // overflow: 'hidden' 추가하여 내용이 넘칠 때 처리
                                            justify="center"
                                            align="center"
                                            direction="row"
                                            gap={{ base: 4, sm: 'md' }} // 모바일 간격은 4px로 유지 (팀 이름-스코어)
                                        >
                                            {/* 팀 A */}
                                            <Group
                                                gap={{ base: 4, sm: 'sm' }} // 팀 이름과 스코어 사이 간격. 모바일에서는 4px, 데스크톱에서는 'sm'
                                                justify='flex-end'
                                                // Flex 아이템의 핵심 조정: flex-grow와 flex-shrink는 유지하고, min-width를 auto로 설정하여 유연하게 축소되도록 함
                                                // 텍스트가 줄바꿈되지 않도록 내부 Text에 whiteSpace: 'nowrap' 유지
                                                style={{
                                                    flex: '1 1 auto', // flex-grow 1, flex-shrink 1, flex-basis auto
                                                    minWidth: 0, // Flex 아이템이 내용물보다 작아질 수 있도록 허용 (overflow: hidden과 함께 사용)
                                                    overflow: 'hidden' // 내용이 넘치면 잘라내기
                                                }}
                                            >
                                                <Text
                                                    fw={700}
                                                    size={{ base: 'md', sm: 'lg' }}
                                                    style={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis', // 텍스트가 넘치면 ... 표시
                                                        textAlign: 'right' // 팀 이름이 왼쪽에 붙도록
                                                    }}
                                                >
                                                    {teamNameMap[m.teamA.teamName] || m.teamA.teamName}
                                                </Text>
                                                <Text
                                                    fw={700}
                                                    size={{ base: 'md', sm: 'lg' }}
                                                    c={m.teamA.score > m.teamB.score ? 'black' : 'gray.5'}
                                                    style={{ whiteSpace: 'nowrap', flexShrink: 0 }} // 스코어는 절대 줄어들지 않음
                                                >
                                                    {m.teamA.score}
                                                </Text>
                                            </Group>

                                            <Text fw={500} c="gray.6" size="xs" px="xs" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>VS</Text>

                                            {/* 팀 B */}
                                            <Group
                                                gap={{ base: 4, sm: 'sm' }} // 팀 이름과 스코어 사이 간격
                                                justify='flex-start'
                                                style={{
                                                    flex: '1 1 auto', // flex-grow 1, flex-shrink 1, flex-basis auto
                                                    minWidth: 0,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <Text
                                                    fw={700}
                                                    size={{ base: 'md', sm: 'lg' }}
                                                    c={m.teamB.score > m.teamA.score ? 'black' : 'gray.5'}
                                                    style={{ whiteSpace: 'nowrap', flexShrink: 0 }} // 스코어는 절대 줄어들지 않음
                                                >
                                                    {m.teamB.score}
                                                </Text>
                                                <Text
                                                    fw={700}
                                                    size={{ base: 'md', sm: 'lg' }}
                                                    style={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis', // 텍스트가 넘치면 ... 표시
                                                        textAlign: 'left' // 팀 이름이 오른쪽에 붙도록
                                                    }}
                                                >
                                                    {teamNameMap[m.teamB.teamName] || m.teamB.teamName}
                                                </Text>
                                            </Group>
                                        </Flex>

                                        {/* ✨ isMobile 값에 따라 버튼 또는 아이콘을 조건부 렌더링 */}
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