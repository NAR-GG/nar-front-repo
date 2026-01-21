"use client";

import { Paper, Text, Button } from "@mantine/core";
import Lck from "@/src/shared/assets/images/lck-home.svg";
import Lpl from "@/src/shared/assets/images/lpl-home.svg";
import Lec from "@/src/shared/assets/images/lec-home.svg";

import clsx from "clsx";
import { useState } from "react";
import { MatchCard } from "./match-card";
import { useQuery } from "@tanstack/react-query";
import { homeQueries } from "@/src/entities/home/model/home.queries";
import dayjs, { toKST } from "@/shared/lib/dayjs";
import { ScheduleData } from "@/src/entities/home/model/home.dto";

export function TodayGame() {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Generate date menu items (2 days before, today, 2 days after)
  const dateMenu = Array.from({ length: 5 }, (_, i) => {
    const date = dayjs().add(i - 2, "day");
    return {
      dateObj: date,
      day: i === 2 ? "오늘" : date.format("ddd"),
      dateStr: date.format("M.D"),
    };
  });

  const { data: scheduleData } = useQuery(
    homeQueries.schedule({
      date: selectedDate.format("YYYY-MM-DD"),
      league: "ALL",
    }),
  );

  return (
    <Paper withBorder radius={24}>
      <div className="flex items-center justify-between pt-[14px] pb-[9px] px-6">
        <Text fz={22} fw={700} lh={1.4} c="var(--nar-text-tertiary)">
          오늘 예정된 경기
        </Text>
        <Text
          fz={16}
          c="var(--nar-text-tertiary-sub)"
          className="cursor-pointer"
        >
          전체일정
        </Text>
      </div>

      <div className="flex justify-around px-4 border-b-2 border-(--nar-text-tertiary-sub)">
        {dateMenu.map((item, index) => {
          const isSelected = item.dateObj.isSame(selectedDate, "day");
          return (
            <div
              key={index}
              onClick={() => setSelectedDate(item.dateObj)}
              className={clsx(
                "flex flex-col items-center justify-center cursor-pointer pt-5 pb-1.75 px-2.5 gap-2.5 flex-1 border-b-4",
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
                    : { color: "var(--nar-text-tertiary-sub)" }
                }
              >
                {item.day}
              </span>
              <span
                className={clsx(
                  "text-[18px]",
                  isSelected ? "font-bold" : "font-medium",
                )}
                style={
                  isSelected
                    ? {
                        background: "var(--nar_gradients)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : { color: "var(--nar-text-tertiary-sub)" }
                }
              >
                {item.dateStr}
              </span>
            </div>
          );
        })}
      </div>

      {scheduleData && scheduleData.length > 0 ? (
        (() => {
          // 리그별로 그룹핑하고 LCK 우선 정렬
          const leagueOrder = ["LCK", "LPL"];
          const uniqueLeagues = [
            ...new Set(scheduleData.map((m) => m.leagueName)),
          ].sort((a, b) => {
            const aIndex = leagueOrder.findIndex((l) => a.includes(l));
            const bIndex = leagueOrder.findIndex((l) => b.includes(l));
            return (
              (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
            );
          });

          return uniqueLeagues.map((leagueName) => {
            // 각 리그 내에서 날짜순 정렬
            const leagueMatches = scheduleData
              .filter((m) => m.leagueName === leagueName)
              .sort(
                (a, b) => dayjs(a.matchDate).unix() - dayjs(b.matchDate).unix(),
              );

            if (leagueMatches.length === 0) return null;

            const leagueIconMap: Record<string, typeof Lck> = {
              LCK: Lck,
              LEC: Lec,
              LPL: Lpl,
            };
            const leagueKey = Object.keys(leagueIconMap).find((key) =>
              leagueName.includes(key),
            );
            const LeagueIcon = leagueKey ? leagueIconMap[leagueKey] : Lpl;

            return (
              <div
                key={leagueName}
                className="py-5 px-[14px] flex flex-col w-full gap-4 bg-(--nar-fill-secondary) rounded-b-[24px]"
              >
                <div className="w-full flex gap-2.5 items-center">
                  <LeagueIcon />
                  <Text fz={28} fw={590} c="var(--nar-text-secondary)">
                    {leagueName}
                  </Text>
                </div>
                <div className="w-full flex flex-col [&>*:not(:first-child)]:border-t-[1px] [&>*:not(:first-child)]:border-[var(--nar-line-2)]">
                  {leagueMatches.map((match: ScheduleData) => {
                    const lastSetNumber = match.sets?.length
                      ? match.sets[match.sets.length - 1].setNumber
                      : undefined;

                    return (
                      <MatchCard
                        key={match.matchId}
                        badgeTheme={
                          match.state === "inProgress" ? "live" : "default"
                        }
                        badgeText={
                          match.state === "inProgress"
                            ? "LIVE"
                            : (toKST(match.matchDate)?.format("HH:mm") ?? "")
                        }
                        tournamentTitle={match.matchTitle}
                        leftTeamName={match.blueTeam?.code}
                        leftTeamImage={match.blueTeam?.imageUrl}
                        rightTeamName={match.redTeam?.code}
                        rightTeamImage={match.redTeam?.imageUrl}
                        leftScore={match.blueTeam?.wins || 0}
                        rightScore={match.redTeam?.wins || 0}
                        isLive={match.state === "inProgress"}
                        setText={
                          match.state === "inProgress" && lastSetNumber
                            ? `SET ${lastSetNumber} 진행중`
                            : undefined
                        }
                        buttonLabel={
                          match.state === "inProgress"
                            ? "중계보기"
                            : match.state === "completed"
                              ? "다시보기"
                              : "준비 중"
                        }
                        buttonTheme={
                          match.state === "inProgress" ? "gray" : "line"
                        }
                        buttonDisabled={match.state === "unstarted"}
                        borderColorVar={
                          match.state === "inProgress"
                            ? "var(--nar-red-700)"
                            : "var(--nar-bg-tertiary)"
                        }
                        sets={match.sets}
                        state={match.state}
                      />
                    );
                  })}
                </div>
              </div>
            );
          });
        })()
      ) : (
        <div className="py-10 text-center text-[var(--nar-text-tertiary)]">
          예정된 경기가 없습니다.
        </div>
      )}
    </Paper>
  );
}
