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
    const [selectedChampions, setSelectedChampions] = useState([]);
    const [showChampionGrid, setShowChampionGrid] = useState(false); // 🔥 챔피언 그리드 표시 상태
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

    // URL 파라미터로 결과 화면 여부 판단
    const showResults = location.search.includes('results=true');

    // 브라우저 뒤로가기/앞으로가기 이벤트 처리
    useEffect(() => {
        const handlePopState = () => {
            // URL 변경 시 챔피언 그리드 숨기기
            setShowChampionGrid(false);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // 🔥 결과 화면이 아닐 때 기본적으로 챔피언 그리드 표시
    useEffect(() => {
        if (!showResults) {
            setShowChampionGrid(true);
        }
    }, [showResults]);

    const handleChampionSelect = (champion) => {
        console.log('Champion clicked:', champion);

        const isAlreadySelected = selectedChampions.some(c => c && c.id === champion.id);

        if (isAlreadySelected) {
            const newSelected = selectedChampions.filter(c => c && c.id !== champion.id);
            setSelectedChampions(newSelected);
        } else {
            if (selectedChampions.length < 5) {
                const newSelected = [...selectedChampions, champion];
                setSelectedChampions(newSelected);
            }
        }
    };

    const handleChampionRemove = (championToRemove) => {
        if (!championToRemove || !championToRemove.id) {
            return;
        }

        const newSelected = selectedChampions.filter(c => c && c.id !== championToRemove.id);
        setSelectedChampions(newSelected);
    };

    // 🔥 빈 슬롯 클릭 핸들러
    const handleEmptySlotClick = (slotIndex) => {
        console.log('Empty slot clicked:', slotIndex);

        // 결과 화면에서 빈 슬롯 클릭 시 챔피언 선택 화면으로 전환
        if (showResults) {
            setShowChampionGrid(true);
            navigate('/', { replace: false }); // URL에서 results 파라미터 제거
        }
    };

    const handleCombinationSearch = () => {
        if (selectedChampions.length === 0) {
            alert('최소 1개의 챔피언을 선택해주세요.');
            return;
        }
        // 챔피언 그리드 숨기고 결과 화면 표시
        setShowChampionGrid(false);
        navigate('/?results=true', { replace: false });
    };

    const handleBackToSelection = () => {
        // 챔피언 그리드 표시하고 결과 화면 숨기기
        setShowChampionGrid(true);
        navigate('/', { replace: false });
    };

    return (
        <Container size="xl" px={{ base: 16, sm: 24, md: 32 }}>
            <Stack gap="xl">
                <ChampionSelector
                    selectedChampions={selectedChampions}
                    onChampionRemove={handleChampionRemove}
                    onEmptySlotClick={handleEmptySlotClick} // 🔥 빈 슬롯 클릭 핸들러 전달
                />

                <FilterSection
                    filters={filters}
                    onFiltersChange={setFilters}
                    selectedChampions={selectedChampions}
                    onCombinationSearch={handleCombinationSearch}
                />

                {/* 🔥 조건부 렌더링 개선 */}
                {showResults ? (
                    <CombinationResults
                        selectedChampions={selectedChampions}
                        filters={filters}
                        onBackToSelection={handleBackToSelection}
                    />
                ) : showChampionGrid ? (
                    <ChampionGrid
                        onChampionSelect={handleChampionSelect}
                        selectedChampions={selectedChampions}
                    />
                ) : null}
            </Stack>
        </Container>
    );
};

export default HomePage;
