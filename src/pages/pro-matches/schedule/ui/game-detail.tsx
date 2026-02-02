"use client";

import {
  Stack,
  Group,
  Text,
  Button,
  Center,
  Avatar,
  Loader,
  Collapse,
} from "@mantine/core";
import type { MatchDetailGame } from "@/entities/schedule/model/schedule.dto";
import { sortByPosition } from "@/shared/lib/sort-by-position";
import { useChampionImage } from "@/shared/lib/use-champion-image";
import { IconChevronRight } from "@tabler/icons-react";
const TEAM_NAME_MAP: Record<string, string> = {
  "Bnk Fearx": "BFX",
  "Dplus Kia": "DK",
  "Kt Rolster": "KT",
  "Nongshim Redforce": "NS",
  "Hanwha Life Esports": "HLE",
  "Gen.g": "GEN",
  T1: "T1",
  "Oksavingsbank Brion": "BRO",
  Drx: "DRX",
  "Dn Freecs": "DNF",
};

const formatGameTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

type GameDetailProps = {
  isExpanded: boolean;
  isLoading: boolean;
  gameDetails: MatchDetailGame[] | undefined;
  onNavigateToRecord: (gameId: number) => void;
};

export function GameDetail({
  isExpanded,
  isLoading,
  gameDetails,
  onNavigateToRecord,
}: GameDetailProps) {
  const { getChampionImageUrl } = useChampionImage();

  return (
    <Collapse in={isExpanded}>
      {isLoading ? (
        <Center p="md">
          <Loader size="sm" />
        </Center>
      ) : !gameDetails || gameDetails.length === 0 ? (
        <div className="py-8 text-center text-(--nar-text-tertiary-sub)">
          경기 상세 정보가 없습니다.
        </div>
      ) : (
        <div>
          {gameDetails.map((game) => {
            const winnerSide = game.blueTeam.isWin ? "blue" : "red";

            return (
              <div
                key={game.gameNumber}
                className="bg-(--nar-BG-last) border-y border-(--nar-line-2) pt-3 pb-5 px-[10px]"
              >
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Group gap="sm">
                      <Text
                        fw={600}
                        fz={16}
                        size="sm"
                        c="var(--nar-text-primary)"
                      >
                        Game {game.gameNumber}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {formatGameTime(game.gameLengthSeconds)}
                      </Text>
                    </Group>
                    <IconChevronRight
                      className="hover:cursor-pointer"
                      onClick={() => onNavigateToRecord(game.id)}
                      color="var(--nar-icon-GNB-default)"
                    />
                  </Group>

                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                    {/* Blue Team */}
                    <Stack gap="xs" align="center">
                      <Group gap="xs" align="center">
                        <Text size="xs" fw={600} fz={16}>
                          {TEAM_NAME_MAP[game.blueTeam.teamName] ||
                            game.blueTeam.teamName}{" "}
                          <Text
                            component="span"
                            c={
                              winnerSide === "blue"
                                ? "var(--nar-text-red)"
                                : "var(--nar-text-4)"
                            }
                            fw={600}
                            fz={16}
                          >
                            ({winnerSide === "blue" ? "승" : "패"})
                          </Text>
                        </Text>
                      </Group>
                      <div className="flex gap-1 sm:gap-4">
                        {sortByPosition(game.blueTeam.players).map((player) => (
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
                    </Stack>

                    <div className="flex items-center justify-center">
                      <Text
                        size="sm"
                        fw={700}
                        fz={26}
                        c="var(--nar-text-tertiary-sub)"
                      >
                        vs
                      </Text>
                    </div>

                    {/* Red Team */}
                    <Stack gap="xs" align="center">
                      <Group gap="xs" align="center">
                        <Text size="xs" fw={600} fz={16}>
                          {TEAM_NAME_MAP[game.redTeam.teamName] ||
                            game.redTeam.teamName}{" "}
                          <Text
                            component="span"
                            c={winnerSide === "red" ? "red" : "gray.6"}
                            fw={600}
                            fz={16}
                          >
                            ({winnerSide === "red" ? "승" : "패"})
                          </Text>
                        </Text>
                      </Group>
                      <div className="flex gap-1 sm:gap-4">
                        {sortByPosition(game.redTeam.players).map((player) => (
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
                    </Stack>
                  </div>
                </Stack>
              </div>
            );
          })}
        </div>
      )}
    </Collapse>
  );
}
