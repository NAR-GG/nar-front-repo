import { Paper, Text } from "@mantine/core";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { ProgamerTop5Table, Top5Mode, ProgamerTop5Row } from "./progamer-table";

export function Top5Progamer() {
  const [mode, setMode] = useState<Top5Mode>("ban");

  const MENU: { label: string; value: Top5Mode }[] = [
    { label: "K/DA", value: "kda" },
    { label: "벤", value: "ban" },
    { label: "픽", value: "pick" },
  ];

  const raw = [
    {
      rank: 1,
      playerName: "Oner",
      playerImageUrl: "/images/players/oner.png",
      teamName: "T1",
      games: 143,
      kda: 4.21,
      ban: 5.4,
      pick: 12.3,
    },
  ];

  const tableData: ProgamerTop5Row[] = useMemo(() => {
    return raw.map((r) => ({
      rank: r.rank,
      playerName: r.playerName,
      playerImageUrl: r.playerImageUrl,
      teamName: r.teamName,
      games: r.games,
      value: mode === "kda" ? r.kda : mode === "ban" ? r.ban : r.pick,
    }));
  }, [mode]);

  return (
    <Paper withBorder radius={24} className="overflow-hidden">
      <div className="flex items-center justify-between pt-[14px] pb-[23px] px-6">
        <div className="flex flex-col w-full">
          <Text fz={22} fw={700} lh={1.4} c="var(--mantine-color-text)">
            TOP 5 선수 통계
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

      <ProgamerTop5Table data={tableData} mode={mode} />
    </Paper>
  );
}
