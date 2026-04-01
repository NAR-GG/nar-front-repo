"use client";

import { useState, useMemo } from "react";
import { Stack, Text, Table, Select, Avatar } from "@mantine/core";
import type { GameDetailPlayer } from "@/entities/games/api/games.dto";
import { IconChevronDown } from "@tabler/icons-react";
import { TimelineChart } from "./timeline-chart/timeline-chart";
import { buildChartData } from "./timeline-chart/timeline-chart.utils";
import { formatDiff } from "@/shared/lib/format-game-time";
import { POSITION_FILTER_OPTIONS } from "@/shared/config/positions";
import type { ProcessedTeamViewModel } from "../model/game-record.view-model";
import {
  getTeamAbbreviation,
  createTimelineKey,
  getPlayerValue,
  getPlayerStringValue,
  calculateTeamTotalsByTime,
  getDiffColor,
} from "../lib/game-record.lib";

import NarGrayTop from "@/shared/assets/icons/nar_gray_top.svg";
import NarGrayJungle from "@/shared/assets/icons/nar_gray_jungle.svg";
import NarGrayMid from "@/shared/assets/icons/nar_gray_mid.svg";
import NarGrayBottom from "@/shared/assets/icons/nar_gray_bottom.svg";
import NarGraySupport from "@/shared/assets/icons/nar_gray_support.svg";

import {
  TIMELINE_CONFIG,
  TIMELINE_FILTER_OPTIONS,
} from "../config/game-record.config";

const tableStyles = {
  th: { height: 48 },
  td: { height: 48 },
};

const POSITION_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> =
  {
    top: NarGrayTop,
    jng: NarGrayJungle,
    mid: NarGrayMid,
    bot: NarGrayBottom,
    sup: NarGraySupport,
  };

interface TimelineAnalysisTabProps {
  blueTeam: ProcessedTeamViewModel;
  redTeam: ProcessedTeamViewModel;
  getChampionImageUrl: (name: string) => string;
}

export function TimelineAnalysisTab({
  blueTeam: blueTeamRaw,
  redTeam: redTeamRaw,
  getChampionImageUrl,
}: TimelineAnalysisTabProps) {
  const [selectedPosition, setSelectedPosition] = useState("전체");
  const [selectedMetric, setSelectedMetric] = useState("gold");
  const [selectedTime, setSelectedTime] = useState("25");

  const processedData = useMemo(() => {
    if (!blueTeamRaw.players.length || !redTeamRaw.players.length) return null;

    return {
      blueTeam: {
        name: getTeamAbbreviation(blueTeamRaw.name),
        players: blueTeamRaw.players,
        totalsByTime: calculateTeamTotalsByTime(
          blueTeamRaw.players,
          TIMELINE_CONFIG.timePoints,
          TIMELINE_CONFIG.metrics,
        ),
      },
      redTeam: {
        name: getTeamAbbreviation(redTeamRaw.name),
        players: redTeamRaw.players,
        totalsByTime: calculateTeamTotalsByTime(
          redTeamRaw.players,
          TIMELINE_CONFIG.timePoints,
          TIMELINE_CONFIG.metrics,
        ),
      },
    };
  }, [blueTeamRaw, redTeamRaw]);

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
      <div className="p-6 text-center">
        <Text ta="center" c="dimmed">
          타임라인 데이터를 표시할 수 없습니다.
        </Text>
      </div>
    );
  }

  const { blueTeam, redTeam } = processedData;
  const isTotalView = selectedPosition === "전체";

  const positionDisplayText = isTotalView
    ? "팀 전체"
    : selectedPosition.toUpperCase();
  const metricLabel =
    TIMELINE_FILTER_OPTIONS.chartMetric.find((m) => m.value === selectedMetric)?.label ?? "";

  const renderTeamHeader = (teamName: string, side: "blue" | "red") => (
    <div className="flex items-start sm:items-center flex-col sm:flex-row justify-center w-fit mx-auto">
      <Text c={side} fw={600} fz={{ base: 14, sm: 16 }}>
        {teamName}
      </Text>
      <Text c={side} fw={400} fz={{ base: 14, sm: 16 }}>
        ({side === "blue" ? "Blue" : "Red"} side)
      </Text>
    </div>
  );

  return (
    <div className="bg-[var(--nar-bg-secondary)] w-full flex flex-col items-center justify-center px-[19.5px] py-[30px] gap-15">
      <div className="flex flex-col w-full gap-6">
        <Text c="--nar-text-secondary" fw={600} fz={{ base: 20, sm: 28 }}>
          {positionDisplayText} {metricLabel} 추이
        </Text>
        <div className="flex w-full gap-6">
          <Select
            label="포지션"
            value={selectedPosition}
            onChange={(v) => setSelectedPosition(v || "전체")}
            data={POSITION_FILTER_OPTIONS}
            className="min-w-30"
            rightSection={<IconChevronDown size={18} />}
            checkIconPosition="right"
          />
          <Select
            label="지표"
            value={selectedMetric}
            onChange={(v) => setSelectedMetric(v || "gold")}
            data={TIMELINE_FILTER_OPTIONS.metric}
            className="min-w-30"
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
        <Text c="--nar-text-secondary" fw={600} fz={{ base: 20, sm: 28 }}>
          팀 전체 상세 지표
        </Text>
        <div className="flex w-full gap-6">
          <Select
            value={selectedTime}
            onChange={(v) => setSelectedTime(v || "10")}
            data={TIMELINE_FILTER_OPTIONS.time}
            className="min-w-30"
            rightSection={<IconChevronDown size={18} />}
            checkIconPosition="right"
          />
        </div>
        <div className="bg-(--nar-bg-primary) border border-(--nar-line-2) rounded-3xl overflow-x-auto">
          <Table miw={{ base: 0, sm: 600 }} styles={tableStyles}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={60}></Table.Th>
                <Table.Th ta="center">
                  {renderTeamHeader(blueTeam.name, "blue")}
                </Table.Th>
                <Table.Th
                  ta="center"
                  w={{ base: 70, sm: 150 }}
                  className="bg-(--nar-purple-opacity5)"
                >
                  <Text fw={600} c="var(--nar-purple-1)">
                    격차
                  </Text>
                </Table.Th>
                <Table.Th ta="center">
                  {renderTeamHeader(redTeam.name, "red")}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {TIMELINE_FILTER_OPTIONS.teamDetailMetric.map((metric) => {
                const timeNum = parseInt(selectedTime);
                let blueValue: number | string;
                let redValue: number | string;
                let diff: string;

                if (metric.value === "kda") {
                  blueValue = `${blueTeam.totalsByTime[timeNum]?.kills ?? 0}/${blueTeam.totalsByTime[timeNum]?.deaths ?? 0}/${blueTeam.totalsByTime[timeNum]?.assists ?? 0}`;
                  redValue = `${redTeam.totalsByTime[timeNum]?.kills ?? 0}/${redTeam.totalsByTime[timeNum]?.deaths ?? 0}/${redTeam.totalsByTime[timeNum]?.assists ?? 0}`;
                  diff = "-";
                } else {
                  blueValue = blueTeam.totalsByTime[timeNum]?.[metric.value] ?? 0;
                  redValue = redTeam.totalsByTime[timeNum]?.[metric.value] ?? 0;
                  diff = formatDiff((blueValue as number) - (redValue as number));
                }

                return (
                  <Table.Tr key={metric.value}>
                    <Table.Td>
                      <Text
                        fw={400}
                        fz={{ base: 12, sm: 14 }}
                        c="var(--nar-text-tertiary-sub)"
                      >
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
                      <Text
                        c={getDiffColor(diff)}
                        fz={{ base: 14, sm: 16 }}
                        fw={500}
                      >
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
        <Text c="--nar-text-secondary" fw={600} fz={{ base: 20, sm: 28 }}>
          {selectedTime}분 포지션별 지표 비교
        </Text>
        <div className="flex w-full gap-6">
          <Select
            value={selectedTime}
            onChange={(v) => setSelectedTime(v || "10")}
            data={TIMELINE_FILTER_OPTIONS.time}
            className="min-w-30"
            rightSection={<IconChevronDown size={18} />}
            checkIconPosition="right"
          />
        </div>

        <Stack gap="lg">
          {TIMELINE_CONFIG.positions.map((pos) => {
            const blueP = blueTeam.players.find(
              (p: GameDetailPlayer) => p.position.toLowerCase() === pos,
            );
            const redP = redTeam.players.find(
              (p: GameDetailPlayer) => p.position.toLowerCase() === pos,
            );

            const timeNum = parseInt(selectedTime);
            const blueGold = getPlayerValue(blueP, createTimelineKey("gold", timeNum));
            const redGold = getPlayerValue(redP, createTimelineKey("gold", timeNum));
            const blueCs = getPlayerValue(blueP, createTimelineKey("cs", timeNum));
            const redCs = getPlayerValue(redP, createTimelineKey("cs", timeNum));
            const blueKills = getPlayerValue(blueP, createTimelineKey("kills", timeNum));
            const blueDeaths = getPlayerValue(blueP, createTimelineKey("deaths", timeNum));
            const blueAssists = getPlayerValue(blueP, createTimelineKey("assists", timeNum));
            const redKills = getPlayerValue(redP, createTimelineKey("kills", timeNum));
            const redDeaths = getPlayerValue(redP, createTimelineKey("deaths", timeNum));
            const redAssists = getPlayerValue(redP, createTimelineKey("assists", timeNum));
            const goldDiff = blueGold - redGold;
            const csDiff = blueCs - redCs;

            return (
              <div
                key={pos}
                className="bg-(--nar-bg-primary) border border-(--nar-line-2) rounded-3xl overflow-x-auto"
              >
                <Table styles={tableStyles}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th w={60}></Table.Th>
                      <Table.Th ta="center">
                        <div className="flex items-start sm:items-center flex-col sm:flex-row justify-center gap-1 w-fit mx-auto">
                          {renderTeamHeader(blueTeam.name, "blue")}
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
                          {renderTeamHeader(redTeam.name, "red")}
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
                        <Text
                          fw={500}
                          fz={{ base: 12, sm: 14 }}
                          c="var(--nar-text-tertiary-sub)"
                        >
                          골드
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="blue" fz={{ base: 14, sm: 16 }}>
                          {blueGold.toLocaleString()}
                        </Text>
                      </Table.Td>
                      <Table.Td
                        ta="center"
                        className="bg-[var(--nar-bg-tertiary)]"
                      >
                        <Text
                          c={getDiffColor(formatDiff(goldDiff))}
                          fw={500}
                          fz={{ base: 14, sm: 16 }}
                        >
                          {formatDiff(goldDiff)}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="red" fz={{ base: 14, sm: 16 }}>
                          {redGold.toLocaleString()}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Text
                          fw={400}
                          fz={{ base: 12, sm: 14 }}
                          c="var(--nar-text-tertiary-sub)"
                        >
                          CS
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="blue" fz={{ base: 14, sm: 16 }}>
                          {blueCs}
                        </Text>
                      </Table.Td>
                      <Table.Td
                        ta="center"
                        className="bg-[var(--nar-bg-tertiary)]"
                      >
                        <Text
                          c={getDiffColor(formatDiff(csDiff))}
                          fw={500}
                          fz={{ base: 14, sm: 16 }}
                        >
                          {formatDiff(csDiff)}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="red" fz={{ base: 14, sm: 16 }}>
                          {redCs}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Text
                          fw={400}
                          fz={{ base: 12, sm: 14 }}
                          c="var(--nar-text-tertiary-sub)"
                        >
                          K/D/A
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="blue" fz={{ base: 14, sm: 16 }}>
                          {blueKills}/{blueDeaths}/{blueAssists}
                        </Text>
                      </Table.Td>
                      <Table.Td
                        ta="center"
                        className="bg-[var(--nar-bg-tertiary)]"
                      >
                        <Text c="dimmed" fw={500} fz={{ base: 14, sm: 16 }}>
                          -
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text c="red" fz={{ base: 14, sm: 16 }}>
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
