// src/pages/HomePage.jsx

import React, { useState } from 'react';
import { Container, Stack } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import ChampionSelector from '../components/layout/ChampionSelector';
import FilterSection from '../components/layout/FilterSection';
import ChampionGrid from '../components/list/ChampionGrid';
import CombinationResults from "../components/results/CombinationResults";
import MatchupResults from "../components/results/MatchupResults";

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedChampions, setSelectedChampions] = useState([]);
    const [selected1v1Champions, setSelected1v1Champions] = useState([]);

    const [currentSlotIndex, setCurrentSlotIndex] = useState(null);
    const [currentMode, setCurrentMode] = useState('team');

    const [filters, setFilters] = useState({
        year: 2025,
        split: null,
        leagueName: null,
        teamName: null,
        patch: null,
        leagueNames: ['LCK'],
        splitNames: [],
        teamNames: []
    });

    const showResults = location.search.includes('results=true');

    const handleChampionSelect = (champion) => {
        console.log('Champion clicked:', champion);

        if (currentMode === 'team') {
            const isAlreadySelected = selectedChampions.some(c => c && c.id === champion.id);
            if (isAlreadySelected) {
                const newSelected = selectedChampions.filter(c => c && c.id !== champion.id);
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
        } else { // '1v1' mode
            const isAlreadySelected = selected1v1Champions.some(c => c && c.id === champion.id);
            if (isAlreadySelected) {
                const newSelected = selected1v1Champions.filter(c => c && c.id !== champion.id);
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

    const handleChampionRemove = (championToRemove) => {
        if (!championToRemove || !championToRemove.id) return;
        const newSelected = selectedChampions.filter(c => c && c.id !== championToRemove.id);
        setSelectedChampions(newSelected);
    };

    const handle1v1ChampionRemove = (championToRemove) => {
        if (!championToRemove || !championToRemove.id) return;
        const newSelected = selected1v1Champions.filter(c => c && c.id !== championToRemove.id);
        setSelected1v1Champions(newSelected);
    };

    const handleEmptySlotClick = (slotIndex) => {
        setCurrentMode('team');
        setCurrentSlotIndex(slotIndex);
        if (showResults) {
            navigate('/', { replace: false });
        }
    };

    const handleEmpty1v1SlotClick = (slotIndex) => {
        setCurrentMode('1v1');
        setCurrentSlotIndex(slotIndex);
        if (showResults) {
            navigate('/', { replace: false });
        }
    };

    const handleModeChange = (mode) => {
        setCurrentMode(mode);
        setCurrentSlotIndex(null);
        // ✅ 수정: 결과 페이지에 있었다면, 그리드를 보여주기 위해 URL을 변경합니다.
        if (showResults) {
            navigate('/', { replace: false });
        }
    };

    const handleCombinationSearch = () => {
        if (currentMode === 'team' && selectedChampions.length < 1) {
            alert('최소 1개의 챔피언을 선택해주세요.');
            return;
        }
        if (currentMode === '1v1' && selected1v1Champions.length < 2) {
            alert('1vs1을 위해 2개의 챔피언을 모두 선택해주세요.');
            return;
        }

        navigate('/?results=true', { replace: false });
    };

    const handleBackToSelection = () => {
        setCurrentSlotIndex(null);
        navigate('/', { replace: false });
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
                    selectedChampions={currentMode === 'team' ? selectedChampions : selected1v1Champions}
                    onCombinationSearch={handleCombinationSearch}
                    currentMode={currentMode}
                />

                {showResults ? (
                    currentMode === 'team' ? (
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
                        selectedChampions={currentMode === 'team' ? selectedChampions : selected1v1Champions}
                        highlightSlot={currentSlotIndex}
                    />
                )}
            </Stack>
        </Container>
    );
};

export default HomePage;