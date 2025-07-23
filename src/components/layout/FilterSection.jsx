import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Paper, Group, Button, Text, Stack, Box, Divider, Checkbox, Popover, TextInput, ScrollArea} from '@mantine/core';
import { IconSearch, IconX, IconChevronDown } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// 커스텀 MultiSelect 컴포넌트
const CustomMultiSelect = ({ label, placeholder, data, value = [], onChange, disabled = false }) => {
    const [opened, setOpened] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        let filtered = data;
        if (searchTerm) {
            filtered = data.filter(item =>
                item.label.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered.slice(0, 100);
    }, [data, searchTerm]);

    const handleToggle = useCallback((itemValue) => {
        const newValue = value.includes(itemValue)
            ? value.filter(v => v !== itemValue)
            : [...value, itemValue];
        onChange(newValue);
    }, [value, onChange]);

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

    const getDisplayText = () => {
        if (label === '시즌') {
            return '2025';
        }
        if (value.length > 0) {
            return `${value.length}개 선택됨`;
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
                        <Text size="sm" c={disabled ? 'dark' : (value.length > 0 ? 'dark' : 'placeholder')}>
                            {getDisplayText()}
                        </Text>
                    </Button>
                </Popover.Target>
                <Popover.Dropdown p={8} style={{ maxWidth: '300px' }} data-mantine-popover>
                    <Stack gap={8}>
                        {data.length > 0 && (
                            <TextInput
                                placeholder="검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="sm"
                                leftSection={<IconSearch size={16} />}
                            />
                        )}
                        <ScrollArea.Autosize mah={200}>
                            <Stack gap={4}>
                                {filteredData.length > 0 ? (
                                    filteredData.map(item => (
                                        <Checkbox
                                            key={item.value}
                                            label={item.label}
                                            checked={value.includes(item.value)}
                                            onChange={() => handleToggle(item.value)}
                                            styles={{
                                                root: {
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    '&:hover': {
                                                        backgroundColor: '#f8f9fa'
                                                    }
                                                },
                                                label: { cursor: 'pointer' }
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Text size="sm" c="dimmed" ta="center" p="md">
                                        {searchTerm ? '검색 결과가 없습니다' : '선택할 수 있는 항목이 없습니다'}
                                    </Text>
                                )}
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
    const [isLoading, setIsLoading] = useState(true);

    // 카테고리 데이터 로드
    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/categories/tree`);
                if (!response.ok) {
                    throw new Error('Failed to fetch category data');
                }
                const data = await response.json();
                setCategoryData(data);
            } catch (error) {
                console.error('Failed to fetch category data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryData();
    }, []);

    // 🔥 리그 옵션 생성
    const leagueOptions = useMemo(() => {
        if (!categoryData) return [];

        const season2025 = categoryData.seasons.find(s => s.year === 2025);
        if (!season2025) return [];

        return season2025.leagues.map(league => ({
            value: league.name,
            label: league.name
        }));
    }, [categoryData]);

    // 🔥 스플릿 옵션 생성 (선택된 리그들의 스플릿 합집합)
    const splitOptions = useMemo(() => {
        if (!categoryData || !filters.leagueNames || filters.leagueNames.length === 0) {
            return [];
        }

        const season2025 = categoryData.seasons.find(s => s.year === 2025);
        if (!season2025) return [];

        const selectedLeagues = season2025.leagues.filter(l =>
            filters.leagueNames.includes(l.name)
        );

        // 선택된 리그들의 모든 스플릿을 합집합으로 가져오기
        const allSplits = selectedLeagues.flatMap(league =>
            league.splits
                .filter(split => split.name && split.name.trim() !== '') // 빈 스플릿 제외
                .map(split => split.name)
        );

        const uniqueSplits = [...new Set(allSplits)];

        return uniqueSplits.map(splitName => ({
            value: splitName,
            label: splitName
        }));
    }, [categoryData, filters.leagueNames]);

    // 🔥 팀 옵션 생성 (선택된 리그들의 팀 합집합)
    const teamOptions = useMemo(() => {
        if (!categoryData || !filters.leagueNames || filters.leagueNames.length === 0) {
            return [];
        }

        const season2025 = categoryData.seasons.find(s => s.year === 2025);
        if (!season2025) return [];

        const selectedLeagues = season2025.leagues.filter(l =>
            filters.leagueNames.includes(l.name)
        );

        // 🔥 빈 스플릿 이름 제외 조건 제거
        const relevantSplits = selectedLeagues.flatMap(league =>
            league.splits.filter(split => {
                // 스플릿 필터가 없으면 모든 스플릿 포함
                if (!filters.splitNames || filters.splitNames.length === 0) return true;

                // 빈 스플릿 이름인 경우 항상 포함 (MSI 케이스)
                if (!split.name || split.name.trim() === '') return true;

                // 선택된 스플릿만 포함
                return filters.splitNames.includes(split.name);
            })
        );

        const allTeams = relevantSplits.flatMap(split =>
            split.teams.map(team => team.name)
        );

        const uniqueTeams = [...new Set(allTeams)];

        return uniqueTeams
            .sort()
            .map(teamName => ({
                value: teamName,
                label: teamName
            }));
    }, [categoryData, filters.leagueNames, filters.splitNames]);

    // 필터 변경 핸들러
    const handleFilterChange = useCallback((field, value) => {
        const newFilters = { ...filters, [field]: value };

        // 🔥 리그 변경 시 유효하지 않은 스플릿과 팀 필터 정리
        if (field === 'leagueNames') {
            // 현재 선택된 리그들에 없는 스플릿 제거
            if (newFilters.splitNames && newFilters.splitNames.length > 0) {
                const season2025 = categoryData?.seasons.find(s => s.year === 2025);
                const selectedLeagues = season2025?.leagues.filter(l =>
                    newFilters.leagueNames.includes(l.name)
                );

                const validSplits = selectedLeagues?.flatMap(league =>
                    league.splits
                        .filter(split => split.name && split.name.trim() !== '')
                        .map(split => split.name)
                ) || [];

                const uniqueValidSplits = [...new Set(validSplits)];
                newFilters.splitNames = newFilters.splitNames.filter(split =>
                    uniqueValidSplits.includes(split)
                );
            }

            // 현재 선택된 리그들에 없는 팀 제거
            if (newFilters.teamNames && newFilters.teamNames.length > 0) {
                const season2025 = categoryData?.seasons.find(s => s.year === 2025);
                const selectedLeagues = season2025?.leagues.filter(l =>
                    newFilters.leagueNames.includes(l.name)
                );

                const allSplits = selectedLeagues?.flatMap(league =>
                    league.splits.filter(split => {
                        if (!split.name || split.name.trim() === '') return false;
                        if (!newFilters.splitNames || newFilters.splitNames.length === 0) return true;
                        return newFilters.splitNames.includes(split.name);
                    })
                ) || [];

                const validTeams = allSplits.flatMap(split =>
                    split.teams.map(team => team.name)
                );
                const uniqueValidTeams = [...new Set(validTeams)];

                newFilters.teamNames = newFilters.teamNames.filter(team =>
                    uniqueValidTeams.includes(team)
                );
            }
        }

        // 🔥 스플릿 변경 시 유효하지 않은 팀 필터 정리
        if (field === 'splitNames') {
            if (newFilters.teamNames && newFilters.teamNames.length > 0) {
                const season2025 = categoryData?.seasons.find(s => s.year === 2025);
                const selectedLeagues = season2025?.leagues.filter(l =>
                    newFilters.leagueNames.includes(l.name)
                );

                const relevantSplits = selectedLeagues?.flatMap(league =>
                    league.splits.filter(split => {
                        if (!split.name || split.name.trim() === '') return false;
                        if (!newFilters.splitNames || newFilters.splitNames.length === 0) return true;
                        return newFilters.splitNames.includes(split.name);
                    })
                ) || [];

                const validTeams = relevantSplits.flatMap(split =>
                    split.teams.map(team => team.name)
                );
                const uniqueValidTeams = [...new Set(validTeams)];

                newFilters.teamNames = newFilters.teamNames.filter(team =>
                    uniqueValidTeams.includes(team)
                );
            }
        }

        onFiltersChange(newFilters);
    }, [filters, categoryData, onFiltersChange]);

    // 태그 제거 핸들러
    const removeTag = useCallback((type, value) => {
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
    }, [filters, handleFilterChange]);

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
        outline: 'none',
        transition: 'all 0.2s ease'
    };

    const getTagColor = (type) => {
        switch (type) {
            case 'league': return { backgroundColor: '#e3f2fd', color: '#1976d2' };
            case 'split': return { backgroundColor: '#e8f5e8', color: '#388e3c' };
            case 'team': return { backgroundColor: '#fff3e0', color: '#f57c00' };
            default: return { backgroundColor: '#f5f5f5', color: '#666' };
        }
    };

    // 로딩 중일 때
    if (isLoading) {
        return (
            <Paper p="md" withBorder radius="md">
                <Group justify="center" p="xl">
                    <Text c="dimmed">필터 옵션을 불러오는 중...</Text>
                </Group>
            </Paper>
        );
    }

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
                            placeholder="리그를 선택하세요"
                            data={leagueOptions}
                            value={filters.leagueNames || []}
                            onChange={(value) => handleFilterChange('leagueNames', value)}
                        />
                    </Group>

                    <Group grow>
                        <CustomMultiSelect
                            label="스플릿"
                            placeholder="스플릿을 선택하세요"
                            data={splitOptions}
                            value={filters.splitNames || []}
                            onChange={(value) => handleFilterChange('splitNames', value)}
                            disabled={!filters.leagueNames || filters.leagueNames.length === 0}
                        />
                        <CustomMultiSelect
                            label="팀"
                            placeholder="팀을 선택하세요"
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
                                placeholder="리그를 선택하세요"
                                data={leagueOptions}
                                value={filters.leagueNames || []}
                                onChange={(value) => handleFilterChange('leagueNames', value)}
                            />
                        </Box>

                        <Box style={{ width: 150 }}>
                            <CustomMultiSelect
                                label="스플릿"
                                placeholder="스플릿을 선택하세요"
                                data={splitOptions}
                                value={filters.splitNames || []}
                                onChange={(value) => handleFilterChange('splitNames', value)}
                                disabled={!filters.leagueNames || filters.leagueNames.length === 0}
                            />
                        </Box>

                        <Box style={{ width: 150 }}>
                            <CustomMultiSelect
                                label="팀"
                                placeholder="팀을 선택하세요"
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
                    <Group gap="xs" style={{ flexWrap: 'wrap' }}>
                        {filters.leagueNames?.map(league => (
                            <Box
                                key={`league-${league}`}
                                style={{
                                    ...tagStyle,
                                    ...getTagColor('league'),
                                    '&:hover': {
                                        opacity: 0.8
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.opacity = '0.8';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.opacity = '1';
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
                                    ...getTagColor('split'),
                                    '&:hover': {
                                        opacity: 0.8
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.opacity = '0.8';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.opacity = '1';
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
                                    ...getTagColor('team'),
                                    '&:hover': {
                                        opacity: 0.8
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.opacity = '0.8';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.opacity = '1';
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
