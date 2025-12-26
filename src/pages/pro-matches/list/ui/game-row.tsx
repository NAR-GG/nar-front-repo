"use client";

import {
  Paper,
  Stack,
  Group,
  Text,
  Button,
  Flex,
  Badge,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { GameData } from "@/entities/games/model/games.dto";
import { TEAM_NAME_MAP, formatGameTime } from "../model/types";
import { TeamDisplay } from "./team-display";

interface GameRowProps {
  game: GameData;
  getChampionImageUrl: (championName: string) => string;
  onNavigateToRecord: (gameId: number) => void;
}

export const GameRow = ({
  game,
  getChampionImageUrl,
  onNavigateToRecord,
}: GameRowProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!game || !game.blueTeam || !game.redTeam) return null;

  const { blueTeam, redTeam } = game;

  const teamNames = (
    <Flex align="center" gap="xs">
      <Text fw={600}>
        {TEAM_NAME_MAP[blueTeam.teamName] || blueTeam.teamName}
      </Text>
      <Badge
        variant="filled"
        color={blueTeam.isWin ? "blue" : "gray"}
        radius="sm"
      >
        {blueTeam.isWin ? "승" : "패"}
      </Badge>
      <Text c="dimmed" size="sm">
        vs
      </Text>
      <Text fw={600}>
        {TEAM_NAME_MAP[redTeam.teamName] || redTeam.teamName}
      </Text>
      <Badge
        variant="filled"
        color={redTeam.isWin ? "red" : "gray"}
        radius="sm"
      >
        {redTeam.isWin ? "승" : "패"}
      </Badge>
    </Flex>
  );

  const recordButton = (
    <Button
      size="xs"
      variant="light"
      onClick={() => onNavigateToRecord(game.gameId)}
    >
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

  const renderHeader = () => {
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
          <Text size="sm" fw={600} c="dimmed" pt="lg">
            vs
          </Text>
          <TeamDisplay team={redTeam} getChampionImageUrl={getChampionImageUrl} />
        </Group>
      </Stack>
    </Paper>
  );
};
