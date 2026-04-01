import type { GameDetailPlayer } from "@/entities/games/api/games.dto";

export interface TimelineChartPoint {
  time: number;
  blueValue: number | null;
  redValue: number | null;
  diff: number | null;
  leadingSide: "blue" | "red" | "even" | null;
}

const TIME_POINTS = [10, 15, 20, 25];
const METRICS_WITH_KEY = ["gold", "xp", "cs", "kills"] as const;
export type ChartMetric = (typeof METRICS_WITH_KEY)[number];

const createTimelineKey = (metric: string, time: number) =>
  `${metric}At${time}`;

const getPlayerValue = (
  player: GameDetailPlayer | null | undefined,
  key: string,
): number => {
  if (!player) return 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (player as any)[key] ?? 0;
};

export interface ProcessedTeamData {
  name: string;
  players: GameDetailPlayer[];
  totalsByTime: Record<number, Record<string, number>>;
}

export function buildChartData(
  blueTeam: ProcessedTeamData,
  redTeam: ProcessedTeamData,
  selectedPosition: string,
  selectedMetric: string,
): TimelineChartPoint[] {
  const isTotalView = selectedPosition === "전체";

  const bluePlayer = isTotalView
    ? null
    : blueTeam.players.find((p) => p.position === selectedPosition);
  const redPlayer = isTotalView
    ? null
    : redTeam.players.find((p) => p.position === selectedPosition);

  const points: TimelineChartPoint[] = [
    { time: 0, blueValue: 0, redValue: 0, diff: 0, leadingSide: "even" },
  ];

  TIME_POINTS.forEach((time) => {
    const key = createTimelineKey(selectedMetric, time);
    const blueValue = isTotalView
      ? blueTeam.totalsByTime[time]?.[selectedMetric] ?? 0
      : getPlayerValue(bluePlayer, key);
    const redValue = isTotalView
      ? redTeam.totalsByTime[time]?.[selectedMetric] ?? 0
      : getPlayerValue(redPlayer, key);
    const diff = blueValue - redValue;

    points.push({
      time,
      blueValue,
      redValue,
      diff,
      leadingSide: diff > 0 ? "blue" : diff < 0 ? "red" : "even",
    });
  });

  return points;
}

export function getYAxisFormatter(metric: string) {
  return (value: number) => {
    if (metric === "gold" || metric === "xp") {
      if (Math.abs(value) >= 1000) {
        return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
      }
      return String(value);
    }
    return String(Math.round(value));
  };
}

export function getYAxisDomain(
  metric: string,
  data: TimelineChartPoint[],
): [number, number] {
  const values = data
    .filter((d) => d.blueValue !== null && d.redValue !== null)
    .flatMap((d) => [d.blueValue!, d.redValue!]);

  if (values.length === 0) return [0, 100];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.15 || 100;

  if (metric === "gold" || metric === "xp") {
    return [
      Math.max(0, Math.floor((min - padding) / 1000) * 1000),
      Math.ceil((max + padding) / 1000) * 1000,
    ];
  }

  return [
    Math.max(0, Math.floor(min - padding)),
    Math.ceil(max + padding),
  ];
}

export function formatDiffValue(diff: number): string {
  const absDiff = Math.abs(diff);
  const sign = diff >= 0 ? "+ " : "- ";

  return `${sign}${absDiff.toLocaleString()}`;
}

export function formatValue(value: number): string {
  return value.toLocaleString();
}
