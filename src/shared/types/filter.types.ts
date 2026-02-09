export type Mode = "team" | "1v1";

export type SortValue = "DESC" | "ASC";

export interface SelectOption {
  value: string;
  label: string;
}

export interface Filters {
  year: number;
  split: string | null;
  leagueName: string | null;
  teamName: string | null;
  patch: string | null;
  leagueNames: string[];
  splitNames: string[];
  teamNames: string[];
}
