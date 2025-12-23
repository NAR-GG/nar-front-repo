"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Stack } from "@mantine/core";
import type { ChampionData } from "@/entities/champions/model/champions.dto";
import type { Mode, Filters } from "../model/types";
import { ChampionSelector } from "./champion-selector";
import { FilterSection } from "./filter-section";
import { CombinationResults } from "./combination-results";
import { MatchupResults } from "./matchup-results";
import { ChampionGrid } from "./champion-grid";

export function ChampionsMetaComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedChampions, setSelectedChampions] = useState<
    (ChampionData | null)[]
  >([]);
  const [selected1v1Champions, setSelected1v1Champions] = useState<
    (ChampionData | null)[]
  >([]);

  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);
  const [currentMode, setCurrentMode] = useState<Mode>("team");

  const [filters, setFilters] = useState<Filters>({
    year: 2025,
    split: null,
    leagueName: null,
    teamName: null,
    patch: null,
    leagueNames: [],
    splitNames: [],
    teamNames: [],
  });

  const showResults = searchParams?.get("results") === "true";

  const handleChampionSelect = (champion: ChampionData) => {
    console.log("Champion clicked:", champion);

    if (currentMode === "team") {
      const isAlreadySelected = selectedChampions.some(
        (c) => c && c.id === champion.id
      );
      if (isAlreadySelected) {
        const newSelected = selectedChampions.filter(
          (c) => c && c.id !== champion.id
        );
        setSelectedChampions(newSelected);
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
        (c) => c && c.id === champion.id
      );
      if (isAlreadySelected) {
        const newSelected = selected1v1Champions.filter(
          (c) => c && c.id !== champion.id
        );
        setSelected1v1Champions(newSelected);
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
  };

  const handleChampionRemove = (championToRemove: ChampionData) => {
    if (!championToRemove?.id) return;
    const newSelected = selectedChampions.filter(
      (c) => c && c.id !== championToRemove.id
    );
    setSelectedChampions(newSelected);
  };

  const handle1v1ChampionRemove = (championToRemove: ChampionData) => {
    if (!championToRemove?.id) return;
    const newSelected = selected1v1Champions.filter(
      (c) => c && c.id !== championToRemove.id
    );
    setSelected1v1Champions(newSelected);
  };

  const handleEmptySlotClick = (slotIndex: number) => {
    setCurrentMode("team");
    setCurrentSlotIndex(slotIndex);
    if (showResults) {
      router.push("/champions-meta");
    }
  };

  const handleEmpty1v1SlotClick = (slotIndex: number) => {
    setCurrentMode("1v1");
    setCurrentSlotIndex(slotIndex);
    if (showResults) {
      router.push("/champions-meta");
    }
  };

  const handleModeChange = (mode: Mode) => {
    setCurrentMode(mode);
    setCurrentSlotIndex(null);
    if (showResults) {
      router.push("/champions-meta");
    }
  };

  const handleCombinationSearch = () => {
    if (currentMode === "team" && selectedChampions.length < 1) {
      alert("최소 1개의 챔피언을 선택해주세요.");
      return;
    }
    if (currentMode === "1v1" && selected1v1Champions.length < 2) {
      alert("1vs1을 위해 2개의 챔피언을 모두 선택해주세요.");
      return;
    }

    router.push("/champions-meta?results=true");
  };

  const handleBackToSelection = () => {
    setCurrentSlotIndex(null);
    router.push("/champions-meta");
  };

  return (
    <Container size="xl" px={{ base: 16, sm: 24, md: 32 }}>
      <Stack gap="xl">
        <ChampionSelector
          selectedChampions={selectedChampions}
          selected1v1Champions={selected1v1Champions}
          onChampionRemove={handleChampionRemove}
          on1v1ChampionRemove={handle1v1ChampionRemove}
          onEmptySlotClick={handleEmptySlotClick}
          onEmpty1v1SlotClick={handleEmpty1v1SlotClick}
          currentMode={currentMode}
          onModeChange={handleModeChange}
        />

        <FilterSection
          filters={filters}
          onFiltersChange={setFilters}
          selectedChampions={
            currentMode === "team" ? selectedChampions : selected1v1Champions
          }
          onCombinationSearch={handleCombinationSearch}
          currentMode={currentMode}
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
          <ChampionGrid
            onChampionSelect={handleChampionSelect}
            selectedChampions={
              currentMode === "team" ? selectedChampions : selected1v1Champions
            }
            highlightSlot={currentSlotIndex}
          />
        )}
      </Stack>
    </Container>
  );
}
