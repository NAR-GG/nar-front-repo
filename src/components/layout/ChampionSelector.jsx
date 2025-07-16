import React from 'react';
import { Group, Paper, Avatar, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

const ChampionSelector = ({ selectedChampions = [], onChampionRemove }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Paper p={isMobile ? "xs" : "md"} withBorder radius="md">
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: isMobile ? '6px' : '16px',
                overflowX: 'auto',
                paddingBottom: '4px',
                paddingLeft: isMobile ? '8px' : '0',
                paddingRight: isMobile ? '8px' : '0',
                margin: isMobile ? '0 -4px' : '0'
            }}>
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} style={{
                        position: 'relative',
                        minWidth: isMobile ? '56px' : '80px',
                        maxWidth: isMobile ? '56px' : '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexShrink: 0
                    }}>
                        {selectedChampions[index] ? (
                            <>
                                <Avatar
                                    src={selectedChampions[index].imageUrl}
                                    alt={selectedChampions[index].championNameKr}
                                    size={isMobile ? 56 : 80}
                                    radius="md"
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            opacity: 0.8,
                                            transform: 'scale(0.95)'
                                        }
                                    }}
                                    onClick={() => onChampionRemove && onChampionRemove(selectedChampions[index])}
                                />
                                <Text
                                    size="xs"
                                    ta="center"
                                    mt={4}
                                    style={{
                                        maxWidth: isMobile ? 56 : 80,
                                        fontSize: isMobile ? '9px' : '12px',
                                        lineHeight: '1.2',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {selectedChampions[index].championNameKr}
                                </Text>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <Avatar
                                    size={isMobile ? 56 : 80}
                                    radius="md"
                                    style={{
                                        backgroundColor: '#f8f9fa',
                                        border: '2px dashed #dee2e6',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: isMobile ? '32px' : '50px',
                                            height: isMobile ? '32px' : '50px',
                                            borderRadius: '50%',
                                            backgroundColor: '#e9ecef',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <IconPlus
                                            size={isMobile ? 16 : 24}
                                            color="#6c757d"
                                            style={{
                                                strokeWidth: 2,
                                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                                            }}
                                        />
                                    </div>
                                </Avatar>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    mt={4}
                                    style={{
                                        fontSize: isMobile ? '9px' : '12px'
                                    }}
                                >
                                    챔피언 선택
                                </Text>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Paper>
    );
};

export default ChampionSelector;
