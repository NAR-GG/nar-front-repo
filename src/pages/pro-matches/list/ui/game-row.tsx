"use client";

import { Group, Text, Button, Flex, Badge, Avatar } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { GameData } from "@/entities/games/model/games.dto";
import { TEAM_NAME_MAP, formatGameTime } from "../model/types";
import { sortByPosition } from "@/shared/lib/sort-by-position";
import { IconChevronRight, IconClock } from "@tabler/icons-react";
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

  return (
    <div className="bg-(--nar-bg-tertiary) px-2 pb-[38px] pt-[13px] flex flex-col gap-6">
      <div className="flex items-center justify-between h-[31px] border-b border-(--nar-line)">
        <Text fz={14} fw={600} c="var(--nar-text-tertiary-sub)">
          {game.league} • Patch {game.patch}
        </Text>
        <div className="flex items-center gap-[7px]">
          <IconClock
            width={16}
            height={16}
            color="var(--nar-text-tertiary-sub)"
          />
          <Text fz={14} fw={600} c="var(--nar-text-tertiary-sub)">
            {formatGameTime(game.gameLengthSeconds)}
          </Text>
        </div>
      </div>
      <div className="flex items-center justify-center w-full relative">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-6">
            <Group gap="xs" align="center">
              <Text size="xs" fw={600} fz={16}>
                {TEAM_NAME_MAP[blueTeam.teamName] || blueTeam.teamName}{" "}
                <Text
                  component="span"
                  c={
                    blueTeam.isWin ? "var(--nar-text-red)" : "var(--nar-text-4)"
                  }
                  fw={600}
                  fz={16}
                >
                  ({blueTeam.isWin ? "승" : "패"})
                </Text>
              </Text>
            </Group>
            <div className="flex gap-1 sm:gap-4">
              {sortByPosition(blueTeam.players).map((player) => (
                <div
                  key={player.playerName}
                  className="flex flex-col items-center w-[46px] sm:w-full"
                >
                  <Avatar
                    src={getChampionImageUrl(player.championName)}
                    size={46}
                    radius="md"
                  />
                  <Text
                    size="xs"
                    mt={2}
                    fz={16}
                    fw={400}
                    c="var(--nar-text-primary)"
                    className="text-center w-full whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {player.playerName}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Text size="sm" fw={700} fz={26} c="var(--nar-text-tertiary-sub)">
              vs
            </Text>
          </div>

          {/* Red Team */}
          <div className="flex flex-col items-center gap-6">
            <Group gap="xs" align="center">
              <Text size="xs" fw={600} fz={16}>
                {TEAM_NAME_MAP[redTeam.teamName] || redTeam.teamName}{" "}
                <Text
                  component="span"
                  c={
                    redTeam.isWin ? "var(--nar-text-red)" : "var(--nar-text-4)"
                  }
                  fw={600}
                  fz={16}
                >
                  ({redTeam.isWin ? "승" : "패"})
                </Text>
              </Text>
            </Group>
            <div className="flex gap-1 sm:gap-4">
              {sortByPosition(redTeam.players).map((player) => (
                <div
                  key={player.playerName}
                  className="flex flex-col items-center w-[46px] sm:w-full"
                >
                  <Avatar
                    src={getChampionImageUrl(player.championName)}
                    size={46}
                    radius="md"
                  />
                  <Text
                    size="xs"
                    fz={16}
                    fw={400}
                    mt={2}
                    c="var(--nar-text-primary)"
                    className="text-center w-full whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {player.playerName}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>
        <IconChevronRight
          className="hover:cursor-pointer absolute right-0"
          onClick={() => onNavigateToRecord(game.gameId)}
          color="var(--nar-icon-GNB-default)"
        />
      </div>
    </div>
  );
};
