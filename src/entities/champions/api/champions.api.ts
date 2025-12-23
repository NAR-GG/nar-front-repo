import { publicApi } from "@/shared/lib/api-client";
import { championsApiEndPoint } from "./champions-endpoint";
import { ChampionListResponseDTO } from "../model/champions.dto";

export const getChampionList = async () => {
  const response = await publicApi.get<ChampionListResponseDTO>(
    championsApiEndPoint.getChampoionList()
  );
  return { data: response.data };
};
