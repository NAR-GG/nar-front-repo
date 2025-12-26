export interface Player {
  position: string;
  playerName: string;
  championName: string;
}

export interface TeamInfo {
  teamName: string;
  isWin: boolean;
  players: Player[];
}

export interface GameInfo {
  gameId: number;
  gameLengthSeconds: number;
  league: string;
  patch: string;
  gameDate: string;
  blueTeam: TeamInfo;
  redTeam: TeamInfo;
}

export interface MatchListFilters {
  leagueNames: string[];
  splitNames: string[];
  teamNames: string[];
}

export type SortValue = "ASC" | "DESC";

export const TEAM_NAME_MAP: Record<string, string> = {
  "Bnk Fearx": "BFX",
  "Dplus Kia": "DK",
  "Kt Rolster": "KT",
  "Nongshim Redforce": "NS",
  "Hanwha Life Esports": "HLE",
  "Gen.g": "GEN",
  T1: "T1",
  "Oksavingsbank Brion": "BRO",
  Drx: "DRX",
  "Dn Freecs": "DNF",
};

export const formatGameTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
