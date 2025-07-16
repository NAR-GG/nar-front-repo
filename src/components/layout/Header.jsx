import React from 'react';
import { Title, Paper, Center, Group } from '@mantine/core';

const Header = () => {
    return (
        <Paper
            p="sm"  // xl에서 lg로 줄임
            radius={0}  // 좌우 여백 없애기 위해 radius 제거
            style={{
                background: '#5383e8',  // OP.GG와 동일한 단일 파란색
                color: 'white',
                width: '100vw',  // 전체 화면 너비
                marginLeft: 'calc(-50vw + 50%)',  // 컨테이너 밖으로 확장
                marginRight: 'calc(-50vw + 50%)',
                position: 'relative'
            }}
        >
            <Center>
                <Group gap="md" align="center">
                    <img
                        src="/icons/nar-icon.png"
                        alt="NAR.GG 아이콘"
                        width={46}
                        height={46}
                        style={{ objectFit: 'contain' }}
                    />
                    <Title
                        order={1}
                        size="h1"
                        fw={700}
                        style={{
                            fontSize: '2rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        NAR.GG
                    </Title>
                </Group>
            </Center>
        </Paper>
    );
};

export default Header;
