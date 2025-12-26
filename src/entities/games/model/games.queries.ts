import { queryOptions } from "@tanstack/react-query";
import { getGameList, getGameDetail } from "../api/games.api";
import type { GameListParams } from "../api/games-endpoint";

export const gamesQueries = {
  all: () => ["games"] as const,

  lists: () => [...gamesQueries.all(), "list"] as const,
  list: (params?: GameListParams) =>
    queryOptions({
      queryKey: [...gamesQueries.lists(), params] as const,
      queryFn: () => getGameList(params),
    }),

  details: () => [...gamesQueries.all(), "detail"] as const,
  detail: (gameId: string) =>
    queryOptions({
      queryKey: [...gamesQueries.details(), gameId] as const,
      queryFn: () => getGameDetail({ gameId }),
    }),
};
