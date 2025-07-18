import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Paper, Group, Button, Text, Stack, Box, Divider, Checkbox, Popover, TextInput, ScrollArea} from '@mantine/core';
import { IconSearch, IconX, IconChevronDown } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

// 커스텀 MultiSelect 컴포넌트
// 커스텀 MultiSelect 컴포넌트
const CustomMultiSelect = ({ label, placeholder, data, value = [], onChange, disabled = false }) => {
    const [opened, setOpened] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // 검색 및 제한된 데이터
    const filteredData = useMemo(() => {
        let filtered = data;
        if (searchTerm) {
            filtered = data.filter(item =>
                item.label.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered.slice(0, 100); // 최대 100개로 제한
    }, [data, searchTerm]);

    const handleToggle = useCallback((itemValue) => {
        const newValue = value.includes(itemValue)
            ? value.filter(v => v !== itemValue)
            : [...value, itemValue];
        onChange(newValue);
    }, [value, onChange]);

    // 시즌 필드는 선택 상태 스타일 적용하지 않음
    const getSelectedStyle = useCallback((hasSelection) => {
        if (disabled) {
            return {
                borderColor: '#ced4da',
                borderWidth: '1px',
                boxShadow: 'none'
            };
        }
        return {
            borderColor: hasSelection ? '#1976d2' : '#ced4da',
            borderWidth: hasSelection ? '2px' : '1px',
            boxShadow: hasSelection ? '0 0 0 1px #1976d2' : 'none'
        };
    }, [disabled]);

    const handleClose = () => {
        setOpened(false);
        setSearchTerm('');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (opened) {
                const target = event.target;
                const isPopoverClick = target.closest('[data-mantine-popover]');
                const isButtonClick = target.closest('button');

                if (!isPopoverClick && !isButtonClick) {
                    handleClose();
                }
            }
        };

        if (opened) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [opened]);

    // 표시할 텍스트 결정
    const getDisplayText = () => {
        if (label === '시즌') {
            return '2025';
        }
        return placeholder;
    };

    return (
        <Box>
            <Text size="sm" fw={500} mb={4}>{label}</Text>
            <Popover
                opened={opened && !disabled}
                onClose={handleClose}
                position="bottom-start"
                shadow="md"
                withinPortal={false}
                closeOnClickOutside={true}
                closeOnEscape={true}
                trapFocus={false}
                clickOutsideEvents={['mousedown', 'touchstart']}
            >
                <Popover.Target>
                    <Button
                        variant="default"
                        onClick={() => !disabled && setOpened(!opened)}
                        disabled={disabled}
                        justify="space-between"
                        rightSection={<IconChevronDown size={16} />}
                        styles={{
                            root: {
                                ...getSelectedStyle(value.length > 0),
                                width: '100%',
                                height: '36px',
                                padding: '0 12px',
                                backgroundColor: disabled ? '#f8f9fa' : '#fff'
                            }
                        }}
                    >
                        <Text size="sm" c={disabled ? 'dark' : (value.length > 0 ? 'dimmed' : 'placeholder')}>
                            {getDisplayText()}
                        </Text>
                    </Button>
                </Popover.Target>
                <Popover.Dropdown p={8} style={{ maxWidth: '300px' }} data-mantine-popover>
                    <Stack gap={8}>
                        <TextInput
                            placeholder="검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="sm"
                        />
                        <ScrollArea.Autosize mah={200}>
                            <Stack gap={4}>
                                {filteredData.map(item => (
                                    <Checkbox
                                        key={item.value}
                                        label={item.label}
                                        checked={value.includes(item.value)}
                                        onChange={() => handleToggle(item.value)}
                                        styles={{
                                            root: { padding: '4px 8px' },
                                            label: { cursor: 'pointer' }
                                        }}
                                    />
                                ))}
                            </Stack>
                        </ScrollArea.Autosize>
                        {data.length > 100 && (
                            <Text size="xs" c="dimmed">
                                {data.length - 100}개 더 있습니다. 검색을 사용하세요.
                            </Text>
                        )}
                    </Stack>
                </Popover.Dropdown>
            </Popover>
        </Box>
    );
};

const FilterSection = ({ filters, onFiltersChange, selectedChampions, onCombinationSearch }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [categoryData, setCategoryData] = useState(null);
    const [leagueOptions, setLeagueOptions] = useState([]);
    const [splitOptions, setSplitOptions] = useState([]);
    const [teamOptions, setTeamOptions] = useState([]);

    // 카테고리 데이터 로드
    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await fetch('/api/categories/tree');
                const data = await response.json();
                setCategoryData(data);

                // 리그 옵션 설정 (2025 시즌 기준)
                const season2025 = data.seasons.find(s => s.year === 2025);
                if (season2025) {
                    const leagues = season2025.leagues.map(league => ({
                        value: league.name,
                        label: league.name
                    }));
                    setLeagueOptions(leagues);
                }
            } catch (error) {
                console.error('Failed to fetch category data:', error);
            }
        };

        fetchCategoryData();
    }, []);

    // 리그 변경 시 스플릿 옵션 업데이트 (합집합, 빈 스플릿 제외)
    useEffect(() => {
        if (categoryData && filters.leagueNames && filters.leagueNames.length > 0) {
            const season2025 = categoryData.seasons.find(s => s.year === 2025);
            const selectedLeagues = season2025?.leagues.filter(l => filters.leagueNames.includes(l.name));

            if (selectedLeagues && selectedLeagues.length > 0) {
                const allSplits = selectedLeagues.flatMap(league =>
                    league.splits
                        .filter(split => split.name && split.name.trim() !== '') // 빈 스플릿 제외
                        .map(split => split.name)
                );
                const uniqueSplits = [...new Set(allSplits)];

                const splits = uniqueSplits.map(splitName => ({
                    value: splitName,
                    label: splitName
                }));
                setSplitOptions(splits);
            }
        } else {
            setSplitOptions([]);
        }
    }, [categoryData, filters.leagueNames]);

    // 스플릿 변경 시 팀 옵션 업데이트 (합집합)
    useEffect(() => {
        if (categoryData && filters.leagueNames && filters.leagueNames.length > 0) {
            const season2025 = categoryData.seasons.find(s => s.year === 2025);
            const selectedLeagues = season2025?.leagues.filter(l => filters.leagueNames.includes(l.name));

            if (selectedLeagues && selectedLeagues.length > 0) {
                const relevantSplits = selectedLeagues.flatMap(league =>
                    league.splits.filter(split =>
                        split.name && split.name.trim() !== '' && // 빈 스플릿 제외
                        (!filters.splitNames ||
                            filters.splitNames.length === 0 ||
                            filters.splitNames.includes(split.name))
                    )
                );

                if (relevantSplits.length > 0) {
                    const allTeams = relevantSplits.flatMap(split =>
                        split.teams.map(team => team.name)
                    );
                    const uniqueTeams = [...new Set(allTeams)];

                    const teams = uniqueTeams.map(teamName => ({
                        value: teamName,
                        label: teamName
                    }));
                    setTeamOptions(teams);
                } else {
                    setTeamOptions([]);
                }
            }
        } else {
            setTeamOptions([]);
        }
    }, [categoryData, filters.leagueNames, filters.splitNames]);

    // 나머지 코드는 동일...
    const handleFilterChange = (field, value) => {
        onFiltersChange({
            ...filters,
            [field]: value
        });
    };

    const removeTag = (type, value) => {
        if (type === 'league') {
            const newLeagues = filters.leagueNames?.filter(name => name !== value) || [];
            handleFilterChange('leagueNames', newLeagues);
        } else if (type === 'split') {
            const newSplits = filters.splitNames?.filter(name => name !== value) || [];
            handleFilterChange('splitNames', newSplits);
        } else if (type === 'team') {
            const newTeams = filters.teamNames?.filter(name => name !== value) || [];
            handleFilterChange('teamNames', newTeams);
        }
    };

    const tagStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
        border: 'none',
        outline: 'none'
    };

    const getTagColor = (type) => {
        switch (type) {
            case 'league': return { backgroundColor: '#e3f2fd', color: '#1976d2' };
            case 'split': return { backgroundColor: '#e8f5e8', color: '#388e3c' };
            case 'team': return { backgroundColor: '#fff3e0', color: '#f57c00' };
            default: return { backgroundColor: '#f5f5f5', color: '#666' };
        }
    };

    return (
        <Paper p="md" withBorder radius="md">
            {isMobile ? (
                <Stack gap="md">
                    <Group grow>
                        <CustomMultiSelect
                            label="시즌"
                            placeholder="시즌"
                            data={[]}
                            value={[]}
                            disabled
                        />
                        <CustomMultiSelect
                            label="리그"
                            placeholder="리그"
                            data={leagueOptions}
                            value={filters.leagueNames || []}
                            onChange={(value) => handleFilterChange('leagueNames', value)}
                        />
                    </Group>

                    <Group grow>
                        <CustomMultiSelect
                            label="스플릿"
                            placeholder="스플릿"
                            data={splitOptions}
                            value={filters.splitNames || []}
                            onChange={(value) => handleFilterChange('splitNames', value)}
                            disabled={!filters.leagueNames || filters.leagueNames.length === 0}
                        />
                        <CustomMultiSelect
                            label="팀"
                            placeholder="팀"
                            data={teamOptions}
                            value={filters.teamNames || []}
                            onChange={(value) => handleFilterChange('teamNames', value)}
                            disabled={!filters.leagueNames || filters.leagueNames.length === 0}
                        />
                    </Group>

                    <Group justify="flex-end" gap="md" align="center">
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
                </Stack>
            ) : (
                <Group justify="space-between" align="end">
                    <Group gap="md">
                        <Box style={{ width: 120 }}>
                            <CustomMultiSelect
                                label="시즌"
                                placeholder="시즌"
                                data={[]}
                                value={[]}
                                disabled
                            />
                        </Box>

                        <Box style={{ width: 150 }}>
                            <CustomMultiSelect
                                label="리그"
                                placeholder="리그"
                                data={leagueOptions}
                                value={filters.leagueNames || []}
                                onChange={(value) => handleFilterChange('leagueNames', value)}
                            />
                        </Box>

                        <Box style={{ width: 150 }}>
                            <CustomMultiSelect
                                label="스플릿"
                                placeholder="스플릿"
                                data={splitOptions}
                                value={filters.splitNames || []}
                                onChange={(value) => handleFilterChange('splitNames', value)}
                                disabled={!filters.leagueNames || filters.leagueNames.length === 0}
                            />
                        </Box>

                        <Box style={{ width: 150 }}>
                            <CustomMultiSelect
                                label="팀"
                                placeholder="팀"
                                data={teamOptions}
                                value={filters.teamNames || []}
                                onChange={(value) => handleFilterChange('teamNames', value)}
                                disabled={!filters.leagueNames || filters.leagueNames.length === 0}
                            />
                        </Box>
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
            )}

            {/* 선택된 필터 태그 표시 */}
            {((filters.leagueNames && filters.leagueNames.length > 0) ||
                (filters.splitNames && filters.splitNames.length > 0) ||
                (filters.teamNames && filters.teamNames.length > 0)) && (
                <>
                    <Divider my="md" />
                    <Group gap="xs">
                        {filters.leagueNames?.map(league => (
                            <Box
                                key={`league-${league}`}
                                style={{
                                    ...tagStyle,
                                    ...getTagColor('league')
                                }}
                            >
                                <Text size="xs">리그: {league}</Text>
                                <IconX
                                    size={14}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => removeTag('league', league)}
                                />
                            </Box>
                        ))}

                        {filters.splitNames?.map(split => (
                            <Box
                                key={`split-${split}`}
                                style={{
                                    ...tagStyle,
                                    ...getTagColor('split')
                                }}
                            >
                                <Text size="xs">스플릿: {split}</Text>
                                <IconX
                                    size={14}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => removeTag('split', split)}
                                />
                            </Box>
                        ))}

                        {filters.teamNames?.map(team => (
                            <Box
                                key={`team-${team}`}
                                style={{
                                    ...tagStyle,
                                    ...getTagColor('team')
                                }}
                            >
                                <Text size="xs">팀: {team}</Text>
                                <IconX
                                    size={14}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => removeTag('team', team)}
                                />
                            </Box>
                        ))}
                    </Group>
                </>
            )}
        </Paper>
    );
};

export default FilterSection;

