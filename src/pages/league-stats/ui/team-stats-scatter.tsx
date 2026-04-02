"use client";

import type { TeamScatterMetric } from "@/entities/teams/api/teams.dto";
import { teamsQueries } from "@/entities/teams/model/teams.queries";
import type { Filters } from "@/shared/types/filter.types";
import { SegmentedControl, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TeamStatsScatterProps {
  filters: Filters;
}

type MetricTab = "all" | "kill" | "gold" | "object";

const METRIC_MAP: Record<MetricTab, TeamScatterMetric> = {
  all: "ALL",
  kill: "KILLS",
  gold: "GOLD",
  object: "OBJECTIVES",
};

function TeamPin(props: Record<string, unknown>) {
  const cx = props.cx as number;
  const cy = props.cy as number;
  const payload = props.payload as {
    teamId: number;
    teamImageUrl: string;
    xAboveAvg: boolean;
  };

  if (cx === undefined || cy === undefined) return null;

  const { teamId, teamImageUrl } = payload;

  const markerTipX = 18;
  const markerTipY = 41;

  const translateX = cx - markerTipX;
  const translateY = cy - markerTipY;

  const imageRadius = 16;
  const imageCx = cx;
  const imageCy = translateY + 18;

  const clipId = `pin-clip-${teamId}`;

  return (
    <g>
      <defs>
        <linearGradient
          id={`marker-gradient-${teamId}`}
          x1="-2.64375"
          y1="-11.587"
          x2="43.7448"
          y2="-11.2815"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--logo-gradient-start, #e26212)" />
          <stop
            offset="0.372489"
            stopColor="var(--logo-gradient-mid, #950371)"
          />
          <stop offset="1" stopColor="var(--logo-gradient-end, #250657)" />
        </linearGradient>
        <clipPath id={clipId}>
          <circle cx={imageCx} cy={imageCy} r={imageRadius} />
        </clipPath>
      </defs>
      <g transform={`translate(${translateX}, ${translateY})`}>
        <path
          d="M18 0C27.9411 0 36 8.05887 36 18C36 26.6793 29.8569 33.9228 21.6816 35.6221L18.8662 40.5C18.4813 41.1667 17.5187 41.1667 17.1338 40.5L14.3174 35.6221C6.1426 33.9225 0 26.679 0 18C0 8.05887 8.05887 0 18 0Z"
          fill={`url(#marker-gradient-${teamId})`}
        />
      </g>
      <circle
        cx={imageCx}
        cy={imageCy}
        r={imageRadius}
        fill="var(--nar-BG-teamlogobox)"
      />
      {teamImageUrl && (
        <image
          href={teamImageUrl}
          x={imageCx - imageRadius}
          y={imageCy - imageRadius}
          width={imageRadius * 2}
          height={imageRadius * 2}
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid meet"
        />
      )}
    </g>
  );
}

function ScatterTooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { teamName: string; y: number; x: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const { teamName, y, x } = payload[0].payload;
  return (
    <div className="rounded-lg border border-(--nar-line) bg-(--nar-bg-secondary) px-3 py-2 flex flex-col gap-1">
      <Text fz={13} fw={700} c="var(--nar-text-primary)">
        {teamName}
      </Text>
      <Text fz={12} c="var(--nar-text-tertiary-sub)">
        Win Rate: {y.toFixed(1)}%
      </Text>
      <Text fz={12} c="var(--nar-text-tertiary-sub)">
        Avg: {x.toFixed(2)}
      </Text>
    </div>
  );
}

export function TeamStatsScatter({ filters }: TeamStatsScatterProps) {
  const leagueName = filters.leagueName ?? "LCK";
  const [metric, setMetric] = useState<MetricTab>("all");

  const { data } = useQuery(
    teamsQueries.scatter({
      year: filters.year,
      league: leagueName,
      split: filters.split ?? undefined,
      patch: filters.patch ?? undefined,
      side: filters.side,
      metric: METRIC_MAP[metric],
    }),
  );

  const scatterData = useMemo(() => {
    if (!data?.points) return [];
    return data.points.map((point) => ({
      x: point.xvalue,
      y: point.winRatePct,
      teamId: point.teamId,
      teamName: point.teamName,
      teamCode: point.teamCode,
      teamImageUrl: point.teamImageUrl,
      xAboveAvg: point.xvalue >= (data.xleagueAverage ?? 0),
    }));
  }, [data]);

  const xAvg = data?.xleagueAverage ?? 0;
  const yAvg = data?.yleagueAverage ?? 50;
  const xLabel = data?.xaxisLabel ?? "Average per Game";

  const xValues = scatterData.map((d) => d.x);
  const xMin = xValues.length ? Math.min(...xValues) * 0.95 : 0;
  const xMax = xValues.length ? Math.max(...xValues) * 1.05 : 100;

  return (
    <div className="flex flex-col gap-2">
      <Text c="var(--nar-text-secondary)" fz={18} fw={700}>
        전체 팀 지표 분포도
      </Text>
      <div className="rounded-xl border border-(--nar-line) bg-(--nar-bg-tertiary)">
        <div className="flex flex-col gap-4 py-6 px-4">
          <SegmentedControl
            value={metric}
            onChange={(v) => setMetric(v as MetricTab)}
            data={[
              { label: "전체", value: "all" },
              { label: "킬", value: "kill" },
              { label: "골드", value: "gold" },
              { label: "오브젝트", value: "object" },
            ]}
            className="md:w-85.75!"
          />
          <ResponsiveContainer width="100%" height={380}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
              <defs>
                <linearGradient
                  id="narTimelineGradient"
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--logo-gradient-start, #e26212)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="40%"
                    stopColor="var(--logo-gradient-mid, #950371)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--logo-gradient-end, #250657)"
                    stopOpacity={0.15}
                  />
                </linearGradient>
              </defs>
              <ReferenceArea
                x1={xAvg}
                x2={xMax}
                y1={yAvg}
                y2={100}
                fill="url(#narTimelineGradient)"
                ifOverflow="hidden"
              />
              <ReferenceArea
                x1={xMin}
                x2={xAvg}
                y1={yAvg}
                y2={100}
                fill="rgba(0,0,0,0)"
                ifOverflow="hidden"
              />
              <ReferenceArea
                x1={xMin}
                x2={xMax}
                y1={0}
                y2={yAvg}
                fill="rgba(0,0,0,0)"
                ifOverflow="hidden"
              />

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="var(--nar-line)"
                vertical={false}
              />

              <ReferenceLine
                x={xAvg}
                stroke="var(--nar-text-primary)"
                strokeWidth={1}
              />
              <ReferenceLine
                y={yAvg}
                stroke="var(--nar-text-primary)"
                strokeWidth={1}
              />

              <XAxis
                type="number"
                dataKey="x"
                name={xLabel}
                domain={[xMin, xMax]}
                tickCount={5}
                label={{
                  value: xLabel,
                  position: "insideBottom",
                  offset: -20,
                  style: { fontSize: 12, fill: "var(--nar-text-tertiary-sub)" },
                }}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "var(--nar-text-primary)" }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Win Rate (%)"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                label={{
                  value: "Win Rate (%)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                  style: { fontSize: 12, fill: "var(--nar-text-tertiary-sub)" },
                }}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "var(--nar-text-primary)" }}
              />
              <Tooltip content={<ScatterTooltipContent />} cursor={false} />
              <Scatter
                data={scatterData}
                shape={(props: unknown) => (
                  <TeamPin {...(props as Record<string, unknown>)} />
                )}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
