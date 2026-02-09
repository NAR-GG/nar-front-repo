"use client";

import { useState, useMemo } from "react";
import { Stack, Paper, Text, Table, Select, Avatar } from "@mantine/core";
import type {
  GameDetailData,
  GameDetailPlayer,
} from "@/entities/games/model/games.dto";
import { IconChevronDown } from "@tabler/icons-react";
import { TimelineChart } from "./timeline-chart/timeline-chart";
import { buildChartData } from "./timeline-chart/timeline-chart.utils";

import NarGrayTop from "@/shared/assets/icons/nar_gray_top.svg";
import NarGrayJungle from "@/shared/assets/icons/nar_gray_jungle.svg";
import NarGrayMid from "@/shared/assets/icons/nar_gray_mid.svg";
import NarGrayBottom from "@/shared/assets/icons/nar_gray_bottom.svg";
import NarGraySupport from "@/shared/assets/icons/nar_gray_support.svg";

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

const TEAM_DETAIL_METRICS = [
  { value: "gold", label: "골드" },
  { value: "xp", label: "경험치" },
  { value: "cs", label: "CS" },
  { value: "kda", label: "KDA" },
];

const createTimelineKey = (metric: string, time: number) =>
  `${metric}At${time}`;

const formatDiff = (value: number): string => {
  if (value === 0) return "0";
  const absValue = Math.abs(value);
  const sign = value > 0 ? "+" : "";
  if (absValue >= 1000) {
    return `${sign}${(value / 1000).toFixed(1)}k`;
  }
  return `${sign}${value}`;
};

const getPlayerValue = (
  player: GameDetailPlayer | null | undefined,
  key: string,
): number => {
  if (!player) return 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (player as any)[key] ?? 0;
};

// 플레이어 객체에서 문자열 값을 가져오는 헬퍼 함수
const getPlayerStringValue = (
  player: GameDetailPlayer | null | undefined,
  key: string,
): string => {
  if (!player) return "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (player as any)[key] ?? "";
};

const POSITION_FILTER_DATA = [
  { value: "전체", label: "전체" },
  { value: "top", label: "탑" },
  { value: "jng", label: "정글" },
  { value: "mid", label: "미드" },
  { value: "bot", label: "원딜" },
  { value: "sup", label: "서폿" },
];

const METRIC_FILTER_DATA = [
  { value: "gold", label: "골드" },
  { value: "xp", label: "경험치" },
  { value: "cs", label: "CS" },
  { value: "kills", label: "킬" },
];

const TIME_FILTER_DATA = [
  { label: "10m", value: "10" },
  { label: "15m", value: "15" },
  { label: "20m", value: "20" },
  { label: "25m", value: "25" },
];

const tableWrapperStyle: React.CSSProperties = {
  backgroundColor: "var(--nar-bg-primary)",
  border: "1px solid var(--nar-line-2)",
  borderRadius: 24,
  overflowX: "auto",
};

const tableStyles = {
  th: { height: 48 },
  td: { height: 48 },
};

const POSITION_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  top: NarGrayTop,
  jng: NarGrayJungle,
  mid: NarGrayMid,
  bot: NarGrayBottom,
  sup: NarGraySupport,
};

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
      (p) => p.side.toLowerCase() === "blue",
    );
    const redPlayers = gameData.players.filter(
      (p) => p.side.toLowerCase() === "red",
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
            0,
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
    return buildChartData(
      processedData.blueTeam,
      processedData.redTeam,
      selectedPosition,
      selectedMetric,
    );
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

  const positionDisplayText = isTotalView
    ? "팀 전체"
    : selectedPosition.toUpperCase();
  const metricLabel =
    METRICS.find((m) => m.value === selectedMetric)?.label || "";

  return (
    <div className="bg-[var(--nar-bg-secondary)] w-full flex flex-col items-center justify-center px-[19.5px] py-[30px] gap-15">
      <div className="flex flex-col w-full gap-6">
        <Text c="--nar-text-secondary" fw={600} fz={{base: 20,sm: 28}}>
          {positionDisplayText} {metricLabel} 추이
        </Text>
        <div className="flex w-full gap-6">
          <Select
            label="포지션"
            value={selectedPosition}
            onChange={(v) => setSelectedPosition(v || "전체")}
            data={POSITION_FILTER_DATA}
            style={{ minWidth: 120 }}
            rightSection={<IconChevronDown size={18} />}
            checkIconPosition="right"
          />
          <Select
            label="지표"
            value={selectedMetric}
            onChange={(v) => setSelectedMetric(v || "gold")}
            data={METRIC_FILTER_DATA}
            style={{ minWidth: 120 }}
            rightSection={<IconChevronDown size={18} />}
            checkIconPosition="right"
          />
        </div>
      </div>

      <TimelineChart
        chartData={chartData}
        blueTeamName={blueTeam.name}
        redTeamName={redTeam.name}
        selectedMetric={selectedMetric}
      />

      <div className="flex flex-col w-full gap-6">
        <Text c="--nar-text-secondary" fw={600} fz={{base: 20,sm: 28}}>
          팀 전체 상세 지표
        </Text>
        <div className="flex w-full gap-6">
          <Select
            value={selectedTime}
            onChange={(v) => setSelectedTime(v || "10")}
            data={TIME_FILTER_DATA}
            style={{ minWidth: 120 }}
            rightSection={<IconChevronDown size={18} />}
            checkIconPosition="right"
          />
        </div>
        <div style={tableWrapperStyle}>
          <Table miw={{ base: 0, sm: 600 }} styles={tableStyles}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={60}></Table.Th>
                <Table.Th ta="center">
                  <div className="flex items-start sm:items-center flex-col sm:flex-row justify-center w-fit mx-auto">
                    <Text c="blue" fw={600} fz={{ base: 14, sm: 16 }}>
                      {blueTeam.name}
                    </Text>
                    <Text c="blue" fw={400} fz={{ base: 14, sm: 16 }}>
                      (Blue side)
                    </Text>
                  </div>
                </Table.Th>
                <Table.Th ta="center" w={{ base: 70, sm: 150 }} className="bg-(--nar-purple-opacity5)">
                  <Text fw={600} c="var(--nar-purple-1)">
                    격차
                  </Text>
                </Table.Th>
                <Table.Th ta="center">
                  <div className="flex items-start sm:items-center flex-col sm:flex-row justify-center w-fit mx-auto">
                    <Text c="red" fw={600} fz={{ base: 14, sm: 16 }}>
                      {redTeam.name}
                    </Text>
                    <Text c="red" fw={400} fz={{ base: 14, sm: 16 }}>
                      (Red side)
                    </Text>
                  </div>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {TEAM_DETAIL_METRICS.map((metric) => {
                const timeNum = parseInt(selectedTime);
                let blueValue: number | string;
                let redValue: number | string;
                let diff: string;

                if (metric.value === "kda") {
                  const blueKills = blueTeam.totalsByTime[timeNum]?.kills ?? 0;
                  const blueDeaths =
                    blueTeam.totalsByTime[timeNum]?.deaths ?? 0;
                  const blueAssists =
                    blueTeam.totalsByTime[timeNum]?.assists ?? 0;
                  const redKills = redTeam.totalsByTime[timeNum]?.kills ?? 0;
                  const redDeaths = redTeam.totalsByTime[timeNum]?.deaths ?? 0;
                  const redAssists =
                    redTeam.totalsByTime[timeNum]?.assists ?? 0;

                  blueValue = `${blueKills}/${blueDeaths}/${blueAssists}`;
                  redValue = `${redKills}/${redDeaths}/${redAssists}`;
                  diff = "-";
                } else {
                  blueValue =
                    blueTeam.totalsByTime[timeNum]?.[metric.value] ?? 0;
                  redValue = redTeam.totalsByTime[timeNum]?.[metric.value] ?? 0;
                  const diffNum = (blueValue as number) - (redValue as number);
                  diff = formatDiff(diffNum);
                }

                const diffColor =
                  diff === "-"
                    ? "dimmed"
                    : diff.startsWith("+")
                      ? "blue"
                      : diff === "0"
                        ? "dimmed"
                        : "red";

                return (
                  <Table.Tr key={metric.value}>
                    <Table.Td>
                      <Text fw={400} fz={{ base: 12, sm: 14 }} c="var(--nar-text-tertiary-sub)">
                        {metric.label}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Text c="blue" fz={{ base: 14, sm: 16 }}>
                        {typeof blueValue === "number"
                          ? blueValue.toLocaleString()
                          : blueValue}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center" className="bg-(--nar-bg-tertiary)">
                      <Text c={diffColor} fz={{ base: 14, sm: 16 }} fw={500}>
                        {diff}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Text c="red" fz={{ base: 14, sm: 16 }}>
                        {typeof redValue === "number"
                          ? redValue.toLocaleString()
                          : redValue}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col w-full gap-6">
        <Text c="--nar-text-secondary" fw={600} fz={{base: 20,sm: 28}}>
          {selectedTime}분 포지션별 지표 비교
        </Text>
        <div className="flex w-full gap-6">
          <Select
            value={selectedTime}
            onChange={(v) => setSelectedTime(v || "10")}
            data={TIME_FILTER_DATA}
            style={{ minWidth: 120 }}
            rightSection={<IconChevronDown size={18} />}
            checkIconPosition="right"
          />
        </div>

        <Stack gap="lg">
          {PLAYER_POSITIONS.map((pos) => {
            const blueP = blueTeam.players.find(
              (p) => p.position.toLowerCase() === pos,
            );
            const redP = redTeam.players.find(
              (p) => p.position.toLowerCase() === pos,
            );

            const timeNum = parseInt(selectedTime);
            const blueGold = getPlayerValue(
              blueP,
              createTimelineKey("gold", timeNum),
            );
            const redGold = getPlayerValue(
              redP,
              createTimelineKey("gold", timeNum),
            );
            const goldDiff = blueGold - redGold;

            const blueCs = getPlayerValue(
              blueP,
              createTimelineKey("cs", timeNum),
            );
            const redCs = getPlayerValue(
              redP,
              createTimelineKey("cs", timeNum),
            );
            const csDiff = blueCs - redCs;

            const blueKills = getPlayerValue(
              blueP,
              createTimelineKey("kills", timeNum),
            );
            const blueDeaths = getPlayerValue(
              blueP,
              createTimelineKey("deaths", timeNum),
            );
            const blueAssists = getPlayerValue(
              blueP,
              createTimelineKey("assists", timeNum),
            );
            const redKills = getPlayerValue(
              redP,
              createTimelineKey("kills", timeNum),
            );
            const redDeaths = getPlayerValue(
              redP,
              createTimelineKey("deaths", timeNum),
            );
            const redAssists = getPlayerValue(
              redP,
              createTimelineKey("assists", timeNum),
            );

            return (
              <div key={pos} style={tableWrapperStyle}>
                <Table styles={tableStyles}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th w={60}></Table.Th>
                      <Table.Th ta="center">
                        <div className="flex items-start sm:items-center flex-col sm:flex-row justify-center gap-1 w-fit mx-auto">
                          <Text c="blue" fw={600} fz={{ base: 14, sm: 16 }}>
                            {blueTeam.name}
                          </Text>
                          <Text c="blue" fw={400} fz={{ base: 14, sm: 16 }}>
                            (Blue side)
                          </Text>
                        </div>
                      </Table.Th>
                      <Table.Th
                        ta="center"
                        w={{ base: 70, sm: 150 }}
                        className="bg-[var(--nar-purple-opacity5)]"
                      >
                        <Text fw={600} c="var(--nar-purple-1)">
                          격차
                        </Text>
                      </Table.Th>
                      <Table.Th ta="center">
                        <div className="flex items-start sm:items-center flex-col sm:flex-row justify-center gap-1 w-fit mx-auto">
                          <Text c="red" fw={600} fz={{ base: 14, sm: 16 }}>
                            {redTeam.name}
                          </Text>
                          <Text c="red" fw={400} fz={{ base: 14, sm: 16 }}>
                            (Red side)
                          </Text>
                        </div>
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>
                        {(() => {
                          const Icon = POSITION_ICONS[pos];
                          return Icon ? <Icon width={34} height={34} /> : null;
                        })()}
                      </Table.Td>
                      <Table.Td ta="center">
                        <div className="flex flex-col items-center justify-center">
                          {getPlayerStringValue(blueP, "champion") && (
                            <Avatar
                              src={getChampionImageUrl(
                                getPlayerStringValue(blueP, "champion"),
                              )}
                              size={32}
                              radius="sm"
                            />
                          )}
                          <Text fz={{ base: 14, sm: 16 }}>
                            {getPlayerStringValue(blueP, "playername") || "N/A"}
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td
                        ta="center"
                        className="bg-[var(--nar-bg-tertiary)]"
                      ></Table.Td>
                      <Table.Td ta="center">
                        <div className="flex flex-col items-center justify-center">
                          {getPlayerStringValue(redP, "champion") && (
                            <Avatar
                              src={getChampionImageUrl(
                                getPlayerStringValue(redP, "champion"),
                              )}
                              size={32}
                              radius="sm"
                            />
                          )}
                          <Text fz={{ base: 14, sm: 16 }}>
                            {getPlayerStringValue(redP, "playername") || "N/A"}
                          </Text>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Text fw={500} fz={{ base: 12, sm: 14 }} c="var(--nar-text-tertiary-sub)">
                          골드
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="blue"  fz={{base: 14,sm: 16}}>{blueGold.toLocaleString()}</Text>
                      </Table.Td>
                      <Table.Td
                        ta="center"
                        className="bg-[var(--nar-bg-tertiary)]"
                      >
                        <Text
                          c={
                            goldDiff > 0
                              ? "blue"
                              : goldDiff < 0
                                ? "red"
                                : "dimmed"
                          }
                          fw={500}
                           fz={{base: 14,sm: 16}}
                        >
                          {formatDiff(goldDiff)}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="red"  fz={{base: 14,sm: 16}}>{redGold.toLocaleString()}</Text>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Text fw={400} fz={{base: 12,sm: 14}} c="var(--nar-text-tertiary-sub)">
                          CS
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="blue"  fz={{base: 14,sm: 16}}>{blueCs}</Text>
                      </Table.Td>
                      <Table.Td
                        ta="center"
                        className="bg-[var(--nar-bg-tertiary)]"
                      >
                        <Text
                          c={
                            csDiff > 0 ? "blue" : csDiff < 0 ? "red" : "dimmed"
                          }
                          fw={500}
                          fz={{base: 14,sm: 16}}
                        >
                          {formatDiff(csDiff)}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="red"  fz={{base: 14,sm: 16}}>{redCs}</Text>
                      </Table.Td>
                    </Table.Tr>
                    {/* K/D/A 행 */}
                    <Table.Tr>
                      <Table.Td>
                        <Text fw={400} fz={{ base: 12, sm: 14 }} c="var(--nar-text-tertiary-sub)">
                          K/D/A
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="blue" fz={{base: 14,sm: 16}}>
                          {blueKills}/{blueDeaths}/{blueAssists}
                        </Text>
                      </Table.Td>
                      <Table.Td
                        ta="center"
                        className="bg-[var(--nar-bg-tertiary)]"
                      >
                        <Text c="dimmed" fw={500} fz={{base: 14,sm: 16}}>
                          -
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="red" fz={{base: 14,sm: 16}}>
                          {redKills}/{redDeaths}/{redAssists}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
            );
          })}
        </Stack>
      </div>
    </div>
  );
}
