// src/components/game-record/PlayersTab.jsx
import React from 'react';
import { Stack, Paper, Group, Text, Badge } from '@mantine/core';
import PlayerStatsTable from './PlayerStatsTable'; // 위에서 만든 상세 테이블 컴포넌트

const PlayersTab = ({ blueTeam, redTeam, gameLengthInMin }) => {
    return (
        <Stack gap="lg" mt="lg">
            {/* 블루팀 테이블 */}
            <Paper p="lg" withBorder radius="md">
                <Group mb="md">
                    <Text size="lg" fw={700} c="blue">
                        {blueTeam.name}
                    </Text>
                    {blueTeam.result === 1 && (
                        <Badge color="blue" variant="light" radius="sm">승리</Badge>
                    )}
                </Group>
                <PlayerStatsTable
                    players={blueTeam.players}
                    teamKills={blueTeam.stats.kills}
                    gameLengthInMin={gameLengthInMin}
                />
            </Paper>

            {/* 레드팀 테이블 */}
            <Paper p="lg" withBorder radius="md">
                <Group mb="md">
                    <Text size="lg" fw={700} c="red">
                        {redTeam.name}
                    </Text>
                    {redTeam.result === 1 && (
                        <Badge color="red" variant="light" radius="sm">승리</Badge>
                    )}
                </Group>
                <PlayerStatsTable
                    players={redTeam.players}
                    teamKills={redTeam.stats.kills}
                    gameLengthInMin={gameLengthInMin}
                />
            </Paper>
        </Stack>
    );
};

export default PlayersTab;