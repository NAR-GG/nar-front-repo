import { queryOptions } from "@tanstack/react-query";
import { getAutoComplete } from "../api/search.api";

export const searchQueries = {
  all: () => ["search"] as const,
  authComplates: () => [...searchQueries.all(), "authComplates"] as const,
  authComplate: ({ q, limit }: { q: string; limit: number }) =>
    queryOptions({
      queryKey: [...searchQueries.authComplates(), q, limit] as const,
      queryFn: () => getAutoComplete({ q, limit }),
    }),
};
