import { queryOptions } from "@tanstack/react-query";
import { getChampionList } from "../api/champions.api";

export const championsQueries = {
  all: () => ["champions"] as const,
  lists: () => [...championsQueries.all(), "list"] as const,
  list: () =>
    queryOptions({
      queryKey: championsQueries.lists(),
      queryFn: getChampionList,
    }),
};
