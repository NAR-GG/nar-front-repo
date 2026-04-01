export type SearchData = {
  gameId: number;
  blueTeamName: string;
  blueTeamCode: string;
  blueTeamImageUrl: string;
  blueTeamScore?: number;
  redTeamName: string;
  redTeamCode: string;
  redTeamImageUrl: string;
  redTeamScore?: number;
  blueWin: boolean;
  leagueName: string;
  gameDate: string;
  patch: string;
  gameNumber: number;
  label: string;
};

export interface SearchList {
  suggestions: SearchData[];
}
