import React from 'react';
import { Paper, Group, Select, Button, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

const FilterSection = ({ filters, onFiltersChange, selectedChampions, onCombinationSearch }) => {
    const handleFilterChange = (field, value) => {
        onFiltersChange({
            ...filters,
            [field]: value
        });
    };

    return (
        <Paper p="md" withBorder radius="md">
            <Group justify="space-between" align="end">
                <Group gap="md">
                    <Select
                        label="시즌"
                        placeholder="시즌 선택"
                        data={[
                            { value: '2024', label: '2024' },
                            { value: '2023', label: '2023' },
                            { value: '2022', label: '2022' }
                        ]}
                        value={filters.year}
                        onChange={(value) => handleFilterChange('year', value)}
                        style={{ width: 120 }}
                    />

                    <Select
                        label="스플릿"
                        placeholder="스플릿 선택"
                        data={[
                            { value: 'spring', label: 'Spring' },
                            { value: 'summer', label: 'Summer' },
                            { value: 'worlds', label: 'Worlds' }
                        ]}
                        value={filters.split}
                        onChange={(value) => handleFilterChange('split', value)}
                        style={{ width: 120 }}
                    />

                    <Select
                        label="리그"
                        placeholder="리그 선택"
                        data={[
                            { value: 'lck', label: 'LCK' },
                            { value: 'lpl', label: 'LPL' },
                            { value: 'lec', label: 'LEC' },
                            { value: 'lcs', label: 'LCS' }
                        ]}
                        value={filters.leagueName}
                        onChange={(value) => handleFilterChange('leagueName', value)}
                        style={{ width: 120 }}
                    />

                    <Select
                        label="팀"
                        placeholder="팀 선택"
                        data={[
                            { value: 't1', label: 'T1' },
                            { value: 'gen', label: 'Gen.G' },
                            { value: 'dk', label: 'DK' },
                            { value: 'kt', label: 'KT' }
                        ]}
                        value={filters.teamName}
                        onChange={(value) => handleFilterChange('teamName', value)}
                        style={{ width: 120 }}
                    />

                    <Select
                        label="패치"
                        placeholder="패치 선택"
                        data={[
                            { value: '14.14', label: '14.14' },
                            { value: '14.13', label: '14.13' },
                            { value: '14.12', label: '14.12' }
                        ]}
                        value={filters.patch}
                        onChange={(value) => handleFilterChange('patch', value)}
                        style={{ width: 120 }}
                    />
                </Group>

                <Group gap="md" align="center">
                    <Text size="sm" c="dimmed">
                        선택된 챔피언: {selectedChampions.length}/5
                    </Text>
                    <Button
                        leftSection={<IconSearch size={16} />}
                        onClick={onCombinationSearch}
                        disabled={selectedChampions.length === 0}
                    >
                        조합 보기
                    </Button>
                </Group>
            </Group>
        </Paper>
    );
};

export default FilterSection;
