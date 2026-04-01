export interface PlayerViewModel {
  playerName: string;
  championName: string;
  position: string;
  championImageUrl: string;
}

export interface TeamViewModel {
  teamName: string;
  teamShortName: string;
  isWin: boolean;
  players: PlayerViewModel[];
}

export interface GameRowViewModel {
  gameId: number;
  league: string;
  patch: string;
  gameDate: string;
  gameLengthLabel: string;
  blueTeam: TeamViewModel;
  redTeam: TeamViewModel;
}
