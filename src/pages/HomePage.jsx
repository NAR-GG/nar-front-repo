import React, { useState, useEffect } from 'react';
import { Container, Stack } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import ChampionSelector from '../components/layout/ChampionSelector';
import FilterSection from '../components/layout/FilterSection';
import ChampionGrid from '../components/list/ChampionGrid';
import CombinationResults from "../components/results/CombinationResults";

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 팀 조합용 상태
    const [selectedChampions, setSelectedChampions] = useState([]);
    // 1vs1용 상태 추가
    const [selected1v1Champions, setSelected1v1Champions] = useState([]);

    const [showChampionGrid, setShowChampionGrid] = useState(false);
    const [currentSlotIndex, setCurrentSlotIndex] = useState(null); // 현재 선택 중인 슬롯
    const [currentMode, setCurrentMode] = useState('team'); // 'team' 또는 '1v1'

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

    useEffect(() => {
        const handlePopState = () => {
            setShowChampionGrid(false);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        if (!showResults) {
            setShowChampionGrid(true);
        }
    }, [showResults]);

    const handleChampionSelect = (champion) => {
        console.log('Champion clicked:', champion);

        if (currentMode === 'team') {
            // 팀 조합 모드
            const isAlreadySelected = selectedChampions.some(c => c && c.id === champion.id);

            if (isAlreadySelected) {
                const newSelected = selectedChampions.filter(c => c && c.id !== champion.id);
                setSelectedChampions(newSelected);
            } else {
                if (currentSlotIndex !== null) {
                    // 특정 슬롯을 클릭했을 때
                    const newSelected = [...selectedChampions];
                    newSelected[currentSlotIndex] = champion;
                    setSelectedChampions(newSelected);
                    setCurrentSlotIndex(null);
                } else if (selectedChampions.length < 5) {
                    // 일반적인 선택
                    const newSelected = [...selectedChampions, champion];
                    setSelectedChampions(newSelected);
                }
            }
        } else {
            // 1vs1 모드
            const isAlreadySelected = selected1v1Champions.some(c => c && c.id === champion.id);

            if (isAlreadySelected) {
                const newSelected = selected1v1Champions.filter(c => c && c.id !== champion.id);
                setSelected1v1Champions(newSelected);
            } else {
                if (currentSlotIndex !== null) {
                    // 특정 슬롯을 클릭했을 때
                    const newSelected = [...selected1v1Champions];
                    newSelected[currentSlotIndex] = champion;
                    setSelected1v1Champions(newSelected);
                    setCurrentSlotIndex(null);
                } else if (selected1v1Champions.length < 2) {
                    // 일반적인 선택
                    const newSelected = [...selected1v1Champions, champion];
                    setSelected1v1Champions(newSelected);
                }
            }
        }
    };

    // 팀 조합 챔피언 제거
    const handleChampionRemove = (championToRemove) => {
        if (!championToRemove || !championToRemove.id) return;
        const newSelected = selectedChampions.filter(c => c && c.id !== championToRemove.id);
        setSelectedChampions(newSelected);
    };

    // 1vs1 챔피언 제거
    const handle1v1ChampionRemove = (championToRemove) => {
        if (!championToRemove || !championToRemove.id) return;
        const newSelected = selected1v1Champions.filter(c => c && c.id !== championToRemove.id);
        setSelected1v1Champions(newSelected);
    };

    // 팀 조합 빈 슬롯 클릭
    const handleEmptySlotClick = (slotIndex) => {
        console.log('Team empty slot clicked:', slotIndex);
        setCurrentMode('team');
        setCurrentSlotIndex(slotIndex);

        if (showResults) {
            setShowChampionGrid(true);
            navigate('/', { replace: false });
        }
    };

    // 1vs1 빈 슬롯 클릭
    const handleEmpty1v1SlotClick = (slotIndex) => {
        console.log('1vs1 empty slot clicked:', slotIndex);
        setCurrentMode('1v1');
        setCurrentSlotIndex(slotIndex);

        if (showResults) {
            setShowChampionGrid(true);
            navigate('/', { replace: false });
        }
    };

    const handleCombinationSearch = () => {
        const champions = currentMode === 'team' ? selectedChampions : selected1v1Champions;
        const minRequired = currentMode === 'team' ? 1 : 2;

        if (champions.length < minRequired) {
            const message = currentMode === 'team'
                ? '최소 1개의 챔피언을 선택해주세요.'
                : '1vs1을 위해 2개의 챔피언을 모두 선택해주세요.';
            alert(message);
            return;
        }

        setShowChampionGrid(false);
        navigate('/?results=true', { replace: false });
    };

    const handleBackToSelection = () => {
        setShowChampionGrid(true);
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
                />

                <FilterSection
                    filters={filters}
                    onFiltersChange={setFilters}
                    selectedChampions={currentMode === 'team' ? selectedChampions : selected1v1Champions}
                    onCombinationSearch={handleCombinationSearch}
                    currentMode={currentMode} // 현재 모드 전달 (필요시)
                />

                {showResults ? (
                    <CombinationResults
                        selectedChampions={currentMode === 'team' ? selectedChampions : selected1v1Champions}
                        filters={filters}
                        onBackToSelection={handleBackToSelection}
                        mode={currentMode} // 모드 정보 전달
                    />
                ) : showChampionGrid ? (
                    <ChampionGrid
                        onChampionSelect={handleChampionSelect}
                        selectedChampions={currentMode === 'team' ? selectedChampions : selected1v1Champions}
                        highlightSlot={currentSlotIndex} // 현재 선택 중인 슬롯 하이라이트 (필요시)
                    />
                ) : null}
            </Stack>
        </Container>
    );
};

export default HomePage;
