const GAMES_PREFIX = {
  games: "/games",
};

export interface GameListParams {
  year?: number;
  leagueNames?: string[];
  splits?: string[];
  teamNames?: string[];
  page?: number;
  size?: number;
  sort?: "ASC" | "DESC";
}

export const gamesApiEndPoint = {
  getGameList: (params?: GameListParams) => {
    const searchParams = new URLSearchParams();

    if (params?.year !== undefined) {
      searchParams.set("year", params.year.toString());
    }
    if (params?.leagueNames?.length) {
      params.leagueNames.forEach((name) =>
        searchParams.append("leagueNames", name)
      );
    }
    if (params?.splits?.length) {
      params.splits.forEach((name) =>
        searchParams.append("splits", name)
      );
    }
    if (params?.teamNames?.length) {
      params.teamNames.forEach((name) =>
        searchParams.append("teamNames", name)
      );
    }
    if (params?.page !== undefined) {
      searchParams.set("page", params.page.toString());
    }
    if (params?.size !== undefined) {
      searchParams.set("size", params.size.toString());
    }
    if (params?.sort) {
      searchParams.set("sort", params.sort);
    }

    const queryString = searchParams.toString();
    return queryString
      ? `${GAMES_PREFIX.games}?${queryString}`
      : GAMES_PREFIX.games;
  },
  getGameDetail: ({ gameId }: { gameId: string }) =>
    `${GAMES_PREFIX.games}/${gameId}/record`,
};
