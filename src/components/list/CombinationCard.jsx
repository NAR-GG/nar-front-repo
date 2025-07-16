// src/components/list/CombinationCard.jsx
import React from 'react';
import { Group, Avatar, Text, Button, Stack, Badge, Progress } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

const CombinationCard = ({ combination, isExpanded, onToggle }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    const {
        champions = [],
        winRate = 0,
        wins = 0,
        losses = 0,
        recentGame = '',
        recentPatch = ''
    } = combination;

    return (
        <Stack gap="xs">
            <Group justify="space-between" align="center" wrap="nowrap">
                <Group gap="sm" style={{ flex: 1 }}>
                    {/* 챔피언 아바타들 */}
                    <Group gap="xs">
                        {champions.map((champion, index) => (
                            <Avatar
                                key={index}
                                src={champion.imageUrl}
                                size={isMobile ? 36 : 44}
                                radius="md"
                                style={{
                                    border: '2px solid #4c6ef5'
                                }}
                            />
                        ))}
                    </Group>

                    {/* 통계 정보 */}
                    <Group gap="md" style={{ flex: 1 }}>
                        <Badge
                            color={winRate >= 50 ? 'blue' : 'red'}
                            size="md"
                            style={{ fontWeight: 600 }}
                        >
                            승률 {winRate}%
                        </Badge>
                        <Text size="sm" c="dimmed">
                            {wins}승 {losses}패
                        </Text>
                        <Text size="sm" c="dimmed">
                            최근: {recentGame}
                        </Text>
                        <Text size="sm" c="dimmed">
                            패치: {recentPatch}
                        </Text>
                    </Group>
                </Group>

                {/* 상세정보 버튼 */}
                <Button
                    variant="light"
                    size="xs"
                    rightSection={isExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                    onClick={onToggle}
                    style={{ flexShrink: 0 }}
                >
                    상세정보
                </Button>
            </Group>

            {/* 승률 프로그레스 바 */}
            <Progress
                value={winRate}
                color={winRate >= 50 ? 'blue' : 'red'}
                size="xs"
                radius="sm"
                style={{ marginTop: '4px' }}
            />
        </Stack>
    );
};

export default CombinationCard;
