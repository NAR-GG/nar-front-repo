"use client";

import type { TeamRadarStatData } from "@/entities/teams/api/teams.dto";
import { teamsQueries } from "@/entities/teams/model/teams.queries";
import type { Filters } from "@/shared/types/filter.types";
import { Select, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface TeamStatsGraphProps {
  filters: Filters;
  className?: string;
  selectedTeam1Id?: string | null;
  selectedTeam2Id?: string | null;
  onTeamSelect?: (team1Id: string | null, team2Id: string | null) => void;
}

type RadarKey = keyof Omit<
  TeamRadarStatData,
  "teamId" | "teamName" | "gamesPlayed" | "year"
>;

type RadarMetric = {
  key: RadarKey;
  label: string;
  invert?: boolean;
};

const RADAR_METRICS: RadarMetric[] = [
  { key: "winRate", label: "WIN%" },
  { key: "goldDiffAt10", label: "10@GD" },
  { key: "goldDiffAt15", label: "15@GD" },
  { key: "goldDiffAt20", label: "20@GD" },
  { key: "goldDiffAt25", label: "25@GD" },
  { key: "gspd", label: "GSPD" },
  { key: "ckpm", label: "CKPM" },
  { key: "firstBloodRate", label: "FB%" },
  { key: "firstTowerRate", label: "FT%" },
  { key: "firstThreeTowerRate", label: "F3T%" },
  { key: "firstHeraldRate", label: "HER%" },
  { key: "firstDragonRate", label: "DRG%" },
  { key: "firstBaronRate", label: "FBN%" },
  { key: "dragonsPerGame", label: "DRAPG" },
  { key: "voidGrubsRate", label: "GRB" },
  { key: "pointsPerGame", label: "PPG" },
  { key: "towersKilledAvg", label: "TOWERS\nKILLED" },
  { key: "towersLostAvg", label: "TOWERS\nLOST", invert: true },
  { key: "earlyGameRating", label: "EGR" },
  { key: "midLateRating", label: "MLR" },
];

const TEAM1_COLOR = "#ff6b6b";
const TEAM2_COLOR = "#7048e8";

function normalizeStats(
  stats: TeamRadarStatData,
  avg: TeamRadarStatData,
): Record<RadarKey, number> {
  const result = {} as Record<RadarKey, number>;

  for (const { key, invert } of RADAR_METRICS) {
    const val = stats[key] ?? 0;
    const avgVal = avg[key] ?? 0;

    if (avgVal === 0) {
      result[key] = 50;
      continue;
    }

    const score = invert ? (avgVal / val) * 50 : (val / avgVal) * 50;

    result[key] = Math.min(100, Math.max(0, Math.round(score)));
  }

  return result;
}

const TICK_STYLE = { fontSize: 11 };

export function TeamStatsGraph({
  filters,
  className,
  selectedTeam1Id = null,
  selectedTeam2Id = null,
  onTeamSelect,
}: TeamStatsGraphProps) {
  const leagueName = filters.leagueName ?? "LCK";

  const [internalTeam1Id, setInternalTeam1Id] = useState<string | null>(null);
  const [internalTeam2Id, setInternalTeam2Id] = useState<string | null>(null);

  const team1Id = selectedTeam1Id ?? internalTeam1Id;
  const team2Id = selectedTeam2Id ?? internalTeam2Id;

  const handleTeam1Change = (value: string | null) => {
    if (onTeamSelect) {
      onTeamSelect(value, team2Id);
      return;
    }

    setInternalTeam1Id(value);
  };

  const handleTeam2Change = (value: string | null) => {
    if (onTeamSelect) {
      onTeamSelect(team1Id, value);
      return;
    }

    setInternalTeam2Id(value);
  };

  const { data: rankingsData } = useQuery(
    teamsQueries.rankings({
      year: filters.year,
      leagueNames: [leagueName],
      splits: filters.split ? [filters.split] : [],
      patch: filters.patch ?? undefined,
      side: filters.side,
    }),
  );

  const teamOptions = useMemo(
    () =>
      (rankingsData?.rankings ?? []).map((team) => ({
        value: String(team.teamId ?? ""),
        label: team.teamCode ?? team.teamName ?? "",
        imageUrl: team.imageUrl ?? "",
      })),
    [rankingsData],
  );

  const { data: radar1 } = useQuery({
    ...teamsQueries.radar({
      teamId: Number(team1Id),
      year: filters.year,
      league: leagueName,
      split: filters.split ?? undefined,
      patch: filters.patch ?? undefined,
      side: filters.side,
    }),
    enabled: Boolean(team1Id),
  });

  const { data: radar2 } = useQuery({
    ...teamsQueries.radar({
      teamId: Number(team2Id),
      year: filters.year,
      league: leagueName,
      split: filters.split ?? undefined,
      patch: filters.patch ?? undefined,
      side: filters.side,
    }),
    enabled: Boolean(team2Id),
  });

  const chartData = useMemo(() => {
    const norm1 =
      radar1?.stats && radar1?.leagueAverage
        ? normalizeStats(radar1.stats, radar1.leagueAverage)
        : null;

    const norm2 =
      radar2?.stats && radar2?.leagueAverage
        ? normalizeStats(radar2.stats, radar2.leagueAverage)
        : null;

    return RADAR_METRICS.map(({ key, label }) => ({
      label,
      team1: norm1?.[key] ?? 0,
      team2: norm2?.[key] ?? 0,
    }));
  }, [radar1, radar2]);

  const team1Info = teamOptions.find((t) => t.value === team1Id);
  const team2Info = teamOptions.find((t) => t.value === team2Id);

  return (
    <div className={`flex h-full flex-col gap-2 ${className ?? ""}`}>
      <Text c="var(--nar-text-secondary)" fz={18} fw={700}>
        1:1 팀 지표 분석
      </Text>
      <div className="flex flex-1 flex-col rounded-xl border border-(--nar-line) bg-(--nar-bg-tertiary)">
        <div className="flex justify-end gap-4 px-4 pt-4">
          {team1Info && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-(--nar-red-700)" />
              <Text fz={14} fw={400} c="var(--nar-text-tertiary)">
                {team1Info.label}
              </Text>
            </div>
          )}
          {team2Info && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-(--nar-purple-1)" />
              <Text fz={14} fw={400} c="var(--nar-text-tertiary)">
                {team2Info.label}
              </Text>
            </div>
          )}
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={chartData} outerRadius="65%">
            <PolarGrid />
            <PolarAngleAxis dataKey="label" tick={TICK_STYLE} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tickCount={6}
              tick={TICK_STYLE}
            />
            <Radar
              name={team1Info?.label ?? "팀 1"}
              dataKey="team1"
              stroke={TEAM1_COLOR}
              fill={TEAM1_COLOR}
              fillOpacity={0.3}
            />
            <Radar
              name={team2Info?.label ?? "팀 2"}
              dataKey="team2"
              stroke={TEAM2_COLOR}
              fill={TEAM2_COLOR}
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-center gap-6 px-4 pb-6">
          <div className="w-37.5">
            <Select
              placeholder="팀 선택"
              data={teamOptions}
              value={team1Id}
              onChange={handleTeam1Change}
              leftSection={
                team1Info?.imageUrl ? (
                  <Image
                    src={team1Info.imageUrl}
                    alt={team1Info.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                ) : null
              }
              classNames={{
                input: "border-(--nar-red-700)! rounded-xl!",
              }}
            />
          </div>
          <Text c="var(--nar-text-tertiary-sub)" fz={20} fw={500}>
            VS
          </Text>
          <div className="w-37.5">
            <Select
              placeholder="팀 선택"
              data={teamOptions}
              value={team2Id}
              onChange={handleTeam2Change}
              leftSection={
                team2Info?.imageUrl ? (
                  <Image
                    src={team2Info.imageUrl}
                    alt={team2Info.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                ) : null
              }
              classNames={{
                input: "border-(--nar-purple-1)! rounded-xl!",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
