"use client";

import React, { useState, useMemo } from "react";
import {
  Stack,
  Paper,
  Title,
  Group,
  Text,
  Card,
  SimpleGrid,
  Table,
  ScrollArea,
  Select,
  Badge,
  Avatar,
  Box,
  SegmentedControl,
} from "@mantine/core";
import { LineChart } from "@mantine/charts";
import type { GameDetailData, GameDetailPlayer } from "@/entities/games/model/games.dto";

const TIME_SELECTOR_DATA = [
  { label: "10분", value: "10" },
  { label: "15분", value: "15" },
  { label: "20분", value: "20" },
  { label: "25분", value: "25" },
];
const POSITIONS = ["전체", "top", "jng", "mid", "bot", "sup"];
const PLAYER_POSITIONS = ["top", "jng", "mid", "bot", "sup"];
const METRICS = [
  { value: "gold", label: "골드" },
  { value: "xp", label: "경험치" },
  { value: "cs", label: "CS" },
  { value: "kills", label: "킬" },
  { value: "deaths", label: "데스" },
  { value: "assists", label: "어시스트" },
];
const TIME_POINTS = [10, 15, 20, 25];

const createTimelineKey = (metric: string, time: number) => `${metric}At${time}`;

// 플레이어 객체에서 동적 키로 값을 가져오는 헬퍼 함수
const getPlayerValue = (
  player: GameDetailPlayer | null | undefined,
  key: string
): number => {
  if (!player) return 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (player as any)[key] ?? 0;
};

// 플레이어 객체에서 문자열 값을 가져오는 헬퍼 함수
const getPlayerStringValue = (
  player: GameDetailPlayer | null | undefined,
  key: string
): string => {
  if (!player) return "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (player as any)[key] ?? "";
};

interface ChartTooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomChartTooltipProps {
  label?: string | number;
  payload?: readonly ChartTooltipPayload[];
  active?: boolean;
}

function CustomChartTooltip({ label, payload, active }: CustomChartTooltipProps) {
  if (active && payload?.length) {
    return (
      <Paper px="sm" py="xs" withBorder shadow="sm" radius="sm">
        <Text fw={700} mb={5}>
          {label}
        </Text>
        {payload.map((item) => (
          <Group key={item.name} gap="xs" justify="space-between">
            <Group gap="xs" align="center">
              <Box
                w={10}
                h={10}
                bg={item.color}
                style={{ borderRadius: "50%" }}
              />
              <Text size="sm">{item.name}</Text>
            </Group>
            <Text size="sm" fw={500}>
              {item.value.toLocaleString()}
            </Text>
          </Group>
        ))}
      </Paper>
    );
  }
  return null;
}

interface TimelineAnalysisTabProps {
  gameData: GameDetailData;
  getChampionImageUrl: (name: string) => string;
}

export function TimelineAnalysisTab({
  gameData,
  getChampionImageUrl,
}: TimelineAnalysisTabProps) {
  const [selectedPosition, setSelectedPosition] = useState("전체");
  const [selectedMetric, setSelectedMetric] = useState("gold");
  const [selectedTime, setSelectedTime] = useState("25");

  const processedData = useMemo(() => {
    if (!gameData?.players?.length) return null;

    const teamNameMap: Record<string, string> = {
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

    const bluePlayers = gameData.players.filter(
      (p) => p.side.toLowerCase() === "blue"
    );
    const redPlayers = gameData.players.filter(
      (p) => p.side.toLowerCase() === "red"
    );
    if (bluePlayers.length === 0 || redPlayers.length === 0) return null;

    const blueTeamFullName = bluePlayers[0]?.teamname || "Blue Team";
    const redTeamFullName = redPlayers[0]?.teamname || "Red Team";

    const calculateTeamTotals = (players: GameDetailPlayer[]) => {
      const totals: Record<number, Record<string, number>> = {};
      TIME_POINTS.forEach((time) => {
        totals[time] = {};
        METRICS.forEach((metricInfo) => {
          const key = createTimelineKey(metricInfo.value, time);
          totals[time][metricInfo.value] = players.reduce(
            (sum, p) => sum + getPlayerValue(p, key),
            0
          );
        });
      });
      return totals;
    };

    return {
      blueTeam: {
        name: teamNameMap[blueTeamFullName] || blueTeamFullName,
        players: bluePlayers,
        totalsByTime: calculateTeamTotals(bluePlayers),
      },
      redTeam: {
        name: teamNameMap[redTeamFullName] || redTeamFullName,
        players: redPlayers,
        totalsByTime: calculateTeamTotals(redPlayers),
      },
    };
  }, [gameData]);

  const chartData = useMemo(() => {
    if (!processedData) return [];
    const isTotalView = selectedPosition === "전체";
    const bluePlayer = isTotalView
      ? null
      : processedData.blueTeam.players.find(
          (p) => p.position === selectedPosition
        );
    const redPlayer = isTotalView
      ? null
      : processedData.redTeam.players.find(
          (p) => p.position === selectedPosition
        );
    return TIME_POINTS.map((time) => {
      const key = createTimelineKey(selectedMetric, time);
      const blueValue = isTotalView
        ? processedData.blueTeam.totalsByTime[time][selectedMetric]
        : getPlayerValue(bluePlayer, key);
      const redValue = isTotalView
        ? processedData.redTeam.totalsByTime[time][selectedMetric]
        : getPlayerValue(redPlayer, key);
      return {
        time: `${time}분`,
        [processedData.blueTeam.name]: blueValue,
        [processedData.redTeam.name]: redValue,
      };
    });
  }, [processedData, selectedPosition, selectedMetric]);

  if (!processedData) {
    return (
      <Paper p="lg" withBorder mt="lg" radius="sm">
        <Text ta="center" c="dimmed">
          타임라인 데이터를 표시할 수 없습니다.
        </Text>
      </Paper>
    );
  }

  const { blueTeam, redTeam } = processedData;
  const isTotalView = selectedPosition === "전체";

  const getDifference = (time: number) => {
    const key = createTimelineKey(selectedMetric, time);
    if (isTotalView) {
      return (
        blueTeam.totalsByTime[time][selectedMetric] -
        redTeam.totalsByTime[time][selectedMetric]
      );
    }
    const bluePlayer = blueTeam.players.find(
      (p) => p.position === selectedPosition
    );
    const redPlayer = redTeam.players.find(
      (p) => p.position === selectedPosition
    );
    return getPlayerValue(bluePlayer, key) - getPlayerValue(redPlayer, key);
  };

  const positionDisplayText = isTotalView
    ? "팀 전체"
    : selectedPosition.toUpperCase();
  const metricLabel =
    METRICS.find((m) => m.value === selectedMetric)?.label || "";

  return (
    <Stack gap="lg" mt="lg">
      {/* 필터 */}
      <Paper p="md" withBorder radius="sm">
        <Group gap="md" wrap="wrap">
          <Select
            label="포지션"
            value={selectedPosition}
            onChange={(v) => setSelectedPosition(v || "전체")}
            data={POSITIONS}
            style={{ minWidth: 120 }}
          />
          <Select
            label="지표"
            value={selectedMetric}
            onChange={(v) => setSelectedMetric(v || "gold")}
            data={METRICS.slice(0, 4)}
            style={{ minWidth: 120 }}
          />
        </Group>
      </Paper>

      {/* 시간대별 차트 */}
      <Paper p="lg" withBorder radius="sm">
        <Title order={3}>
          {positionDisplayText} {metricLabel} 추이
        </Title>
        <LineChart
          h={300}
          data={chartData}
          dataKey="time"
          series={[
            { name: blueTeam.name, color: "blue.6" },
            { name: redTeam.name, color: "red.6" },
          ]}
          curveType="linear"
          withLegend={false}
          tooltipProps={{ content: CustomChartTooltip }}
        />
        <Group justify="center" mt="md" gap="lg">
          <Group gap="xs">
            <Box w={12} h={3} bg="blue.6" />
            <Text size="sm">{blueTeam.name}</Text>
          </Group>
          <Group gap="xs">
            <Box w={12} h={3} bg="red.6" />
            <Text size="sm">{redTeam.name}</Text>
          </Group>
        </Group>
      </Paper>

      {/* 차이 분석 카드 */}
      <Paper p="lg" withBorder radius="sm">
        <Title order={3} mb="md">
          {positionDisplayText} 시간대별 {metricLabel} 격차
        </Title>
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          {TIME_POINTS.map((time) => {
            const diff = getDifference(time);
            const isBlueAhead = diff >= 0;
            const leadTeam = isBlueAhead ? blueTeam : redTeam;
            const leadColor = isBlueAhead ? "blue" : "red";
            return (
              <Card key={time} p="md" withBorder radius="sm">
                <Stack align="center" gap="xs">
                  <Text size="sm" fw={600}>
                    {time}분
                  </Text>
                  <Badge variant="light" color={leadColor} size="lg" radius="sm">
                    {leadTeam.name} 우세
                  </Badge>
                  <Text size="lg" fw={700} c={leadColor}>
                    +{Math.abs(diff).toLocaleString()}
                  </Text>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      </Paper>

      {/* 상세 지표 테이블 */}
      <Paper p="lg" withBorder radius="sm">
        <Title order={3} mb="md">
          팀 전체 상세 지표
        </Title>
        <ScrollArea>
          <Table
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            miw={800}
          >
            <Table.Thead>
              <Table.Tr>
                {["시간", "팀", ...METRICS.map((m) => m.label)].map((h) => (
                  <Table.Th key={h}>{h}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {TIME_POINTS.map((time) => (
                <React.Fragment key={time}>
                  <Table.Tr>
                    <Table.Td rowSpan={2}>
                      <Text fw={600}>{time}분</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light" radius="sm">
                        {blueTeam.name}
                      </Badge>
                    </Table.Td>
                    {METRICS.map((m) => (
                      <Table.Td key={`${time}-blue-${m.value}`}>
                        {blueTeam.totalsByTime[time][m.value].toLocaleString()}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Badge color="red" variant="light" radius="sm">
                        {redTeam.name}
                      </Badge>
                    </Table.Td>
                    {METRICS.map((m) => (
                      <Table.Td key={`${time}-red-${m.value}`}>
                        {redTeam.totalsByTime[time][m.value].toLocaleString()}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                </React.Fragment>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      {/* 포지션별 지표 비교 테이블 */}
      <Paper p="lg" withBorder radius="sm">
        <Stack gap="md">
          <Title order={3}>
            {selectedTime}분 포지션별 지표 비교
          </Title>
          <SegmentedControl
            value={selectedTime}
            onChange={setSelectedTime}
            data={TIME_SELECTOR_DATA}
            color="blue"
            fullWidth
          />
        </Stack>
        <ScrollArea mt="md">
          <Table
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            miw={700}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>포지션</Table.Th>
                <Table.Th>선수</Table.Th>
                <Table.Th>골드 (격차)</Table.Th>
                <Table.Th>CS (격차)</Table.Th>
                <Table.Th>K/D/A</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {PLAYER_POSITIONS.map((pos) => {
                const blueP = blueTeam.players.find(
                  (p) => p.position.toLowerCase() === pos
                );
                const redP = redTeam.players.find(
                  (p) => p.position.toLowerCase() === pos
                );

                const goldDiff = getPlayerValue(blueP, `goldDiffAt${selectedTime}`);
                const csDiff = getPlayerValue(blueP, `csdiffAt${selectedTime}`);

                return (
                  <React.Fragment key={pos}>
                    <Table.Tr>
                      <Table.Td rowSpan={2}>
                        <Text fw={600} tt="uppercase">
                          {pos}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" wrap="nowrap">
                          {getPlayerStringValue(blueP, "champion") && (
                            <Avatar
                              src={getChampionImageUrl(getPlayerStringValue(blueP, "champion"))}
                              size={24}
                              radius="sm"
                            />
                          )}
                          <Text size="sm">
                            {getPlayerStringValue(blueP, "playername") || "N/A"}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} wrap="nowrap">
                          <Text size="sm">
                            {getPlayerValue(blueP, createTimelineKey("gold", parseInt(selectedTime))).toLocaleString()}
                          </Text>
                          <Text
                            c={goldDiff >= 0 ? "blue" : "red"}
                            size="xs"
                          >
                            ({goldDiff >= 0 ? "+" : ""}
                            {goldDiff})
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} wrap="nowrap">
                          <Text size="sm">
                            {getPlayerValue(blueP, createTimelineKey("cs", parseInt(selectedTime)))}
                          </Text>
                          <Text
                            c={csDiff >= 0 ? "blue" : "red"}
                            size="xs"
                          >
                            ({csDiff >= 0 ? "+" : ""}
                            {csDiff})
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        {getPlayerValue(blueP, createTimelineKey("kills", parseInt(selectedTime)))}/
                        {getPlayerValue(blueP, createTimelineKey("deaths", parseInt(selectedTime)))}/
                        {getPlayerValue(blueP, createTimelineKey("assists", parseInt(selectedTime)))}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Group gap="xs" wrap="nowrap">
                          {getPlayerStringValue(redP, "champion") && (
                            <Avatar
                              src={getChampionImageUrl(getPlayerStringValue(redP, "champion"))}
                              size={24}
                              radius="sm"
                            />
                          )}
                          <Text size="sm">
                            {getPlayerStringValue(redP, "playername") || "N/A"}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} wrap="nowrap">
                          <Text size="sm">
                            {getPlayerValue(redP, createTimelineKey("gold", parseInt(selectedTime))).toLocaleString()}
                          </Text>
                          <Text
                            c={goldDiff <= 0 ? "blue" : "red"}
                            size="xs"
                          >
                            ({goldDiff <= 0 ? "+" : ""}
                            {-goldDiff})
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} wrap="nowrap">
                          <Text size="sm">
                            {getPlayerValue(redP, createTimelineKey("cs", parseInt(selectedTime)))}
                          </Text>
                          <Text
                            c={csDiff <= 0 ? "blue" : "red"}
                            size="xs"
                          >
                            ({csDiff <= 0 ? "+" : ""}
                            {-csDiff})
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        {getPlayerValue(redP, createTimelineKey("kills", parseInt(selectedTime)))}/
                        {getPlayerValue(redP, createTimelineKey("deaths", parseInt(selectedTime)))}/
                        {getPlayerValue(redP, createTimelineKey("assists", parseInt(selectedTime)))}
                      </Table.Td>
                    </Table.Tr>
                  </React.Fragment>
                );
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </Stack>
  );
}
