"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Stack,
  Paper,
  Group,
  Text,
  ActionIcon,
  Button,
  Box,
  Card,
  Collapse,
  Flex,
  ScrollArea,
  Center,
  Avatar,
  Loader,
  Popover,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import "dayjs/locale/ko";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconChevronDown,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { scheduleQueries } from "@/entities/schedule/model/schedule.queries";
import { championsQueries } from "@/entities/champions/model/champions.queries";

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

const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];

const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatGameTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const getWeekDates = (date: Date): Date[] => {
  const week: Date[] = [];
  const tmp = new Date(date);
  const day = tmp.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  tmp.setDate(tmp.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    week.push(new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate() + i));
  }
  return week;
};

export const SchedulePageComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const initializeDate = (): Date => {
    const dateParam = searchParams?.get("date");
    if (dateParam && !isNaN(new Date(dateParam).getTime())) {
      return new Date(dateParam);
    }
    return new Date();
  };

  const [selectedDate, setSelectedDate] = useState<Date>(initializeDate);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const dateString = formatDateString(selectedDate);
  const weekDates = getWeekDates(selectedDate);

  // URL 동기화
  useEffect(() => {
    if (searchParams?.get("date") !== dateString) {
      router.push(`/pro-matches/schedule?date=${dateString}`);
    }
  }, [dateString, searchParams, router]);

  // 스케줄 데이터 조회
  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    isError: scheduleError,
  } = useQuery(scheduleQueries.date(dateString));

  // 매치 상세 조회
  const { data: matchDetail, isLoading: detailLoading } = useQuery({
    ...scheduleQueries.detail(expandedId ?? ""),
    enabled: !!expandedId,
  });

  // 챔피언 데이터 조회
  const { data: champions = [] } = useQuery(championsQueries.list());

  const championImageMap = useMemo(() => {
    if (!champions || champions.length === 0) return new Map<string, string>();
    return new Map(champions.map((c) => [c.championNameEn, c.imageUrl]));
  }, [champions]);

  const getChampionImageUrl = (championName: string): string => {
    return championImageMap.get(championName) || "";
  };

  const handleToggleExpand = (matchId: string) => {
    setExpandedId((prev) => (prev === matchId ? null : matchId));
  };

  const handleNavigateToRecord = (gameId: number) => {
    router.push(`/pro-matches/${gameId}/record`);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  return (
    <Container size="xl" px={{ base: 12, sm: 24, md: 32 }}>
      <Stack gap="lg" mt="md">
        <Paper p={{ base: "md", sm: "xl" }} withBorder bg="white">
          {/* 날짜 선택 영역 */}
          <Paper p="sm" mb="md" bg="gray.0" radius="sm">
            <Group justify="space-between" mb="sm">
              <ActionIcon variant="light" onClick={handlePrevWeek}>
                <IconChevronLeft size={18} />
              </ActionIcon>
              <Popover position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Group gap="xs" style={{ cursor: "pointer" }}>
                    <IconCalendar
                      size={16}
                      color="var(--mantine-color-blue-6)"
                    />
                    <Text fw={600}>
                      {selectedDate.getFullYear()}.
                      {String(selectedDate.getMonth() + 1).padStart(2, "0")}
                    </Text>
                  </Group>
                </Popover.Target>
                <Popover.Dropdown>
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => date && setSelectedDate(new Date(date))}
                    locale="ko"
                  />
                </Popover.Dropdown>
              </Popover>
              <ActionIcon variant="light" onClick={handleNextWeek}>
                <IconChevronRight size={18} />
              </ActionIcon>
            </Group>

            <Center>
              <ScrollArea type="never" style={{ width: "100%" }}>
                <Flex
                  gap="xs"
                  justify="center"
                  wrap="nowrap"
                  style={{ minWidth: "max-content" }}
                >
                  {weekDates.map((date, idx) => {
                    const isSelected =
                      date.toDateString() === selectedDate.toDateString();
                    const isToday =
                      date.toDateString() === new Date().toDateString();

                    return (
                      <Button
                        key={idx}
                        size="sm"
                        variant={isSelected ? "filled" : "light"}
                        color={isSelected ? "blue" : isToday ? "blue" : "gray"}
                        onClick={() => setSelectedDate(date)}
                        style={{
                          minWidth: 50,
                          height: 60,
                          flexDirection: "column",
                          padding: 8,
                        }}
                      >
                        <div style={{ textAlign: "center", lineHeight: 1.2 }}>
                          <Text
                            size="xs"
                            fw={500}
                            c={
                              isSelected ? "white" : isToday ? "blue" : "dimmed"
                            }
                            style={{ marginBottom: "2px" }}
                          >
                            {DAY_NAMES[idx]}
                          </Text>
                          <Text
                            size="sm"
                            fw={700}
                            c={isSelected ? "white" : isToday ? "blue" : "dark"}
                          >
                            {date.getDate()}
                          </Text>
                          {isToday && !isSelected && (
                            <Box
                              w={4}
                              h={4}
                              bg="blue"
                              style={{
                                borderRadius: "50%",
                                margin: "2px auto 0",
                              }}
                            />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </Flex>
              </ScrollArea>
            </Center>

            <Text c="dimmed" size="xs" ta="center" mt="xs">
              경기 데이터는 실제 경기 종료 후 약 24시간 내에 업데이트됩니다.
            </Text>
          </Paper>

          <Stack gap="sm">
            {scheduleLoading ? (
              <Center p="xl">
                <Loader />
              </Center>
            ) : scheduleError ? (
              <Center p="xl">
                <Text c="red">데이터를 불러오는 중 오류가 발생했습니다.</Text>
              </Center>
            ) : !scheduleData?.matches || scheduleData.matches.length === 0 ? (
              <Center p="xl">
                <Text c="dimmed">해당 날짜에 경기 일정이 없습니다.</Text>
              </Center>
            ) : (
              scheduleData.matches.map((match) => (
                <Card
                  key={match.matchId}
                  p="sm"
                  withBorder
                  radius="sm"
                  bg="gray.0"
                >
                  <Group justify="space-between" align="center">
                    <Text
                      fw={600}
                      size="sm"
                      c="blue.6"
                      w={{ base: 45, sm: 50 }}
                    >
                      {match.scheduledTime}
                    </Text>

                    <Flex
                      style={{ flex: 1, minWidth: 0, overflow: "hidden" }}
                      justify="center"
                      align="center"
                      direction="row"
                      gap={isMobile ? 4 : "md"}
                    >
                      {/* Team A */}
                      <Group
                        gap={isMobile ? 4 : "sm"}
                        justify="flex-end"
                        style={{ flex: "1 1 auto", minWidth: 0 }}
                      >
                        <Text
                          fw={700}
                          size={isMobile ? "md" : "lg"}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            textAlign: "right",
                          }}
                        >
                          {TEAM_NAME_MAP[match.teamA.teamName] ||
                            match.teamA.teamName}
                        </Text>
                        <Text
                          fw={700}
                          size={isMobile ? "md" : "lg"}
                          c={
                            match.teamA.score > match.teamB.score
                              ? "black"
                              : "gray.5"
                          }
                          style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                        >
                          {match.teamA.score}
                        </Text>
                      </Group>

                      <Text
                        fw={500}
                        c="gray.6"
                        size="xs"
                        px="xs"
                        style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                      >
                        VS
                      </Text>

                      {/* Team B */}
                      <Group
                        gap={isMobile ? 4 : "sm"}
                        justify="flex-start"
                        style={{ flex: "1 1 auto", minWidth: 0 }}
                      >
                        <Text
                          fw={700}
                          size={isMobile ? "md" : "lg"}
                          c={
                            match.teamB.score > match.teamA.score
                              ? "black"
                              : "gray.5"
                          }
                          style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                        >
                          {match.teamB.score}
                        </Text>
                        <Text
                          fw={700}
                          size={isMobile ? "md" : "lg"}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            textAlign: "left",
                          }}
                        >
                          {TEAM_NAME_MAP[match.teamB.teamName] ||
                            match.teamB.teamName}
                        </Text>
                      </Group>
                    </Flex>

                    {isMobile ? (
                      <ActionIcon
                        variant="light"
                        color="gray"
                        onClick={() => handleToggleExpand(match.matchId)}
                      >
                        <IconChevronDown size={18} />
                      </ActionIcon>
                    ) : (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleToggleExpand(match.matchId)}
                      >
                        상세정보
                      </Button>
                    )}
                  </Group>

                  {/* 상세 정보 */}
                  <Collapse in={expandedId === match.matchId}>
                    {detailLoading && expandedId === match.matchId ? (
                      <Center p="md">
                        <Loader size="sm" />
                      </Center>
                    ) : matchDetail && expandedId === match.matchId ? (
                      <Stack mt="sm" gap="md">
                        {matchDetail.gameDetails.map((game) => {
                          const winnerSide = game.blueTeam.isWin
                            ? "blue"
                            : "red";

                          return (
                            <Paper
                              key={game.gameNumber}
                              p="md"
                              bg="white"
                              radius="md"
                              withBorder
                            >
                              <Stack gap="sm">
                                <Group justify="space-between" align="center">
                                  <Group gap="sm">
                                    <Text fw={600} size="sm">
                                      Game {game.gameNumber}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                      {formatGameTime(game.gameLengthSeconds)}
                                    </Text>
                                  </Group>
                                  <Button
                                    size="xs"
                                    variant="light"
                                    color="gray"
                                    onClick={() =>
                                      handleNavigateToRecord(game.id)
                                    }
                                  >
                                    기록
                                  </Button>
                                </Group>

                                <Group
                                  justify="center"
                                  align="flex-start"
                                  gap="md"
                                >
                                  {/* Blue Team */}
                                  <Stack gap="xs" align="center">
                                    <Group gap="xs" align="center">
                                      <Text size="xs" fw={600}>
                                        {TEAM_NAME_MAP[
                                          game.blueTeam.teamName
                                        ] || game.blueTeam.teamName}{" "}
                                        <Text
                                          component="span"
                                          c={
                                            winnerSide === "blue"
                                              ? "blue"
                                              : "gray.6"
                                          }
                                          fw={700}
                                        >
                                          ({winnerSide === "blue" ? "승" : "패"}
                                          )
                                        </Text>
                                      </Text>
                                    </Group>
                                    <div
                                      style={{ display: "flex", gap: "4px" }}
                                    >
                                      {game.blueTeam.players.map((player) => (
                                        <div
                                          key={player.playerName}
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            width: "40px",
                                          }}
                                        >
                                          <Avatar
                                            src={getChampionImageUrl(
                                              player.championName
                                            )}
                                            size={32}
                                            radius="md"
                                          />
                                          <Text
                                            size="xs"
                                            mt={2}
                                            style={{
                                              textAlign: "center",
                                              width: "100%",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                            }}
                                          >
                                            {player.playerName}
                                          </Text>
                                        </div>
                                      ))}
                                    </div>
                                  </Stack>

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      height: "32px",
                                      paddingTop: "16px",
                                    }}
                                  >
                                    <Text size="sm" fw={600} c="dimmed">
                                      vs
                                    </Text>
                                  </div>

                                  {/* Red Team */}
                                  <Stack gap="xs" align="center">
                                    <Group gap="xs" align="center">
                                      <Text size="xs" fw={600}>
                                        {TEAM_NAME_MAP[game.redTeam.teamName] ||
                                          game.redTeam.teamName}{" "}
                                        <Text
                                          component="span"
                                          c={
                                            winnerSide === "red"
                                              ? "red"
                                              : "gray.6"
                                          }
                                          fw={700}
                                        >
                                          ({winnerSide === "red" ? "승" : "패"})
                                        </Text>
                                      </Text>
                                    </Group>
                                    <div
                                      style={{ display: "flex", gap: "4px" }}
                                    >
                                      {game.redTeam.players.map((player) => (
                                        <div
                                          key={player.playerName}
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            width: "40px",
                                          }}
                                        >
                                          <Avatar
                                            src={getChampionImageUrl(
                                              player.championName
                                            )}
                                            size={32}
                                            radius="md"
                                          />
                                          <Text
                                            size="xs"
                                            mt={2}
                                            style={{
                                              textAlign: "center",
                                              width: "100%",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                            }}
                                          >
                                            {player.playerName}
                                          </Text>
                                        </div>
                                      ))}
                                    </div>
                                  </Stack>
                                </Group>
                              </Stack>
                            </Paper>
                          );
                        })}
                      </Stack>
                    ) : null}
                  </Collapse>
                </Card>
              ))
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};
