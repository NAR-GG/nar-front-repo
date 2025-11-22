// src/hooks/useGameDataProcessor.js
import { useMemo } from 'react';
import { useChampions } from './useChampions';

const POSITION_ORDER = {
    'top': 0,
    'jungle': 1, 'jng': 1,
    'middle': 2, 'mid': 2,
    'bottom': 3, 'bot': 3,
    'utility': 4, 'support': 4, 'sup': 4
};const TEAM_NAME_MAP = {
    'Bnk Fearx': 'BFX',
    'Dplus Kia': 'DK',
    'Kt Rolster': 'KT',
    'Nongshim Redforce': 'NS',
    'Hanwha Life Esports': 'HLE',
    'Gen.g': 'GEN',
    'T1': 'T1',
    'Oksavingsbank Brion': 'BRO',
    'Drx': 'DRX',
    'Dn Freecs': 'DNF',
};

const calculateTeamStats = (teamPlayers) => {
    if (!teamPlayers || teamPlayers.length === 0) return {};
    const source = teamPlayers[0];
    return {
        kills: source.teamkills || 0,
        towers: source.towers || 0,
        inhibitors: source.inhibitors || 0,
        barons: source.barons || 0,
        dragons: source.dragons || 0,
        heralds: source.heralds || 0,
        voidGrubs: source.voidGrubs || 0,
        firstDragon: source.firstdragon,
        firstBaron: source.firstbaron,
        firstTower: source.firsttower,
        firstHerald: source.firstherald,
        totalGold: teamPlayers.reduce((sum, p) => sum + (p.totalGold || 0), 0),
        totalDamage: teamPlayers.reduce((sum, p) => sum + (p.damageToChampions || 0), 0),
        visionScore: teamPlayers.reduce((sum, p) => sum + (p.visionScore || 0), 0),
        elders: source.elders || 0,
        turretPlates: source.turretPlates || 0,
    };
};

export const useGameDataProcessor = (gameData) => {
    const { data: champions = [] } = useChampions();

    const processedData = useMemo(() => {
        if (!gameData || !gameData.players || gameData.players.length < 10) {
            const emptyTeam = { players: [], stats: {}, name: '', bans: [], result: 0 };
            return {
                gameInfo: {},
                blueTeam: { ...emptyTeam, name: 'Blue Team' },
                redTeam: { ...emptyTeam, name: 'Red Team' },
                getChampionImageUrl: () => '',
            };
        }

        const championImageMap = new Map(champions.map(c => [c.championNameEn, c.imageUrl]));
        const getChampionImageUrl = (championName) => {
            const champKey = championName?.split('.')[0];
            return championImageMap.get(champKey) || `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${champKey}.png`;
        };

        // ✅ [수정] ...rest 연산자를 사용하여 players를 제외한 모든 상위 레벨 정보를 gameInfo에 할당합니다.
        // 이렇게 하면 league, split, game, date 등 모든 정보가 자동으로 포함됩니다.
        const { players, ...gameInfo } = gameData;

        const blueTeamPlayers = players
            .filter(p => p.side.toLowerCase() === 'blue')
            .sort((a, b) => POSITION_ORDER[a.position.toLowerCase()] - POSITION_ORDER[b.position.toLowerCase()]);

        const redTeamPlayers = players
            .filter(p => p.side.toLowerCase() === 'red')
            .sort((a, b) => POSITION_ORDER[a.position.toLowerCase()] - POSITION_ORDER[b.position.toLowerCase()]);

        const blueTeamStats = calculateTeamStats(blueTeamPlayers);
        const redTeamStats = calculateTeamStats(redTeamPlayers);

        blueTeamStats.deaths = redTeamStats.kills;
        redTeamStats.deaths = blueTeamStats.kills;

        const blueTeamName = blueTeamPlayers[0]?.teamname || 'Blue Team';
        const redTeamName = redTeamPlayers[0]?.teamname || 'Red Team';

        const blueTeam = {
            players: blueTeamPlayers,
            stats: blueTeamStats,
            name: TEAM_NAME_MAP[blueTeamName] || blueTeamName,
            fullName: blueTeamName,
            result: blueTeamPlayers[0]?.result,
            bans: gameData.bans?.blue || [],
        };

        const redTeam = {
            players: redTeamPlayers,
            stats: redTeamStats,
            name: TEAM_NAME_MAP[redTeamName] || redTeamName,
            fullName: redTeamName,
            result: redTeamPlayers[0]?.result,
            bans: gameData.bans?.red || [],
        };

        return { gameInfo, blueTeam, redTeam, getChampionImageUrl };

    }, [gameData, champions]);

    return processedData;
};