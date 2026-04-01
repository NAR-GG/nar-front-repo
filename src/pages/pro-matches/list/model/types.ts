export type { SortValue } from "@/shared/types/filter.types";
export { TEAM_NAME_MAP, getTeamShortName } from "@/shared/config/team-name-map";
export { formatGameTime } from "@/shared/lib/format-game-time";

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
