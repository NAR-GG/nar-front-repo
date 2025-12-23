import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDateSchedule } from "../api/schedule.api";
import { scheduleQueries } from "./schedule.queries";

export const useGetDateScheduleInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: getDateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleQueries.all() });
    },
  });
};
