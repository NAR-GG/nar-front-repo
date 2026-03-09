import { useQueryClient } from "@tanstack/react-query";
import { playersQueries } from "./players.queries";

export const useInvalidatePlayerCardList = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: playersQueries.lists(),
    });
};
