import { queryOptions } from "@tanstack/react-query";
import {
  getChampionTop5,
  getCommunity,
  getDateSchedule,
  getNews,
  getPlayerTop5,
} from "../api/home.api";

export const homeQueries = {
  all: () => ["home"] as const,
  championTop5s: () => [...homeQueries.all(), "champion", "top5"] as const,
  championTop5: () =>
    queryOptions({
      queryKey: [...homeQueries.championTop5s()] as const,
      queryFn: () => getChampionTop5(),
    }),
  communitys: () => [...homeQueries.all(), "community"] as const,
  community: ({ sort }: { sort: "latest" | "popular" }) =>
    queryOptions({
      queryKey: [...homeQueries.communitys()] as const,
      queryFn: () => getCommunity({ sort }),
    }),
  news: () => [...homeQueries.all(), "news"] as const,
  newsList: () =>
    queryOptions({
      queryKey: [...homeQueries.news()] as const,
      queryFn: () => getNews(),
    }),
  playerTop5s: () => [...homeQueries.all(), "player", "top5"] as const,
  playerTop5: () =>
    queryOptions({
      queryKey: [...homeQueries.playerTop5s()] as const,
      queryFn: () => getPlayerTop5(),
    }),
  schedules: () => [...homeQueries.all(), "schedule"] as const,
  schedule: ({ date, league }: { date: string; league: "ALL" | "LCK" | "LPL" }) =>
    queryOptions({
      queryKey: [...homeQueries.schedules(), date, league] as const,
      queryFn: () => getDateSchedule({ date, league }),
    }),
};
