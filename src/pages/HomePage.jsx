// src/pages/HomePage.jsx
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
    const [filters, setFilters] = useState({
        year: 2025,                    // ✅ 기본 연도
        split: null,
        leagueName: null,
        teamName: null,
        patch: null,
        leagueNames: ['LCK'],         // ✅ 기본 리그 LCK
        splitNames: [],
        teamNames: []
    });

    // URL 파라미터로 결과 화면 여부 판단
    const showResults = location.search.includes('results=true');

    // 브라우저 뒤로가기/앞으로가기 이벤트 처리
    useEffect(() => {
        const handlePopState = () => {
            // URL 변경 시 컴포넌트 리렌더링
            // showResults는 location.search로 결정되므로 자동으로 처리됨
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

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

    const handleCombinationSearch = () => {
        if (selectedChampions.length === 0) {
            alert('최소 1개의 챔피언을 선택해주세요.');
            return;
        }
        // URL에 results=true 파라미터 추가
        navigate('/?results=true', { replace: false });
    };

    const handleBackToSelection = () => {
        // URL에서 results 파라미터 제거
        navigate('/', { replace: false });
    };

    return (
        <Container size="xl" px={{ base: 16, sm: 24, md: 32 }}>
            <Stack gap="xl">
                <ChampionSelector
                    selectedChampions={selectedChampions}
                    onChampionRemove={handleChampionRemove}
                />

                <FilterSection
                    filters={filters}
                    onFiltersChange={setFilters}
                    selectedChampions={selectedChampions}
                    onCombinationSearch={handleCombinationSearch}
                />

                {/* 조건부 렌더링 */}
                {showResults ? (
                    <CombinationResults
                        selectedChampions={selectedChampions}
                        filters={filters}
                        onBackToSelection={handleBackToSelection}
                    />
                ) : (
                    <ChampionGrid
                        onChampionSelect={handleChampionSelect}
                        selectedChampions={selectedChampions}
                    />
                )}
            </Stack>
        </Container>
    );
};

export default HomePage;
