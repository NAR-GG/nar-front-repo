export interface Team {
  id: number;
  name: string;
}

export interface Split {
  name: string;
  leagueId: number;
  teams: Team[];
}

export interface League {
  name: string;
  splits: Split[];
}

export interface Season {
  year: number;
  leagues: League[];
}

export interface CtgoTreeData {
  seasons: Season[];
}
