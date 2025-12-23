import type { ApiResponse } from "@/shared/types/api";
import { Pageable } from "@/shared/types/common";

export interface PageResponse<T> {
  content: T[];
  pageable: Pageable;
  hasNext: boolean;
  totalCount: number;
}

export interface CombinationSummary {
  combinationId: string;
  rank: number;
  champions: string[];
  frequency: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  latestGameDate: string;
  latestPatch: string;
}

export type CombinationData = PageResponse<CombinationSummary>;

export interface GamePlayer {
  position: string;
  playerName: string;
  championName: string;
}

export interface GameTeam {
  teamName: string;
  isWin: boolean;
  players: GamePlayer[];
}

export interface GameDetail {
  id: number;
  gameNumber: number;
  gameLengthSeconds: number;
  blueTeam: GameTeam;
  redTeam: GameTeam;
}

export interface CombinationDetailData {
  summary: CombinationSummary;
  gameDetails: GameDetail[];
}

export interface MatchUp1v1Data extends PageResponse<GameDetail> {
  totalMatches: number;
  winRateForChampion1: number;
}

export interface LastUpdateData {
  lastUpdateTime: string;
}

export type CombinationResponseDTO = ApiResponse<CombinationData>;
export type CombinationDetailResponseDTO = ApiResponse<CombinationDetailData>;
export type MatchUp1v1ResponseDTO = ApiResponse<MatchUp1v1Data>;
export type LastUpdateResponseDTO = ApiResponse<LastUpdateData>;
