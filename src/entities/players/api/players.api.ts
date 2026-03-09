import { publicApi } from "@/shared/lib/api-client";
import {
  playersApiEndPoint,
  type PlayerCardListParams,
} from "./players-endpoint";
import type { PlayerCardListData } from "../model/players.dto";

export const getPlayerCardList = async (params?: PlayerCardListParams) => {
  const response = await publicApi.get<PlayerCardListData>(
    playersApiEndPoint.getPlayerCardList(params),
  );
  return response.data;
};
