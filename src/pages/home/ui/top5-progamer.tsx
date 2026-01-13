"use client";

import { Paper, Text, Skeleton } from "@mantine/core";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { homeQueries } from "@/entities/home/model/home.queries";
import { ProgamerTop5Table, Top5Mode, ProgamerTop5Row } from "./progamer-table";

export function Top5Progamer() {
  const [mode, setMode] = useState<Top5Mode>("kda");
  const { data: playerData, isLoading } = useQuery(homeQueries.playerTop5());

  const MENU: { label: string; value: Top5Mode }[] = [
    { label: "K/DA", value: "kda" },
    { label: "GPM", value: "gpm" },
    { label: "DPM", value: "dpm" },
  ];

  const tableData: ProgamerTop5Row[] = useMemo(() => {
    if (!playerData) return [];

    const players =
      mode === "kda"
        ? playerData.kdaTop5
        : mode === "gpm"
        ? playerData.gpmTop5
        : playerData.dpmTop5;

    return players.slice(0, 5).map((player, index) => ({
      rank: index + 1,
      playerName: player.playerName,
      playerImageUrl: player.playerImgUrl,
      teamName: player.teamName,
      games: player.totalGames,
      value: player.statValue,
    }));
  }, [playerData, mode]);

  return (
    <Paper withBorder radius={24} className="overflow-hidden">
      <div className="flex items-center justify-between pt-[14px] px-6">
        <div className="flex flex-col w-full">
          <Text fz={22} fw={700} lh={1.4} c="var(--nar-text-secondary)">
            TOP 5 선수 통계
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
                  : "border-transparent"
              )}
            >
              <span
                className={clsx(
                  "text-[16px]",
                  isSelected ? "font-bold" : "font-normal"
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

      <ProgamerTop5Table data={tableData} mode={mode} />
    </Paper>
  );
}
