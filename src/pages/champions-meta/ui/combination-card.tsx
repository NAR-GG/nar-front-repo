"use client";

import { useMemo } from "react";
import { Group, Avatar, Text, Stack } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import type { ChampionData } from "@/entities/champions/model/champions.dto";
import type { ChampionInfo, CombinationCardData } from "../model/types";

interface CombinationCardProps {
  combination: CombinationCardData;
  isExpanded: boolean;
  selectedChampions: (ChampionData | null)[];
}

export function CombinationCard({
  combination,
  isExpanded,
  selectedChampions,
}: CombinationCardProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    champions = [],
    winRate = 0,
    wins = 0,
    losses = 0,
    recentGame = "",
    latestPatch = "",
  } = combination;

  const totalGames = wins + losses;
  const winPercentage = totalGames > 0 ? (wins / totalGames) * 100 : 0;
  const lossPercentage = totalGames > 0 ? (losses / totalGames) * 100 : 0;
  // API에서 winRate가 100.0 형태(이미 퍼센트)로 오면 그대로 사용, 0~1 사이면 *100
  const displayWinRate =
    winRate > 1 ? Math.round(winRate) : Math.round(winRate * 100);

  const orderedChampions = useMemo(() => {
    if (!selectedChampions || selectedChampions.length === 0) {
      return champions;
    }

    const championMap = new Map<string, ChampionInfo>();
    champions.forEach((champion) => {
      championMap.set(champion.championNameEn, champion);
    });

    const selectedChampionNames = selectedChampions
      .filter((c): c is ChampionData => c !== null)
      .map((c) => c.championNameEn);

    const selectedInOrder = selectedChampionNames
      .map((name) => championMap.get(name))
      .filter((c): c is ChampionInfo => c !== undefined);

    const remaining = champions.filter(
      (champion) => !selectedChampionNames.includes(champion.championNameEn),
    );

    return [...selectedInOrder, ...remaining];
  }, [champions, selectedChampions]);

  return (
    <Stack gap="xs">
      <Group
        justify="flex-start"
        align={isMobile ? "flex-start" : "center"}
        wrap={isMobile ? "wrap" : "nowrap"}
        style={{ width: "100%" }}
      >
        <div
          className={
            isMobile
              ? "order-2 grid w-full grid-cols-5 gap-x-4"
              : "order-none flex gap-4"
          }
        >
          {orderedChampions.map((champion, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-1 ${isMobile ? "w-[46px]" : "w-11"}`}
            >
              <Avatar
                src={champion.imageUrl}
                size={isMobile ? 46 : 44}
                radius="md"
              />
              <Text
                fz={isMobile ? 12 : 14}
                c="var(--nar-text-secondary)"
                className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center"
              >
                {champion.championNameKr}
              </Text>
            </div>
          ))}
        </div>

        <div
          className={`${isMobile ? "order-3 w-full" : "ml-5"} flex items-center gap-3`}
        >
          <div
            className={`${isMobile ? "flex-1" : "w-[253px]"} flex h-7 overflow-hidden rounded-[6px]`}
            style={{ backgroundColor: "var(--nar-bg-primary)" }}
          >
            {wins > 0 && (
              <div
                className="relative flex items-center justify-start px-2"
                style={{
                  width: `${winPercentage}%`,
                }}
              >
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundColor: "var(--nar-red-600)",
                    opacity: 0.5,
                  }}
                />
                <Text
                  className="relative z-10"
                  fz={isMobile ? 12 : 14}
                  fw={600}
                  c="var(--nar-bg-primary)"
                >
                  {wins}승
                </Text>
              </div>
            )}
            {losses > 0 && (
              <div
                className="relative flex items-center justify-end px-2"
                style={{
                  width: `${lossPercentage}%`,
                }}
              >
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundColor: "var(--nar-text-tertiary-sub)",
                    opacity: 0.5,
                  }}
                />
                <Text
                  className="relative z-10"
                  fz={isMobile ? 12 : 14}
                  fw={600}
                  c="var(--nar-bg-primary)"
                >
                  {losses}패
                </Text>
              </div>
            )}
          </div>
          <Text fz={16} fw={600} c="var(--nar-red-700)">
            {displayWinRate.toFixed(1)}%
          </Text>
        </div>

        <Group
          gap={isMobile ? 8 : 16}
          className={isMobile ? "order-1 w-full" : "ml-auto"}
        >
          <Text fz={14} fw={500} c="var(--nar-text-tertiary-sub)">
            최근 : {recentGame}
          </Text>
          <Text fz={14} fw={500} c="var(--nar-text-tertiary-sub)">
            패치: {latestPatch}
          </Text>
        </Group>
      </Group>

      <button
        type="button"
        className="inline-flex items-center justify-center rounded-[8px] border-[1.5px] text-[14px] whitespace-nowrap transition-colors duration-150 focus:outline-none border-[var(--nar-button-more-line)] bg-[var(--nar-button-more-bg)] text-[var(--nar-button-more-text)] btn-sm w-full"
      >
        총 {totalGames}경기 상세 보기
        {isExpanded ? (
          <IconChevronUp size={14} className="ml-1" />
        ) : (
          <IconChevronDown size={14} className="ml-1" />
        )}
      </button>
    </Stack>
  );
}
