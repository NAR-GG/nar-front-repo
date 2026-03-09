import { queryOptions } from "@tanstack/react-query";
import { getPlayerCardList } from "../api/players.api";
import type { PlayerCardListParams } from "../api/players-endpoint";

export const playersQueries = {
  all: () => ["players"] as const,

  lists: () => [...playersQueries.all(), "list"] as const,
  list: (params?: PlayerCardListParams) =>
    queryOptions({
      queryKey: [...playersQueries.lists(), params] as const,
      queryFn: () => getPlayerCardList(params),
    }),
};
