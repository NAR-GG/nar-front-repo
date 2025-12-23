import type { ApiResponse } from "@/shared/types/api";

export interface CtgoTreeData {
  seasons: [
    {
      year: number;
      leagues: [
        {
          name: string;
          splits: [
            {
              name: string;
              leagueId: number;
              teams: [
                {
                  id: number;
                  name: string;
                }
              ];
            }
          ];
        }
      ];
    }
  ];
}

export type CtgoTreeResponseDTO = ApiResponse<CtgoTreeData>;
