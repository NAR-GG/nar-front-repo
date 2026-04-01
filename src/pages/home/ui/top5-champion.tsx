"use client";

import { Paper, Text, Skeleton } from "@mantine/core";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { homeQueries } from "@/entities/home/model/home.queries";
import { ChampionTop5Table } from "./champion-table";
import { useChampionImage } from "@/shared/lib/use-champion-image";
import type { ChampionTop5Mode } from "../model/home.viewmodel";
import { toChampionTop5ViewModels } from "../model/home.mapper";
import { GradientTabs } from "@/shared/ui/gradient-tabs";

const MENU = [
  { label: "밴", value: "ban" },
  { label: "픽", value: "pick" },
] satisfies { label: string; value: ChampionTop5Mode }[];

export function Top5Champion() {
  const [mode, setMode] = useState<ChampionTop5Mode>("ban");
  const { data: championData, isLoading } = useQuery(homeQueries.championTop5());
  const { getChampionImageUrl } = useChampionImage();

  const data = useMemo(
    () =>
      championData
        ? toChampionTop5ViewModels(championData, mode, getChampionImageUrl)
        : [],
    [championData, mode, getChampionImageUrl],
  );

  return (
    <Paper withBorder radius={24} className="overflow-hidden">
      <div className="flex items-center justify-between pt-[14px] px-6">
        <div className="flex flex-col w-full">
          <Text fz={22} fw={700} lh={1.4} c="var(--nar-text-secondary)">
            TOP 5 챔피언 통계
          </Text>
          <Text fz={14} fw={500} c="var(--nar-text-tertiary-sub)">
            LCK 리그 최근 패치 기준입니다.
          </Text>
        </div>
      </div>

      <GradientTabs
        items={MENU}
        value={mode}
        onChange={(v) => setMode(v as ChampionTop5Mode)}
      />

      {isLoading ? (
        <div className="p-4 flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={70} radius="md" />
          ))}
        </div>
      ) : (
        <ChampionTop5Table data={data} mode={mode} />
      )}
    </Paper>
  );
}
