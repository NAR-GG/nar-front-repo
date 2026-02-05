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
    <div className="bg-[var(--nar-bg-secondary)] w-full flex flex-col items-center justify-center px-[19.5px] py-[30px] gap-[14px]">
      <div className="w-full flex flex-col gap-2">
        <div className="flex gap-2 items-center py-6 border-b border-(--nar-blue-700)">
          <Text fz={22} fw={700} c="blue.6">
            Blue Side : {blueTeam.name}
          </Text>
          {blueTeam.result === 1 && (
            <Text fz={22} fw={700} c="red.6">
              (승)
            </Text>
          )}
        </div>
        <PlayerStatsTable
          players={blueTeam.players}
          teamKills={blueTeam.stats.kills}
          gameLengthInMin={gameLengthInMin}
          getChampionImageUrl={getChampionImageUrl}
        />
      </div>
      <div className="h-[1px] w-full bg-(--nar-line)" />

      <div className="w-full flex flex-col gap-2">
        <div className="flex gap-2 items-center py-6 border-b border-(--nar-red-700)">
          <Text fz={22} fw={700} c="red.6">
            Red Side : {redTeam.name}
          </Text>
          {redTeam.result === 1 && (
            <Text fz={22} fw={700} c="red.6">
              (승)
            </Text>
          )}
        </div>
        <PlayerStatsTable
          players={redTeam.players}
          teamKills={redTeam.stats.kills}
          gameLengthInMin={gameLengthInMin}
          getChampionImageUrl={getChampionImageUrl}
        />
      </div>
    </div>
  );
}
