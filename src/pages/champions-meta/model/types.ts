import type { ChampionData } from "@/entities/champions/model/champions.dto";

export type Mode = "team" | "1v1";

export type SortValue = "DESC" | "ASC";

export type ChampionInfo = Omit<ChampionData, "id">;

export interface Filters {
  year: number;
  split: string | null;
  leagueName: string | null;
  teamName: string | null;
  patch: string | null;
  leagueNames: string[];
  splitNames: string[];
  teamNames: string[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface CombinationCardData {
  combinationId: string;
  champions: ChampionInfo[];
  winRate: number;
  wins: number;
  losses: number;
  recentGame: string;
  latestPatch: string;
  frequency: number;
}
