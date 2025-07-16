import { useQuery } from '@tanstack/react-query';

const mockCombinations = [
    {
        id: 1,
        champions: [
            { championNameKr: '가렌', championNameEn: 'Garen', imageUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Garen.png' },
            { championNameKr: '그라가스', championNameEn: 'Gragas', imageUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gragas.png' },
            { championNameKr: '그웬', championNameEn: 'Gwen', imageUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gwen.png' },
            { championNameKr: '그레이브즈', championNameEn: 'Graves', imageUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Graves.png' },
            { championNameKr: '갈리오', championNameEn: 'Galio', imageUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Galio.png' }
        ],
        winRate: 68.5,
        wins: 37,
        losses: 17,
        recentGame: '2024-07-15',
        recentPatch: '14.14',
        matches: [
            {
                id: 1,
                blueTeam: 'T1',
                redTeam: 'Gen.G',
                isWin: true,
                league: 'LCK',
                patch: '14.14',
                gameTime: '32:15',
                date: '2024-07-15',
                blueTeamPlayers: [
                    { playerName: 'Zeus', championName: 'Garen', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Garen.png', lane: 'TOP' },
                    { playerName: 'Oner', championName: 'Gragas', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gragas.png', lane: 'JUNGLE' },
                    { playerName: 'Faker', championName: 'Gwen', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gwen.png', lane: 'MID' },
                    { playerName: 'Gumayusi', championName: 'Graves', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Graves.png', lane: 'BOTTOM' },
                    { playerName: 'Keria', championName: 'Galio', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Galio.png', lane: 'SUPPORT' }
                ],
                redTeamPlayers: [
                    { playerName: 'Kiin', championName: 'Jax', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jax.png', lane: 'TOP' },
                    { playerName: 'Canyon', championName: 'Viego', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Viego.png', lane: 'JUNGLE' },
                    { playerName: 'Chovy', championName: 'Azir', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Azir.png', lane: 'MID' },
                    { playerName: 'Peyz', championName: 'Jinx', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jinx.png', lane: 'BOTTOM' },
                    { playerName: 'Lehends', championName: 'Nautilus', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Nautilus.png', lane: 'SUPPORT' }
                ]
            },
            {
                id: 2,
                blueTeam: 'DK',
                redTeam: 'KT',
                isWin: false,
                league: 'LCK',
                patch: '14.14',
                gameTime: '28:42',
                date: '2024-07-14',
                blueTeamPlayers: [
                    { playerName: 'Showmaker', championName: 'Garen', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Garen.png', lane: 'TOP' },
                    { playerName: 'Canyon', championName: 'Gragas', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gragas.png', lane: 'JUNGLE' },
                    { playerName: 'Zeka', championName: 'Gwen', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gwen.png', lane: 'MID' },
                    { playerName: 'Aiming', championName: 'Graves', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Graves.png', lane: 'BOTTOM' },
                    { playerName: 'Kellin', championName: 'Galio', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Galio.png', lane: 'SUPPORT' }
                ],
                redTeamPlayers: [
                    { playerName: 'Kiin', championName: 'Aatrox', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aatrox.png', lane: 'TOP' },
                    { playerName: 'Pyosik', championName: 'Kindred', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Kindred.png', lane: 'JUNGLE' },
                    { playerName: 'Bdd', championName: 'Orianna', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Orianna.png', lane: 'MID' },
                    { playerName: 'Deft', championName: 'Ashe', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ashe.png', lane: 'BOTTOM' },
                    { playerName: 'BeryL', championName: 'Thresh', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Thresh.png', lane: 'SUPPORT' }
                ]
            }
        ]
    },
    {
        id: 2,
        champions: [
            { championNameKr: '가렌', championNameEn: 'Garen', imageUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Garen.png' },
            { championNameKr: '그라가스', championNameEn: 'Gragas', imageUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gragas.png' },
            { championNameKr: '그웬', championNameEn: 'Gwen', imageUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gwen.png' },
            { championNameKr: '그레이브즈', championNameEn: 'Graves', imageUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Graves.png' },
            { championNameKr: '갈리오', championNameEn: 'Galio', imageUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Galio.png' }
        ],
        winRate: 68.5,
        wins: 37,
        losses: 17,
        recentGame: '2024-07-15',
        recentPatch: '14.14',
        matches: [
            {
                id: 1,
                blueTeam: 'T1',
                redTeam: 'Gen.G',
                isWin: true,
                league: 'LCK',
                patch: '14.14',
                gameTime: '32:15',
                date: '2024-07-15',
                blueTeamPlayers: [
                    { playerName: 'Zeus', championName: 'Garen', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Garen.png', lane: 'TOP' },
                    { playerName: 'Oner', championName: 'Gragas', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gragas.png', lane: 'JUNGLE' },
                    { playerName: 'Faker', championName: 'Gwen', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gwen.png', lane: 'MID' },
                    { playerName: 'Gumayusi', championName: 'Graves', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Graves.png', lane: 'BOTTOM' },
                    { playerName: 'Keria', championName: 'Galio', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Galio.png', lane: 'SUPPORT' }
                ],
                redTeamPlayers: [
                    { playerName: 'Kiin', championName: 'Jax', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jax.png', lane: 'TOP' },
                    { playerName: 'Canyon', championName: 'Viego', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Viego.png', lane: 'JUNGLE' },
                    { playerName: 'Chovy', championName: 'Azir', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Azir.png', lane: 'MID' },
                    { playerName: 'Peyz', championName: 'Jinx', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jinx.png', lane: 'BOTTOM' },
                    { playerName: 'Lehends', championName: 'Nautilus', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Nautilus.png', lane: 'SUPPORT' }
                ]
            },
            {
                id: 2,
                blueTeam: 'DK',
                redTeam: 'KT',
                isWin: false,
                league: 'LCK',
                patch: '14.14',
                gameTime: '28:42',
                date: '2024-07-14',
                blueTeamPlayers: [
                    { playerName: 'Showmaker', championName: 'Garen', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Garen.png', lane: 'TOP' },
                    { playerName: 'Canyon', championName: 'Gragas', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gragas.png', lane: 'JUNGLE' },
                    { playerName: 'Zeka', championName: 'Gwen', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Gwen.png', lane: 'MID' },
                    { playerName: 'Aiming', championName: 'Graves', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Graves.png', lane: 'BOTTOM' },
                    { playerName: 'Kellin', championName: 'Galio', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Galio.png', lane: 'SUPPORT' }
                ],
                redTeamPlayers: [
                    { playerName: 'Kiin', championName: 'Aatrox', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aatrox.png', lane: 'TOP' },
                    { playerName: 'Pyosik', championName: 'Kindred', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Kindred.png', lane: 'JUNGLE' },
                    { playerName: 'Bdd', championName: 'Orianna', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Orianna.png', lane: 'MID' },
                    { playerName: 'Deft', championName: 'Ashe', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ashe.png', lane: 'BOTTOM' },
                    { playerName: 'BeryL', championName: 'Thresh', championImg: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Thresh.png', lane: 'SUPPORT' }
                ]
            }
        ]
    }
];

const fetchCombinationResults = async (selectedChampions, filters) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockCombinations);
        }, 1000);
    });
};

export const useCombinationResults = (selectedChampions, filters) => {
    return useQuery({
        queryKey: ['combinations', selectedChampions, filters],
        queryFn: () => fetchCombinationResults(selectedChampions, filters),
        enabled: Array.isArray(selectedChampions) && selectedChampions.length > 0,
        staleTime: 5 * 60 * 1000,
    });
};