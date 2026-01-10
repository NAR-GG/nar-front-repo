import { Paper, Text } from "@mantine/core";
import clsx from "clsx";
import { useState } from "react";
import Eye from "@/shared/assets/icons/eye.svg";
import { ChampionTop5Table, Top5Mode } from "./champion-table";

export function Top5Champion() {
  const [mode, setMode] = useState<Top5Mode>("ban");

  const MENU: { label: string; value: Top5Mode }[] = [
    { label: "승률", value: "win" },
    { label: "벤", value: "ban" },
    { label: "픽", value: "pick" },
  ];

  const data = [
    {
      rank: 1,
      championName: "신짜오",
      championImageUrl: "/images/champions/xinzhao.png",
      laneIcon: <Eye />,
      winRate: 54.2,
      winGames: 143,
      banRate: 5.4,
      banGames: 58,
      pickRate: 12.3,
      pickGames: 210,
    },
  ];

  return (
    <Paper withBorder radius={24} className="overflow-hidden">
      <div className="flex items-center justify-between pt-[14px] pb-[23px] px-6">
        <div className="flex flex-col w-full">
          <Text fz={22} fw={700} lh={1.4} c="var(--mantine-color-text)">
            TOP 5 챔피언 통계
          </Text>
          <Text fz={14} fw={500} c="var(--nar-text-con-text2)">
            LCK 리그 최근 패치 기준입니다.
          </Text>
        </div>
      </div>

      <div className="flex px-4 border-b-2 border-[var(--menu-text-inactive)]">
        {MENU.map((item) => {
          const isSelected = mode === item.value;

          return (
            <div
              key={item.value}
              onClick={() => setMode(item.value)}
              className={clsx(
                "flex flex-col w-[64px] items-center justify-center cursor-pointer pt-5 pb-1.75 px-2.5 gap-2.5 border-b-4",
                isSelected
                  ? "border-transparent [border-image:var(--gradients-nargg)_1]"
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
                        background: "var(--gradients-nargg)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : { color: "var(--menu-text-inactive)" }
                }
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <ChampionTop5Table data={data} mode={mode} />
    </Paper>
  );
}
