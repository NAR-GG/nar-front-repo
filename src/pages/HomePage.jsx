// HomePage.jsx
import React, { useState, useEffect } from 'react';
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

    // 모드 변경 핸들러 추가
    const handleModeChange = (mode) => {
        setCurrentMode(mode);
        setCurrentSlotIndex(null);

        // 결과 페이지에서 모드 변경 시 홈으로 돌아가기
        if (showResults) {
            setShowChampionGrid(true);
            navigate('/', { replace: false });
        }
    };

    // HomePage.jsx 수정
    const handleCombinationSearch = () => {
        if (currentMode === 'team') {
            // 팀 조합 검색
            if (selectedChampions.length < 1) {
                alert('최소 1개의 챔피언을 선택해주세요.');
                return;
            }
        } else {
            // 1vs1 매치업 검색
            if (selected1v1Champions.length < 2) {
                alert('1vs1을 위해 2개의 챔피언을 모두 선택해주세요.');
                return;
            }
        }

        // 두 모드 모두 동일하게 결과 페이지로 이동
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
                    currentMode={currentMode}
                    onModeChange={handleModeChange} // 모드 변경 핸들러 전달
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
                ) : showChampionGrid ? (
                    <ChampionGrid
                        onChampionSelect={handleChampionSelect}
                        selectedChampions={currentMode === 'team' ? selectedChampions : selected1v1Champions}
                        highlightSlot={currentSlotIndex}
                    />
                ) : null}
            </Stack>
        </Container>
    );
};

export default HomePage;
