import { Paper, Text } from "@mantine/core";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { ProgamerTop5Table, Top5Mode, ProgamerTop5Row } from "./progamer-table";

export function Top5Progamer() {
  const [mode, setMode] = useState<Top5Mode>("kda");

  const MENU: { label: string; value: Top5Mode }[] = [
    { label: "K/DA", value: "kda" },
    { label: "GPM", value: "gpm" },
    { label: "DPM", value: "dpm" },
  ];

  const raw = [
    {
      rank: 1,
      playerName: "Oner",
      playerImageUrl: "/images/players/oner.png",
      teamName: "T1",
      games: 143,
      kda: 4.21,
      gpm: 12.3,
      dpm: 12.3,
    },
  ];

  const tableData: ProgamerTop5Row[] = useMemo(() => {
    return raw.map((r) => ({
      rank: r.rank,
      playerName: r.playerName,
      playerImageUrl: r.playerImageUrl,
      teamName: r.teamName,
      games: r.games,
      value: mode === "kda" ? r.kda : mode === "gpm" ? r.gpm : r.dpm,
    }));
  }, [mode]);

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

      {/* ✅ Champion이랑 동일 토큰으로 통일 */}
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
