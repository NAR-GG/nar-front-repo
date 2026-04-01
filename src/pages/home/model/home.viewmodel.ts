export type ProgamerTop5Mode = "kda" | "gpm" | "dpm";
export type ChampionTop5Mode = "ban" | "pick";

export interface ProgamerTop5ViewModel {
  rank: number;
  playerName: string;
  playerImageUrl: string;
  teamName: string;
  games: number;
  value: number;
}

export interface ChampionTop5ViewModel {
  rank: number;
  championName: string;
  championImageUrl: string;
  laneIcon: React.ReactNode;
  winRate: number;
  totalGames?: number;
  pickRate?: number;
  pickGames?: number;
  winGames?: number;
  banRate?: number;
  banCount?: number;
}
