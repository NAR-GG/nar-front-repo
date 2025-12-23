import { publicApi } from "@/shared/lib/api-client";
import { categoriesApiEndPoint } from "./categories-endpoint";
import { CtgoTreeResponseDTO } from "../model/categories.dto";

export const getCtgoTree = async () => {
  const response = await publicApi.get<CtgoTreeResponseDTO>(
    categoriesApiEndPoint.getTree()
  );
  return { data: response.data };
};
