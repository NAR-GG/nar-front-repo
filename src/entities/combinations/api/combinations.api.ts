import { publicApi } from "@/shared/lib/api-client";
import { combinationsApiEndPoint } from "./combinations-endpoint";

export const getCombinationInfo = async () => {
  const response = await publicApi.get(
    combinationsApiEndPoint.getCombinations()
  );
  return { data: response.data };
};

export const getCombinationDetail = async (params: Record<string, unknown>) => {
  const response = await publicApi.get(
    combinationsApiEndPoint.getCombinations(),
    { params }
  );
  return { data: response.data };
};

export const get1v1MatchUp = async (params: Record<string, unknown>) => {
  const response = await publicApi.get(
    combinationsApiEndPoint.get1v1MatchUp(),
    { params }
  );
  return { data: response.data };
};

export const getLastUpdate = async () => {
  const response = await publicApi.get(combinationsApiEndPoint.getLastUpdate());
  return { data: response.data };
};
