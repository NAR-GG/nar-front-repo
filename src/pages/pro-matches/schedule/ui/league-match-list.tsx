"use client";

import { memo } from "react";
import { Text, Center, Loader } from "@mantine/core";
import type { DateScheduleData, ScheduleMatchSummary } from "@/entities/schedule/api/schedule.dto";
import { MatchCard } from "./match-card";

import Lck from "@/shared/assets/images/lck-home.svg";
import Lpl from "@/shared/assets/images/lpl-home.svg";
import Lec from "@/shared/assets/images/lec-home.svg";
import Ljl from "@/shared/assets/images/lgl-home.svg";
import Lcs from "@/shared/assets/images/lcs-home.svg";
import Msi from "@/shared/assets/images/msi-home.svg";
import Worlds from "@/shared/assets/images/worlds-home.svg";

const LEAGUE_ORDER = ["LCK", "LPL", "LEC", "LJL", "LCS", "MSI", "WORLDS"];

const LEAGUE_ICON_MAP: Record<string, React.FC> = {
  LCK: Lck,
  LEC: Lec,
  LPL: Lpl,
  LJL: Ljl,
  LCS: Lcs,
  MSI: Msi,
  WORLDS: Worlds,
};

interface LeagueGroupProps {
  leagueName: string;
  matches: ScheduleMatchSummary[];
}

const LeagueGroup = memo(function LeagueGroup({ leagueName, matches }: LeagueGroupProps) {
  const leagueKey = Object.keys(LEAGUE_ICON_MAP).find((key) => leagueName.includes(key));
  const LeagueIcon = leagueKey ? LEAGUE_ICON_MAP[leagueKey] : Lpl;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex gap-2.5 items-center">
        <LeagueIcon />
        <Text fz={28} fw={590} c="var(--nar-text-secondary)">
          {leagueName}
        </Text>
      </div>
      <div className="w-full flex flex-col [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-(--nar-line-2)">
        {matches.map((match) => (
          <div key={match.matchId}>
            <MatchCard match={match} />
          </div>
        ))}
      </div>
    </div>
  );
});

interface LeagueMatchListProps {
  scheduleData: DateScheduleData | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function LeagueMatchList({ scheduleData, isLoading, isError }: LeagueMatchListProps) {
  if (isLoading) {
    return (
      <Center p="xl">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center p="xl">
        <Text c="red">데이터를 불러오는 중 오류가 발생했습니다.</Text>
      </Center>
    );
  }

  if (!scheduleData?.matches || scheduleData.matches.length === 0) {
    return (
      <div className="py-10 text-center text-(--nar-text-tertiary)">
        해당 날짜에 경기 일정이 없습니다.
      </div>
    );
  }

  const uniqueLeagues = [...new Set(scheduleData.matches.map((m) => m.leagueInfo))].sort(
    (a, b) => {
      const aIndex = LEAGUE_ORDER.findIndex((l) => a.includes(l));
      const bIndex = LEAGUE_ORDER.findIndex((l) => b.includes(l));
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    },
  );

  return (
    <>
      {uniqueLeagues.map((leagueName) => {
        const leagueMatches = scheduleData.matches.filter((m) => m.leagueInfo === leagueName);
        if (leagueMatches.length === 0) return null;
        return <LeagueGroup key={leagueName} leagueName={leagueName} matches={leagueMatches} />;
      })}
    </>
  );
}
