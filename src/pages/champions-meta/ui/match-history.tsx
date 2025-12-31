"use client";

import { useMemo } from "react";
import { Stack, Group, Text, Badge, Paper, Avatar } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import type { ChampionInfo } from "../model/types";
import type { ChampionData } from "@/entities/champions/model/champions.dto";
import { sortByPosition } from "@/shared/lib/sort-by-position";

interface GameDetailFromApi {
  gameId: number;
  gameDate: string;
  split: string;
  league: string;
  patch: string;
  gameLengthSeconds: number;
  ourTeam: {
    teamName: string;
    side: string;
    isWin: boolean;
    players: {
      position: string;
      championName: string;
      playerName: string;
    }[];
  };
  opponentTeam: {
    teamName: string;
    side: string;
    isWin: boolean;
    players: {
      position: string;
      championName: string;
      playerName: string;
    }[];
  };
}

interface MatchHistoryProps {
  champions: ChampionInfo[];
  gameDetails: GameDetailFromApi[];
}

export function MatchHistory({ gameDetails }: MatchHistoryProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const queryClient = useQueryClient();

  const championMap = useMemo(() => {
    const championData = (queryClient.getQueryData(["champions"]) ||
      []) as ChampionData[];
    const map = new Map<string, ChampionData>();
    championData.forEach((champion) => {
      map.set(champion.championNameEn, champion);
    });
    return map;
  }, [queryClient]);

  const getChampionImageUrl = (championName: string) => {
    const championInfo = championMap.get(championName);
    if (championInfo?.imageUrl) {
      return championInfo.imageUrl;
    }

    const imageNameMap: Record<string, string> = {
      Drmundo: "DrMundo",
      Jarvaniv: "JarvanIV",
      Kogmaw: "KogMaw",
      Leesin: "LeeSin",
      Masteryi: "MasterYi",
      Missfortune: "MissFortune",
      Monkeyking: "MonkeyKing",
      Twistedfate: "TwistedFate",
      Velkoz: "Velkoz",
      Xinzhao: "XinZhao",
    };

    const imageName = imageNameMap[championName] || championName;
    return `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${imageName}.png`;
  };

  const formatGameTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!gameDetails || gameDetails.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center" py="sm">
        매치 기록이 없습니다.
      </Text>
    );
  }

  return (
    <Stack gap="xs" mt="sm">
      <Text size="sm" fw={600} c="dimmed" mb="xs">
        플레이 기록 ({gameDetails.length}게임)
      </Text>

      <Stack gap="sm">
        {gameDetails.map((game, index) => {
          if (!game || !game.ourTeam || !game.opponentTeam) {
            return (
              <Paper key={index} p="sm" bg="#f8f9fa" radius="md">
                <Text size="sm" c="red" ta="center">
                  게임 데이터가 불완전합니다.
                </Text>
              </Paper>
            );
          }

          const { ourTeam, opponentTeam } = game;
          const weWon = ourTeam?.isWin ?? false;

          const ourTeamSide = ourTeam?.side;
          const opponentTeamSide = opponentTeam?.side;

          if (!ourTeamSide || !opponentTeamSide) {
            return (
              <Paper key={index} p="sm" bg="#f8f9fa" radius="md">
                <Text size="sm" c="red" ta="center">
                  팀 사이드 정보가 없습니다.
                </Text>
              </Paper>
            );
          }

          const blueTeam = ourTeamSide === "Blue" ? ourTeam : opponentTeam;
          const redTeam = ourTeamSide === "Red" ? ourTeam : opponentTeam;
          const ourTeamIsBlue = ourTeamSide === "Blue";

          const blueTeamName = blueTeam?.teamName || "알 수 없는 팀";
          const redTeamName = redTeam?.teamName || "알 수 없는 팀";

          const renderHeader = () => {
            const teamNames = ourTeamIsBlue ? (
              <>
                <Text
                  component="span"
                  fw={700}
                  style={{
                    backgroundColor: weWon ? "#2196f3" : "#f44336",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {blueTeamName}
                </Text>
                {" vs "}
                <Text component="span" c="black" fw={600}>
                  {redTeamName}
                </Text>
              </>
            ) : (
              <>
                <Text component="span" c="black" fw={600}>
                  {blueTeamName}
                </Text>
                {" vs "}
                <Text
                  component="span"
                  fw={700}
                  style={{
                    backgroundColor: weWon ? "#2196f3" : "#f44336",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {redTeamName}
                </Text>
              </>
            );

            const badge = (
              <Badge size="sm" color={weWon ? "blue" : "red"} variant="filled">
                {weWon ? "승리" : "패배"}
              </Badge>
            );

            const leaguePatch = (
              <Text size="xs" c="dimmed">
                {game.league || "알 수 없음"} • {game.patch || "알 수 없음"}
              </Text>
            );

            const gameTime = (
              <Text size="xs" c="dimmed">
                {game.gameLengthSeconds
                  ? formatGameTime(game.gameLengthSeconds)
                  : "00:00"}
              </Text>
            );

            const gameDate = (
              <Text size="xs" c="dimmed">
                {game.gameDate || "날짜 없음"}
              </Text>
            );

            if (isMobile) {
              return (
                <Stack gap="xs">
                  <Group justify="space-between" align="center">
                    <Group gap="sm">
                      <Text size="sm" fw={600}>
                        {teamNames}
                      </Text>
                      {badge}
                    </Group>
                  </Group>
                  <Group justify="space-between" align="center">
                    {leaguePatch}
                    <Group gap="xs">
                      {gameTime}
                      {gameDate}
                    </Group>
                  </Group>
                </Stack>
              );
            } else {
              return (
                <Group justify="space-between" align="center">
                  <Group gap="sm">
                    <Text size="sm" fw={600}>
                      {teamNames}
                    </Text>
                    {badge}
                    {leaguePatch}
                  </Group>
                  <Group gap="xs">
                    {gameTime}
                    {gameDate}
                  </Group>
                </Group>
              );
            }
          };

          return (
            <Paper key={index} p="sm" bg="#f8f9fa" radius="md">
              <Stack gap="xs">
                {renderHeader()}

                <Group justify="center" align="flex-start" gap="md">
                  <Stack gap="xs" align="center">
                    <Text size="xs" fw={600}>
                      {blueTeamName}
                    </Text>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {(blueTeam?.players || []).length > 0 ? (
                        sortByPosition(blueTeam.players).map((player, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              width: "50px",
                            }}
                          >
                            <Avatar
                              src={getChampionImageUrl(
                                player?.championName || ""
                              )}
                              size={40}
                              radius="md"
                            />
                            <Text
                              size="xs"
                              mt={4}
                              style={{
                                textAlign: "center",
                                width: "100%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {player?.playerName || "알 수 없음"}
                            </Text>
                          </div>
                        ))
                      ) : (
                        <Text size="xs" c="dimmed">
                          플레이어 정보 없음
                        </Text>
                      )}
                    </div>
                  </Stack>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "40px",
                      paddingTop: "20px",
                    }}
                  >
                    <Text size="sm" fw={600} c="dimmed">
                      vs
                    </Text>
                  </div>

                  <Stack gap="xs" align="center">
                    <Text size="xs" fw={600}>
                      {redTeamName}
                    </Text>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {(redTeam?.players || []).length > 0 ? (
                        sortByPosition(redTeam.players).map((player, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              width: "50px",
                            }}
                          >
                            <Avatar
                              src={getChampionImageUrl(
                                player?.championName || ""
                              )}
                              size={40}
                              radius="md"
                            />
                            <Text
                              size="xs"
                              mt={4}
                              style={{
                                textAlign: "center",
                                width: "100%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {player?.playerName || "알 수 없음"}
                            </Text>
                          </div>
                        ))
                      ) : (
                        <Text size="xs" c="dimmed">
                          플레이어 정보 없음
                        </Text>
                      )}
                    </div>
                  </Stack>
                </Group>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
}
