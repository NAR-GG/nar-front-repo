// src/components/results/MatchupResults.jsx
import React, { useState } from 'react';
import {
    Stack,
    Title,
    Paper,
    Group,
    Text,
    Button,
    Avatar,
    Badge,
    Divider,
    SimpleGrid,
    LoadingOverlay,
    Alert,
    ActionIcon
} from '@mantine/core';
import { IconSwords, IconArrowLeft, IconChevronDown } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useMatchupResults } from '../hooks/useMatchupResults';

const MatchupResults = ({ champion1, champion2, filters, onBackToSelection }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const queryClient = useQueryClient();

    const { data: matchupData, isLoading, error } = useMatchupResults(champion1, champion2, filters);

    // 캐시된 챔피언 데이터 가져오기
    const championData = queryClient.getQueryData(['champions']) || [];
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

    // 챔피언 한글 이름 가져오기
    const getChampionKoreanName = (championName) => {
        const championInfo = championMap.get(championName);
        return championInfo?.championNameKr || championName;
    };

    // 게임 시간 포맷팅 함수
    const formatGameTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 포지션별 챔피언 찾기
    const findChampionByPosition = (players, targetChampion) => {
        return players.find(player => player.championName === targetChampion);
    };

    // 헤더 렌더링
    const renderHeader = () => {
        const backButton = (
            <Button
                size="sm"
                color="gray"
                leftSection={<IconArrowLeft size={16} />}
                onClick={onBackToSelection}
            >
                돌아가기
            </Button>
        );

        const statsText = matchupData ? (
            <Text size="sm" c="dimmed">
                총 {matchupData.totalMatches}게임 • {matchupData.content?.length || 0}개 기록
            </Text>
        ) : null;

        if (isMobile) {
            return (
                <Stack gap="xs">
                    <Title order={2} c="dark">1vs1 매치업 분석</Title>
                    {statsText}
                    <Group justify="flex-end">
                        {backButton}
                    </Group>
                </Stack>
            );
        }

        return (
            <Group justify="space-between" align="center">
                <Title order={2} c="dark">1vs1 매치업 분석</Title>
                <Group>
                    {statsText}
                    {backButton}
                </Group>
            </Group>
        );
    };

    // 유효성 검사
    if (!champion1 || !champion2) {
        return (
            <Paper p="md" withBorder radius="md">
                <Stack gap="md" align="center">
                    <Text ta="center" c="dimmed">
                        유효한 챔피언 데이터가 없습니다.
                    </Text>
                    <Button
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={onBackToSelection}
                        variant="light"
                    >
                        챔피언 선택하러 가기
                    </Button>
                </Stack>
            </Paper>
        );
    }

    return (
        <Paper p="md" withBorder radius="md" style={{ position: 'relative', minHeight: '400px' }}>
            <LoadingOverlay visible={isLoading} />

            {!isLoading && (
                <Stack gap="sm">
                    {renderHeader()}
                    <Divider color="#e9ecef" size="sm" />

                    {error ? (
                        <Stack gap="md" align="center" py="xl">
                            <Text c="red" ta="center">
                                매치업 데이터를 불러오는데 실패했습니다: {error.message}
                            </Text>
                            <Button onClick={onBackToSelection} variant="light">
                                다시 시도하기
                            </Button>
                        </Stack>
                    ) : !matchupData || matchupData.totalMatches === 0 ? (
                        <Stack gap="md" align="center" py="xl">
                            <Text size="lg" fw={600} c="dimmed">
                                매치업 데이터가 없습니다
                            </Text>
                            <Text size="sm" c="dimmed" ta="center">
                                선택한 조건에서 {getChampionKoreanName(champion1)} vs {getChampionKoreanName(champion2)}
                                매치업을 찾을 수 없습니다.
                            </Text>
                            <Button onClick={onBackToSelection} variant="light">
                                다른 조건으로 검색하기
                            </Button>
                        </Stack>
                    ) : (
                        <Stack gap="lg">
                            {/* 매치업 헤더 - VS 구도 */}
                            <Paper p="xl" withBorder radius="md" bg="#f8f9fa">
                                <Stack gap="xl" align="center">
                                    <Group gap={isMobile ? "md" : "xl"} align="center" justify="center">
                                        {/* Champion 1 */}
                                        <Stack align="center" gap="sm">
                                            <Avatar
                                                src={getChampionImageUrl(champion1)}
                                                size={isMobile ? 80 : 120}
                                                radius="md"
                                            />
                                            <Text size={isMobile ? "lg" : "xl"} fw={700}>
                                                {getChampionKoreanName(champion1)}
                                            </Text>
                                            <Badge size="lg" color="blue" variant="light">
                                                {matchupData.winRateForChampion1.toFixed(1)}% 승률
                                            </Badge>
                                            <Text size="sm" c="dimmed">
                                                {Math.round((matchupData.totalMatches * matchupData.winRateForChampion1) / 100)}승
                                            </Text>
                                        </Stack>

                                        {/* VS */}
                                        <Stack align="center" gap="xs">
                                            <IconSwords size={isMobile ? 32 : 48} color="#868e96" />
                                            <Text size={isMobile ? "lg" : "xl"} fw={700} c="dimmed">
                                                VS
                                            </Text>
                                        </Stack>

                                        {/* Champion 2 */}
                                        <Stack align="center" gap="sm">
                                            <Avatar
                                                src={getChampionImageUrl(champion2)}
                                                size={isMobile ? 80 : 120}
                                                radius="md"
                                            />
                                            <Text size={isMobile ? "lg" : "xl"} fw={700}>
                                                {getChampionKoreanName(champion2)}
                                            </Text>
                                            <Badge size="lg" color="red" variant="light">
                                                {(100 - matchupData.winRateForChampion1).toFixed(1)}% 승률
                                            </Badge>
                                            <Text size="sm" c="dimmed">
                                                {matchupData.totalMatches - Math.round((matchupData.totalMatches * matchupData.winRateForChampion1) / 100)}승
                                            </Text>
                                        </Stack>
                                    </Group>

                                    <Divider w="100%" />

                                    {/* 통계 요약 */}
                                    <SimpleGrid cols={isMobile ? 2 : 3} w="100%">
                                        <Stack align="center" gap="xs">
                                            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                                총 게임수
                                            </Text>
                                            <Text size="xl" fw={700}>
                                                {matchupData.totalMatches}
                                            </Text>
                                        </Stack>

                                        <Stack align="center" gap="xs">
                                            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                                평균 게임시간
                                            </Text>
                                            <Text size="xl" fw={700}>
                                                {matchupData.content && matchupData.content.length > 0
                                                    ? formatGameTime(Math.round(matchupData.content.reduce((acc, match) => acc + match.gameLengthSeconds, 0) / matchupData.content.length))
                                                    : '00:00'
                                                }
                                            </Text>
                                        </Stack>

                                        <Stack align="center" gap="xs">
                                            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                                최신 패치
                                            </Text>
                                            <Text size="xl" fw={700}>
                                                {matchupData.content && matchupData.content.length > 0 ? matchupData.content[0].patch : '-'}
                                            </Text>
                                        </Stack>
                                    </SimpleGrid>
                                </Stack>
                            </Paper>

                            {/* 경기 기록 리스트 */}
                            <Stack gap="md">
                                <Group justify="space-between" align="center">
                                    <Text size="lg" fw={600}>경기 기록</Text>
                                    <Group gap="xs">
                                        <Text size="sm" c="dimmed">
                                            최신순 • {matchupData.content?.length || 0}게임
                                        </Text>
                                        {matchupData.hasNext && (
                                            <Text size="xs" c="dimmed">
                                                (더 많은 기록 있음)
                                            </Text>
                                        )}
                                    </Group>
                                </Group>

                                <Stack gap="sm">
                                    {(matchupData.content || []).map((match, index) => {
                                        // 각 팀에서 해당 챔피언을 플레이한 플레이어 찾기
                                        const champion1Player = findChampionByPosition(match.ourTeam.players, champion1) ||
                                            findChampionByPosition(match.opponentTeam.players, champion1);
                                        const champion2Player = findChampionByPosition(match.ourTeam.players, champion2) ||
                                            findChampionByPosition(match.opponentTeam.players, champion2);

                                        const champion1Won = match.champion1Won;

                                        return (
                                            <Paper key={match.gameId} p="md" bg="#f8f9fa" radius="md">
                                                <Stack gap="sm">
                                                    {/* 경기 정보 헤더 */}
                                                    <Group justify="space-between" align="center">
                                                        <Group gap="sm">
                                                            <Text size="sm" fw={600}>
                                                                {match.ourTeam.teamName} vs {match.opponentTeam.teamName}
                                                            </Text>
                                                            <Text size="xs" c="dimmed">
                                                                {match.league} {match.split && `• ${match.split}`} • {match.patch}
                                                            </Text>
                                                        </Group>
                                                        <Group gap="xs">
                                                            <Text size="xs" c="dimmed">
                                                                {formatGameTime(match.gameLengthSeconds)}
                                                            </Text>
                                                            <Text size="xs" c="dimmed">
                                                                {match.gameDate}
                                                            </Text>
                                                        </Group>
                                                    </Group>

                                                    {/* 1vs1 매치업 결과 */}
                                                    <Group justify="center" align="center" gap="xl">
                                                        {/* Champion 1 */}
                                                        <Group gap="sm" align="center">
                                                            <Avatar
                                                                src={getChampionImageUrl(champion1)}
                                                                size={40}
                                                                radius="md"
                                                            />
                                                            <Stack gap={2} align="flex-start">
                                                                <Text size="sm" fw={600}>
                                                                    {champion1Player?.playerName || '알 수 없음'}
                                                                </Text>
                                                                <Text
                                                                    size="xs"
                                                                    c={champion1Won ? "blue" : "dimmed"}
                                                                    fw={champion1Won ? 600 : 400}
                                                                >
                                                                    {champion1Won ? "(승)" : "(패)"}
                                                                </Text>
                                                            </Stack>
                                                        </Group>

                                                        {/* VS */}
                                                        <Text size="sm" fw={600} c="dimmed">
                                                            vs
                                                        </Text>

                                                        {/* Champion 2 */}
                                                        <Group gap="sm" align="center">
                                                            <Avatar
                                                                src={getChampionImageUrl(champion2)}
                                                                size={40}
                                                                radius="md"
                                                            />
                                                            <Stack gap={2} align="flex-start">
                                                                <Text size="sm" fw={600}>
                                                                    {champion2Player?.playerName || '알 수 없음'}
                                                                </Text>
                                                                <Text
                                                                    size="xs"
                                                                    c={!champion1Won ? "blue" : "dimmed"}
                                                                    fw={!champion1Won ? 600 : 400}
                                                                >
                                                                    {!champion1Won ? "(승)" : "(패)"}
                                                                </Text>
                                                            </Stack>
                                                        </Group>
                                                    </Group>
                                                </Stack>
                                            </Paper>
                                        );
                                    })}
                                </Stack>

                                {/* 더 많은 기록이 있을 때 표시 */}
                                {matchupData.hasNext && (
                                    <Group justify="center">
                                        <Text size="sm" c="dimmed">
                                            더 많은 기록이 있습니다
                                        </Text>
                                    </Group>
                                )}
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            )}
        </Paper>
    );
};

export default MatchupResults;
