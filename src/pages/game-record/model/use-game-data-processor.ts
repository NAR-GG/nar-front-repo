"use client";

import { useCallback, useMemo } from "react";
import type {
  GameDetailData,
  GameDetailPlayer,
} from "@/entities/games/model/games.dto";
import { useQuery } from "@tanstack/react-query";
import { championsQueries } from "@/src/entities/champions/model/champions.queries";

interface TeamStats {
  kills: number;
  deaths: number;
  assists: number;
  totalGold: number;
  totalDamage: number;
  visionScore: number;
  dragons: number;
  barons: number;
  heralds: number;
  towers: number;
  inhibitors: number;
  voidGrubs: number;
  elders: number;
  infernals: number;
  mountains: number;
  clouds: number;
  oceans: number;
  chemtechs: number;
  hextechs: number;
  turretPlates: number;
  firstDragon: boolean;
  firstBaron: boolean;
  firstHerald: boolean;
  firstTower: boolean;
}

interface ProcessedTeam {
  name: string;
  result: number;
  players: GameDetailPlayer[];
  bans: string[];
  stats: TeamStats;
}

interface GameInfo {
  league: string;
  split: string;
  playoffs: number;
  date: string;
  game: number;
  patch: string;
  gamelength: number;
}

export function useGameDataProcessor(
  gameData: GameDetailData | null | undefined
) {
  const { data: champions = [] } = useQuery(championsQueries.list());

  const championImageMap = useMemo(() => {
    if (!champions || champions.length === 0) return new Map<string, string>();
    return new Map(
      champions.map((c) => [c.championNameEn.toLowerCase(), c.imageUrl])
    );
  }, [champions]);

  const getChampionImageUrl = useCallback(
    (championName: string) => {
      return (
        championImageMap.get(championName.toLowerCase()) ||
        `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/${championName}.png`
      );
    },
    [championImageMap]
  );

  return useMemo(() => {
    if (!gameData) {
      return {
        gameInfo: null,
        blueTeam: null,
        redTeam: null,
        getChampionImageUrl,
      };
    }

    const gameInfo: GameInfo = {
      league: gameData.league,
      split: gameData.split,
      playoffs: gameData.playoffs,
      date: gameData.date,
      game: gameData.game,
      patch: gameData.patch,
      gamelength: gameData.gamelength,
    };

    const bluePlayers = gameData.players.filter(
      (p) => p.side.toLowerCase() === "blue"
    );
    const redPlayers = gameData.players.filter(
      (p) => p.side.toLowerCase() === "red"
    );

    const calculateTeamStats = (players: GameDetailPlayer[]): TeamStats => {
      const firstPlayer = players[0];
      return {
        kills: players.reduce((sum, p) => sum + p.kills, 0),
        deaths: players.reduce((sum, p) => sum + p.deaths, 0),
        assists: players.reduce((sum, p) => sum + p.assists, 0),
        totalGold: players.reduce((sum, p) => sum + p.totalGold, 0),
        totalDamage: players.reduce((sum, p) => sum + p.damageToChampions, 0),
        visionScore: players.reduce((sum, p) => sum + p.visionScore, 0),
        dragons: firstPlayer?.dragons || 0,
        barons: firstPlayer?.barons || 0,
        heralds: firstPlayer?.heralds || 0,
        towers: firstPlayer?.towers || 0,
        inhibitors: firstPlayer?.inhibitors || 0,
        voidGrubs: firstPlayer?.voidGrubs || 0,
        elders: firstPlayer?.elders || 0,
        infernals: firstPlayer?.infernals || 0,
        mountains: firstPlayer?.mountains || 0,
        clouds: firstPlayer?.clouds || 0,
        oceans: firstPlayer?.oceans || 0,
        chemtechs: firstPlayer?.chemtechs || 0,
        hextechs: firstPlayer?.hextechs || 0,
        turretPlates: firstPlayer?.turretPlates || 0,
        firstDragon: firstPlayer?.firstdragon || false,
        firstBaron: firstPlayer?.firstbaron || false,
        firstHerald: firstPlayer?.firstherald || false,
        firstTower: firstPlayer?.firsttower || false,
      };
    };

    const blueTeam: ProcessedTeam = {
      name: bluePlayers[0]?.teamname || "Blue Team",
      result: bluePlayers[0]?.result || 0,
      players: bluePlayers,
      bans: gameData.bans?.blue || [],
      stats: calculateTeamStats(bluePlayers),
    };

    const redTeam: ProcessedTeam = {
      name: redPlayers[0]?.teamname || "Red Team",
      result: redPlayers[0]?.result || 0,
      players: redPlayers,
      bans: gameData.bans?.red || [],
      stats: calculateTeamStats(redPlayers),
    };

    return {
      gameInfo,
      blueTeam,
      redTeam,
      getChampionImageUrl,
    };
  }, [gameData, getChampionImageUrl]);
}
