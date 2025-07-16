import React from 'react';
import { Group, Paper, Avatar, ActionIcon, Text } from '@mantine/core';
import { IconHelmet, IconX } from '@tabler/icons-react';

const ChampionSelector = ({ selectedChampions, onChampionRemove }) => {
    return (
        <Paper p="md" withBorder radius="md">
            <Group justify="center" gap="md">
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                        {selectedChampions[index] ? (
                            <>
                                <Avatar
                                    src={selectedChampions[index].image}
                                    size={80}
                                    radius="md"
                                    style={{
                                        border: '3px solid #667eea',
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
                                    onClick={() => onChampionRemove(index)}
                                >
                                    <IconX size={12} />
                                </ActionIcon>
                                <Text
                                    size="xs"
                                    ta="center"
                                    mt={4}
                                    style={{ maxWidth: 80 }}
                                >
                                    {selectedChampions[index].name}
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
                                        cursor: 'pointer'
                                    }}
                                >
                                    <IconHelmet size={40} color="#adb5bd" />
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
