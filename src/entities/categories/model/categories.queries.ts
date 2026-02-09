import { queryOptions } from "@tanstack/react-query";
import { getCtgoTree } from "../api/categories.api";

export const categoriesQueries = {
  all: () => ["categories"] as const,
  trees: () => [...categoriesQueries.all(), "tree"] as const,
  tree: (year?: number) =>
    queryOptions({
      queryKey: [...categoriesQueries.trees(), year] as const,
      queryFn: () => getCtgoTree(year),
    }),
};
