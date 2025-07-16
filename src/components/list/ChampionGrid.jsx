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
import { IconSearch } from '@tabler/icons-react';
import { useChampions } from '../../hooks/useChampions';
import { useMediaQuery } from '@mantine/hooks';

const ChampionGrid = ({ onChampionSelect, selectedChampions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('*');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const { data: champions = [], isLoading, error } = useChampions();

    const positions = [
        { id: '*', name: '전체', iconSrc: '/icons/nothing.png' },
        { id: 'TOP', name: '탑', iconSrc: '/icons/top.png' },
        { id: 'JUG', name: '정글', iconSrc: '/icons/jungle.png' },
        { id: 'MID', name: '미드', iconSrc: '/icons/mid.png' },
        { id: 'ADC', name: '원딜', iconSrc: '/icons/bottom.png' },
        { id: 'SUP', name: '서포터', iconSrc: '/icons/support.png' },
    ];

    const filteredChampions = useMemo(() => {
        return champions.filter(champion => {
            const matchesSearch = champion.championNameKr.includes(searchTerm) ||
                champion.championNameEn.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [champions, searchTerm]);

    const handleChampionClick = (champion) => {
        console.log('Champion clicked:', champion);
        onChampionSelect(champion);
    };

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
                {/* 검색창과 포지션 필터 */}
                {isMobile ? (
                    // 모바일: 세로 정렬
                    <Stack gap="md">
                        <TextInput
                            placeholder="챔피언 검색 (가렌, 그웬, Garen...)"
                            leftSection={<IconSearch size={16} />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%' }}
                        />

                        {/* 포지션 아이콘 탭 - 모바일 세로 정렬 */}
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center',
                            overflowX: 'auto',
                            paddingBottom: '4px'
                        }}>
                            <div style={{
                                display: 'flex',
                                minWidth: 'fit-content'
                            }}>
                                {positions.map(({ id, name, iconSrc }, index) => (
                                    <div
                                        key={id}
                                        style={{
                                            padding: '12px 16px',
                                            cursor: 'pointer',
                                            backgroundColor: selectedPosition === id ? '#4c6ef5' : '#f8f9fa',
                                            border: '1px solid #e9ecef',
                                            borderLeft: index === 0 ? '1px solid #e9ecef' : 'none',
                                            borderRight: '1px solid #e9ecef',
                                            borderRadius: index === 0 ? '6px 0 0 6px' :
                                                index === positions.length - 1 ? '0 6px 6px 0' : '0',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: '50px',
                                            height: '44px',
                                            flex: '0 0 auto'
                                        }}
                                        onClick={() => setSelectedPosition(id)}
                                        title={name}
                                    >
                                        <img
                                            src={iconSrc}
                                            alt={name}
                                            width={24}
                                            height={24}
                                            style={{
                                                objectFit: 'contain',
                                                filter: selectedPosition === id
                                                    ? 'brightness(0) invert(1)'
                                                    : 'brightness(0.4) opacity(0.6) sepia(1) saturate(0.8) hue-rotate(200deg)',
                                            }}
                                            onError={(e) => {
                                                console.error('Icon load error:', iconSrc);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Stack>
                ) : (
                    // 웹사이트: 가로 정렬
                    <Group justify="space-between">
                        <TextInput
                            placeholder="챔피언 검색 (가렌, 그웬, Garen...)"
                            leftSection={<IconSearch size={16} />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: 300 }}
                        />

                        {/* 포지션 아이콘 탭 - 웹사이트 가로 정렬 */}
                        <div style={{ display: 'flex' }}>
                            {positions.map(({ id, name, iconSrc }, index) => (
                                <div
                                    key={id}
                                    style={{
                                        padding: '12px 14px',
                                        cursor: 'pointer',
                                        backgroundColor: selectedPosition === id ? '#4c6ef5' : '#f8f9fa',
                                        border: '1px solid #e9ecef',
                                        borderLeft: index === 0 ? '1px solid #e9ecef' : 'none',
                                        borderRight: '1px solid #e9ecef',
                                        borderRadius: index === 0 ? '6px 0 0 6px' :
                                            index === positions.length - 1 ? '0 6px 6px 0' : '0',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: '50px',
                                        height: '44px',
                                        flex: 1
                                    }}
                                    onClick={() => setSelectedPosition(id)}
                                    title={name}
                                >
                                    <img
                                        src={iconSrc}
                                        alt={name}
                                        width={24}
                                        height={24}
                                        style={{
                                            objectFit: 'contain',
                                            filter: selectedPosition === id
                                                ? 'brightness(0) invert(1)'
                                                : 'brightness(0.4) opacity(0.6) sepia(1) saturate(0.8) hue-rotate(200deg)',
                                        }}
                                        onError={(e) => {
                                            console.error('Icon load error:', iconSrc);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </Group>
                )}

                {/* 챔피언 그리드 */}
                <ScrollArea h={400}>
                    <SimpleGrid cols={{ base: 4, sm: 6, md: 8, lg: 10 }} spacing="md">
                        {filteredChampions.map((champion) => {
                            const isSelected = selectedChampions.some(c => c && c.id === champion.id);

                            return (
                                <div
                                    key={champion.id}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        opacity: 1,
                                        transition: 'all 0.2s',
                                        padding: '8px'
                                    }}
                                    onClick={() => handleChampionClick(champion)}
                                >
                                    <Avatar
                                        src={champion.imageUrl}
                                        size={60}
                                        radius="md"
                                        style={{
                                            border: isSelected ? '3px solid #4c6ef5' : '2px solid transparent',
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
                                            fontSize: '11px',
                                            color: isSelected ? '#4c6ef5' : 'inherit',
                                            fontWeight: isSelected ? 600 : 400
                                        }}
                                    >
                                        {champion.championNameKr}
                                    </Text>
                                    <div style={{ height: '2px' }}>
                                        {isSelected && (
                                            <Text size="xs" c="blue" mt={2}>
                                                선택됨
                                            </Text>
                                        )}
                                    </div>
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
