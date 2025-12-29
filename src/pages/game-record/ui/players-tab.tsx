"use client";

import { Stack, Paper, Group, Text, Badge } from "@mantine/core";
import { PlayerStatsTable } from "./player-stats-table";
import type { GameDetailPlayer } from "@/entities/games/model/games.dto";

interface TeamData {
  name: string;
  result: number;
  players: GameDetailPlayer[];
  stats: {
    kills: number;
  };
}

interface PlayersTabProps {
  blueTeam: TeamData;
  redTeam: TeamData;
  gameLengthInMin: number;
  getChampionImageUrl: (name: string) => string;
}

export function PlayersTab({
  blueTeam,
  redTeam,
  gameLengthInMin,
  getChampionImageUrl,
}: PlayersTabProps) {
  return (
    <Stack gap="lg" mt="lg">
      <Paper p="lg" withBorder radius="sm">
        <Group mb="md">
          <Text size="lg" fw={700} c="blue">
            {blueTeam.name}
          </Text>
          {blueTeam.result === 1 && (
            <Badge color="blue" radius="xs">
              승리
            </Badge>
          )}
        </Group>
        <PlayerStatsTable
          players={blueTeam.players}
          teamKills={blueTeam.stats.kills}
          gameLengthInMin={gameLengthInMin}
          getChampionImageUrl={getChampionImageUrl}
        />
      </Paper>

      <Paper p="lg" withBorder radius="sm">
        <Group mb="md">
          <Text size="lg" fw={700} c="red">
            {redTeam.name}
          </Text>
          {redTeam.result === 1 && (
            <Badge color="red" radius="xs">
              승리
            </Badge>
          )}
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
}
