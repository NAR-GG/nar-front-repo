import type { ApiResponse } from "@/shared/types/api";

export interface ChampionData {
  id: number;
  championNameKr: string;
  championNameEn: string;
  imageUrl: string;
}

export type ChampionListResponseDTO = ApiResponse<ChampionData[]>;
