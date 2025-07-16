import React from 'react';
import { Group, Select, Button, Paper } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

const FilterSection = ({ filters, onFiltersChange, selectedChampions }) => {
    const handleFilterChange = (key, value) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const handleCombinationSearch = async () => {
        if (selectedChampions.length === 0) {
            alert('최소 1개의 챔피언을 선택해주세요.');
            return;
        }

        // API 호출 로직 (나중에 구현)
        console.log('API 호출:', {
            champions: selectedChampions.map(c => c.name),
            ...filters
        });
    };

    return (
        <Paper p="md" withBorder radius="md">
            <Group justify="space-between">
                <Group gap="md">
                    <Select
                        placeholder="년도"
                        data={['2024', '2023', '2022', '2021']}
                        value={filters.year}
                        onChange={(value) => handleFilterChange('year', value)}
                        style={{ width: 120 }}
                    />
                    <Select
                        placeholder="리그"
                        data={['LCK', 'LPL', 'LEC', 'LCS']}
                        value={filters.leagueName}
                        onChange={(value) => handleFilterChange('leagueName', value)}
                        style={{ width: 120 }}
                    />
                    <Select
                        placeholder="스플릿"
                        data={['Spring', 'Summer', 'MSI', 'Worlds']}
                        value={filters.split}
                        onChange={(value) => handleFilterChange('split', value)}
                        style={{ width: 120 }}
                    />
                    <Select
                        placeholder="팀"
                        data={['T1', 'Gen.G', 'DK', 'KT']}
                        value={filters.teamName}
                        onChange={(value) => handleFilterChange('teamName', value)}
                        style={{ width: 120 }}
                    />
                    <Select
                        placeholder="패치"
                        data={['14.1', '14.2', '14.3', '14.4']}
                        value={filters.patch}
                        onChange={(value) => handleFilterChange('patch', value)}
                        style={{ width: 120 }}
                    />
                </Group>

                <Button
                    leftSection={<IconSearch size={16} />}
                    onClick={handleCombinationSearch}
                    disabled={selectedChampions.length === 0}
                >
                    조합보기
                </Button>
            </Group>
        </Paper>
    );
};

export default FilterSection;
