"use client";

import {
  Paper,
  Stack,
  Group,
  Text,
  Divider,
  Flex,
  Avatar,
  Center,
  Box,
} from "@mantine/core";
import type { GameDetailPlayer } from "@/entities/games/model/games.dto";
import { sortByPosition } from "@/shared/lib/sort-by-position";

interface TeamData {
  name: string;
  result: number;
  players: GameDetailPlayer[];
  bans: string[];
}

interface GameInfo {
  league: string;
  split: string;
  playoffs: number;
  date: string;
  game: number;
  patch: string;
  gamelength: number;
}

interface GameHeaderProps {
  gameInfo: GameInfo;
  blueTeam: TeamData;
  redTeam: TeamData;
  getChampionImageUrl: (name: string) => string;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function GameHeader({
  gameInfo,
  blueTeam,
  redTeam,
  getChampionImageUrl,
}: GameHeaderProps) {
  const BannedChampion = ({
    championName,
    size = 32,
  }: {
    championName: string;
    size?: number;
  }) => (
    <Box style={{ position: "relative" }}>
      <Avatar src={getChampionImageUrl(championName)} size={size} radius="sm" />
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `calc(${size}px * 0.8)`,
          height: "2px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          transform: "translate(-50%, -50%) rotate(45deg)",
          borderRadius: "2px",
          boxShadow: "0 0 2px black",
        }}
      />
    </Box>
  );

  const renderTeamDisplay = (team: TeamData, color: "blue" | "red") => (
    <Stack align="center" gap="lg" style={{ flex: 1, minWidth: 0 }}>
      <Group>
        <Text size="2rem" fw={800} c={`${color}.7`}>
          {team.name}
        </Text>
        {team.result === 1 && (
          <Text size="xl" fw={700} c="dark">
            (승)
          </Text>
        )}
      </Group>
      <Flex gap="md" justify="center">
        {sortByPosition(team.players).map((player) => (
          <Stack key={player.participantid} align="center" gap="xs">
            <Avatar
              src={getChampionImageUrl(player.champion)}
              size={64}
              radius="md"
              style={{ border: `2px solid var(--mantine-color-${color}-6)` }}
            />
            <Text
              size="xs"
              ta="center"
              c="gray.7"
              fw={500}
              w={64}
              truncate="end"
            >
              {player.playername}
            </Text>
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

  const renderMobileTeamDisplay = (team: TeamData, color: "blue" | "red") => (
    <Stack align="center" gap="md">
      <Group gap="sm">
        <Text size="xl" fw={800} c={`${color}.7`}>
          {team.name}
        </Text>
        {team.result === 1 && (
          <Text size="lg" fw={700} c="dark">
            (승)
          </Text>
        )}
      </Group>
      <Flex gap="xs" justify="center">
        {sortByPosition(team.players).map((player) => (
          <Stack key={player.participantid} align="center" gap={2}>
            <Avatar
              src={getChampionImageUrl(player.champion)}
              size={44}
              radius="sm"
              style={{ border: `2px solid var(--mantine-color-${color}-6)` }}
            />
            <Text
              size="10px"
              ta="center"
              c="gray.7"
              fw={500}
              w={44}
              truncate="end"
            >
              {player.playername}
            </Text>
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
            <Text size="lg" fw={700}>
              {gameInfo.league}
            </Text>
            <Text c="dimmed" size="sm">
              {gameInfo.split} {gameInfo.playoffs ? "Playoffs" : ""}
            </Text>
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
          {renderTeamDisplay(blueTeam, "blue")}
          <Center px={50}>
            <Text size="2rem" fw={700} c="gray.5">
              VS
            </Text>
          </Center>
          {renderTeamDisplay(redTeam, "red")}
        </Group>

        {/* Mobile View */}
        <Stack gap="xl" hiddenFrom="sm" mt="md">
          {renderMobileTeamDisplay(blueTeam, "blue")}
          <Center>
            <Text size="xl" fw={700} c="gray.5">
              VS
            </Text>
          </Center>
          {renderMobileTeamDisplay(redTeam, "red")}
        </Stack>
      </Stack>
    </Paper>
  );
}
