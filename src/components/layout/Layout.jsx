import React from 'react';
import { Stack, Container } from '@mantine/core';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <Stack
            gap={0}
            style={{ minHeight: '100vh' }}
        >
            <Header />

            <main style={{
                flex: 1,
                backgroundColor: '#f8f9fa',
                paddingTop: '2rem',
                paddingBottom: '2rem'
            }}>
                {/* 전체 프로젝트 최대 너비 통일 */}
                <Container
                    size="lg"  // xl에서 lg로 변경
                    px={{ base: 16, sm: 24, md: 32 }}
                    style={{ maxWidth: '1200px' }}  // 최대 너비 제한
                >
                    {children}
                </Container>
            </main>

            <Footer />
        </Stack>
    );
};

export default Layout;