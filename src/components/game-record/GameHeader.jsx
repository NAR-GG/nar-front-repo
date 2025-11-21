// src/components/game-record/GameHeader.jsx
import React from 'react';
import { Paper, Stack, Group, Text, Divider, Flex, Avatar, Center, Box } from '@mantine/core';

// 헬퍼 함수들은 그대로 둡니다.
const getChampionImageUrl = (championName) => {
    const nameMap = { 'Wukong': 'MonkeyKing' };
    const finalName = nameMap[championName] || championName;
    return `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${finalName}.png`;
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const BannedChampion = ({ championName, size = 32 }) => (
    <Box style={{ position: 'relative', display: 'inline-block' }}>
        <Avatar src={getChampionImageUrl(championName)} size={size} radius="sm" />
        <Box
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `calc(${size}px * 0.8)`,
                height: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: 'translate(-50%, -50%) rotate(135deg)',
                borderRadius: '2px',
                boxShadow: '0 0 2px black',
            }}
        />
    </Box>
);


const GameHeader = ({ gameInfo, blueTeam, redTeam }) => {
    // ✅ 이 함수는 이제 데스크톱 전용 렌더링 함수입니다.
    const renderDesktopTeamDisplay = (team, color) => (
        <Stack align="center" gap="lg" style={{ flex: 1 }}>
            <Group gap="sm" align="center">
                <Text size="2rem" fw={800} c={`${color}.7`}>{team.name}</Text>
                {team.result === 1 && <Text size="xl" fw={700} c="dark">(승)</Text>}
            </Group>

            <Flex gap="md" wrap="nowrap" justify="center">
                {team.players.map((player) => (
                    <Stack key={player.participantid} align="center" gap="xs">
                        <Avatar
                            src={getChampionImageUrl(player.champion)}
                            size={64}
                            radius="sm"
                            style={{ border: `2px solid var(--mantine-color-${color}-6)` }}
                        />
                        <Text size="xs" ta="center" c="gray.7" fw={500} w={64} truncate="end">
                            {player.playername}
                        </Text>
                    </Stack>
                ))}
            </Flex>

            <Flex gap="xs" wrap="nowrap" justify="center" mt="sm">
                {team.bans.map((champion, idx) => (
                    <BannedChampion key={idx} championName={champion} size={36} />
                ))}
            </Flex>
        </Stack>
    );

    return (
        <Paper p={{ base: "md", md: "xl" }} withBorder radius="md">
            <Stack gap="xl">
                {/* 게임 기본 정보 (기존과 동일) */}
                <Group justify="space-between" align="center" wrap="wrap">
                    <Group>
                        <Text size="xl" fw={700}>{gameInfo.league}</Text>
                        <Text c="dimmed" size="sm">{gameInfo.split} {gameInfo.playoffs ? 'Playoffs' : 'Regular'}</Text>
                    </Group>
                    <Group c="dimmed" size="xs">
                        <Text>{gameInfo.date}</Text>
                        <Text>Game {gameInfo.game}</Text>
                        <Text>Patch {gameInfo.patch}</Text>
                        <Text>{formatTime(gameInfo.gamelength)}</Text>
                    </Group>
                </Group>

                <Divider />

                {/* --- 🖥️ 데스크톱 뷰 --- */}
                <Group justify="center" gap={80} visibleFrom="sm">
                    {renderDesktopTeamDisplay(blueTeam, 'blue')}
                    <Center><Text size="2rem" fw={700} c="gray.5">VS</Text></Center>
                    {renderDesktopTeamDisplay(redTeam, 'red')}
                </Group>

                {/* --- 📱 모바일 뷰 --- */}
                <Stack gap="xl" hiddenFrom="sm">
                    {/* 블루팀 - 모바일 */}
                    <Stack align="center" gap="md">
                        <Group gap="sm" align="center">
                            <Text size="xl" fw={800} c="blue.7">{blueTeam.name}</Text>
                            {blueTeam.result === 1 && <Text size="lg" fw={700} c="dark">(승)</Text>}
                        </Group>
                        <Flex gap="xs" wrap="nowrap" justify="center">
                            {blueTeam.players.map((player) => (
                                <Stack key={player.participantid} align="center" gap={2}>
                                    <Avatar src={getChampionImageUrl(player.champion)} size={44} radius="sm" style={{ border: '2px solid #228be6' }} />
                                    <Text size="10px" ta="center" c="gray.7" fw={500} w={44} truncate="end">{player.playername}</Text>
                                </Stack>
                            ))}
                        </Flex>
                        <Flex gap={4} wrap="nowrap" justify="center" mt="xs">
                            {blueTeam.bans.map((champion, idx) => (
                                <BannedChampion key={idx} championName={champion} size={28} />
                            ))}
                        </Flex>
                    </Stack>

                    <Center><Text size="xl" fw={700} c="gray.5">VS</Text></Center>

                    {/* 레드팀 - 모바일 */}
                    <Stack align="center" gap="md">
                        <Group gap="sm" align="center">
                            <Text size="xl" fw={800} c="red.7">{redTeam.name}</Text>
                            {redTeam.result === 1 && <Text size="lg" fw={700} c="dark">(승)</Text>}
                        </Group>
                        <Flex gap="xs" wrap="nowrap" justify="center">
                            {redTeam.players.map((player) => (
                                <Stack key={player.participantid} align="center" gap={2}>
                                    <Avatar src={getChampionImageUrl(player.champion)} size={44} radius="sm" style={{ border: '2px solid #fa5252' }} />
                                    <Text size="10px" ta="center" c="gray.7" fw={500} w={44} truncate="end">{player.playername}</Text>
                                </Stack>
                            ))}
                        </Flex>
                        <Flex gap={4} wrap="nowrap" justify="center" mt="xs">
                            {redTeam.bans.map((champion, idx) => (
                                <BannedChampion key={idx} championName={champion} size={28} />
                            ))}
                        </Flex>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default GameHeader;