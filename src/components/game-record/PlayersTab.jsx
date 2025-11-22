// src/components/game-record/PlayersTab.jsx
import React from 'react';
import { Stack, Paper, Group, Text, Badge } from '@mantine/core';
import PlayerStatsTable from './PlayerStatsTable';

const PlayersTab = ({ blueTeam, redTeam, gameLengthInMin, getChampionImageUrl }) => {
    return (
        <Stack gap="lg" mt="lg">
            <Paper p="lg" withBorder radius="sm"> {/* Paper의 radius도 "sm"으로 조정하여 일관성 부여 */}
                <Group mb="md">
                    <Text size="lg" fw={700} c="blue">{blueTeam.name}</Text>
                    {/* ✅ [수정] radius="xs"를 추가하여 배지를 더 각지게 만듭니다. */}
                    {blueTeam.result === 1 && <Badge color="blue" radius="xs">승리</Badge>}
                </Group>
                <PlayerStatsTable
                    players={blueTeam.players}
                    teamKills={blueTeam.stats.kills}
                    gameLengthInMin={gameLengthInMin}
                    getChampionImageUrl={getChampionImageUrl}
                />
            </Paper>

            <Paper p="lg" withBorder radius="sm"> {/* Paper의 radius도 "sm"으로 조정하여 일관성 부여 */}
                <Group mb="md">
                    <Text size="lg" fw={700} c="red">{redTeam.name}</Text>
                    {/* ✅ [수정] radius="xs"를 추가하여 배지를 더 각지게 만듭니다. */}
                    {redTeam.result === 1 && <Badge color="red" radius="xs">승리</Badge>}
                </Group>
                <PlayerStatsTable
                    players={redTeam.players}
                    teamKills={redTeam.stats.kills}
                    gameLengthInMin={gameLengthInMin}
                    getChampionImageUrl={getChampionImageUrl}
                />
            </Paper>
        </Stack>
    );
};

export default PlayersTab;