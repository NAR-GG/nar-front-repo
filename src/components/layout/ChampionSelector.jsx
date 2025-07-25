import React, { useState } from 'react';
import { Group, Paper, Avatar, Text, Button } from '@mantine/core';
import { IconPlus, IconSwords, IconUsers } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

const RADIUS = 'sm';          // Mantine 기준 = 6 px  (OP.GG 스타일)

const ChampionSelector = ({
                              selectedChampions = [],
                              selected1v1Champions = [],
                              onChampionRemove,
                              on1v1ChampionRemove,
                              onEmptySlotClick,
                              onEmpty1v1SlotClick,
                          }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeTab, setActiveTab] = useState('team'); // 'team' | '1v1'

    /* ---------- 공통 슬롯 렌더러 ---------- */
    const renderSlot = (champ, index, slotCount, onRemove, onEmptyClick, slotType) => (
        <div
            key={`${slotType}-${index}`}
            style={{
                position: 'relative',
                minWidth: isMobile ? 56 : 80,
                maxWidth: isMobile ? 56 : 80,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
            }}
        >
            {champ ? (
                <>
                    <Avatar
                        src={champ.imageUrl}
                        alt={champ.championNameKr}
                        size={isMobile ? 56 : 80}
                        radius={RADIUS}
                        style={{ cursor: 'pointer', transition: 'all .15s ease' }}
                        onClick={() => onRemove?.(champ)}
                    />
                    <Text
                        size="xs"
                        mt={4}
                        truncate="end"
                        style={{
                            maxWidth: isMobile ? 56 : 80,
                            fontSize: isMobile ? '9px' : '12px',  // 기존처럼 px 단위로 복원
                            lineHeight: '1.2',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {champ.championNameKr}
                    </Text>
                    {slotType === '1v1' && (
                        <Text
                            size={isMobile ? 8 : 10}
                            c="dimmed"
                            mt={2}
                            style={{
                                fontSize: isMobile ? '7px' : '9px'  // 기존처럼 더 작게
                            }}
                        >
                            {index === 0 ? '플레이어 1' : '플레이어 2'}
                        </Text>
                    )}
                </>
            ) : (
                <>
                    <Avatar
                        size={isMobile ? 56 : 80}
                        radius={RADIUS}
                        style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px dashed #ced4da',
                            cursor: 'pointer',
                            transition: 'all .15s ease',
                        }}
                        onClick={() => onEmptyClick?.(index)}
                    >
                        <IconPlus size={isMobile ? 16 : 24} color="#868e96" stroke={2} />
                    </Avatar>
                    <Text
                        size="xs"
                        c="dimmed"
                        mt={4}
                        style={{
                            fontSize: isMobile ? '9px' : '12px'  // 기존처럼 작게
                        }}
                    >
                        챔피언 선택  {/* 1vs1에서도 통일 */}
                    </Text>
                </>
            )}
        </div>
    );

    /* ---------- 1vs1 전용 컨테이너 ---------- */
    const render1v1 = () => (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile ? 6 : 16,
                overflowX: 'auto',
                padding: '0 8px 4px',
            }}
        >
            {renderSlot(
                selected1v1Champions[0],
                0,
                2,
                on1v1ChampionRemove,
                onEmpty1v1SlotClick,
                '1v1',
            )}

            {/* ▶︎ 가운데 VS 라벨 ◀︎ */}
            <Text
                fw={700}
                c="gray.6"
                mx={isMobile ? 4 : 8}
                style={{ userSelect: 'none', fontSize: isMobile ? 14 : 18 }}
            >
                VS
            </Text>

            {renderSlot(
                selected1v1Champions[1],
                1,
                2,
                on1v1ChampionRemove,
                onEmpty1v1SlotClick,
                '1v1',
            )}
        </div>
    );

    /* ---------- 팀 조합 컨테이너 ---------- */
    const renderTeam = () => (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                gap: isMobile ? 6 : 16,
                overflowX: 'auto',
                padding: '0 8px 4px',
            }}
        >
            {Array.from({ length: 5 }).map((_, i) =>
                renderSlot(
                    selectedChampions[i],
                    i,
                    5,
                    onChampionRemove,
                    onEmptySlotClick,
                    'team',
                ),
            )}
        </div>
    );

    return (
        <Paper p={isMobile ? 'xs' : 'md'} withBorder radius={RADIUS}>
            {/* 탭 버튼 – radius 통일 */}
            <Group justify="center" mb="md" gap="xs">
                <Button
                    radius={RADIUS}
                    size={isMobile ? 'xs' : 'sm'}
                    leftSection={<IconUsers size={isMobile ? 14 : 16} />}
                    variant={activeTab === 'team' ? 'filled' : 'default'}
                    color="blue"
                    onClick={() => setActiveTab('team')}
                >
                    팀 조합
                </Button>

                <Button
                    radius={RADIUS}
                    size={isMobile ? 'xs' : 'sm'}
                    leftSection={<IconSwords size={isMobile ? 14 : 16} />}
                    variant={activeTab === '1v1' ? 'filled' : 'default'}
                    color="red"
                    onClick={() => setActiveTab('1v1')}
                >
                    1vs1
                </Button>
            </Group>

            {/* 선택창 */}
            {activeTab === 'team' ? renderTeam() : render1v1()}

            {/* 안내 문구 */}
            <Text
                size="xs"
                c="dimmed"
                ta="center"
                mt="md"
                style={{ fontSize: isMobile ? '10px' : '12px' }}  // 기존처럼
            >
                {activeTab === 'team'
                    ? '최대 5명의 챔피언으로 팀을 구성하세요'
                    : '1vs1 대결할 챔피언 2명을 선택하세요'}
            </Text>
        </Paper>
    );
};

export default ChampionSelector;
