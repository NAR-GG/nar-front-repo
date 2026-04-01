"use client";

import { memo } from "react";
import { Group, Text, Avatar } from "@mantine/core";
import { sortByPosition } from "@/shared/lib/sort-by-position";
import { IconChevronRight, IconClock } from "@tabler/icons-react";
import type { GameRowViewModel } from "../model/match-list.viewmodel";

interface GameRowProps {
  game: GameRowViewModel;
  onNavigateToRecord: (gameId: number) => void;
}

interface TeamSideProps {
  team: GameRowViewModel["blueTeam"];
}

const TeamSide = memo(function TeamSide({ team }: TeamSideProps) {
  const sortedPlayers = sortByPosition(team.players);

  return (
    <div className="flex flex-col items-center gap-6">
      <Group gap="xs" align="center">
        <Text size="xs" fw={600} fz={16}>
          {team.teamShortName}{" "}
          <Text
            component="span"
            c={team.isWin ? "var(--nar-text-red)" : "var(--nar-text-4)"}
            fw={600}
            fz={16}
          >
            ({team.isWin ? "승" : "패"})
          </Text>
        </Text>
      </Group>
      <div className="flex gap-[12.5px] lg:gap-4">
        {sortedPlayers.map((player) => (
          <div key={player.playerName} className="flex flex-col items-center w-11.5">
            <Avatar src={player.championImageUrl || null} size={46} radius="md" />
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
  );
});

export const GameRow = memo(function GameRow({ game, onNavigateToRecord }: GameRowProps) {
  return (
    <div className="bg-(--nar-bg-tertiary) px-2 pb-[38px] pt-[13px] flex flex-col gap-6">
      <div className="flex items-center justify-between h-[31px] border-b border-(--nar-line)">
        <Text fz={14} fw={600} c="var(--nar-text-tertiary-sub)">
          {game.league} • Patch {game.patch}
        </Text>
        <div className="flex items-center gap-[7px]">
          <IconClock width={16} height={16} color="var(--nar-text-tertiary-sub)" />
          <Text fz={14} fw={600} c="var(--nar-text-tertiary-sub)">
            {game.gameLengthLabel}
          </Text>
        </div>
      </div>

      <div className="flex items-center justify-center w-full relative">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <TeamSide team={game.blueTeam} />
          <Text size="sm" fw={700} fz={26} c="var(--nar-text-tertiary-sub)">vs</Text>
          <TeamSide team={game.redTeam} />
        </div>
        <IconChevronRight
          className="hover:cursor-pointer absolute right-0"
          onClick={() => onNavigateToRecord(game.gameId)}
          color="var(--nar-icon-GNB-default)"
        />
      </div>
    </div>
  );
});
