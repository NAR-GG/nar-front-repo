"use client";

import { Paper, Text } from "@mantine/core";
import Lck from "@/src/shared/assets/images/lck-home.svg";
import Lpl from "@/src/shared/assets/images/lpl-home.svg";

import clsx from "clsx";
import { useState } from "react";
import { MatchCard } from "./match-card";

const DATE_MENU = [
  { day: "일", date: "12.28" },
  { day: "월", date: "12.29" },
  { day: "오늘", date: "12.30", isToday: true },
  { day: "수", date: "12.31" },
  { day: "목", date: "1.1" },
];

export function TodayGame() {
  const [selectedIndex, setSelectedIndex] = useState(2);

  return (
    <Paper withBorder radius={24}>
      <div className="flex items-center justify-between pt-[14px] pb-[9px] px-6">
        <Text fz={22} fw={700} lh={1.4} c="var(--mantine-color-text)">
          오늘 예정된 경기
        </Text>
        <Text
          fz={16}
          c="var(--mantine-color-dark-2)"
          className="cursor-pointer"
        >
          전체일정
        </Text>
      </div>

      <div className="flex justify-around px-4 border-b-2 border-[var(--menu-text-inactive)]">
        {DATE_MENU.map((item, index) => {
          const isSelected = selectedIndex === index;
          return (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={clsx(
                "flex flex-col items-center justify-center cursor-pointer pt-5 pb-1.75 px-2.5 gap-2.5 flex-1 border-b-4",
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
                {item.day}
              </span>
              <span
                className={clsx(
                  "text-[18px]",
                  isSelected ? "font-bold" : "font-medium"
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
                {item.date}
              </span>
            </div>
          );
        })}
      </div>

      {/* LCK */}
      <div className="py-5 px-[14px] flex flex-col w-full gap-4">
        <div className="w-full flex gap-2.5 items-center">
          <Lck />
          <Text fz={28} fw={590} c="var(--mantine-color-text)">
            LCK
          </Text>
        </div>
        <div className=" w-full">
          <MatchCard
            badgeTheme="live"
            badgeText="LIVE"
            tournamentTitle="LCK 플레이-인 토너먼트"
            leftTeamName="Gen.G"
            rightTeamName="Hanwha"
            leftScore={2}
            rightScore={1}
            isLive
            setText="SET 4 진행중"
            buttonLabel="중계보기"
            buttonTheme="gray"
            borderColorVar="var(--match-card-border)"
          />

          <MatchCard
            badgeTheme="default"
            badgeText="20:00"
            tournamentTitle="LCK 플레이-인 토너먼트"
            leftTeamName="Gen.G"
            rightTeamName="Hanwha"
            leftScore={2}
            rightScore={1}
            isLive={false}
            buttonLabel="준비 중"
            buttonTheme="line"
            buttonDisabled
            borderColorVar="var(--match-card-bg)"
          />
        </div>
      </div>

      {/* LPL */}
      <div className="py-5 px-[14px] flex flex-col w-full gap-4">
        <div className="w-full flex gap-2.5 items-center">
          <Lpl />
          <Text fz={28} fw={590} c="var(--mantine-color-text)">
            LPL
          </Text>
        </div>

        <MatchCard
          badgeTheme="default"
          badgeText="지난경기"
          tournamentTitle="LCK 플레이-인 토너먼트"
          leftTeamName="Gen.G"
          rightTeamName="Hanwha"
          leftScore={2}
          rightScore={1}
          isLive={false}
          buttonLabel="다시보기"
          buttonTheme="line"
          borderColorVar="var(--match-card-bg)"
        />
      </div>
    </Paper>
  );
}
