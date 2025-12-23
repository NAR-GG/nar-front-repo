import { queryOptions } from "@tanstack/react-query";
import { getGameList } from "../api/games.api";

export const gamesQueries = {
  all: () => ["games"] as const,
  lists: () => [...gamesQueries.all(), "list"] as const,
  list: () =>
    queryOptions({
      queryKey: gamesQueries.lists(),
      queryFn: getGameList,
    }),
  details: () => [...gamesQueries.all(), "detail"] as const,
};
