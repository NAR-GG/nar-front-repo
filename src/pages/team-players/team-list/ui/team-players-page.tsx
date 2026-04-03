"use client";

import { CommonTabs } from "@/shared/ui/common-tabs";
import { FilterSection } from "@/shared/ui/filter-section";
import type { Filters } from "@/shared/types/filter.types";
import { Box, Container, Paper, Select, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTeamPlayersPage } from "../model/use-team-players-page";
import BrandHomeIcon from "@/shared/assets/icons/home.svg";
import BrandInstarIcon from "@/shared/assets/icons/brand-instagram.svg";
import BrandTwitterIcon from "@/shared/assets/icons/brand-twitter.svg";
import BrandYoutubeIcon from "@/shared/assets/icons/brand-youtube.svg";
import { getDaysAgo } from "../lib/get-days-ago";
import {
  TEAM_PLAYERS_TABS,
  DEFAULT_TEAM_DASHBOARD_FILTERS,
} from "../config/team-players.config";
import { GameSummary } from "./game-summary";
import { PlayerRecord } from "./player-record";
import { BannedAgainst } from "./banned-against";
import { BannedByTeam } from "./banned-by-team";
import { PlayedChampions } from "./played-champions";
import { TeamMatchList } from "./team-match-list";

export function TeamListPageComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeTab, setActiveTab] = useState<"total" | "play-list">("total");
  const searchParams = useSearchParams();
  const [teamName, setTeamName] = useState<string | null>(
    searchParams?.get("team") ?? DEFAULT_TEAM_DASHBOARD_FILTERS.defaultTeamName,
  );
  const [dashboardFilters, setDashboardFilters] = useState<Filters>({
    year: DEFAULT_TEAM_DASHBOARD_FILTERS.year,
    split: null,
    leagueName: DEFAULT_TEAM_DASHBOARD_FILTERS.leagueName,
    teamName: null,
    patch: null,
    side: DEFAULT_TEAM_DASHBOARD_FILTERS.side,
    leagueNames: [],
    splitNames: [],
    teamNames: [],
  });

  const { teamOptions, profileHeader, dashboard } = useTeamPlayersPage(
    teamName,
    dashboardFilters,
  );

  return (
    <Container size="xl" px={{ base: 0, sm: 24, md: 32 }}>
      <div className="relative flex flex-col gap-3.75">
        <Box style={{ width: 126 }}>
          <Select
            placeholder="팀을 선택하세요"
            data={teamOptions}
            value={teamName}
            onChange={setTeamName}
          />
        </Box>
        <div className="flex gap-5">
          {profileHeader?.teamImageUrl && (
            <Image
              src={profileHeader.teamImageUrl}
              alt={profileHeader.teamName ?? ""}
              width={85}
              height={78}
              className="object-contain"
            />
          )}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <Text c="var(--nar-text-primary)" fz={34} fw={700}>
                {profileHeader?.teamCode}
              </Text>
              <Text c="var(--nar-text-tertiary-sub)" fz={18} fw={500}>
                {profileHeader?.teamName}
              </Text>
            </div>
            <div className="flex gap-2">
              {profileHeader?.socialLinks.homepage && (
                <BrandHomeIcon
                  onClick={() =>
                    window.open(profileHeader.socialLinks.homepage, "_blank")
                  }
                />
              )}
              {profileHeader?.socialLinks.youtube && (
                <BrandYoutubeIcon
                  onClick={() =>
                    window.open(profileHeader.socialLinks.youtube, "_blank")
                  }
                />
              )}
              {profileHeader?.socialLinks.instagram && (
                <BrandInstarIcon
                  onClick={() =>
                    window.open(profileHeader.socialLinks.instagram, "_blank")
                  }
                />
              )}
              {profileHeader?.socialLinks.twitter && (
                <BrandTwitterIcon
                  onClick={() =>
                    window.open(profileHeader.socialLinks.twitter, "_blank")
                  }
                />
              )}
            </div>
          </div>
        </div>
        <Box
          pos={isMobile ? "relative" : "absolute"}
          bottom={isMobile ? undefined : -35}
          right={isMobile ? undefined : 0}
          mt={isMobile ? "md" : 0}
        >
          <div className="flex flex-col gap-1.75">
            <Text c="var(--nar-text-secondary)" fz={16} fw={400}>
              최근 경기 일정
            </Text>
            <div
              className="rounded-lg p-px"
              style={{ background: "var(--nar_gradients_LNB)" }}
            >
              <div className="rounded-[7px] p-3.5 bg-(--nar-bg-secondary) relative">
                <div className="absolute inset-0 rounded-[7px] bg-(--nar-purple-opacity5)" />
                <div className="flex flex-col gap-2.5">
                  {profileHeader?.recentMatches.map((match) => {
                    const teamColor = match.isToday
                      ? "var(--nar-text-primary)"
                      : "var(--nar-text-tertiary-sub)";
                    const vsColor = match.isToday
                      ? "var(--nar-text-red)"
                      : "var(--nar-text-tertiary-sub)";
                    return (
                      <div
                        className="flex gap-[15px] items-center"
                        key={match.matchId}
                      >
                        <Text
                          c="var(--nar-text-tertiary-sub)"
                          fz={16}
                          fw={400}
                          w={59}
                          className="text-end"
                        >
                          {getDaysAgo(match.scheduledAt, match.isToday)}
                        </Text>
                        <div className="flex gap-[12px] items-center">
                          <Text c={teamColor} fz={16} fw={400} w={36} ta="left">
                            {match.blueTeamCode}
                          </Text>
                          <Text c={vsColor} fz={16} fw={400} w={20} ta="center">
                            VS
                          </Text>
                          <Text c={teamColor} fz={16} fw={400} w={36} ta="left">
                            {match.redTeamCode}
                          </Text>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </div>
      <Stack mt="md" gap={0}>
        <CommonTabs
          variant="set-nav"
          value={activeTab}
          items={[...TEAM_PLAYERS_TABS.items]}
          onChange={(nextValue) => {
            if (nextValue === "total" || nextValue === "play-list") {
              setActiveTab(nextValue);
            }
          }}
        />
        <Paper withBorder p={0} radius="0 24px 24px 24px">
          {activeTab === "play-list" && <TeamMatchList teamName={teamName} />}
          {activeTab === "total" && (
            <Stack px={16} py={24} gap={22}>
              <FilterSection
                variant="players"
                filters={dashboardFilters}
                onFiltersChange={setDashboardFilters}
                showSearchButton={false}
              />
            </Stack>
          )}
          {activeTab === "total" && dashboard && (
            <Stack px={16} py={24} gap={22}>
              <GameSummary data={dashboard.gameSummary} />
              <PlayerRecord data={dashboard.playerRecords} />
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <BannedAgainst data={dashboard.bannedAgainst} />
                </div>
                <div className="flex-1">
                  <BannedByTeam data={dashboard.bannedByTeam} />
                </div>
              </div>
              <PlayedChampions data={dashboard.playedChampions} />
            </Stack>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
