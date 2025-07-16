// src/components/detail/MatchHistory.jsx
import React from 'react';
import { Stack, Group, Text, Badge, Paper, Avatar } from '@mantine/core';
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

    // 우리 팀(조합에 포함된 팀)인지 확인하는 함수
    const isOurTeam = (teamPlayers, selectedChampions) => {
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

            <Stack gap="sm">
                {matches.map((match, index) => {
                    // 우리 팀이 블루팀인지 레드팀인지 확인
                    const ourTeamIsBlue = isOurTeam(match.blueTeamPlayers, champions);
                    const weWon = ourTeamIsBlue ? match.isWin : !match.isWin;

                    return (
                        <Paper key={index} p="sm" bg="#f8f9fa" radius="md">
                            <Stack gap="xs">
                                {/* 첫 번째 행: 경기 헤더 */}
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

                                {/* 두 번째 행: 챔피언들과 선수 이름 - 정렬 수정 */}
                                <Group justify="center" align="flex-start" gap="md">
                                    {/* 블루팀 챔피언들 */}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {match.blueTeamPlayers?.map((player, idx) => (
                                            <div key={idx} style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                width: '50px'
                                            }}>
                                                <Avatar
                                                    src={player.championImg}
                                                    size={40}
                                                    radius="md"
                                                />
                                                <Text
                                                    size="xs"
                                                    mt={4}
                                                    style={{
                                                        textAlign: 'center',
                                                        width: '100%',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {player.playerName}
                                                </Text>
                                            </div>
                                        ))}
                                    </div>

                                    {/* VS */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '40px',
                                        paddingTop: '8px'
                                    }}>
                                        <Text size="sm" fw={600} c="dimmed">
                                            vs
                                        </Text>
                                    </div>

                                    {/* 레드팀 챔피언들 */}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {match.redTeamPlayers?.map((player, idx) => (
                                            <div key={idx} style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                width: '50px'
                                            }}>
                                                <Avatar
                                                    src={player.championImg}
                                                    size={40}
                                                    radius="md"
                                                />
                                                <Text
                                                    size="xs"
                                                    mt={4}
                                                    style={{
                                                        textAlign: 'center',
                                                        width: '100%',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {player.playerName}
                                                </Text>
                                            </div>
                                        ))}
                                    </div>
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
