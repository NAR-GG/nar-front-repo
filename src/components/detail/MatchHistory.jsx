// src/components/detail/MatchHistory.jsx
import React from 'react';
import { Stack, Group, Text, Badge, Paper, Avatar } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';

const MatchHistory = ({ champions, gameDetails }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const queryClient = useQueryClient();

    if (!gameDetails || gameDetails.length === 0) {
        return (
            <Text size="sm" c="dimmed" ta="center" py="sm">
                매치 기록이 없습니다.
            </Text>
        );
    }

    // 캐시된 챔피언 데이터 가져오기
    const championData = queryClient.getQueryData(['champions']) || [];

    // 챔피언 이름으로 빠른 검색을 위한 Map 생성
    const championMap = new Map();
    championData.forEach(champion => {
        championMap.set(champion.championNameEn, champion);
    });

    // 챔피언 이미지 URL 가져오기 함수
    const getChampionImageUrl = (championName) => {
        const championInfo = championMap.get(championName);
        if (championInfo?.imageUrl) {
            return championInfo.imageUrl;
        }

        const imageNameMap = {
            'Drmundo': 'DrMundo',
            'Jarvaniv': 'JarvanIV',
            'Kogmaw': 'KogMaw',
            'Leesin': 'LeeSin',
            'Masteryi': 'MasterYi',
            'Missfortune': 'MissFortune',
            'Monkeyking': 'MonkeyKing',
            'Twistedfate': 'TwistedFate',
            'Velkoz': 'Velkoz',
            'Xinzhao': 'XinZhao'
        };

        const imageName = imageNameMap[championName] || championName;
        return `https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/${imageName}.png`;
    };

    // 게임 시간 포맷팅 함수
    const formatGameTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Stack gap="xs" mt="sm">
            <Text size="sm" fw={600} c="dimmed" mb="xs">
                플레이 기록 ({gameDetails.length}게임)
            </Text>

            <Stack gap="sm">
                {gameDetails.map((game, index) => {
                    const { ourTeam, opponentTeam } = game;
                    const weWon = ourTeam.isWin;

                    // 블루사이드와 레드사이드 구분
                    const blueTeam = ourTeam.side === 'Blue' ? ourTeam : opponentTeam;
                    const redTeam = ourTeam.side === 'Red' ? ourTeam : opponentTeam;
                    const ourTeamIsBlue = ourTeam.side === 'Blue';

                    return (
                        <Paper key={index} p="sm" bg="#f8f9fa" radius="md">
                            <Stack gap="xs">
                                {/* 첫 번째 행: 경기 헤더 - 조합 사용팀을 블루/레드 위치에 맞게 배치 */}
                                <Group justify="space-between" align="center">
                                    <Group gap="sm">
                                        <Text size="sm" fw={600}>
                                            {ourTeamIsBlue ? (
                                                <>
                                                    <Text
                                                        component="span"
                                                        fw={700}
                                                        style={{
                                                            backgroundColor: weWon ? '#2196f3' : '#f44336',
                                                            color: 'white',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px'
                                                        }}
                                                    >
                                                        {blueTeam.teamName}
                                                    </Text>
                                                    {' vs '}
                                                    <Text component="span" c="black" fw={600}>
                                                        {redTeam.teamName}
                                                    </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Text component="span" c="black" fw={600}>
                                                        {blueTeam.teamName}
                                                    </Text>
                                                    {' vs '}
                                                    <Text
                                                        component="span"
                                                        fw={700}
                                                        style={{
                                                            backgroundColor: weWon ? '#2196f3' : '#f44336',
                                                            color: 'white',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px'
                                                        }}
                                                    >
                                                        {redTeam.teamName}
                                                    </Text>
                                                </>
                                            )}
                                        </Text>
                                        <Badge
                                            size="sm"
                                            color={weWon ? 'blue' : 'red'}
                                            variant="filled"
                                        >
                                            {weWon ? '승리' : '패배'}
                                        </Badge>
                                        <Text size="xs" c="dimmed">
                                            {game.league} • {game.patch}
                                        </Text>
                                    </Group>
                                    <Group gap="xs">
                                        <Text size="xs" c="dimmed">
                                            {formatGameTime(game.gameLengthSeconds)}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {game.gameDate}
                                        </Text>
                                    </Group>
                                </Group>

                                {/* 두 번째 행: 블루사이드(왼쪽) vs 레드사이드(오른쪽) */}
                                <Group justify="center" align="flex-start" gap="md">
                                    {/* 블루사이드 (왼쪽) */}
                                    <Stack gap="xs" align="center">
                                        <Text size="xs" fw={600}>
                                            {blueTeam.teamName}
                                        </Text>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {blueTeam.players?.map((player, idx) => (
                                                <div key={idx} style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    width: '50px'
                                                }}>
                                                    <Avatar
                                                        src={getChampionImageUrl(player.championName)}
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
                                    </Stack>

                                    {/* VS */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '40px',
                                        paddingTop: '20px'
                                    }}>
                                        <Text size="sm" fw={600} c="dimmed">
                                            vs
                                        </Text>
                                    </div>

                                    {/* 레드사이드 (오른쪽) */}
                                    <Stack gap="xs" align="center">
                                        <Text size="xs" fw={600}>
                                            {redTeam.teamName}
                                        </Text>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {redTeam.players?.map((player, idx) => (
                                                <div key={idx} style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    width: '50px'
                                                }}>
                                                    <Avatar
                                                        src={getChampionImageUrl(player.championName)}
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
