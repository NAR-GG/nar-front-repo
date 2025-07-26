import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import {
    Container,
    Stack,
    Paper,
    Title,
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
    Avatar
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconCalendar } from '@tabler/icons-react';

/* ────────────────────────────── MOCK DATA ────────────────────────────── */
const mockMatches = [
    {
        id: 1,
        time: '17:00',
        team1: { name: 'T1' },
        team2: { name: 'GEN' },
        games: [
            {
                id: 1,
                gameId: 'T1_vs_GEN_game1', // 기록 페이지로 이동할 때 사용할 고유 ID
                winnerSide: 'blue',
                blueTeam: {
                    name: 'T1',
                    players: [
                        { championName: 'Gnar', playerName: 'Zeus' },
                        { championName: 'Viego', playerName: 'Oner' },
                        { championName: 'Azir', playerName: 'Faker' },
                        { championName: 'Jinx', playerName: 'Gumayusi' },
                        { championName: 'Leona', playerName: 'Keria' }
                    ]
                },
                redTeam: {
                    name: 'GEN',
                    players: [
                        { championName: 'Aatrox', playerName: 'Kiin' },
                        { championName: 'Graves', playerName: 'Canyon' },
                        { championName: 'Orianna', playerName: 'Chovy' },
                        { championName: 'Aphelios', playerName: 'Peyz' },
                        { championName: 'Alistar', playerName: 'Lehends' }
                    ]
                },
                gameTime: '28:45'
            },
            {
                id: 2,
                gameId: 'T1_vs_GEN_game2',
                winnerSide: 'red',
                blueTeam: {
                    name: 'GEN',
                    players: [
                        { championName: 'Renekton', playerName: 'Kiin' },
                        { championName: 'Nidalee', playerName: 'Canyon' },
                        { championName: 'Galio', playerName: 'Chovy' },
                        { championName: 'Kalista', playerName: 'Peyz' },
                        { championName: 'Nautilus', playerName: 'Lehends' }
                    ]
                },
                redTeam: {
                    name: 'T1',
                    players: [
                        { championName: 'Jayce', playerName: 'Zeus' },
                        { championName: 'Kindred', playerName: 'Oner' },
                        { championName: 'Sylas', playerName: 'Faker' },
                        { championName: 'Xayah', playerName: 'Gumayusi' },
                        { championName: 'Rakan', playerName: 'Keria' }
                    ]
                },
                gameTime: '35:12'
            },
            {
                id: 3,
                gameId: 'T1_vs_GEN_game3',
                winnerSide: 'blue',
                blueTeam: {
                    name: 'T1',
                    players: [
                        { championName: 'Ornn', playerName: 'Zeus' },
                        { championName: 'Sejuani', playerName: 'Oner' },
                        { championName: 'Galio', playerName: 'Faker' },
                        { championName: 'Sivir', playerName: 'Gumayusi' },
                        { championName: 'Yuumi', playerName: 'Keria' }
                    ]
                },
                redTeam: {
                    name: 'GEN',
                    players: [
                        { championName: 'Fiora', playerName: 'Kiin' },
                        { championName: 'Elise', playerName: 'Canyon' },
                        { championName: 'Yasuo', playerName: 'Chovy' },
                        { championName: 'Zeri', playerName: 'Peyz' },
                        { championName: 'Lulu', playerName: 'Lehends' }
                    ]
                },
                gameTime: '42:33'
            }
        ]
    },
    {
        id: 2,
        time: '19:00',
        team1: { name: 'DRX' },
        team2: { name: 'KT' },
        games: [
            {
                id: 1,
                gameId: 'DRX_vs_KT_game1',
                winnerSide: 'red',
                blueTeam: {
                    name: 'DRX',
                    players: [
                        { championName: 'Camille', playerName: 'Kingen' },
                        { championName: 'Hecarim', playerName: 'Juhan' },
                        { championName: 'Corki', playerName: 'FATE' },
                        { championName: 'Ezreal', playerName: 'Teddy' },
                        { championName: 'Thresh', playerName: 'BeryL' }
                    ]
                },
                redTeam: {
                    name: 'KT',
                    players: [
                        { championName: 'Kennen', playerName: 'Kiin' },
                        { championName: 'Nocturne', playerName: 'Pyosik' },
                        { championName: 'Viktor', playerName: 'Bdd' },
                        { championName: 'Lucian', playerName: 'Aiming' },
                        { championName: 'Braum', playerName: 'Effort' }
                    ]
                },
                gameTime: '31:22'
            }
        ]
    }
];

// 챔피언 이미지 URL 생성 함수
const getChampionImageUrl = (championName) => {
    const imageNameMap = {
        'Drmundo': 'DrMundo',
        'Jarvaniv': 'JarvanIV',
        'Kogmaw': 'KogMaw',
        'Leesin': 'LeeSin',
        'Masteryi': 'MasterYi',
        'Missfortune': 'MissFortune',
        'Monkeyking': 'MonkeyKing',
        'Twistedfate': 'TwistedFate',
        'Velkoz': 'Velkoz',
        'Xinzhao': 'XinZhao'
    };

    const imageName = imageNameMap[championName] || championName;
    return `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${imageName}.png`;
};

/* ────────────────────────────── COMPONENT ────────────────────────────── */
function SchedulePage() {
    /* 캘린더 관련 상태 --------------------------------------------- */
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [expandedId, setExpandedId] = useState(null);
    const navigate = useNavigate(); // navigate 훅 추가

    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

    // 월요일부터 시작하는 주간 날짜 계산
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

    // 기록 페이지로 이동하는 함수
    const handleNavigateToRecord = (gameId) => {
        navigate(`/record/${gameId}`);
    };

    /* 렌더 ----------------------------------------------------------- */
    return (
        <Container size="xl" px={{ base: 12, sm: 24, md: 32 }}>
            <Stack gap="lg" mt="md">
                <Paper p={{ base: 'md', sm: 'xl' }} withBorder bg="white">
                    <Title order={2} mb="lg" size={{ base: 'h3', sm: 'h2' }}>
                        LCK 일정
                    </Title>

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

                        {/* 가운데 정렬된 요일·일수 */}
                        <Center>
                            <ScrollArea type="never" style={{ width: '100%' }}>
                                <Flex gap="xs" justify="center" wrap="nowrap" style={{ minWidth: 'max-content' }}>
                                    {weekDates.map((date, idx) => {
                                        const isSel = date.toDateString() === selectedDate.toDateString();
                                        const isToday = date.toDateString() === new Date().toDateString();
                                        return (
                                            <Button
                                                key={idx}
                                                size="sm"
                                                variant={isSel ? 'filled' : 'light'}
                                                color={isSel ? 'blue' : isToday ? 'blue' : 'gray'}
                                                onClick={() => setSelectedDate(date)}
                                                style={{ minWidth: 50, height: 60, flexDirection: 'column', padding: 8 }}
                                            >
                                                <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
                                                    <div>
                                                        <Text size="xs" fw={500} c={isSel ? 'white' : isToday ? 'blue' : 'dimmed'} style={{ marginBottom: '2px' }}>
                                                            {dayNames[idx]}
                                                        </Text>
                                                    </div>
                                                    <div>
                                                        <Text size="sm" fw={700} c={isSel ? 'white' : isToday ? 'blue' : 'dark'}>
                                                            {date.getDate()}
                                                        </Text>
                                                    </div>
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
                        {mockMatches.map((m) => (
                            <Card key={m.id} p="sm" withBorder radius="sm" bg="gray.0">
                                {/* 카드 상단(기본 정보 + 상세정보 버튼) */}
                                <Group justify="space-between" align="center">
                                    <Group gap="md" align="center">
                                        <Text fw={600} size="sm" c="blue.6" w={50}>{m.time}</Text>
                                        <Group gap="xs" align="center">
                                            <Text fw={600}>{m.team1.name}</Text>
                                            <Text c="gray.6" fw={500}>VS</Text>
                                            <Text fw={600}>{m.team2.name}</Text>
                                        </Group>
                                    </Group>

                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                                    >
                                        상세정보
                                    </Button>
                                </Group>

                                {/* 펼쳐지는 상세 정보(게임별 챔피언 조합) */}
                                <Collapse in={expandedId === m.id}>
                                    <Stack mt="sm" gap="md">
                                        {m.games.map((game) => (
                                            <Paper key={game.id} p="md" bg="white" radius="md" withBorder>
                                                <Stack gap="sm">
                                                    {/* 게임 헤더 */}
                                                    <Group justify="space-between" align="center">
                                                        <Group gap="sm">
                                                            <Text fw={600} size="sm">Game {game.id}</Text>
                                                            <Text size="xs" c="dimmed">{game.gameTime}</Text>
                                                        </Group>
                                                        <Button
                                                            size="xs"
                                                            variant="light"
                                                            color="gray"
                                                            onClick={() => handleNavigateToRecord(game.gameId)} // 클릭 이벤트 추가
                                                        >
                                                            기록
                                                        </Button>
                                                    </Group>

                                                    {/* 챔피언 조합 vs 구도 */}
                                                    <Group justify="center" align="flex-start" gap="md">
                                                        {/* 블루사이드 (왼쪽) */}
                                                        <Stack gap="xs" align="center">
                                                            <Group gap="xs" align="center">
                                                                <Text size="xs" fw={600}>
                                                                    {game.blueTeam.name}
                                                                    {game.winnerSide === 'blue' ? (
                                                                        <Text component="span" c="blue" fw={700} ml={4}>(승)</Text>
                                                                    ) : (
                                                                        <Text component="span" c="gray.6" fw={700} ml={4}>(패)</Text>
                                                                    )}
                                                                </Text>
                                                            </Group>
                                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                                {game.blueTeam.players.map((player, idx) => (
                                                                    <div key={idx} style={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        width: '40px'
                                                                    }}>
                                                                        <Avatar
                                                                            src={getChampionImageUrl(player.championName)}
                                                                            size={32}
                                                                            radius="md"
                                                                        />
                                                                        <Text
                                                                            size="xs"
                                                                            mt={2}
                                                                            style={{
                                                                                textAlign: 'center',
                                                                                width: '100%',
                                                                                whiteSpace: 'nowrap',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis'
                                                                            }}
                                                                        >
                                                                            {player.playerName}
                                                                        </Text>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Stack>

                                                        {/* VS */}
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            height: '32px',
                                                            paddingTop: '16px'
                                                        }}>
                                                            <Text size="sm" fw={600} c="dimmed">
                                                                vs
                                                            </Text>
                                                        </div>

                                                        {/* 레드사이드 (오른쪽) */}
                                                        <Stack gap="xs" align="center">
                                                            <Group gap="xs" align="center">
                                                                <Text size="xs" fw={600}>
                                                                    {game.redTeam.name}
                                                                    {game.winnerSide === 'red' ? (
                                                                        <Text component="span" c="blue" fw={700} ml={4}>(승)</Text>
                                                                    ) : (
                                                                        <Text component="span" c="gray.6" fw={700} ml={4}>(패)</Text>
                                                                    )}
                                                                </Text>
                                                            </Group>
                                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                                {game.redTeam.players.map((player, idx) => (
                                                                    <div key={idx} style={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        width: '40px'
                                                                    }}>
                                                                        <Avatar
                                                                            src={getChampionImageUrl(player.championName)}
                                                                            size={32}
                                                                            radius="md"
                                                                        />
                                                                        <Text
                                                                            size="xs"
                                                                            mt={2}
                                                                            style={{
                                                                                textAlign: 'center',
                                                                                width: '100%',
                                                                                whiteSpace: 'nowrap',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis'
                                                                            }}
                                                                        >
                                                                            {player.playerName}
                                                                        </Text>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </Stack>
                                                    </Group>
                                                </Stack>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </Collapse>
                            </Card>
                        ))}
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
}

export default SchedulePage;
