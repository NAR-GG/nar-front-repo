import { publicApi } from "@/shared/lib/api-client";
import { championsApiEndPoint } from "./champions-endpoint";
import type { ChampionData } from "../model/champions.dto";

export const getChampionList = async (): Promise<ChampionData[]> => {
  const response = await publicApi.get<ChampionData[]>(
    championsApiEndPoint.getChampoionList()
  );
  return response.data;
};
