import React from 'react';
import { Stack, Container } from '@mantine/core';
import Header from './Header';
import Footer from './Footer';
import KakaoAdFit from '../ads/KakaoAdFit'; // 1. 광고 컴포넌트 불러오기

const Layout = ({ children }) => {
    return (
        <Stack
            gap={0}
            style={{ minHeight: '100vh' }}
        >
            <Header />

            {/* ===== 2. 여기에 광고 컴포넌트 추가 ===== */}
            <KakaoAdFit
                adUnit="DAN-S0LZlpjW3VDOjjia" // 본인의 광고 단위 ID
                adWidth="728"
                adHeight="90"
            />

            <main style={{
                flex: 1,
                backgroundColor: '#f8f9fa',
                paddingTop: '2rem',
                paddingBottom: '2rem'
            }}>
                <Container
                    size="lg"
                    px={{ base: 16, sm: 24, md: 32 }}
                    style={{ maxWidth: '1200px' }}
                >
                    {children}
                </Container>
            </main>

            <Footer />
        </Stack>
    );
};

export default Layout;