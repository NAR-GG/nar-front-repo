import { publicApi } from "@/shared/lib/api-client";
import { scheduleApiEndPoint } from "./schedule-endpoint";
import type {
  DateScheduleData,
  MatchDetailData,
} from "../api/schedule.dto";

export const getDateSchedule = async (date: string): Promise<DateScheduleData> => {
  const response = await publicApi.get<DateScheduleData>(
    scheduleApiEndPoint.getDateSchedule(date)
  );
  return response.data;
};

export const getMatchDetail = async (matchId: string): Promise<MatchDetailData> => {
  const response = await publicApi.get<MatchDetailData>(
    scheduleApiEndPoint.getMatchDetail(matchId)
  );
  return response.data;
};
