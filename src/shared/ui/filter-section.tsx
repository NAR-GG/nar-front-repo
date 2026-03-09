"use client";

import { useMemo, useCallback } from "react";
import {
  Paper,
  Group,
  Button,
  Text,
  Stack,
  Box,
  Divider,
  Flex,
  Select,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { categoriesQueries } from "@/entities/categories/model/categories.queries";
import type { ChampionData } from "@/entities/champions/model/champions.dto";
import type { Mode, Filters } from "@/shared/types/filter.types";
import { CustomMultiSelect } from "./custom-multi-select";

interface FilterSectionProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  selectedChampions?: (ChampionData | null)[];
  onCombinationSearch?: () => void;
  currentMode?: Mode;
  showSearchButton?: boolean;
  variant?: "default" | "players";
}

export function FilterSection({
  filters,
  onFiltersChange,
  selectedChampions = [],
  onCombinationSearch,
  currentMode = "team",
  showSearchButton = true,
  variant = "default",
}: FilterSectionProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSearchDisabled = selectedChampions.filter(Boolean).length === 0;

  const { data: categoryData, isLoading } = useQuery(
    categoriesQueries.tree(filters.year),
  );

  const getButtonText = () => {
    return currentMode === "1v1" ? "매치업 보기" : "조합 보기";
  };

  const leagueOptions = useMemo(() => {
    if (!categoryData) return [];

    const currentSeason = categoryData.seasons.find(
      (s) => s.year === filters.year,
    );
    if (!currentSeason) return [];

    return currentSeason.leagues.map((league) => ({
      value: league.name,
      label: league.name,
    }));
  }, [categoryData, filters.year]);

  const splitOptions = useMemo(() => {
    if (
      !categoryData ||
      !filters.leagueNames ||
      filters.leagueNames.length === 0
    ) {
      return [];
    }

    const currentSeason = categoryData.seasons.find(
      (s) => s.year === filters.year,
    );
    if (!currentSeason) return [];

    const selectedLeagues = currentSeason.leagues.filter((l) =>
      filters.leagueNames.includes(l.name),
    );

    const allSplits = selectedLeagues.flatMap((league) =>
      league.splits
        .filter((split) => split.name && split.name.trim() !== "")
        .map((split) => split.name),
    );

    const uniqueSplits = [...new Set(allSplits)];

    return uniqueSplits.map((splitName) => ({
      value: splitName,
      label: splitName,
    }));
  }, [categoryData, filters.leagueNames, filters.year]);

  const teamOptions = useMemo(() => {
    if (
      !categoryData ||
      !filters.leagueNames ||
      filters.leagueNames.length === 0
    ) {
      return [];
    }

    const currentSeason = categoryData.seasons.find(
      (s) => s.year === filters.year,
    );
    if (!currentSeason) return [];

    const selectedLeagues = currentSeason.leagues.filter((l) =>
      filters.leagueNames.includes(l.name),
    );

    const relevantSplits = selectedLeagues.flatMap((league) =>
      league.splits.filter((split) => {
        if (!filters.splitNames || filters.splitNames.length === 0) return true;
        if (!split.name || split.name.trim() === "") return true;
        return filters.splitNames.includes(split.name);
      }),
    );

    const allTeams = relevantSplits.flatMap((split) =>
      split.teams.map((team) => team.name),
    );

    const uniqueTeams = [...new Set(allTeams)];

    return uniqueTeams.sort().map((teamName) => ({
      value: teamName,
      label: teamName,
    }));
  }, [categoryData, filters.leagueNames, filters.splitNames, filters.year]);

  const playerSplitOptions = useMemo(() => {
    if (!categoryData) return [];

    const season = categoryData.seasons.find((s) => s.year === filters.year);
    if (!season) return [];

    const targetLeagueName =
      filters.leagueName ?? filters.leagueNames?.[0] ?? "LCK";

    const league = season.leagues.find((l) => l.name === targetLeagueName);
    if (!league) return [];

    const uniqueSplits = [
      ...new Set(
        league.splits
          .filter((split) => split.name && split.name.trim() !== "")
          .map((split) => split.name),
      ),
    ];

    return uniqueSplits.map((splitName) => ({
      value: splitName,
      label: splitName,
    }));
  }, [categoryData, filters.year, filters.leagueName, filters.leagueNames]);

  const playerPatchOptions = useMemo(() => {
    if (!categoryData) return [];

    const season = categoryData.seasons.find((s) => s.year === filters.year);
    if (!season) return [];

    const targetLeagueName =
      filters.leagueName ?? filters.leagueNames?.[0] ?? "LCK";
    const league = season.leagues.find((l) => l.name === targetLeagueName);
    if (!league) return [];

    const targetSplits = league.splits.filter((split) => {
      if (!split.name || split.name.trim() === "") return false;
      if (!filters.split) return true;
      return split.name === filters.split;
    });

    const uniquePatches = [
      ...new Set(
        targetSplits.flatMap((split) =>
          (split.patches ?? []).filter((patch) => Boolean(patch?.trim())),
        ),
      ),
    ];

    return uniquePatches.map((patch) => ({
      value: patch,
      label: patch,
    }));
  }, [
    categoryData,
    filters.year,
    filters.leagueName,
    filters.leagueNames,
    filters.split,
  ]);

  const handleFilterChange = useCallback(
    (field: keyof Filters, value: string[]) => {
      const newFilters = { ...filters, [field]: value };

      if (field === "leagueNames") {
        if (newFilters.splitNames && newFilters.splitNames.length > 0) {
          const currentSeason = categoryData?.seasons.find(
            (s) => s.year === filters.year,
          );
          const selectedLeagues = currentSeason?.leagues.filter((l) =>
            newFilters.leagueNames.includes(l.name),
          );

          const validSplits =
            selectedLeagues?.flatMap((league) =>
              league.splits
                .filter((split) => split.name && split.name.trim() !== "")
                .map((split) => split.name),
            ) || [];

          const uniqueValidSplits = [...new Set(validSplits)];
          newFilters.splitNames = newFilters.splitNames.filter((split) =>
            uniqueValidSplits.includes(split),
          );
        }

        if (newFilters.teamNames && newFilters.teamNames.length > 0) {
          const currentSeason = categoryData?.seasons.find(
            (s) => s.year === filters.year,
          );
          const selectedLeagues = currentSeason?.leagues.filter((l) =>
            newFilters.leagueNames.includes(l.name),
          );

          const allSplits =
            selectedLeagues?.flatMap((league) =>
              league.splits.filter((split) => {
                if (!split.name || split.name.trim() === "") return false;
                if (
                  !newFilters.splitNames ||
                  newFilters.splitNames.length === 0
                )
                  return true;
                return newFilters.splitNames.includes(split.name);
              }),
            ) || [];

          const validTeams = allSplits.flatMap((split) =>
            split.teams.map((team) => team.name),
          );
          const uniqueValidTeams = [...new Set(validTeams)];

          newFilters.teamNames = newFilters.teamNames.filter((team) =>
            uniqueValidTeams.includes(team),
          );
        }
      }

      if (field === "splitNames") {
        if (newFilters.teamNames && newFilters.teamNames.length > 0) {
          const currentSeason = categoryData?.seasons.find(
            (s) => s.year === filters.year,
          );
          const selectedLeagues = currentSeason?.leagues.filter((l) =>
            newFilters.leagueNames.includes(l.name),
          );

          const relevantSplits =
            selectedLeagues?.flatMap((league) =>
              league.splits.filter((split) => {
                if (!split.name || split.name.trim() === "") return false;
                if (
                  !newFilters.splitNames ||
                  newFilters.splitNames.length === 0
                )
                  return true;
                return newFilters.splitNames.includes(split.name);
              }),
            ) || [];

          const validTeams = relevantSplits.flatMap((split) =>
            split.teams.map((team) => team.name),
          );
          const uniqueValidTeams = [...new Set(validTeams)];

          newFilters.teamNames = newFilters.teamNames.filter((team) =>
            uniqueValidTeams.includes(team),
          );
        }
      }

      onFiltersChange(newFilters);
    },
    [filters, categoryData, onFiltersChange],
  );

  const removeTag = useCallback(
    (type: "league" | "split" | "team", value: string) => {
      if (type === "league") {
        const newLeagues =
          filters.leagueNames?.filter((name) => name !== value) || [];
        handleFilterChange("leagueNames", newLeagues);
      } else if (type === "split") {
        const newSplits =
          filters.splitNames?.filter((name) => name !== value) || [];
        handleFilterChange("splitNames", newSplits);
      } else if (type === "team") {
        const newTeams =
          filters.teamNames?.filter((name) => name !== value) || [];
        handleFilterChange("teamNames", newTeams);
      }
    },
    [filters, handleFilterChange],
  );

  const tagStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.2s ease",
    backgroundColor: "var(--nar-bg-tertiary)",
    border: "1px solid var(--nar-line)",
    color: "var(--nar-text-purple)",
  };

  if (isLoading) {
    return (
      <Paper p="md" withBorder radius="md">
        <Group justify="center" p="xl">
          <Text c="dimmed">필터 옵션을 불러오는 중...</Text>
        </Group>
      </Paper>
    );
  }

  if (variant === "players") {
    if (isMobile) {
      return (
        <Box className="grid w-full grid-cols-2 gap-3">
          <Select
            label="년도"
            data={[
              { value: "2025", label: "2025" },
              { value: "2026", label: "2026" },
            ]}
            value={filters.year.toString()}
            onChange={(v) =>
              onFiltersChange({
                ...filters,
                year: parseInt(v || "2026", 10),
                split: null,
                patch: null,
              })
            }
          />

          <Select
            label="스플릿"
            placeholder="스플릿 선택"
            data={playerSplitOptions}
            value={filters.split}
            onChange={(v) =>
              onFiltersChange({
                ...filters,
                split: v ?? null,
                patch: null,
              })
            }
            clearable
          />

          <Select
            label="패치"
            placeholder="패치 선택"
            data={playerPatchOptions}
            value={filters.patch}
            onChange={(v) =>
              onFiltersChange({
                ...filters,
                patch: v ?? null,
              })
            }
            clearable
            searchable
            disabled={playerPatchOptions.length === 0}
          />

          <Select
            label="진영"
            data={[
              { value: "ALL", label: "ALL" },
              { value: "BLUE", label: "BLUE" },
              { value: "RED", label: "RED" },
            ]}
            value={filters.side ?? "ALL"}
            onChange={(v) =>
              onFiltersChange({
                ...filters,
                side: (v as "ALL" | "BLUE" | "RED") ?? "ALL",
              })
            }
          />
        </Box>
      );
    }

    return (
      <Group gap="md" align="end" wrap="wrap">
        <Box style={{ width: 192 }}>
          <Select
            label="년도"
            data={[
              { value: "2025", label: "2025" },
              { value: "2026", label: "2026" },
            ]}
            value={filters.year.toString()}
            onChange={(v) =>
              onFiltersChange({
                ...filters,
                year: parseInt(v || "2026", 10),
                split: null,
                patch: null,
              })
            }
          />
        </Box>

        <Box style={{ width: 192 }}>
          <Select
            label="스플릿"
            placeholder="스플릿 선택"
            data={playerSplitOptions}
            value={filters.split}
            onChange={(v) =>
              onFiltersChange({
                ...filters,
                split: v ?? null,
                patch: null,
              })
            }
            clearable
          />
        </Box>

        <Box style={{ width: 192 }}>
          <Select
            label="패치"
            placeholder="패치 선택"
            data={playerPatchOptions}
            value={filters.patch}
            onChange={(v) =>
              onFiltersChange({
                ...filters,
                patch: v ?? null,
              })
            }
            clearable
            searchable
            disabled={playerPatchOptions.length === 0}
          />
        </Box>

        <Box style={{ width: 192 }}>
          <Select
            label="진영"
            data={[
              { value: "ALL", label: "ALL" },
              { value: "BLUE", label: "BLUE" },
              { value: "RED", label: "RED" },
            ]}
            value={filters.side ?? "ALL"}
            onChange={(v) =>
              onFiltersChange({
                ...filters,
                side: (v as "ALL" | "BLUE" | "RED") ?? "ALL",
              })
            }
          />
        </Box>
      </Group>
    );
  }

  return (
    <div>
      {isMobile ? (
        <Stack gap="md">
          <Group grow>
            <Select
              label="시즌"
              placeholder="시즌"
              data={[
                { value: "2025", label: "2025" },
                { value: "2026", label: "2026" },
              ]}
              value={filters.year.toString()}
              onChange={(v) =>
                onFiltersChange({
                  ...filters,
                  year: parseInt(v || "2026"),
                  leagueNames: [],
                  splitNames: [],
                  teamNames: [],
                })
              }
            />
            <CustomMultiSelect
              label="리그"
              placeholder="리그를 선택하세요"
              data={leagueOptions}
              value={filters.leagueNames || []}
              onChange={(value) => handleFilterChange("leagueNames", value)}
            />
          </Group>
          <Group grow>
            <CustomMultiSelect
              label="스플릿"
              placeholder="스플릿을 선택하세요"
              data={splitOptions}
              value={filters.splitNames || []}
              onChange={(value) => handleFilterChange("splitNames", value)}
              disabled={
                !filters.leagueNames || filters.leagueNames.length === 0
              }
            />
            <CustomMultiSelect
              label="팀"
              placeholder="팀을 선택하세요"
              data={teamOptions}
              value={filters.teamNames || []}
              onChange={(value) => handleFilterChange("teamNames", value)}
              disabled={
                !filters.leagueNames || filters.leagueNames.length === 0
              }
            />
          </Group>

          {showSearchButton && (
            <Flex justify="flex-end">
              <Group gap="md" align="center">
                <Button
                  rightSection={<IconSearch size={16} />}
                  onClick={onCombinationSearch}
                  disabled={isSearchDisabled}
                  className={`${!isSearchDisabled ? "bg-(--nar-purple-1)!" : ""} rounded-[10px]!`}
                >
                  {getButtonText()}
                </Button>
              </Group>
            </Flex>
          )}
        </Stack>
      ) : (
        <Group justify="space-between" align="end">
          <Group gap="md">
            <Box style={{ width: 192 }}>
              <Select
                label="시즌"
                placeholder="시즌"
                data={[
                  { value: "2025", label: "2025" },
                  { value: "2026", label: "2026" },
                ]}
                value={filters.year.toString()}
                onChange={(v) =>
                  onFiltersChange({
                    ...filters,
                    year: parseInt(v || "2026"),
                    leagueNames: [],
                    splitNames: [],
                    teamNames: [],
                  })
                }
              />
            </Box>
            <Box style={{ width: 192 }}>
              <CustomMultiSelect
                label="리그"
                placeholder="리그를 선택하세요"
                data={leagueOptions}
                value={filters.leagueNames || []}
                onChange={(value) => handleFilterChange("leagueNames", value)}
              />
            </Box>
            <Box style={{ width: 192 }}>
              <CustomMultiSelect
                label="스플릿"
                placeholder="스플릿을 선택하세요"
                data={splitOptions}
                value={filters.splitNames || []}
                onChange={(value) => handleFilterChange("splitNames", value)}
                disabled={
                  !filters.leagueNames || filters.leagueNames.length === 0
                }
              />
            </Box>
            <Box style={{ width: 192 }}>
              <CustomMultiSelect
                label="팀"
                placeholder="팀을 선택하세요"
                data={teamOptions}
                value={filters.teamNames || []}
                onChange={(value) => handleFilterChange("teamNames", value)}
                disabled={
                  !filters.leagueNames || filters.leagueNames.length === 0
                }
              />
            </Box>
          </Group>

          {showSearchButton && (
            <Group gap="md" align="center">
              <Button
                rightSection={<IconSearch size={16} />}
                onClick={onCombinationSearch}
                className={`${isSearchDisabled ? "bg-(--nar-button-disabled-bg)!" : "bg-(--nar-purple-1)!"} py-px! pl-[13px]! rounded-[10px]!`}
                disabled={isSearchDisabled}
              >
                <Text
                  c={
                    isSearchDisabled
                      ? "var(--nar-button-disabled-text)"
                      : "var(--nar-button-active-text)"
                  }
                  fz={14}
                  fw={400}
                >
                  {getButtonText()}
                </Text>
              </Button>
            </Group>
          )}
        </Group>
      )}

      {(filters.leagueNames?.length > 0 ||
        filters.splitNames?.length > 0 ||
        filters.teamNames?.length > 0) && (
        <>
          <Divider my="md" />
          <Group gap="xs" style={{ flexWrap: "wrap" }}>
            {filters.leagueNames?.map((league) => (
              <Box
                key={`league-${league}`}
                component="button"
                style={{ ...tagStyle }}
                onClick={() => removeTag("league", league)}
              >
                <Text size="xs">리그: {league}</Text>
                <IconX size={14} style={{ pointerEvents: "none" }} />
              </Box>
            ))}
            {filters.splitNames?.map((split) => (
              <Box
                key={`split-${split}`}
                component="button"
                style={{ ...tagStyle }}
                onClick={() => removeTag("split", split)}
              >
                <Text size="xs">스플릿: {split}</Text>
                <IconX size={14} style={{ pointerEvents: "none" }} />
              </Box>
            ))}
            {filters.teamNames?.map((team) => (
              <Box
                key={`team-${team}`}
                component="button"
                style={{ ...tagStyle }}
                onClick={() => removeTag("team", team)}
              >
                <Text size="xs">팀: {team}</Text>
                <IconX size={14} style={{ pointerEvents: "none" }} />
              </Box>
            ))}
          </Group>
        </>
      )}
    </div>
  );
}
