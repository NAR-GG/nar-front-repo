export type Position = "TOP" | "JUG" | "MID" | "ADC" | "SUP";

export interface Filter {
  year: number;
  splitNames: string[];
  leagueNames: string[];
  teamNames: string[];
  patch: string | null;
}

export interface PaginationParams {
  page: number;
  size: number;
  sort?: "frequency" | "recency" | "patch";
}

export interface PageResponse<T> {
  content: T[];
  hasNext: boolean;
  totalCount: number;
}

export interface Pageable {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  unpaged: boolean;
}
