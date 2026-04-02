"use client";

import type {
  ChampionPickData,
  OpponentChampionData,
} from "@/entities/teams/api/teams.dto";
import { teamsQueries } from "@/entities/teams/model/teams.queries";
import BottomIcon from "@/shared/assets/icons/nar_bottom.svg";
import JungleIcon from "@/shared/assets/icons/nar_jungle.svg";
import MidIcon from "@/shared/assets/icons/nar_mid.svg";
import SupportIcon from "@/shared/assets/icons/nar_support.svg";
import TopIcon from "@/shared/assets/icons/nar_top.svg";
import type { Filters } from "@/shared/types/filter.types";
import { GradientTabs } from "@/shared/ui/gradient-tabs";
import { Popover, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { PLAYED_CHAMPION_MENU } from "../config/league-stats.config";

interface PlayedChampionProps {
  filters: Filters;
  className?: string;
}

type SideValue = "all" | "blue" | "red";

const SIDE_API_MAP: Record<SideValue, string | undefined> = {
  all: undefined,
  blue: "BLUE",
  red: "RED",
};

function formatRate(val: number | undefined): string {
  if (val === undefined) return "0.0";
  const pct = val > 1 ? val : val * 100;
  return pct.toFixed(1);
}

function formatOpponentRate(
  opponent: OpponentChampionData,
  championPlayCount: number,
): string {
  if (!opponent.matchCount || !championPlayCount) return "0%";
  return `${Math.round((opponent.matchCount / championPlayCount) * 100)}%`;
}

interface ChampionPopoverContentProps {
  champions: ChampionPickData[];
  totalGames: number;
}

function ChampionPopoverContent({
  champions,
  totalGames,
}: ChampionPopoverContentProps) {
  const [idx, setIdx] = useState(0);
  const champion = champions[idx];

  if (!champion) return null;

  const playFrequency =
    totalGames > 0
      ? Math.round(((champion.playCount ?? 0) / totalGames) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-3 w-55">
      <div className="flex items-center justify-between">
        <Text fz={16} fw={500} c="var(--nar-text-primary)">
          * 플레이 챔프 상세
        </Text>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIdx((p) => Math.max(0, p - 1))}
            disabled={idx === 0}
            className="disabled:opacity-30"
          >
            <IconChevronLeft size={24} />
          </button>
          <button
            onClick={() => setIdx((p) => Math.min(champions.length - 1, p + 1))}
            disabled={idx === champions.length - 1}
            className="disabled:opacity-30"
          >
            <IconChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {champion.championImageUrl && (
          <Image
            src={champion.championImageUrl}
            alt={champion.championName ?? ""}
            width={56}
            height={56}
            className="rounded-lg object-cover"
          />
        )}
        <Text fz={16} fw={700} c="var(--nar-text-primary)">
          {champion.championName}
        </Text>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <Text fz={14} c="var(--nar-text-tertiary-sub)">
            빈도수
          </Text>
          <Text fz={14} fw={600} c="var(--nar-text-score)">
            {playFrequency}%
          </Text>
        </div>
        <div className="flex justify-between items-center">
          <Text fz={14} c="var(--nar-text-tertiary-sub)">
            승률
          </Text>
          <Text fz={14} fw={600} c="var(--nar-text-purple)">
            {formatRate(champion.winRate)}%
          </Text>
        </div>
        <div className="flex justify-between items-center">
          <Text fz={14} c="var(--nar-text-tertiary-sub)">
            벤률
          </Text>
          <Text fz={14} fw={600} c="var(--nar-text-tertiary)">
            {formatRate(champion.banRate)}%
          </Text>
        </div>
      </div>

      {(champion.topOpponents?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-2">
          <Text fz={12} c="var(--nar-text-tertiary-sub)">
            상대 챔피언 빈도수 (TOP3)
          </Text>
          <div className="flex gap-3">
            {champion.topOpponents?.slice(0, 3).map((opp, idx) => (
              <div
                key={opp.championName}
                className="flex flex-col items-center gap-1"
              >
                {opp.championImageUrl && (
                  <Image
                    src={opp.championImageUrl}
                    alt={opp.championName ?? ""}
                    width={33}
                    height={33}
                    className="rounded-md object-cover"
                  />
                )}
                <Text
                  fz={14}
                  fw={600}
                  c={idx === 0 ? "var(--nar-text-red)" : "var(--nar-text-2)"}
                >
                  {formatOpponentRate(opp, champion.playCount ?? 0)}
                </Text>
              </div>
            ))}
          </div>
        </div>
      )}

      {champions.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {champions.map((_, i) => (
            <div
              key={i}
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                i === idx ? "bg-(--nar-purple-1)" : "bg-(--nar-line)"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ChampionCellProps {
  champions?: ChampionPickData[];
  totalGames?: number;
}

function ChampionCell({ champions, totalGames }: ChampionCellProps) {
  const [opened, setOpened] = useState(false);
  const primary = champions?.[0];
  const extraCount = (champions?.length ?? 0) - 1;

  if (!primary?.championImageUrl) {
    return <div className="w-12 h-12" />;
  }

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="right"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <button
          onClick={() => setOpened((o) => !o)}
          className="relative w-11 h-11 shrink-0"
        >
          <Image
            src={primary.championImageUrl}
            alt={primary.championName ?? ""}
            fill
            className="rounded-lg object-cover"
          />
          {extraCount > 0 && (
            <div className="absolute top-0 right-0 w-5 h-5 px-1 rounded-md bg-(--nar-bg-GNB) flex items-center justify-center">
              <Text fz={10} fw={400} c="var(--nar-text-GNB-default)">
                +{extraCount}
              </Text>
            </div>
          )}
        </button>
      </Popover.Target>
      <Popover.Dropdown p="md">
        <ChampionPopoverContent
          champions={champions ?? []}
          totalGames={totalGames ?? 0}
        />
      </Popover.Dropdown>
    </Popover>
  );
}

export function PlayedChampion({
  filters,
  className,
}: PlayedChampionProps) {
  const leagueName = filters.leagueName ?? "LCK";
  const controlledSide = filters.side;
  const [internalSide, setInternalSide] = useState<SideValue>("all");
  const side =
    controlledSide === "BLUE"
      ? "blue"
      : controlledSide === "RED"
        ? "red"
        : controlledSide === "ALL"
          ? "all"
          : internalSide;

  const { data: rankingsData } = useQuery(
    teamsQueries.rankings({
      year: filters.year,
      leagueNames: [leagueName],
      splits: filters.split ? [filters.split] : [],
      patch: filters.patch ?? undefined,
      side: SIDE_API_MAP[side],
    }),
  );

  const rankings = rankingsData?.rankings ?? [];

  return (
    <div className={`flex h-full flex-col gap-2 ${className ?? ""}`}>
      <div className="flex w-full justify-between items-center">
        <Text c="var(--nar-text-secondary)" fz={18} fw={700}>
          플레이 한 챔피언
        </Text>
        <Text c="var(--nar-text-tertiary-sub)" fz={14} fw={400}>
          *챔피언 호버 시 각 챔피언 플레이 상세 지표를 확인 할 수 있습니다.
        </Text>
      </div>
      <div className="flex flex-1 flex-col rounded-xl border border-(--nar-line) bg-(--nar-bg-tertiary)">
        <GradientTabs
          items={[...PLAYED_CHAMPION_MENU]}
          value={side}
          onChange={(v) => {
            if (!controlledSide) {
              setInternalSide(v as SideValue);
            }
          }}
        />
        <Table.ScrollContainer minWidth={346} maxHeight={356}>
          <Table
            withRowBorders
            withTableBorder={false}
            verticalSpacing="md"
            horizontalSpacing="sm"
            styles={{
              td: { borderColor: "var(--nar-line-2)" },
              th: { borderColor: "var(--nar-line-2)" },
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th ta="center">
                  <Text
                    fw={500}
                    fz={14}
                    c="var(--nar-text-tertiary-sub)"
                    className="whitespace-nowrap"
                  >
                    순위
                  </Text>
                </Table.Th>
                <Table.Th ta="center">
                  <Text fw={500} fz={14} c="var(--nar-text-tertiary-sub)">
                    팀
                  </Text>
                </Table.Th>
                <Table.Th ta="center">
                  <Text fw={500} fz={14} c="var(--nar-text-tertiary-sub)">
                    승률
                  </Text>
                </Table.Th>
                <Table.Th ta="center">
                  <div className="flex justify-center items-center">
                    <TopIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </Table.Th>
                <Table.Th ta="center">
                  <div className="flex justify-center items-center">
                    <JungleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </Table.Th>
                <Table.Th ta="center">
                  <div className="flex justify-center items-center">
                    <MidIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </Table.Th>
                <Table.Th ta="center">
                  <div className="flex justify-center items-center">
                    <BottomIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </Table.Th>
                <Table.Th ta="center">
                  <div className="flex justify-center items-center">
                    <SupportIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rankings.map((team) => {
                const winRatePct = team.totalGames
                  ? ((team.wins ?? 0) / team.totalGames) * 100
                  : 0;

                return (
                  <Table.Tr key={team.teamId}>
                    <Table.Td ta="center">
                      <Text fz={14} fw={500} c="var(--nar-text-primary)">
                        {team.rank}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center gap-2">
                        {team.imageUrl && (
                          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-(--nar-BG-teamlogobox)">
                            <Image
                              src={team.imageUrl}
                              alt={team.teamCode ?? ""}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                        )}
                        <Text fz={16} fw={600} c="var(--nar-text-secondary)">
                          {team.teamCode}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Text fz={14} fw={500} c="var(--nar-text-primary)">
                        {winRatePct.toFixed(1)}%
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <ChampionCell
                        champions={team.mostPicks?.top}
                        totalGames={team.totalGames}
                      />
                    </Table.Td>
                    <Table.Td ta="center">
                      <ChampionCell
                        champions={team.mostPicks?.jungle}
                        totalGames={team.totalGames}
                      />
                    </Table.Td>
                    <Table.Td ta="center">
                      <ChampionCell
                        champions={team.mostPicks?.mid}
                        totalGames={team.totalGames}
                      />
                    </Table.Td>
                    <Table.Td ta="center">
                      <ChampionCell
                        champions={team.mostPicks?.bot}
                        totalGames={team.totalGames}
                      />
                    </Table.Td>
                    <Table.Td ta="center">
                      <ChampionCell
                        champions={team.mostPicks?.support}
                        totalGames={team.totalGames}
                      />
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </div>
    </div>
  );
}
