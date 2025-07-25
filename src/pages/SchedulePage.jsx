import React from 'react';
import { Container, Stack, Title, Paper } from '@mantine/core';

const SchedulePage = () => {
    return (
        <Container size="xl" px={{ base: 16, sm: 24, md: 32 }}>
            <Stack gap="xl" mt="xl">
                <Paper p="xl" withBorder radius="sm">
                    <Title order={2} mb="lg">LCK 일정</Title>
                    {/* 여기에 일정 컴포넌트들이 들어갈 예정 */}
                    <div>일정 페이지 개발 예정...</div>
                </Paper>
            </Stack>
        </Container>
    );
};

export default SchedulePage;