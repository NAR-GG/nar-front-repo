"use client";

import { Paper, Text, Skeleton } from "@mantine/core";
import clsx from "clsx";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { homeQueries } from "@/entities/home/model/home.queries";
import { ChampionTop5Table, Top5Mode, ChampionTop5Row } from "./champion-table";
import { useChampionImage } from "@/shared/lib/use-champion-image";
import { getLaneIcon } from "@/shared/lib/get-lane-icon";

export function Top5Champion() {
  const [mode, setMode] = useState<Top5Mode>("win");
  const { data: championData, isLoading } = useQuery(
    homeQueries.championTop5(),
  );
  const { getChampionImageUrl } = useChampionImage();

  const MENU: { label: string; value: Top5Mode }[] = [
    { label: "승률", value: "win" },
    { label: "밴률", value: "ban" },
  ];

  const data: ChampionTop5Row[] = (() => {
    if (!championData) return [];

    if (mode === "ban") {
      return championData.topBans.slice(0, 5).map((ban, index) => ({
        rank: index + 1,
        championName: ban.championNameKr,
        championImageUrl: getChampionImageUrl(ban.championNameEn),
        laneIcon: getLaneIcon(ban.lane),
        winRate: ban.winRate,
        winGames: ban.wins,
        banRate: ban.banRate,
        banGames: ban.totalGames,
      }));
    }

    return championData.topPicks.slice(0, 5).map((champ, index) => ({
      rank: index + 1,
      championName: champ.championNameKr,
      championImageUrl: getChampionImageUrl(champ.championNameEn),
      laneIcon: getLaneIcon(champ.lane),
      winRate: champ.winRate,
      winGames: champ.wins,
      pickRate: champ.winRate,
      pickGames: champ.totalGames,
    }));
  })();

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

      <div className="flex px-4 border-b-2 border-(--nar-text-cont-nav)">
        {MENU.map((item) => {
          const isSelected = mode === item.value;

          return (
            <div
              key={item.value}
              onClick={() => setMode(item.value)}
              className={clsx(
                "flex flex-col w-[64px] items-center justify-center cursor-pointer pt-5 pb-1.75 px-2.5 gap-2.5 border-b-4",
                isSelected
                  ? "border-transparent [border-image:var(--nar_gradients)_1]"
                  : "border-transparent",
              )}
            >
              <span
                className={clsx(
                  "text-[16px]",
                  isSelected ? "font-bold" : "font-normal",
                )}
                style={
                  isSelected
                    ? {
                        background: "var(--nar_gradients)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : { color: "var(--nar-text-cont-nav)" }
                }
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

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
