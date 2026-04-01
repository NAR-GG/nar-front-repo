"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Paper, Stack, Text } from "@mantine/core";
import type { ChampionData } from "@/entities/champions/api/champions.dto";
import type { Mode, Filters } from "@/shared/types/filter.types";
import { ChampionSelector } from "./champion-selector";
import { FilterSection } from "@/shared/ui/filter-section";
import { CombinationResults } from "./combination-results";
import { MatchupResults } from "./matchup-results";
import { ChampionGrid } from "./champion-grid";

export function ChampionsMetaComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const championGridRef = useRef<HTMLDivElement>(null);

  const [selectedChampions, setSelectedChampions] = useState<
    (ChampionData | null)[]
  >([]);
  const [selected1v1Champions, setSelected1v1Champions] = useState<
    (ChampionData | null)[]
  >([]);

  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);
  const [currentMode, setCurrentMode] = useState<Mode>("team");

  const [filters, setFilters] = useState<Filters>({
    year: 2026,
    split: null,
    leagueName: null,
    teamName: null,
    patch: null,
    leagueNames: [],
    splitNames: [],
    teamNames: [],
  });

  const showResults = searchParams?.get("results") === "true";

  const scrollToChampionGrid = useCallback(() => {
    setTimeout(() => {
      championGridRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, []);

  const handleChampionSelect = useCallback((champion: ChampionData) => {
    if (currentMode === "team") {
      const isAlreadySelected = selectedChampions.some(
        (c) => c && c.id === champion.id,
      );
      if (isAlreadySelected) {
        setSelectedChampions(selectedChampions.filter((c) => c && c.id !== champion.id));
      } else {
        if (currentSlotIndex !== null) {
          const newSelected = [...selectedChampions];
          newSelected[currentSlotIndex] = champion;
          setSelectedChampions(newSelected);
          setCurrentSlotIndex(null);
        } else if (selectedChampions.length < 5) {
          setSelectedChampions([...selectedChampions, champion]);
        }
      }
    } else {
      const isAlreadySelected = selected1v1Champions.some(
        (c) => c && c.id === champion.id,
      );
      if (isAlreadySelected) {
        setSelected1v1Champions(selected1v1Champions.filter((c) => c && c.id !== champion.id));
      } else {
        if (currentSlotIndex !== null) {
          const newSelected = [...selected1v1Champions];
          newSelected[currentSlotIndex] = champion;
          setSelected1v1Champions(newSelected);
          setCurrentSlotIndex(null);
        } else if (selected1v1Champions.length < 2) {
          setSelected1v1Champions([...selected1v1Champions, champion]);
        }
      }
    }
  }, [currentMode, selectedChampions, selected1v1Champions, currentSlotIndex]);

  const handleChampionRemove = useCallback((championToRemove: ChampionData) => {
    if (!championToRemove?.id) return;
    setSelectedChampions((prev) => prev.filter((c) => c && c.id !== championToRemove.id));
  }, []);

  const handle1v1ChampionRemove = useCallback((championToRemove: ChampionData) => {
    if (!championToRemove?.id) return;
    setSelected1v1Champions((prev) => prev.filter((c) => c && c.id !== championToRemove.id));
  }, []);

  const handleEmptySlotClick = useCallback((slotIndex: number) => {
    setCurrentMode("team");
    setCurrentSlotIndex(slotIndex);
    if (showResults) {
      router.push("/champions-meta");
    }
    scrollToChampionGrid();
  }, [showResults, router, scrollToChampionGrid]);

  const handleEmpty1v1SlotClick = useCallback((slotIndex: number) => {
    setCurrentMode("1v1");
    setCurrentSlotIndex(slotIndex);
    if (showResults) {
      router.push("/champions-meta");
    }
    scrollToChampionGrid();
  }, [showResults, router, scrollToChampionGrid]);

  const handleModeChange = useCallback((mode: Mode) => {
    setCurrentMode(mode);
    setCurrentSlotIndex(null);
    if (showResults) {
      router.push("/champions-meta");
    }
  }, [showResults, router]);

  const handleCombinationSearch = useCallback(() => {
    if (currentMode === "team" && selectedChampions.length < 1) {
      alert("최소 1개의 챔피언을 선택해주세요.");
      return;
    }
    if (currentMode === "1v1" && selected1v1Champions.length < 2) {
      alert("1vs1을 위해 2개의 챔피언을 모두 선택해주세요.");
      return;
    }
    router.push("/champions-meta?results=true");
  }, [currentMode, selectedChampions.length, selected1v1Champions.length, router]);

  const handleBackToSelection = useCallback(() => {
    setCurrentSlotIndex(null);
    router.push("/champions-meta");
  }, [router]);

  return (
    <Paper p={20} withBorder radius={24}>
      <Stack gap="xl">
        <Text fz={22} fw={700} lh={1.4} c="var(--nar-text-tertiary)">
          챔피언 조합 검색
        </Text>
        <FilterSection
          filters={filters}
          onFiltersChange={setFilters}
          selectedChampions={
            currentMode === "team" ? selectedChampions : selected1v1Champions
          }
          onCombinationSearch={handleCombinationSearch}
          currentMode={currentMode}
        />
        <ChampionSelector
          selectedChampions={selectedChampions}
          selected1v1Champions={selected1v1Champions}
          onChampionRemove={handleChampionRemove}
          on1v1ChampionRemove={handle1v1ChampionRemove}
          onEmptySlotClick={handleEmptySlotClick}
          onEmpty1v1SlotClick={handleEmpty1v1SlotClick}
          currentMode={currentMode}
          onModeChange={handleModeChange}
          highlightSlot={currentSlotIndex}
        />

        {showResults ? (
          currentMode === "team" ? (
            <CombinationResults
              selectedChampions={selectedChampions}
              filters={filters}
              onBackToSelection={handleBackToSelection}
              mode={currentMode}
            />
          ) : (
            <MatchupResults
              champion1={selected1v1Champions[0]?.championNameEn}
              champion2={selected1v1Champions[1]?.championNameEn}
              filters={filters}
              onBackToSelection={handleBackToSelection}
            />
          )
        ) : (
          <div ref={championGridRef}>
            <ChampionGrid
              onChampionSelect={handleChampionSelect}
              selectedChampions={
                currentMode === "team"
                  ? selectedChampions
                  : selected1v1Champions
              }
              highlightSlot={currentSlotIndex}
              currentMode={currentMode}
            />
          </div>
        )}
      </Stack>
    </Paper>
  );
}
