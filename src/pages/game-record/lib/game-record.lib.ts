import type { GameDetailPlayer, GameSetNav } from "@/entities/games/api/games.dto";
import { POSITION_ORDER } from "@/shared/config/positions";
import TopIcon from "@/shared/assets/icons/nar_top.svg";
import JungleIcon from "@/shared/assets/icons/nar_jungle.svg";
import MidIcon from "@/shared/assets/icons/nar_mid.svg";
import BottomIcon from "@/shared/assets/icons/nar_bottom.svg";
import SupportIcon from "@/shared/assets/icons/nar_support.svg";
import { TEAM_ABBREVIATIONS } from "../config/game-record.config";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

export function hasVodInSets(sets: GameSetNav["sets"] | undefined): boolean {
  return sets?.some((s) => s.vodUrl && s.vodUrl.length > 0) ?? false;
}

export function getTeamAbbreviation(teamName: string): string {
  return TEAM_ABBREVIATIONS[teamName] ?? teamName;
}

export function createTimelineKey(metric: string, time: number): string {
  return `${metric}At${time}`;
}

export function getPlayerValue(
  player: GameDetailPlayer | null | undefined,
  key: string,
): number {
  if (!player) return 0;
  return ((player as unknown as Record<string, unknown>)[key] as number) ?? 0;
}

export function getPlayerStringValue(
  player: GameDetailPlayer | null | undefined,
  key: string,
): string {
  if (!player) return "";
  return ((player as unknown as Record<string, unknown>)[key] as string) ?? "";
}

export function calculateTeamTotalsByTime(
  players: GameDetailPlayer[],
  timePoints: readonly number[],
  metrics: readonly string[],
): Record<number, Record<string, number>> {
  const totals: Record<number, Record<string, number>> = {};
  timePoints.forEach((time) => {
    totals[time] = {};
    metrics.forEach((metric) => {
      const key = createTimelineKey(metric, time);
      totals[time][metric] = players.reduce(
        (sum, p) => sum + getPlayerValue(p, key),
        0,
      );
    });
  });
  return totals;
}

export function formatKilo(value: number): string {
  return `${(value / 1000).toFixed(1)}K`;
}

export function calculateKdaRatio(
  kills: number,
  assists: number,
  deaths: number,
): string {
  if (deaths === 0) return "Perfect";
  return ((kills + assists) / deaths).toFixed(2);
}

export function getDiffColor(diff: string): string {
  if (diff === "-" || diff === "0") return "dimmed";
  if (diff.startsWith("+")) return "blue";
  return "red";
}

export function getRoleIcon(
  position: string,
): React.FC<React.SVGProps<SVGSVGElement>> {
  const pos = position.toLowerCase();
  if (POSITION_ORDER[pos] === 1) return TopIcon;
  if (POSITION_ORDER[pos] === 2) return JungleIcon;
  if (POSITION_ORDER[pos] === 3) return MidIcon;
  if (POSITION_ORDER[pos] === 4) return BottomIcon;
  if (POSITION_ORDER[pos] === 5) return SupportIcon;
  return TopIcon;
}
