import { queryOptions } from "@tanstack/react-query";
import { getDateSchedule, getMatchDetail, getScheduleCalendar } from "../api/schedule.api";

export const scheduleQueries = {
  all: () => ["schedule"] as const,

  dates: () => [...scheduleQueries.all(), "dates"] as const,
  date: (date: string) =>
    queryOptions({
      queryKey: [...scheduleQueries.dates(), date] as const,
      queryFn: () => getDateSchedule(date),
    }),

  details: () => [...scheduleQueries.all(), "detail"] as const,
  detail: (matchId: string) =>
    queryOptions({
      queryKey: [...scheduleQueries.details(), matchId] as const,
      queryFn: () => getMatchDetail(matchId),
    }),

  calendars: () => [...scheduleQueries.all(), "calendar"] as const,
  calendar: (month: string) =>
    queryOptions({
      queryKey: [...scheduleQueries.calendars(), month] as const,
      queryFn: () => getScheduleCalendar(month),
    }),
};
