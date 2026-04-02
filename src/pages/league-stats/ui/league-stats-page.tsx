"use client";

import { categoriesQueries } from "@/entities/categories/model/categories.queries";
import LckIcon from "@/shared/assets/images/lck-home.svg";
import LcsIcon from "@/shared/assets/images/lcs-home.svg";
import LecIcon from "@/shared/assets/images/lec-home.svg";
import LglIcon from "@/shared/assets/images/lgl-home.svg";
import LplIcon from "@/shared/assets/images/lpl-home.svg";
import MsiIcon from "@/shared/assets/images/msi-home.svg";
import WorldsIcon from "@/shared/assets/images/worlds-home.svg";
import type { Filters } from "@/shared/types/filter.types";
import { FilterSection } from "@/shared/ui/filter-section";
import { Box, Container, Paper, Select, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { TeamStatsGraph } from "./team-stats-graph";
import { PlayedChampion } from "./played-champion";
import { TeamStatsScatter } from "./team-stats-scatter";
import { GameDetail } from "./game-detail";

type LeagueIconComponent = React.ComponentType<{
  width?: number;
  height?: number;
}>;

const LEAGUE_INFO: Record<
  string,
  { fullName: string; Icon: LeagueIconComponent }
> = {
  LCK: { fullName: "League of Legends Champions Korea", Icon: LckIcon },
  LPL: { fullName: "League of Legends Pro League", Icon: LplIcon },
  LEC: { fullName: "League of Legends EMEA Championship", Icon: LecIcon },
  LCS: { fullName: "League Championship Series", Icon: LcsIcon },
  LGL: { fullName: "Liga Latinoamérica", Icon: LglIcon },
  MSI: { fullName: "Mid-Season Invitational", Icon: MsiIcon },
  Worlds: {
    fullName: "League of Legends World Championship",
    Icon: WorldsIcon,
  },
};

const DEFAULT_LEAGUE = "LCK";
const DEFAULT_YEAR = 2026;

export function LeagueStatsPage() {
  const [filters, setFilters] = useState<Filters>({
    year: DEFAULT_YEAR,
    split: null,
    leagueName: DEFAULT_LEAGUE,
    teamName: null,
    patch: null,
    side: "ALL",
    leagueNames: [],
    splitNames: [],
    teamNames: [],
  });

  const { data: categoryData } = useQuery(categoriesQueries.tree(filters.year));

  const leagueOptions = useMemo(() => {
    if (!categoryData) return [];
    const currentSeason = categoryData.seasons.find(
      (s) => s.year === filters.year,
    );
    if (!currentSeason) return [];
    return currentSeason.leagues.map((league) => ({
      value: league.name,
      label: `League: ${league.name}`,
    }));
  }, [categoryData, filters.year]);

  const leagueName = filters.leagueName ?? DEFAULT_LEAGUE;
  const leagueInfo = leagueName ? LEAGUE_INFO[leagueName] : null;

  function handleLeagueChange(value: string | null) {
    setFilters((prev) => ({
      ...prev,
      leagueName: value ?? DEFAULT_LEAGUE,
      split: null,
      patch: null,
    }));
  }

  return (
    <Container size="xl" px={{ base: 0, sm: 24, md: 32 }}>
      <div className="relative flex flex-col gap-3.75">
        <Box style={{ width: 160 }}>
          <Select
            placeholder="리그를 선택하세요"
            data={leagueOptions}
            value={leagueName}
            onChange={handleLeagueChange}
          />
        </Box>
        {leagueName && leagueInfo && (
          <div className="flex gap-5 items-center">
            <leagueInfo.Icon width={85} height={78} />
            <div className="flex flex-col">
              <Text c="var(--nar-text-primary)" fz={34} fw={700}>
                {leagueName}
              </Text>
              <Text c="var(--nar-text-tertiary-sub)" fz={18} fw={500}>
                {leagueInfo.fullName}
              </Text>
            </div>
          </div>
        )}
      </div>
      <Stack mt="md" gap={0}>
        <Paper withBorder p={0} radius="xl">
          <Stack px={16} py={24} gap={22}>
            <FilterSection
              variant="players"
              filters={filters}
              onFiltersChange={setFilters}
              showSearchButton={false}
            />
          </Stack>
          <Stack px={16} py={24} gap={22}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              <div className="w-full sm:min-w-0 sm:basis-[44%] lg:basis-[42%]">
                <TeamStatsGraph filters={filters} className="w-full" />
              </div>
              <div className="w-full sm:min-w-0 sm:basis-[56%] lg:basis-[58%]">
                <PlayedChampion
                  filters={filters}
                  className="w-full"
                  onSideChange={(side) =>
                    setFilters((prev) => ({
                      ...prev,
                      side,
                    }))
                  }
                />
              </div>
            </div>
            <TeamStatsScatter filters={filters} />
            <GameDetail filters={filters} />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
