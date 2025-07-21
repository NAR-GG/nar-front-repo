// src/components/layout/Footer.jsx
import React from 'react';
import {
    Paper,
    Container,
    Text,
    Anchor,
    Divider,
    Stack,
    Group,
} from '@mantine/core';

const Footer = () => (
    <Paper
        component="footer"
        bg="#F8F9FA"          /* 본문과 같은 배경 */
        shadow="sm"
        p={{ base: 'md', md: 'lg' }}
    >
        <Container size="xl">
            {/* 얇은 상단 구분선 */}
            <Divider
                color="#E9ECEF"
                mb={{ base: 'md', md: 'lg' }}
            />

            <Stack gap="sm" align="center">
                {/* 문의 메일 · GitHub */}
                <Group gap="xs" justify="center">
                    <Text
                        size="sm"
                        c="#495057"
                        style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                    >
                        문의사항:
                    </Text>

                    <Anchor
                        href="mailto:mentenseoul@gmail.com"
                        c="#495057"
                        td="none"
                        style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#1c7ed6')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#495057')}
                    >
                        mentenseoul@gmail.com
                    </Anchor>

                    <Text c="#ADB5BD">|</Text>

                    <Anchor
                        href="https://github.com/NAR-GG"
                        target="_blank"
                        rel="noopener noreferrer"
                        c="#495057"
                        td="none"
                        style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#1c7ed6')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#495057')}
                    >
                        GitHub
                    </Anchor>
                </Group>

                {/* 저작권 */}
                <Text
                    size="sm"
                    c="#495057"
                    ta="center"
                    style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                >
                    © 2025 NAR.GG. All rights reserved.
                </Text>

                {/* 면책조항 */}
                <Text
                    size="xs"
                    c="#868E96"
                    ta="center"
                    style={{
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
                        lineHeight: 1.4,
                        maxWidth: '800px',
                    }}
                >
                    NAR.GG isn't endorsed by Riot Games and doesn't reflect the views or
                    opinions of Riot Games or anyone officially involved in producing or
                    managing Riot Games properties. Riot Games, and all associated
                    properties are trademarks or registered trademarks of Riot Games, Inc.
                </Text>
            </Stack>
        </Container>
    </Paper>
);

export default Footer;
