import React, { useState } from 'react';
import {
    Paper,
    TextInput,
    Group,
    Button,
    SimpleGrid,
    Avatar,
    Text,
    Stack,
    ScrollArea
} from '@mantine/core';
import { IconSearch, IconSword, IconShield, IconWand, IconTarget, IconUsers } from '@tabler/icons-react';

const ChampionGrid = ({ onChampionSelect, selectedChampions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('*');

    // 임시 챔피언 데이터 (나중에 API로 변경)
    const champions = [
        { id: 1, name: '가렌', position: 'TOP', image: '/images/champions/garen.jpg' },
        { id: 2, name: '갈리오', position: 'MID', image: '/images/champions/galio.jpg' },
        { id: 3, name: '갱플랭크', position: 'TOP', image: '/images/champions/gangplank.jpg' },
        // ... 더 많은 챔피언 데이터
    ];

    const positions = [
        { id: '*', name: '전체', icon: IconUsers },
        { id: 'TOP', name: '탑', icon: IconShield },
        { id: 'JUG', name: '정글', icon: IconSword },
        { id: 'MID', name: '미드', icon: IconWand },
        { id: 'ADC', name: '원딜', icon: IconTarget },
        { id: 'SUP', name: '서포터', icon: IconUsers },
    ];

    const filteredChampions = champions.filter(champion => {
        const matchesSearch = champion.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPosition = selectedPosition === '*' || champion.position === selectedPosition;
        return matchesSearch && matchesPosition;
    });

    return (
        <Paper p="md" withBorder radius="md">
            <Stack gap="md">
                {/* 검색 및 포지션 필터 */}
                <Group justify="space-between">
                    <TextInput
                        placeholder="챔피언 검색 (가렌, 그웬, ...)"
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
                                        textAlign: 'center',
                                        cursor: isSelected ? 'not-allowed' : 'pointer',
                                        opacity: isSelected ? 0.5 : 1,
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => !isSelected && onChampionSelect(champion)}
                                >
                                    <Avatar
                                        src={champion.image}
                                        size={60}
                                        radius="md"
                                        style={{
                                            border: isSelected ? '2px solid #fa5252' : '2px solid transparent',
                                            margin: '0 auto',
                                            '&:hover': {
                                                transform: isSelected ? 'none' : 'scale(1.05)'
                                            }
                                        }}
                                    />
                                    <Text size="xs" mt={4} style={{ maxWidth: 60 }}>
                                        {champion.name}
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
