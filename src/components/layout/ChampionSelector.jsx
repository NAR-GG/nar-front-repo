// ChampionSelector.jsx
import React, { useState, useEffect } from 'react';
import { Group, Paper, Avatar, Text, Button } from '@mantine/core';
import { IconPlus, IconSwords, IconUsers } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

const RADIUS = 'sm';

const ChampionSelector = ({
                              selectedChampions = [],
                              selected1v1Champions = [],
                              onChampionRemove,
                              on1v1ChampionRemove,
                              onEmptySlotClick,
                              onEmpty1v1SlotClick,
                              currentMode = 'team',
                              onModeChange,
                          }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    const activeTab = currentMode;

    const handleTabChange = (newMode) => {
        if (onModeChange) {
            onModeChange(newMode);
        }
    };

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
                // 고정된 높이를 설정하여 레이아웃 안정성 확보
                minHeight: isMobile ? 90 : 110,
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
                            fontSize: isMobile ? '9px' : '12px',
                            lineHeight: '1.2',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textAlign: 'center'
                        }}
                    >
                        {champ.championNameKr}
                    </Text>
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
                            fontSize: isMobile ? '9px' : '12px',
                            textAlign: 'center',
                            maxWidth: isMobile ? 56 : 80,
                        }}
                    >
                        챔피언 선택
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
                alignItems: 'flex-start', // 상단 정렬로 변경
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

            {/* VS 부분을 슬롯과 같은 높이에 맞춤 */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                height: isMobile ? 56 : 80,
                paddingTop: 0
            }}>
                <Text
                    fw={700}
                    c="gray.6"
                    mx={isMobile ? 4 : 8}
                    style={{ userSelect: 'none', fontSize: isMobile ? 14 : 18 }}
                >
                    VS
                </Text>
            </div>

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
            {/* 탭 버튼 */}
            <Group justify="center" mb="md" gap="xs">
                <Button
                    radius={RADIUS}
                    size={isMobile ? 'xs' : 'sm'}
                    variant={activeTab === 'team' ? 'filled' : 'default'}
                    color="blue"
                    onClick={() => handleTabChange('team')}
                >
                    팀 조합
                </Button>

                <Button
                    radius={RADIUS}
                    size={isMobile ? 'xs' : 'sm'}
                    variant={activeTab === '1v1' ? 'filled' : 'default'}
                    color="red"
                    onClick={() => handleTabChange('1v1')}
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
                style={{ fontSize: isMobile ? '10px' : '12px' }}
            >
                {activeTab === 'team'
                    ? '최대 5명의 챔피언으로 팀을 구성하세요'
                    : '1vs1 분석할 챔피언 2명을 선택하세요'}
            </Text>
        </Paper>
    );
};

export default ChampionSelector;
