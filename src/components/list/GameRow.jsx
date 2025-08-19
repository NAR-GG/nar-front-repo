import React from 'react';
import { Paper, Stack, Group, Text, Avatar, Button, Flex, Badge } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

// 팀 약어와 시간 포맷 함수는 그대로 사용합니다.
const teamNameMap = {
    'Bnk Fearx': 'BFX', 'Dplus Kia': 'DK', 'Kt Rolster': 'KT',
    'Nongshim Redforce': 'NS', 'Hanwha Life Esports': 'HLE',
    'Gen.g': 'GEN', 'T1': 'T1', 'Oksavingsbank Brion': 'BRO',
    'Drx': 'DRX', 'Dn Freecs': 'DNF',
};
const formatGameTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const GameRow = ({ game, getChampionImageUrl, onNavigateToRecord }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (!game || !game.blueTeam || !game.redTeam) return null;

    const { blueTeam, redTeam } = game;

    const renderHeader = () => {
        const teamNames = (
            <Flex align="center" gap="xs">
                <Text fw={600}>{teamNameMap[blueTeam.teamName] || blueTeam.teamName}</Text>
                <Badge variant="filled" color={blueTeam.isWin ? 'blue' : 'gray'} radius="sm">{blueTeam.isWin ? '승' : '패'}</Badge>
                <Text c="dimmed" size="sm">vs</Text>
                <Text fw={600}>{teamNameMap[redTeam.teamName] || redTeam.teamName}</Text>
                <Badge variant="filled" color={redTeam.isWin ? 'red' : 'gray'} radius="sm">{redTeam.isWin ? '승' : '패'}</Badge>
            </Flex>
        );

        const recordButton = (
            <Button size="xs" variant="light" onClick={() => onNavigateToRecord(game.gameId)}>
                기록
            </Button>
        );

        const gameMetaInfo = (
            <Text size="xs" c="dimmed">
                {game.league} • Patch {game.patch}
            </Text>
        );

        const gameTimeInfo = (
            <Text size="xs" c="dimmed">
                {formatGameTime(game.gameLengthSeconds)}
            </Text>
        );

        if (isMobile) {
            return (
                <Stack gap="xs">
                    <Group justify="space-between">
                        {teamNames}
                        {recordButton}
                    </Group>
                    <Group justify="space-between">
                        {gameMetaInfo}
                        {gameTimeInfo}
                    </Group>
                </Stack>
            );
        }

        return (
            <Group justify="space-between">
                <Group gap="md">
                    {teamNames}
                    {gameMetaInfo}
                </Group>
                <Group gap="md">
                    {gameTimeInfo}
                    {recordButton}
                </Group>
            </Group>
        );
    };

    return (
        <Paper p="md" withBorder radius="md">
            <Stack gap="md">
                {renderHeader()}
                <Group justify="center" align="flex-start" gap="md" mt="xs">
                    <TeamDisplay team={blueTeam} getChampionImageUrl={getChampionImageUrl} />
                    <Text size="sm" fw={600} c="dimmed" pt="lg">vs</Text>
                    <TeamDisplay team={redTeam} getChampionImageUrl={getChampionImageUrl} />
                </Group>
            </Stack>
        </Paper>
    );
};

const TeamDisplay = ({ team, getChampionImageUrl }) => (
    <Stack gap="xs" align="center" w={{base: '100%', sm: 250}}>
        <Text size="xs" fw={600}>
            {teamNameMap[team.teamName] || team.teamName}
        </Text>
        <Group gap={8}>
            {team.players.map(player => (
                <Stack key={player.playerName} align="center" gap={4} w={40}>
                    <Avatar src={getChampionImageUrl(player.championName)} size={40} radius="md" />
                    <Text
                        size="xs"
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {player.playerName}
                    </Text>
                </Stack>
            ))}
        </Group>
    </Stack>
);


export default GameRow;