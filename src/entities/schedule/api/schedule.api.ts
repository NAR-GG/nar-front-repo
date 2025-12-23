import { publicApi } from "@/shared/lib/api-client";
import { scheduleApiEndPoint } from "./schedule-endpoint";
import type {
  DateScheduleResponseDTO,
  MatchDetailResponseDTO,
} from "../model/schedule.dto";

export const getDateSchedule = async () => {
  const response = await publicApi.get<DateScheduleResponseDTO>(
    scheduleApiEndPoint.getDateSchedule()
  );
  return { data: response.data };
};

export const getMatchDetail = async ({ matchId }: { matchId: string }) => {
  const response = await publicApi.get<MatchDetailResponseDTO>(
    scheduleApiEndPoint.getMatchDetail({ matchId })
  );
  return { data: response.data };
};
