import { publicApi } from "@/shared/lib/api-client";
import { searchApiEndPoint } from "./search-endpoint";
import type { SearchList } from "../model/search.dto";

export const getAutoComplete = async ({
  q,
  limit,
}: {
  q: string;
  limit: number;
}) => {
  const response = await publicApi.get<SearchList>(
    searchApiEndPoint.getAutoComplete({ q, limit }),
  );
  return response.data;
};
