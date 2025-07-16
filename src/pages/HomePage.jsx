import React, { useState } from 'react';
import { Container, Stack } from '@mantine/core';
import ChampionSelector from '../components/layout/ChampionSelector';
import FilterSection from '../components/layout/FilterSection';
import ChampionGrid from '../components/list/ChampionGrid';

const HomePage = () => {
    const [selectedChampions, setSelectedChampions] = useState([]);
    const [filters, setFilters] = useState({
        year: null,
        split: null,
        leagueName: null,
        teamName: null,
        patch: null
    });

    const handleChampionSelect = (champion) => {
        console.log('=== handleChampionSelect called ===');
        console.log('Clicked champion:', champion);
        console.log('Current selected:', selectedChampions);

        if (!champion || !champion.id) {
            console.error('Invalid champion data:', champion);
            return;
        }

        // 이미 선택된 챔피언인지 확인
        const isAlreadySelected = selectedChampions.some(c => c && c.id === champion.id);
        console.log('Is already selected:', isAlreadySelected);

        if (isAlreadySelected) {
            // 이미 선택된 챔피언이면 제거
            const newSelected = selectedChampions.filter(c => c && c.id !== champion.id);
            console.log('Removing champion, new array:', newSelected);
            setSelectedChampions(newSelected);
        } else {
            // 새로운 챔피언이고 5개 미만이면 추가
            if (selectedChampions.length < 5) {
                const newSelected = [...selectedChampions, champion];
                console.log('Adding champion, new array:', newSelected);
                setSelectedChampions(newSelected);
            } else {
                console.log('Cannot add more champions (limit: 5)');
            }
        }
    };

    const handleChampionRemove = (championToRemove) => {
        console.log('=== handleChampionRemove called ===');
        console.log('Removing champion:', championToRemove);

        if (!championToRemove || !championToRemove.id) {
            console.error('Invalid champion data for removal:', championToRemove);
            return;
        }

        const newSelected = selectedChampions.filter(c => c && c.id !== championToRemove.id);
        console.log('New selected after removal:', newSelected);
        setSelectedChampions(newSelected);
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
                />

                <ChampionGrid
                    onChampionSelect={handleChampionSelect}
                    selectedChampions={selectedChampions}
                />
            </Stack>
        </Container>
    );
};

export default HomePage;
