import { publicApi } from "@/shared/lib/api-client";
import { gamesApiEndPoint, type GameListParams } from "./games-endpoint";
import type { GameDetailData, GameListData } from "../model/games.dto";

export const getGameList = async (params?: GameListParams) => {
  const response = await publicApi.get<GameListData>(
    gamesApiEndPoint.getGameList(params)
  );
  return response.data;
};

export const getGameDetail = async ({ gameId }: { gameId: string }) => {
  const response = await publicApi.get<GameDetailData>(
    gamesApiEndPoint.getGameDetail({ gameId })
  );
  return response.data;
};
