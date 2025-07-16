// src/components/detail/MatchHistory.jsx
import React from 'react';
import { Stack, Group, Text, Badge, Paper, Avatar, Divider } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const MatchHistory = ({ champions, matches }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (!matches || matches.length === 0) {
        return (
            <Text size="sm" c="dimmed" ta="center" py="sm">
                매치 기록이 없습니다.
            </Text>
        );
    }

    const getPositionIcon = (lane) => {
        return `/icons/${lane.toLowerCase()}.png`;
    };

    // 우리 팀(조합에 포함된 팀)인지 확인하는 함수
    const isOurTeam = (teamPlayers, selectedChampions) => {
        // 선택된 챔피언들이 해당 팀에 모두 포함되어 있는지 확인
        return selectedChampions.every(selectedChamp =>
            teamPlayers?.some(player =>
                player.championName === selectedChamp.championNameEn
            )
        );
    };

    return (
        <Stack gap="xs" mt="sm">
            <Text size="sm" fw={600} c="dimmed" mb="xs">
                플레이 기록 ({matches.length}게임)
            </Text>

            <Stack gap="md">
                {matches.map((match, index) => {
                    // 우리 팀이 블루팀인지 레드팀인지 확인
                    const ourTeamIsBlue = isOurTeam(match.blueTeamPlayers, champions);
                    const weWon = ourTeamIsBlue ? match.isWin : !match.isWin;

                    return (
                        <Paper key={index} p="md" bg="#f8f9fa" radius="md">
                            <Stack gap="sm">
                                {/* 경기 헤더 - 우리 팀 기준으로 승/패 표시 */}
                                <Group justify="space-between" align="center">
                                    <Group gap="sm">
                                        <Text size="sm" fw={600}>
                                            {match.blueTeam} vs {match.redTeam}
                                        </Text>
                                        <Badge
                                            size="sm"
                                            color={weWon ? 'blue' : 'red'}
                                            variant="filled"
                                        >
                                            {weWon ? '승리' : '패배'}
                                        </Badge>
                                        <Text size="xs" c="dimmed">
                                            {match.league} • {match.patch}
                                        </Text>
                                    </Group>
                                    <Group gap="xs">
                                        <Text size="xs" c="dimmed">
                                            {match.gameTime}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {match.date}
                                        </Text>
                                    </Group>
                                </Group>

                                {/* 팀 vs 팀 구성 - 우리 조합 기준 */}
                                <Group justify="space-between" align="flex-start">
                                    {/* 블루팀 */}
                                    <Stack gap="xs" style={{ flex: 1 }}>
                                        <Group gap="xs">
                                            <div
                                                style={{
                                                    width: '4px',
                                                    height: '16px',
                                                    backgroundColor: '#4c6ef5',
                                                    borderRadius: '2px'
                                                }}
                                            />
                                            <Text size="sm" fw={600} c="black">
                                                {match.blueTeam}
                                            </Text>
                                            {/* 우리 조합 기준으로 표시 */}
                                            {ourTeamIsBlue && (
                                                <Badge size="xs" color={weWon ? 'blue' : 'red'} variant="light">
                                                    {weWon ? '승리' : '패배'}
                                                </Badge>
                                            )}
                                        </Group>
                                        <Stack gap="xs">
                                            {match.blueTeamPlayers?.map((player, idx) => (
                                                <Group key={idx} gap="xs" wrap="nowrap">
                                                    <div style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        backgroundColor: '#ffffff',
                                                        border: '1px solid #4c6ef5',
                                                        borderRadius: '3px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <img
                                                            src={getPositionIcon(player.lane)}
                                                            alt={player.lane}
                                                            width={14}
                                                            height={14}
                                                            style={{
                                                                filter: 'brightness(0.6) contrast(1.2)'
                                                            }}
                                                        />
                                                    </div>
                                                    <Avatar
                                                        src={player.championImg}
                                                        size={24}
                                                        radius="sm"
                                                    />
                                                    <Text size="xs" style={{ minWidth: '60px' }}>
                                                        {player.playerName}
                                                    </Text>
                                                </Group>
                                            ))}
                                        </Stack>
                                    </Stack>

                                    {/* 가운데 구분선 */}
                                    <Divider
                                        orientation="vertical"
                                        style={{ height: '120px', alignSelf: 'center' }}
                                    />

                                    {/* 레드팀 */}
                                    <Stack gap="xs" style={{ flex: 1 }}>
                                        <Group gap="xs" justify="flex-end">
                                            {/* 우리 조합 기준으로 표시 */}
                                            {!ourTeamIsBlue && (
                                                <Badge size="xs" color={weWon ? 'blue' : 'red'} variant="light">
                                                    {weWon ? '승리' : '패배'}
                                                </Badge>
                                            )}
                                            <Text size="sm" fw={600} c="black">
                                                {match.redTeam}
                                            </Text>
                                            <div
                                                style={{
                                                    width: '4px',
                                                    height: '16px',
                                                    backgroundColor: '#fa5252',
                                                    borderRadius: '2px'
                                                }}
                                            />
                                        </Group>
                                        <Stack gap="xs">
                                            {match.redTeamPlayers?.map((player, idx) => (
                                                <Group key={idx} gap="xs" wrap="nowrap" justify="flex-end">
                                                    <Text size="xs" style={{ minWidth: '60px', textAlign: 'right' }}>
                                                        {player.playerName}
                                                    </Text>
                                                    <Avatar
                                                        src={player.championImg}
                                                        size={24}
                                                        radius="sm"
                                                    />
                                                    <div style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        backgroundColor: '#ffffff',
                                                        border: '1px solid #fa5252',
                                                        borderRadius: '3px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <img
                                                            src={getPositionIcon(player.lane)}
                                                            alt={player.lane}
                                                            width={14}
                                                            height={14}
                                                            style={{
                                                                filter: 'brightness(0.6) contrast(1.2)'
                                                            }}
                                                        />
                                                    </div>
                                                </Group>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </Group>
                            </Stack>
                        </Paper>
                    );
                })}
            </Stack>
        </Stack>
    );
};

export default MatchHistory;
