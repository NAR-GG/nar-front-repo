import { queryOptions } from "@tanstack/react-query";
import { getDateSchedule, getMatchDetail } from "../api/schedule.api";

export const scheduleQueries = {
  all: () => ["schedule"] as const,
  dates: () => [...scheduleQueries.all(), "dates"] as const,
  date: () =>
    queryOptions({
      queryKey: scheduleQueries.dates(),
      queryFn: getDateSchedule,
    }),

  detail: (matchId: string) =>
    queryOptions({
      queryKey: [...scheduleQueries.all(), "detail", matchId] as const,
      queryFn: () => getMatchDetail({ matchId }),
    }),
};
