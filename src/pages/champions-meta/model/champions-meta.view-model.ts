export interface ChampionInfoViewModel {
  championNameKr: string;
  championNameEn: string;
  imageUrl: string;
}

export interface CombinationCardViewModel {
  combinationId: string;
  champions: ChampionInfoViewModel[];
  displayWinRate: number;
  wins: number;
  losses: number;
  totalGames: number;
  winPct: number;
  lossPct: number;
  recentGame: string;
  latestPatch: string;
  frequency: number;
}

export interface MatchPlayerViewModel {
  position: string;
  playerName: string;
  championName: string;
  championImageUrl: string;
}

export interface MatchTeamViewModel {
  teamName: string;
  isWin: boolean;
  side: "blue" | "red";
  players: MatchPlayerViewModel[];
}

export interface GameMatchViewModel {
  id: number;
  gameNumber: number;
  gameLengthSeconds: number;
  formattedGameLength: string;
  vodUrl?: string;
  blueTeam: MatchTeamViewModel;
  redTeam: MatchTeamViewModel;
}

export interface MatchUp1v1ViewModel {
  totalMatches: number;
  champion1WinRatePct: number;
  champion2WinRatePct: number;
  games: GameMatchViewModel[];
  hasNextPage: boolean;
}
