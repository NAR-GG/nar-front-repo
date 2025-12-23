import { queryOptions } from "@tanstack/react-query";
import { getCtgoTree } from "../api/categories.api";

export const categoriesQueries = {
  all: () => ["categories"] as const,
  trees: () => [...categoriesQueries.all(), "tree"] as const,
  tree: () =>
    queryOptions({
      queryKey: categoriesQueries.trees(),
      queryFn: getCtgoTree,
    }),
};
