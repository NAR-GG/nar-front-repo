import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getGameDetail } from "../api/games.api";
import { gamesQueries } from "./games.queries";

export const useGameDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: getGameDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamesQueries.all() });
    },
  });
};
