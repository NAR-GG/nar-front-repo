import React from 'react';
import { Stack } from '@mantine/core';
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
                {children}
            </main>

            <Footer />
        </Stack>
    );
};

export default Layout;
