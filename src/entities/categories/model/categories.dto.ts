export interface Team {
  code: string;
  name: string;
  imageUrl: string;
  score: number;
}

export interface Split {
  name: string;
  leagueId: number;
  teams: Team[];
  patches: string[];
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
