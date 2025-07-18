import React from 'react';
import { Title, Paper, Group, Container } from '@mantine/core';

const Header = () => {
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
            </Container>
        </Paper>
    );
};

export default Header;
