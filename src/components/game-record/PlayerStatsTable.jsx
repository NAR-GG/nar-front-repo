// src/components/game-record/PlayerStatsTable.jsx
import { Table, ScrollArea, Group, Avatar, Stack, Text, Badge } from '@mantine/core';

// --- 헬퍼 함수들 (기존과 동일) ---
const getChampionImageUrl = (championName) => `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${championName}.png`;

const calculateKP = (kills, assists, teamKills) => {
    if (teamKills === 0) return '0%';
    return `${Math.round(((kills + assists) / teamKills) * 100)}%`;
};

// ✅ 요청사항을 모두 반영하여 수정한 헬퍼 함수
const renderKeyRecords = (player) => {
    const records = [];
    const badgeProps = { variant: "light", size: "sm", radius: "xs" };

    // '퍼블 당함' 기록 (부정적 지표이므로 다른 스타일 적용)
    if (player.firstbloodvictim) {
        records.push(<Badge key="fbv" color="gray" variant="filled" {...badgeProps}>퍼블 당함</Badge>);
    }
    // '퍼블' 기록
    if (player.firstbloodkill) {
        records.push(<Badge key="fbk" color="gray" {...badgeProps}>퍼블</Badge>);
    }
    // 멀티킬 기록 (x2, x3 형식으로 변경)
    if (player.doublekills > 0) {
        records.push(<Badge key="double" color="gray" {...badgeProps}>더블킬 x{player.doublekills}</Badge>);
    }
    if (player.triplekills > 0) {
        records.push(<Badge key="triple" color="gray" {...badgeProps}>트리플킬 x{player.triplekills}</Badge>);
    }
    if (player.quadrakills > 0) {
        records.push(<Badge key="quadra" color="gray" {...badgeProps}>쿼드라킬 x{player.quadrakills}</Badge>);
    }
    if (player.pentakills > 0) {
        records.push(<Badge key="penta" color="gray" {...badgeProps}>펜타킬 x{player.pentakills}</Badge>);
    }

    if (records.length === 0) {
        return <Text size="sm" c="dimmed">-</Text>;
    }

    return <Stack gap={4} align="flex-start">{records}</Stack>;
};


// --- PlayerStatsTable 컴포넌트 (기존과 동일) ---
const PlayerStatsTable = ({ players, teamKills, gameLengthInMin }) => (
    <ScrollArea>
        <Table striped highlightOnHover miw={700}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>선수</Table.Th>
                    <Table.Th>KDA</Table.Th>
                    <Table.Th>주요 기록</Table.Th>
                    <Table.Th>데미지(DPM)</Table.Th>
                    <Table.Th>CS(CSPM)</Table.Th>
                    <Table.Th visibleFrom="sm">골드</Table.Th>
                    <Table.Th visibleFrom="sm">시야(VSPM)</Table.Th>
                    <Table.Th visibleFrom="sm">KP</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {players.map((p) => (
                    <Table.Tr key={p.participantid}>
                        <Table.Td>
                            <Group gap="sm">
                                <Avatar src={getChampionImageUrl(p.champion)} radius="sm" />
                                <Stack gap={0}>
                                    <Text size="sm" fw={600}>{p.playername}</Text>
                                    <Text size="xs" c="dimmed">{p.champion}</Text>
                                </Stack>
                            </Group>
                        </Table.Td>
                        <Table.Td>
                            <Text size="sm" fw={600}>{p.kills}/{p.deaths}/{p.assists}</Text>
                        </Table.Td>
                        <Table.Td>
                            {renderKeyRecords(p)}
                        </Table.Td>
                        <Table.Td>
                            <Stack gap={0}>
                                <Text size="sm">{(p.damagetochampions / 1000).toFixed(1)}K</Text>
                                <Text size="xs" c="dimmed">{p.dpm}</Text>
                            </Stack>
                        </Table.Td>
                        <Table.Td>
                            <Stack gap={0}>
                                <Text size="sm">{p.totalcs}</Text>
                                <Text size="xs" c="dimmed">{p.cspm.toFixed(1)}</Text>
                            </Stack>
                        </Table.Td>
                        <Table.Td visibleFrom="sm">
                            <Text size="sm">{(p.totalgold / 1000).toFixed(1)}K</Text>
                        </Table.Td>
                        <Table.Td visibleFrom="sm">
                            <Stack gap={0}>
                                <Text size="sm">{p.visionscore}</Text>
                                <Text size="xs" c="dimmed">{p.vspm.toFixed(1)}</Text>
                            </Stack>
                        </Table.Td>
                        <Table.Td visibleFrom="sm">
                            <Text size="sm">{calculateKP(p.kills, p.assists, teamKills)}</Text>
                        </Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </ScrollArea>
);

export default PlayerStatsTable;