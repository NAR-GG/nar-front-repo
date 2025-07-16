import React, { useState } from 'react';
import { Container, Stack, Title, Paper } from '@mantine/core';
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
        if (selectedChampions.length < 5 && !selectedChampions.includes(champion)) {
            setSelectedChampions([...selectedChampions, champion]);
        }
    };

    const handleChampionRemove = (index) => {
        setSelectedChampions(selectedChampions.filter((_, i) => i !== index));
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