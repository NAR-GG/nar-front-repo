"use client";

import { Stack, Group, Text, Avatar } from "@mantine/core";
import type { GameTeam } from "@/entities/games/model/games.dto";
import { TEAM_NAME_MAP } from "../model/types";

interface TeamDisplayProps {
  team: GameTeam;
  getChampionImageUrl: (championName: string) => string;
}

export const TeamDisplay = ({ team, getChampionImageUrl }: TeamDisplayProps) => {
  return (
    <Stack gap="xs" align="center" w={{ base: "100%", sm: 250 }}>
      <Text size="xs" fw={600}>
        {TEAM_NAME_MAP[team.teamName] || team.teamName}
      </Text>
      <Group gap={8}>
        {team.players.map((player) => (
          <Stack key={player.playerName} align="center" gap={4} w={40}>
            <Avatar
              src={getChampionImageUrl(player.championName)}
              size={40}
              radius="md"
            />
            <Text
              size="xs"
              style={{
                width: "100%",
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {player.playerName}
            </Text>
          </Stack>
        ))}
      </Group>
    </Stack>
  );
};
