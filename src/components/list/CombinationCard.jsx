// src/components/list/CombinationCard.jsx
import React from 'react';
import { Group, Avatar, Text, Button, Stack, Progress } from '@mantine/core';
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

    const totalGames = wins + losses;
    const winPercentage = totalGames > 0 ? (wins / totalGames) * 100 : 0;
    const lossPercentage = totalGames > 0 ? (losses / totalGames) * 100 : 0;

    return (
        <Stack gap="xs">
            {/* 모바일에서는 여러 행으로 구성하되 챔피언들은 한 행에 */}
            {isMobile ? (
                <>
                    {/* 첫 번째 행: 챔피언 5개 한 행 + 화살표 버튼 */}
                    <Group justify="space-between" align="center" wrap="nowrap">
                        <Group gap="xs">
                            {champions.map((champion, index) => (
                                <Avatar
                                    key={index}
                                    src={champion.imageUrl}
                                    size={32}
                                    radius="md"
                                />
                            ))}
                        </Group>

                        <Button
                            variant="light"
                            size="sm"
                            color="gray"
                            onClick={onToggle}
                            style={{
                                flexShrink: 0,
                                borderRadius: '8px',
                                padding: '8px 12px'
                            }}
                        >
                            {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                        </Button>
                    </Group>

                    {/* 두 번째 행: 승률 Progress 바 */}
                    <Group gap="xs" align="center">
                        <Progress.Root size="md" style={{ flex: 1, height: '20px' }}>
                            <Progress.Section
                                value={winPercentage}
                                color="#5383e8"
                                style={{ borderRadius: '2px 0 0 2px' }}
                            >
                                <Progress.Label
                                    style={{
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: 600
                                    }}
                                >
                                    {wins}승
                                </Progress.Label>
                            </Progress.Section>
                            <Progress.Section
                                value={lossPercentage}
                                color="#e84057"
                                style={{ borderRadius: '0 2px 2px 0' }}
                            >
                                <Progress.Label
                                    style={{
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: 600
                                    }}
                                >
                                    {losses}패
                                </Progress.Label>
                            </Progress.Section>
                        </Progress.Root>

                        <Text size="sm" fw={600} c={winRate >= 50 ? '#5383e8' : '#e84057'}>
                            {winRate}%
                        </Text>
                    </Group>

                    {/* 세 번째 행: 추가 정보 */}
                    <Group gap="xs" justify="center">
                        <Text size="xs" c="dimmed">
                            {totalGames}게임
                        </Text>
                        <Text size="xs" c="dimmed">
                            최근: {recentGame}
                        </Text>
                        <Text size="xs" c="dimmed">
                            패치: {recentPatch}
                        </Text>
                    </Group>
                </>
            ) : (
                /* 데스크톱에서는 기존 레이아웃 유지 */
                <Group justify="space-between" align="center" wrap="nowrap">
                    <Group gap="sm" style={{ flex: 1 }}>
                        {/* 챔피언 아바타들 */}
                        <Group gap="xs">
                            {champions.map((champion, index) => (
                                <Avatar
                                    key={index}
                                    src={champion.imageUrl}
                                    size={44}
                                    radius="md"
                                />
                            ))}
                        </Group>

                        {/* 승률 Progress 바 - OP.GG 스타일 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flex: 1
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                minWidth: '180px'
                            }}>
                                <Progress.Root size="xl" style={{ flex: 1, height: '24px' }}>
                                    <Progress.Section
                                        value={winPercentage}
                                        color="#5383e8"
                                        style={{ borderRadius: '2px 0 0 2px' }}
                                    >
                                        <Progress.Label
                                            style={{
                                                color: 'white',
                                                fontSize: '12px',
                                                fontWeight: 600
                                            }}
                                        >
                                            {wins}승
                                        </Progress.Label>
                                    </Progress.Section>
                                    <Progress.Section
                                        value={lossPercentage}
                                        color="#e84057"
                                        style={{ borderRadius: '0 2px 2px 0' }}
                                    >
                                        <Progress.Label
                                            style={{
                                                color: 'white',
                                                fontSize: '12px',
                                                fontWeight: 600
                                            }}
                                        >
                                            {losses}패
                                        </Progress.Label>
                                    </Progress.Section>
                                </Progress.Root>
                            </div>

                            <Text size="sm" fw={600} c={winRate >= 50 ? '#5383e8' : '#e84057'}>
                                {winRate}%
                            </Text>
                        </div>

                        {/* 추가 정보 */}
                        <Group gap="md">
                            <Text size="sm" c="dimmed">
                                {totalGames}게임
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
                        color="gray"
                        rightSection={isExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                        onClick={onToggle}
                        style={{ flexShrink: 0 }}
                    >
                        상세정보
                    </Button>
                </Group>
            )}
        </Stack>
    );
};

export default CombinationCard;
