"use client";

import { Stack, Group, Text, Avatar } from "@mantine/core";
import type { ChampionInfoViewModel, GameMatchViewModel } from "../model/champions-meta.view-model";
import { sortByPosition } from "@/shared/lib/sort-by-position";
import { IconChevronRight, IconClock } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface MatchHistoryProps {
  champions: ChampionInfoViewModel[];
  gameDetails: GameMatchViewModel[];
}

export function MatchHistory({ gameDetails }: MatchHistoryProps) {
  const router = useRouter();

  if (!gameDetails || gameDetails.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center" py="sm">
        매치 기록이 없습니다.
      </Text>
    );
  }

  const onNavigateToRecord = (gameId: number) => {
    router.push(`/pro-matches/${gameId}/record`);
  };

  return (
    <Stack gap="xs" mt="sm">
      <Stack gap="sm">
        {gameDetails.map((game, index) => {
          const { blueTeam, redTeam } = game;

          return (
            <div
              key={index}
              className="bg-(--nar-bg-tertiary) px-2 pb-[38px] pt-[13px] flex flex-col gap-6"
            >
              <div className="flex items-center justify-between h-[31px] border-b border-(--nar-line)">
                <Text fz={14} fw={600} c="var(--nar-text-tertiary-sub)">
                  Game {game.gameNumber}
                </Text>
                <div className="flex items-center gap-[7px]">
                  <IconClock
                    width={16}
                    height={16}
                    color="var(--nar-text-tertiary-sub)"
                  />
                  <Text fz={14} fw={600} c="var(--nar-text-tertiary-sub)">
                    {game.formattedGameLength}
                  </Text>
                </div>
              </div>
              <div className="flex items-center justify-center w-full relative">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                  <div className="flex flex-col items-center gap-6">
                    <Group gap="xs" align="center">
                      <Text size="xs" fw={600} fz={16}>
                        {blueTeam.teamName}{" "}
                        <Text
                          component="span"
                          c={blueTeam.isWin ? "var(--nar-text-red)" : "var(--nar-text-4)"}
                          fw={600}
                          fz={16}
                        >
                          ({blueTeam.isWin ? "승" : "패"})
                        </Text>
                      </Text>
                    </Group>
                    <div
                      className={`flex gap-[12.5px] lg:gap-4 ${blueTeam.isWin ? "bg-(--nar-red-opacity10) rounded-[8px] py-[6px] px-3" : ""}`}
                    >
                      {sortByPosition(blueTeam.players).map((player) => (
                        <div
                          key={`${game.id}-blue-${player.playerName}`}
                          className="flex flex-col items-center w-[46px]"
                        >
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

                  <div className="flex items-center justify-center">
                    <Text size="sm" fw={700} fz={26} c="var(--nar-text-tertiary-sub)">
                      vs
                    </Text>
                  </div>

                  <div className="flex flex-col items-center gap-6">
                    <Group gap="xs" align="center">
                      <Text size="xs" fw={600} fz={16}>
                        {redTeam.teamName}{" "}
                        <Text
                          component="span"
                          c={redTeam.isWin ? "var(--nar-text-red)" : "var(--nar-text-4)"}
                          fw={600}
                          fz={16}
                        >
                          ({redTeam.isWin ? "승" : "패"})
                        </Text>
                      </Text>
                    </Group>
                    <div
                      className={`flex gap-[12.5px] lg:gap-4 ${redTeam.isWin ? "bg-(--nar-red-opacity10) rounded-[8px]" : ""}`}
                    >
                      {sortByPosition(redTeam.players).map((player) => (
                        <div
                          key={`${game.id}-red-${player.playerName}`}
                          className="flex flex-col items-center w-[46px]"
                        >
                          <Avatar src={player.championImageUrl || null} size={46} radius="md" />
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
                  onClick={() => onNavigateToRecord(game.id)}
                  color="var(--nar-icon-GNB-default)"
                />
              </div>
            </div>
          );
        })}
      </Stack>
    </Stack>
  );
}
