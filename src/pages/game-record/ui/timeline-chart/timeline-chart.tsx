"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ResponsiveContainer,
} from "recharts";
import { TimelineChartLegend } from "./timeline-chart-legend";
import { AdvantageLabel } from "./timeline-chart-advantage-label";
import { TimelineChartTooltip } from "./timeline-chart-tooltip";
import {
  getYAxisFormatter,
  getYAxisDomain,
  type TimelineChartPoint,
} from "./timeline-chart.utils";

interface TimelineChartProps {
  chartData: TimelineChartPoint[];
  blueTeamName: string;
  redTeamName: string;
  selectedMetric: string;
}

export function TimelineChart({
  chartData,
  blueTeamName,
  redTeamName,
  selectedMetric,
}: TimelineChartProps) {
  const yDomain = getYAxisDomain(selectedMetric, chartData);
  const yFormatter = getYAxisFormatter(selectedMetric);
  const dataWithValues = chartData.filter(
    (d) => d.time > 0 && d.diff !== null && d.diff !== 0,
  );

  return (
    <div className="w-full">
      <TimelineChartLegend />

      <div className="w-full rounded-lg overflow-hidden">
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
          >
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
                  stopColor="var(--logo-gradient-start)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="40%"
                  stopColor="var(--logo-gradient-mid)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="100%"
                  stopColor="var(--logo-gradient-end)"
                  stopOpacity={0.5}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              type="number"
              domain={[10, 25]}
              ticks={[10, 15, 20, 25]}
              tickFormatter={(v: number) => `${v}m`}
              stroke="var(--nar-text-tertiary-sub)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "var(--nar-line)" }}
            />
            <YAxis
              domain={yDomain}
              tickFormatter={yFormatter}
              stroke="var(--nar-text-tertiary-sub)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              content={
                <TimelineChartTooltip
                  blueTeamName={blueTeamName}
                  redTeamName={redTeamName}
                />
              }
              cursor={{
                stroke: "var(--nar-text-tertiary-sub)",
                strokeWidth: 1,
              }}
            />

            {/* Area fills */}
            <Area
              dataKey="blueValue"
              stroke="none"
              fill="url(#narTimelineGradient)"
              fillOpacity={0.5}
              connectNulls={false}
            />
            <Area
              dataKey="redValue"
              stroke="none"
              fill="url(#narTimelineGradient)"
              fillOpacity={0.5}
              connectNulls={false}
            />

            {/* Dashed lines with dots */}
            <Line
              dataKey="blueValue"
              stroke="var(--nar-blue-600)"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{
                r: 4,
                fill: "var(--nar-blue-600)",
                stroke: "white",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: "var(--nar-blue-600)",
                stroke: "white",
                strokeWidth: 2,
              }}
              connectNulls={false}
              name={blueTeamName}
            />
            <Line
              dataKey="redValue"
              stroke="var(--nar-red-600)"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{
                r: 4,
                fill: "var(--nar-red-600)",
                stroke: "white",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: "var(--nar-red-600)",
                stroke: "white",
                strokeWidth: 2,
              }}
              connectNulls={false}
              name={redTeamName}
            />

            {/* Advantage labels */}
            {dataWithValues.map((d) => {
              const isBlue = d.leadingSide === "blue";
              const yValue = isBlue ? d.blueValue! : d.redValue!;
              const teamName = isBlue ? blueTeamName : redTeamName;
              return (
                <ReferenceDot
                  key={`adv-${d.time}`}
                  x={d.time}
                  y={yValue}
                  r={0}
                  label={
                    <AdvantageLabel
                      diff={d.diff!}
                      leadingSide={d.leadingSide!}
                      teamName={teamName}
                    />
                  }
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
