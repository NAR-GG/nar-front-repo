import { publicApi } from "@/shared/lib/api-client";
import { gamesApiEndPoint } from "./games-endpoint";
import { GameDetailResponseDTO, GameListResponseDTO } from "../model/games.dto";

export const getGameList = async () => {
  const response = await publicApi.get<GameListResponseDTO>(
    gamesApiEndPoint.getGameList()
  );
  return { data: response.data };
};

export const getGameDetail = async ({ gameId }: { gameId: string }) => {
  const response = await publicApi.get<GameDetailResponseDTO>(
    gamesApiEndPoint.getGameDetail({ gameId })
  );
  return { data: response.data };
};
