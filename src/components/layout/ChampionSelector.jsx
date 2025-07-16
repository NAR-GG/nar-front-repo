import React from 'react';
import { Group, Paper, Avatar, ActionIcon, Text } from '@mantine/core';
import { IconX, IconPlus } from '@tabler/icons-react';

const ChampionSelector = ({ selectedChampions, onChampionRemove }) => {
    return (
        <Paper p="md" withBorder radius="md">
            <Group justify="center" gap="md">
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                        {selectedChampions[index] ? (
                            <>
                                <Avatar
                                    src={selectedChampions[index].imageUrl}
                                    alt={selectedChampions[index].championNameKr}
                                    size={80}
                                    radius="md"
                                    style={{
                                        border: '3px solid #4c6ef5',
                                        cursor: 'pointer'
                                    }}
                                />
                                <ActionIcon
                                    size="sm"
                                    color="red"
                                    variant="filled"
                                    style={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        zIndex: 1
                                    }}
                                    onClick={() => onChampionRemove(selectedChampions[index])}
                                >
                                    <IconX size={12} />
                                </ActionIcon>
                                <Text
                                    size="xs"
                                    ta="center"
                                    mt={4}
                                    style={{ maxWidth: 80 }}
                                >
                                    {selectedChampions[index].championNameKr}
                                </Text>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <Avatar
                                    size={80}
                                    radius="md"
                                    style={{
                                        backgroundColor: '#f8f9fa',
                                        border: '2px dashed #dee2e6',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: '#e9ecef',
                                            borderColor: '#adb5bd'
                                        }
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            backgroundColor: '#e9ecef',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <IconPlus
                                            size={24}
                                            color="#6c757d"
                                            style={{
                                                strokeWidth: 2,
                                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                                            }}
                                        />
                                    </div>
                                </Avatar>
                                <Text size="xs" c="dimmed" mt={4}>
                                    챔피언 선택
                                </Text>
                            </div>
                        )}
                    </div>
                ))}
            </Group>
        </Paper>
    );
};

export default ChampionSelector;
