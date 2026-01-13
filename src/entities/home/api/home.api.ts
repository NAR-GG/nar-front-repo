import { publicApi } from "@/shared/lib/api-client";
import { homeApiEndPoint } from "./home-endpoint";
import type {
  ChampionTop5Data,
  CommunityData,
  NewsData,
  PlayerTop5Data,
  ScheduleData,
} from "../model/home.dto";

export const getChampionTop5 = async () => {
  const response = await publicApi.get<ChampionTop5Data>(
    homeApiEndPoint.getChampionTop5()
  );
  return response.data;
};

export const getCommunity = async ({
  sort,
}: {
  sort: "latest" | "popular";
}) => {
  const response = await publicApi.get<CommunityData[]>(
    homeApiEndPoint.getCommunity({ sort })
  );
  return response.data;
};

export const getNews = async () => {
  const response = await publicApi.get<NewsData[]>(homeApiEndPoint.getNews());
  return response.data;
};

export const getPlayerTop5 = async () => {
  const response = await publicApi.get<PlayerTop5Data>(
    homeApiEndPoint.getPlayerTop5()
  );
  return response.data;
};

export const getDateSchedule = async ({
  date,
  league,
}: {
  date: string;
  league: "ALL" | "LCK" | "LPL";
}) => {
  const response = await publicApi.get<ScheduleData[]>(
    homeApiEndPoint.getDateSchedule({ date, league })
  );
  return response.data;
};
