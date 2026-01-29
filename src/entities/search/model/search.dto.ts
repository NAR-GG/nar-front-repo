export type SearchData = {
  gameId: number;
  blueTeamName: string;
  blueTeamCode: string;
  blueTeamImageUrl: string;
  redTeamName: string;
  redTeamCode: string;
  redTeamImageUrl: string;
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
