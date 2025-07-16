import React from 'react';
import { Title, Paper, Center } from '@mantine/core';

const Header = () => {
    return (
        <Paper
            p="xl"
            radius="md"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}
        >
            <Center>
                <Title
                    order={1}
                    size="h1"
                    fw={700}
                    style={{
                        fontSize: '2.5rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    NAR.GG
                </Title>
            </Center>
        </Paper>
    );
};

export default Header;