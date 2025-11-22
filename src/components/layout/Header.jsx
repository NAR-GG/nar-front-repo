import React from 'react';
import { Title, Paper, Group, Container, Text, Tabs } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUpdateInfo } from '../../hooks/useUpdateInfo';

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Header = () => {
    const { data: updateInfo, isLoading, error } = useUpdateInfo();
    const location = useLocation();
    const navigate = useNavigate();

    // 현재 경로에 따라 활성 탭 결정
    const getActiveTab = () => {
        const { pathname } = location;
        if (pathname.startsWith('/schedule') || pathname.startsWith('/record')) {
            return 'schedule';
        }
        if (pathname.startsWith('/games')) {
            return 'games';
        }
        return 'combination';
    };

    const handleTabChange = (value) => {
        if (value === 'combination') {
            navigate('/');
        } else if (value === 'schedule') {
            navigate('/schedule');
        } else if (value === 'games'){
            navigate('/games');
        }
    };

    let updateText = '로딩 중...';
    if (!isLoading) {
        if (error) {
            updateText = '최근 업데이트: -';
        } else {
            updateText = `최근 업데이트: ${formatDate(updateInfo?.lastUpdateTime)}`;
        }
    }

    return (
        <Paper
            p={0}
            radius={0}
            style={{
                background: '#5383e8',
                color: 'white',
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
                position: 'relative'
            }}
        >
            <Container
                size="xl"
                px={{ base: 16, sm: 24, md: 32 }}
                style={{ maxWidth: '1200px' }}
            >
                {/* 상단 로고 + 업데이트 정보 */}
                <Group justify="space-between" align="center" wrap="nowrap" py="sm">
                    {/* 왼쪽: 로고 + 타이틀 */}
                    <Group gap="xs" align="center" justify="flex-start" wrap="nowrap">
                        <img
                            src="/icons/nar-icon.png"
                            alt="NAR.GG 아이콘"
                            width={42}
                            height={42}
                            style={{ objectFit: 'contain' }}
                        />
                        <Title
                            order={1}
                            size="h1"
                            fw={700}
                            style={{
                                fontSize: '1.75rem',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            NAR.GG
                        </Title>
                    </Group>

                    {/* 오른쪽: 최근 업데이트 */}
                    <Text size="xs" c="white" ta="right" style={{ whiteSpace: 'nowrap' }}>
                        {updateText}
                    </Text>
                </Group>

                {/* 하단 탭 네비게이션 - 네이버 스포츠 스타일 */}
                <div style={{ paddingBottom: '12px' }}>
                    <Group gap="xl" align="center">
                        <Text
                            size="sm"
                            fw={getActiveTab() === 'combination' ? 700 : 400}
                            style={{
                                color: getActiveTab() === 'combination' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                                cursor: 'pointer',
                                padding: '8px 0',
                                borderBottom: getActiveTab() === 'combination' ? '2px solid white' : '2px solid transparent',
                                transition: 'all 0.2s ease',
                                fontSize: '15px'
                            }}
                            onClick={() => handleTabChange('combination')}
                        >
                            챔피언 조합
                        </Text>

                        <Text
                            size="sm"
                            fw={getActiveTab() === 'schedule' ? 700 : 400}
                            style={{
                                color: getActiveTab() === 'schedule' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                                cursor: 'pointer',
                                padding: '8px 0',
                                borderBottom: getActiveTab() === 'schedule' ? '2px solid white' : '2px solid transparent',
                                transition: 'all 0.2s ease',
                                fontSize: '15px'
                            }}
                            onClick={() => handleTabChange('schedule')}
                        >
                            LCK 일정
                        </Text>
                        <Text
                            size="sm"
                            fw={getActiveTab() === 'games' ? 700 : 400}
                            style={{
                                color: getActiveTab() === 'games' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                                cursor: 'pointer',
                                padding: '8px 0',
                                borderBottom: getActiveTab() === 'games' ? '2px solid white' : '2px solid transparent',
                                transition: 'all 0.2s ease',
                                fontSize: '15px'
                            }}
                            onClick={() => handleTabChange('games')}
                        >
                            경기 리스트
                        </Text>
                    </Group>
                </div>
            </Container>
        </Paper>
    );
};

export default Header;
