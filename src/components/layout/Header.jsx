import React from 'react';
import { Title, Paper, Group, Container, Text } from '@mantine/core';
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
                style={{ maxWidth: '1200px' }}
            >
                <Group justify="space-between" align="center" wrap="nowrap">
                    {/* 왼쪽: 로고 + 타이틀 */}
                    {/* 🔥 이 부분이 핵심입니다! wrap="nowrap" 추가 */}
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
            </Container>
        </Paper>
    );
};

export default Header;