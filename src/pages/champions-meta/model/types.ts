import type { ChampionData } from "@/entities/champions/model/champions.dto";

// Re-export shared types for backwards compatibility
export type {
  Mode,
  SortValue,
  Filters,
  SelectOption,
} from "@/shared/types/filter.types";

export type ChampionInfo = Omit<ChampionData, "id">;

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
