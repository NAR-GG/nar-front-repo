export type PlayerCardSide = "ALL" | "BLUE" | "RED";

export interface AppliedFilterData {
  year: number;
  split: string | null;
  patch: string | null;
  side: PlayerCardSide;
}

export interface MostChampionData {
  championId: number;
  championNameKr: string;
  championNameEn: string;
  championImageUrl: string;
  championLoadingImageUrl: string;
  playCount: number;
  winRatePct: number;
}

export interface PlayerProfileData {
  name: string;
  position: string;
  summonerName: string;
  soloRankTier: string | null;
  birthDate: string;
  gamesPlayed: number;
  kda: number;
  gpm: number;
  dpm: number;
}

export interface PlayerCardData {
  playerId: number;
  playerName: string;
  playerImageUrl: string;
  teamCode: string;
  teamImageUrl: string;
  topChampionLoadingImageUrl: string;
  mostChampions: MostChampionData[];
  profile: PlayerProfileData;
}

export interface PlayerCardListData {
  leagueName: string;
  appliedFilter: AppliedFilterData;
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  players: PlayerCardData[];
}
