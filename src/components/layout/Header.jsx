import React from 'react';
import { Title, Paper, Group, Container, Text } from '@mantine/core';
import { useUpdateInfo } from '../../hooks/useUpdateInfo';  // 🔥 훅 import (이전 제안 기반, 필요 시 생성)

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Header = () => {
    const { data: updateInfo, isLoading } = useUpdateInfo();  // 🔥 훅 사용: 업데이트 정보 fetch

    return (
        <Paper
            p="sm"
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
                style={{ maxWidth: '1200px' }}  // 본문과 동일한 최대 너비
            >
                <Group justify="space-between" align="center" wrap="nowrap">  {/* 🔥 space-between으로 왼쪽/오른쪽 분리 */}
                    {/* 왼쪽: 로고 + 타이틀 */}
                    <Group gap="xs" align="center" justify="flex-start">
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

                    <Text size="sm" c="white" ta="right" style={{ whiteSpace: 'nowrap' }}>
                        {isLoading
                            ? '로딩 중...'
                            : `최근 업데이트: ${formatDate(updateInfo.lastUpdateTime)}`}
                    </Text>
                </Group>
            </Container>
        </Paper>
    );
};

export default Header;
