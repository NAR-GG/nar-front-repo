import { publicApi } from "@/shared/lib/api-client";
import { categoriesApiEndPoint } from "./categories-endpoint";
import type { CtgoTreeData } from "../model/categories.dto";

export const getCtgoTree = async (): Promise<CtgoTreeData> => {
  const response = await publicApi.get<CtgoTreeData>(
    categoriesApiEndPoint.getTree()
  );
  return response.data;
};
