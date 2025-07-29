import { useMemo } from 'react';

/**
 * 포지션 순서 (탑-정글-미드-봇-서폿)
 */
const POSITION_ORDER = { top: 0, jungle: 1, mid: 2, bot: 3, support: 4 };

/**
 * 데이터가 없을 경우 반환될 팀의 기본 통계 상태
 */
const EMPTY_TEAM_STATS = {
    kills: 0, deaths: 0, towers: 0, inhibitors: 0, barons: 0, dragons: 0,
    heralds: 0, void_grubs: 0, elders: 0, turretPlates: 0, infernals: 0,
    mountains: 0, clouds: 0, oceans: 0, chemtechs: 0, hextechs: 0,
    firstDragon: false, firstBaron: false, firstTower: false, firstHerald: false,
    totalGold: 0, totalDamage: 0, visionScore: 0,
};

/**
 * 팀 플레이어 목록을 기반으로 팀 통계를 계산하는 헬퍼 함수
 * @param {Array} teamPlayers - 한 팀에 속한 플레이어 객체 배열
 * @returns {Object} - 계산된 팀 통계 객체
 */
const calculateTeamStats = (teamPlayers) => {
    if (!teamPlayers || teamPlayers.length === 0) {
        return { ...EMPTY_TEAM_STATS };
    }

    // LCK 데이터 구조 상, 팀 전체 데이터는 모든 플레이어에게 동일하게 포함됨.
    // 따라서 첫 번째 플레이어를 기준으로 팀 전체 통계를 가져옴.
    const source = teamPlayers[0];

    return {
        kills: source.teamkills || 0,
        // ✅ 'deaths'는 상대팀의 킬 수이므로, 나중에 교차 계산함.
        towers: source.towers || 0,
        inhibitors: source.inhibitors || 0,
        barons: source.barons || 0,
        dragons: source.dragons || 0,
        heralds: source.heralds || 0,
        void_grubs: source.void_grubs || 0,
        elders: source.elders || 0,
        turretPlates: source.turretplates || 0,
        infernals: source.infernals || 0,
        mountains: source.mountains || 0,
        clouds: source.clouds || 0,
        oceans: source.oceans || 0,
        chemtechs: source.chemtechs || 0,
        hextechs: source.hextechs || 0,
        firstDragon: source.firstdragon === 1,
        firstBaron: source.firstbaron === 1,
        firstTower: source.firsttower === 1,
        firstHerald: source.firstherald === 1,
        totalGold: teamPlayers.reduce((sum, p) => sum + (p.totalgold || 0), 0),
        totalDamage: teamPlayers.reduce((sum, p) => sum + (p.damagetochampions || 0), 0),
        visionScore: teamPlayers.reduce((sum, p) => sum + (p.visionscore || 0), 0),
    };
};


/**
 * 원본 게임 데이터를 UI에서 사용하기 쉬운 형태로 가공하는 커스텀 훅.
 * @param {Object} gameData - API로부터 받은 원본 경기 데이터
 * @returns {{gameInfo: Object, blueTeam: Object, redTeam: Object}} - 가공된 게임 정보 및 양 팀 데이터
 */
export const useGameDataProcessor = (gameData) => {
    return useMemo(() => {
        // --- 1. 데이터 유효성 검사 및 기본값 반환 ---
        if (!gameData || !gameData.players || gameData.players.length === 0) {
            const emptyTeam = { players: [], stats: { ...EMPTY_TEAM_STATS }, name: '', bans: [], result: 0 };
            return {
                gameInfo: {},
                blueTeam: { ...emptyTeam, name: 'Blue Team' },
                redTeam: { ...emptyTeam, name: 'Red Team' },
            };
        }

        const { players, ...gameInfo } = gameData;

        // --- 2. 팀별 플레이어 분리 및 정렬 ---
        const blueTeamPlayers = players
            .filter(p => p.side === 'blue')
            .sort((a, b) => POSITION_ORDER[a.position] - POSITION_ORDER[b.position]);

        const redTeamPlayers = players
            .filter(p => p.side === 'red')
            .sort((a, b) => POSITION_ORDER[a.position] - POSITION_ORDER[b.position]);

        // --- 3. 각 팀의 통계 계산 ---
        const blueTeamStats = calculateTeamStats(blueTeamPlayers);
        const redTeamStats = calculateTeamStats(redTeamPlayers);

        console.log("--- 훅 내부 계산 결과 ---");
        console.log("블루팀 통계:", blueTeamStats);
        console.log("레드팀 통계:", redTeamStats);

        // --- 4. 누락된 통계 교차 계산 (가장 중요한 부분) ---
        // ✅ 한 팀의 데스 = 상대팀의 킬 수. 이 로직이 정확한 데이터를 보장.
        blueTeamStats.deaths = redTeamStats.kills;
        redTeamStats.deaths = blueTeamStats.kills;

        // --- 5. 최종 데이터 객체 조립 ---
        const blueTeam = {
            players: blueTeamPlayers,
            stats: blueTeamStats,
            name: blueTeamPlayers[0]?.teamname || 'Blue Team',
            result: blueTeamPlayers[0]?.result,
            bans: gameData.bans?.blue || [],
        };

        const redTeam = {
            players: redTeamPlayers,
            stats: redTeamStats,
            name: redTeamPlayers[0]?.teamname || 'Red Team',
            result: redTeamPlayers[0]?.result,
            bans: gameData.bans?.red || [],
        };

        return { gameInfo, blueTeam, redTeam };

    }, [gameData]); // gameData가 변경될 때만 재계산
};