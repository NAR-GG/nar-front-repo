import React, { useState, useMemo } from 'react';
import {
    Paper,
    TextInput,
    Group,
    Button,
    SimpleGrid,
    Avatar,
    Text,
    Stack,
    ScrollArea,
    LoadingOverlay,
    Alert
} from '@mantine/core';
import { IconSearch, IconSword, IconShield, IconWand, IconTarget, IconUsers } from '@tabler/icons-react';
import { useChampions } from '../../hooks/useChampions';

const ChampionGrid = ({ onChampionSelect, selectedChampions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('*');

    const { data: champions = [], isLoading, error } = useChampions();

    const positions = [
        { id: '*', name: '전체', icon: IconUsers },
        { id: 'TOP', name: '탑', icon: IconShield },
        { id: 'JUG', name: '정글', icon: IconSword },
        { id: 'MID', name: '미드', icon: IconWand },
        { id: 'ADC', name: '원딜', icon: IconTarget },
        { id: 'SUP', name: '서포터', icon: IconUsers },
    ];

    const filteredChampions = useMemo(() => {
        return champions.filter(champion => {
            const matchesSearch = champion.championNameKr.includes(searchTerm) ||
                champion.championNameEn.toLowerCase().includes(searchTerm.toLowerCase());
            // 나중에 포지션 필터링 추가
            // const matchesPosition = selectedPosition === '*' || champion.position === selectedPosition;
            return matchesSearch;
        });
    }, [champions, searchTerm, selectedPosition]);

    if (error) {
        return (
            <Alert color="red" title="오류 발생">
                챔피언 데이터를 불러오는데 실패했습니다: {error.message}
            </Alert>
        );
    }

    return (
        <Paper p="md" withBorder radius="md" style={{ position: 'relative' }}>
            <LoadingOverlay visible={isLoading} />

            <Stack gap="md">
                {/* 검색 및 포지션 필터 */}
                <Group justify="space-between">
                    <TextInput
                        placeholder="챔피언 검색 (가렌, 그웬, Garen...)"
                        leftSection={<IconSearch size={16} />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 300 }}
                    />

                    <Group gap="xs">
                        {positions.map(({ id, name, icon: Icon }) => (
                            <Button
                                key={id}
                                variant={selectedPosition === id ? 'filled' : 'light'}
                                size="sm"
                                leftSection={<Icon size={16} />}
                                onClick={() => setSelectedPosition(id)}
                            >
                                {name}
                            </Button>
                        ))}
                    </Group>
                </Group>

                {/* 챔피언 그리드 */}
                <ScrollArea h={400}>
                    <SimpleGrid cols={{ base: 4, sm: 6, md: 8, lg: 10 }} spacing="md">
                        {filteredChampions.map((champion) => {
                            const isSelected = selectedChampions.some(c => c.id === champion.id);

                            return (
                                <div
                                    key={champion.id}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        cursor: isSelected ? 'not-allowed' : 'pointer',
                                        opacity: isSelected ? 0.5 : 1,
                                        transition: 'all 0.2s',
                                        padding: '8px'
                                    }}
                                    onClick={() => !isSelected && onChampionSelect(champion)}
                                >
                                    <Avatar
                                        src={champion.imageUrl}
                                        size={60}
                                        radius="md"
                                        style={{
                                            border: isSelected ? '2px solid #fa5252' : '2px solid transparent',
                                            marginBottom: '8px'
                                        }}
                                    />
                                    <Text
                                        size="xs"
                                        style={{
                                            width: '100%',
                                            textAlign: 'center',
                                            wordBreak: 'keep-all',
                                            lineHeight: '1.2',
                                            fontSize: '11px'
                                        }}
                                    >
                                        {champion.championNameKr}
                                    </Text>
                                </div>
                            );
                        })}
                    </SimpleGrid>
                </ScrollArea>
            </Stack>
        </Paper>
    );
};

export default ChampionGrid;
