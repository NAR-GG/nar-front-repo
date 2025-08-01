// src/components/game-record/GameHeader.jsx
import React from 'react';
import { Paper, Stack, Group, Text, Divider, Flex, Avatar, Center, Box } from '@mantine/core';

const formatTime = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// ✅ [수정] getChampionImageUrl를 props로 받도록 변경
const GameHeader = ({ gameInfo, blueTeam, redTeam, getChampionImageUrl }) => {
    // ✅ BannedChampion 컴포넌트를 내부로 옮겨 getChampionImageUrl 함수에 쉽게 접근하도록 함
    const BannedChampion = ({ championName, size = 32 }) => (
        <Box style={{ position: 'relative' }}>
            <Avatar src={getChampionImageUrl(championName)} size={size} radius="sm" />
            <Box
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: `calc(${size}px * 0.8)`,
                    height: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    borderRadius: '2px',
                    boxShadow: '0 0 2px black',
                }}
            />
        </Box>
    );

    const renderTeamDisplay = (team, color) => (
        <Stack align="center" gap="lg" style={{ flex: 1, minWidth: 0 }}>
            <Group>
                <Text size="2rem" fw={800} c={`${color}.7`}>{team.name}</Text>
                {team.result === 1 && <Text size="xl" fw={700} c="dark">(승)</Text>}
            </Group>
            <Flex gap="md" justify="center">
                {team.players.map((player) => (
                    <Stack key={player.participantid} align="center" gap="xs">
                        <Avatar
                            src={getChampionImageUrl(player.champion)}
                            size={64}
                            radius="md"
                            style={{ border: `2px solid var(--mantine-color-${color}-6)` }}
                        />
                        <Text size="xs" ta="center" c="gray.7" fw={500} w={64} truncate="end">{player.playername}</Text>
                    </Stack>
                ))}
            </Flex>
            <Group justify="center" gap="xs" mt="sm">
                {team.bans.map((champion, idx) => (
                    <BannedChampion key={idx} championName={champion} size={36} />
                ))}
            </Group>
        </Stack>
    );

    // 모바일 뷰 렌더링 함수
    const renderMobileTeamDisplay = (team, color) => (
        <Stack align="center" gap="md">
            <Group gap="sm">
                <Text size="xl" fw={800} c={`${color}.7`}>{team.name}</Text>
                {team.result === 1 && <Text size="lg" fw={700} c="dark">(승)</Text>}
            </Group>
            <Flex gap="xs" justify="center">
                {team.players.map((player) => (
                    <Stack key={player.participantid} align="center" gap={2}>
                        <Avatar src={getChampionImageUrl(player.champion)} size={44} radius="sm" style={{ border: `2px solid var(--mantine-color-${color}-6)` }} />
                        <Text size="10px" ta="center" c="gray.7" fw={500} w={44} truncate="end">{player.playername}</Text>
                    </Stack>
                ))}
            </Flex>
            <Group justify="center" gap={4} mt="xs">
                {team.bans.map((champion, idx) => (
                    <BannedChampion key={idx} championName={champion} size={28} />
                ))}
            </Group>
        </Stack>
    );

    return (
        <Paper p={{ base: "md", md: "xl" }} withBorder radius="md">
            <Stack>
                <Group justify="space-between" wrap="wrap" gap="xs">
                    <Group>
                        <Text size="lg" fw={700}>{gameInfo.league}</Text>
                        <Text c="dimmed" size="sm">{gameInfo.split} {gameInfo.playoffs ? 'Playoffs' : ''}</Text>
                    </Group>
                    <Group c="dimmed" gap="md" fz="xs">
                        <Text size="sm">{gameInfo.date}</Text>
                        <Text size="sm">Game {gameInfo.game}</Text>
                        <Text size="sm">Patch {gameInfo.patch}</Text>
                        <Text size="sm">{formatTime(gameInfo.gamelength)}</Text>
                    </Group>
                </Group>
                <Divider />

                {/* Desktop View */}
                <Group justify="center" gap={0} visibleFrom="sm" mt="md">
                    {renderTeamDisplay(blueTeam, 'blue')}
                    <Center px={50}><Text size="2rem" fw={700} c="gray.5">VS</Text></Center>
                    {renderTeamDisplay(redTeam, 'red')}
                </Group>

                {/* Mobile View */}
                <Stack gap="xl" hiddenFrom="sm" mt="md">
                    {renderMobileTeamDisplay(blueTeam, 'blue')}
                    <Center><Text size="xl" fw={700} c="gray.5">VS</Text></Center>
                    {renderMobileTeamDisplay(redTeam, 'red')}
                </Stack>
            </Stack>
        </Paper>
    );
};

export default GameHeader;