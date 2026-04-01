import { publicApi } from "@/shared/lib/api-client";
import { categoriesApiEndPoint } from "./categories-endpoint";
import type { CtgoTreeData } from "../api/categories.dto";

export const getCtgoTree = async (year?: number): Promise<CtgoTreeData> => {
  const response = await publicApi.get<CtgoTreeData>(
    categoriesApiEndPoint.getTree(year)
  );
  return response.data;
};
