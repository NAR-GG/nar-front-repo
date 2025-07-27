import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Stack,
    Paper,
    Title,
    Group,
    Text,
    Grid,
    Badge,
    Avatar,
    Progress,
    Card,
    Tabs,
    SimpleGrid,
    Center,
    Divider,
    Table,
    ScrollArea,
    Box, Flex
} from '@mantine/core';
import { IconTrophy, IconSword, IconEye, IconCoins, IconClock, IconTarget, IconShield } from '@tabler/icons-react';
import TimelineAnalysisTab from "./tab/TimelineAnalysisTab";

const gameData = {
    // 게임 기본 정보
    gameid: "ESPORTSTMNT01_2675894",
    datacompleteness: "complete",
    url: "https://watch.lolesports.com/vod/lck/2024-summer-playoffs",
    league: "LCK",
    year: 2024,
    split: "Summer",
    playoffs: 1,
    date: "2024-08-25",
    game: 2,
    patch: "14.16",
    gamelength: 2187, // 36분 27초

    // 밴픽 정보
    bans: {
        blue: ["Azir", "Yone", "Graves", "Viego", "Jax"],
        red: ["Gnar", "Aatrox", "Jinx", "Lucian", "Nautilus"]
    },

    // 팀별 플레이어 데이터
    players: [
        // 블루팀 (T1) - TOP Zeus
        {
            participantid: 1, side: "blue", position: "top", playername: "Zeus", playerid: "zeus001",
            teamname: "T1", teamid: "t1", champion: "Renekton", result: 1,
            kills: 4, deaths: 2, assists: 12, teamkills: 24, teamdeaths: 8,
            doublekills: 2, triplekills: 0, quadrakills: 0, pentakills: 0,
            firstblood: 0, firstbloodkill: 0, firstbloodassist: 1, firstbloodvictim: 0,

            // 오브젝트 관련
            firstdragon: 1, dragons: 4, opp_dragons: 1, elementaldrakes: 3, opp_elementaldrakes: 1,
            infernals: 2, mountains: 1, clouds: 0, oceans: 0, chemtechs: 0, hextechs: 0, elders: 1, opp_elders: 0,
            firstherald: 1, heralds: 2, opp_heralds: 0, void_grubs: 6, opp_void_grubs: 0,
            firstbaron: 1, barons: 2, opp_barons: 0,
            firsttower: 1, towers: 9, opp_towers: 2, firstmidtower: 0, firsttoptower: 1, firstbottower: 0,
            firsttothreetowers: 1, turretplates: 4, opp_turretplates: 0,
            inhibitors: 3, opp_inhibitors: 0,

            // 데미지 관련
            damagetochampions: 22340, dpm: 612, damageshare: 21.8,
            damagetakenperminute: 456, damagemitigatedperminute: 234,

            // 시야 관련
            wardsplaced: 18, wpm: 0.49, wardskilled: 8, wcpm: 0.22,
            controlwardsbought: 5, visionscore: 45, vspm: 1.23,

            // 골드 및 CS 관련
            totalgold: 16820, earnedgold: 15650, earnedgoldshare: 19.2,
            goldspent: 16200, totalcs: 278, minionkills: 271, monsterkills: 7,
            monsterkillsownjungle: 3, monsterkillsenemyjungle: 4, cspm: 7.62,

            // 시간대별 지표
            goldat10: 3840, xpat10: 4920, csat10: 96,
            opp_goldat10: 3420, opp_xpat10: 4380, opp_csat10: 88,
            golddiffat10: 420, xpdiffat10: 540, csdiffat10: 8,
            killsat10: 1, assistsat10: 3, deathsat10: 0,
            opp_killsat10: 0, opp_assistsat10: 1, opp_deathsat10: 1,

            goldat15: 6280, xpat15: 8450, csat15: 145,
            opp_goldat15: 5640, opp_xpat15: 7620, opp_csat15: 132,
            golddiffat15: 640, xpdiffat15: 830, csdiffat15: 13,
            killsat15: 2, assistsat15: 5, deathsat15: 1,
            opp_killsat15: 1, opp_assistsat15: 2, opp_deathsat15: 2,

            goldat20: 9720, xpat20: 12850, csat20: 193,
            opp_goldat20: 8450, opp_xpat20: 11290, opp_csat20: 175,
            golddiffat20: 1270, xpdiffat20: 1560, csdiffat20: 18,
            killsat20: 3, assistsat20: 8, deathsat20: 1,
            opp_killsat20: 2, opp_assistsat20: 4, opp_deathsat20: 3,

            goldat25: 13450, xpat25: 17820, csat25: 235,
            opp_goldat25: 11680, opp_xpat25: 15240, opp_csat25: 213,
            golddiffat25: 1770, xpdiffat25: 2580, csdiffat25: 22,
            killsat25: 4, assistsat25: 10, deathsat25: 2,
            opp_killsat25: 3, opp_assistsat25: 6, opp_deathsat25: 4
        },

        // 블루팀 (T1) - JUNGLE Oner
        {
            participantid: 2, side: "blue", position: "jungle", playername: "Oner", playerid: "oner001",
            teamname: "T1", teamid: "t1", champion: "Kindred", result: 1,
            kills: 6, deaths: 1, assists: 14, teamkills: 24, teamdeaths: 8,
            doublekills: 1, triplekills: 1, quadrakills: 0, pentakills: 0,
            firstblood: 1, firstbloodkill: 1, firstbloodassist: 0, firstbloodvictim: 0,

            // 오브젝트는 탑과 동일 (팀 데이터)
            firstdragon: 1, dragons: 4, opp_dragons: 1, elementaldrakes: 3, opp_elementaldrakes: 1,
            infernals: 2, mountains: 1, clouds: 0, oceans: 0, chemtechs: 0, hextechs: 0, elders: 1, opp_elders: 0,
            firstherald: 1, heralds: 2, opp_heralds: 0, void_grubs: 6, opp_void_grubs: 0,
            firstbaron: 1, barons: 2, opp_barons: 0,
            firsttower: 1, towers: 9, opp_towers: 2, turretplates: 4, opp_turretplates: 0,
            inhibitors: 3, opp_inhibitors: 0,

            damagetochampions: 18960, dpm: 520, damageshare: 18.5,
            damagetakenperminute: 398, damagemitigatedperminute: 187,

            wardsplaced: 25, wpm: 0.68, wardskilled: 12, wcpm: 0.33,
            controlwardsbought: 8, visionscore: 68, vspm: 1.86,

            totalgold: 15420, earnedgold: 14280, earnedgoldshare: 17.5,
            goldspent: 14980, totalcs: 186, minionkills: 45, monsterkills: 141,
            monsterkillsownjungle: 128, monsterkillsenemyjungle: 13, cspm: 5.10,

            goldat10: 3240, xpat10: 4280, csat10: 52,
            opp_goldat10: 2890, opp_xpat10: 3840, opp_csat10: 46,
            golddiffat10: 350, xpdiffat10: 440, csdiffat10: 6,
            killsat10: 2, assistsat10: 2, deathsat10: 0,

            goldat15: 5680, xpat15: 7420, csat15: 78,
            golddiffat15: 520, xpdiffat15: 680, csdiffat15: 9,
            killsat15: 3, assistsat15: 5, deathsat15: 0,

            goldat20: 8450, xpat20: 11280, csat20: 105,
            golddiffat20: 780, xpdiffat20: 1020, csdiffat20: 12,
            killsat20: 5, assistsat20: 9, deathsat20: 1,

            goldat25: 12180, xpat25: 15640, csat25: 138,
            golddiffat25: 1140, xpdiffat25: 1480, csdiffat25: 16
        },

        // 블루팀 (T1) - MID Faker
        {
            participantid: 3, side: "blue", position: "mid", playername: "Faker", playerid: "faker001",
            teamname: "T1", teamid: "t1", champion: "Orianna", result: 1,
            kills: 8, deaths: 1, assists: 11, teamkills: 24, teamdeaths: 8,
            doublekills: 2, triplekills: 0, quadrakills: 0, pentakills: 0,
            firstblood: 0, firstbloodkill: 0, firstbloodassist: 0, firstbloodvictim: 0,

            firstdragon: 1, dragons: 4, opp_dragons: 1, elementaldrakes: 3, opp_elementaldrakes: 1,
            infernals: 2, mountains: 1, clouds: 0, oceans: 0, chemtechs: 0, hextechs: 0, elders: 1, opp_elders: 0,
            firstherald: 1, heralds: 2, opp_heralds: 0, void_grubs: 6, opp_void_grubs: 0,
            firstbaron: 1, barons: 2, opp_barons: 0,
            firsttower: 1, towers: 9, opp_towers: 2, turretplates: 4, opp_turretplates: 0,
            inhibitors: 3, opp_inhibitors: 0,

            damagetochampions: 31240, dpm: 856, damageshare: 30.5,
            damagetakenperminute: 287, damagemitigatedperminute: 145,

            wardsplaced: 16, wpm: 0.44, wardskilled: 6, wcpm: 0.16,
            controlwardsbought: 4, visionscore: 38, vspm: 1.04,

            totalgold: 18650, earnedgold: 17420, earnedgoldshare: 21.4,
            goldspent: 18200, totalcs: 324, minionkills: 318, monsterkills: 6,
            monsterkillsownjungle: 2, monsterkillsenemyjungle: 4, cspm: 8.88,

            goldat10: 4120, xpat10: 5180, csat10: 102,
            opp_goldat10: 3680, opp_xpat10: 4620, opp_csat10: 94,
            golddiffat10: 440, xpdiffat10: 560, csdiffat10: 8,
            killsat10: 1, assistsat10: 1, deathsat10: 0,

            goldat15: 7280, xpat15: 9640, csat15: 156,
            golddiffat15: 680, xpdiffat15: 880, csdiffat15: 14,
            killsat15: 3, assistsat15: 3, deathsat15: 0,

            goldat20: 11450, xpat20: 14820, csat20: 208,
            golddiffat20: 1120, xpdiffat20: 1480, csdiffat20: 19,
            killsat20: 6, assistsat20: 7, deathsat20: 1,

            goldat25: 15890, xpat25: 20540, csat25: 268,
            golddiffat25: 1680, xpdiffat25: 2240, csdiffat25: 26
        },

        // 블루팀 (T1) - ADC Gumayusi
        {
            participantid: 4, side: "blue", position: "bot", playername: "Gumayusi", playerid: "gumayusi001",
            teamname: "T1", teamid: "t1", champion: "Kaisa", result: 1,
            kills: 5, deaths: 2, assists: 8, teamkills: 24, teamdeaths: 8,
            doublekills: 1, triplekills: 0, quadrakills: 0, pentakills: 0,
            firstblood: 0, firstbloodkill: 0, firstbloodassist: 0, firstbloodvictim: 0,

            firstdragon: 1, dragons: 4, opp_dragons: 1, elementaldrakes: 3, opp_elementaldrakes: 1,
            infernals: 2, mountains: 1, clouds: 0, oceans: 0, chemtechs: 0, hextechs: 0, elders: 1, opp_elders: 0,
            firstherald: 1, heralds: 2, opp_heralds: 0, void_grubs: 6, opp_void_grubs: 0,
            firstbaron: 1, barons: 2, opp_barons: 0,
            firsttower: 1, towers: 9, opp_towers: 2, turretplates: 4, opp_turretplates: 0,
            inhibitors: 3, opp_inhibitors: 0,

            damagetochampions: 28650, dpm: 785, damageshare: 28.0,
            damagetakenperminute: 312, damagemitigatedperminute: 98,

            wardsplaced: 12, wpm: 0.33, wardskilled: 4, wcpm: 0.11,
            controlwardsbought: 3, visionscore: 28, vspm: 0.77,

            totalgold: 17890, earnedgold: 16620, earnedgoldshare: 20.4,
            goldspent: 17450, totalcs: 315, minionkills: 309, monsterkills: 6,
            monsterkillsownjungle: 1, monsterkillsenemyjungle: 5, cspm: 8.64,

            goldat10: 3920, xpat10: 4680, csat10: 98,
            opp_goldat10: 3540, opp_xpat10: 4280, opp_csat10: 89,
            golddiffat10: 380, xpdiffat10: 400, csdiffat10: 9,
            killsat10: 0, assistsat10: 1, deathsat10: 0,

            goldat15: 6890, xpat15: 8240, csat15: 148,
            golddiffat15: 590, xpdiffat15: 620, csdiffat15: 16,
            killsat15: 2, assistsat15: 3, deathsat15: 1,

            goldat20: 10680, xpat20: 12940, csat20: 198,
            golddiffat20: 980, xpdiffat20: 1180, csdiffat20: 22,
            killsat20: 3, assistsat20: 5, deathsat20: 2,

            goldat25: 14620, xpat25: 17580, csat25: 256,
            golddiffat25: 1420, xpdiffat25: 1840, csdiffat25: 28
        },

        // 블루팀 (T1) - SUPPORT Keria
        {
            participantid: 5, side: "blue", position: "support", playername: "Keria", playerid: "keria001",
            teamname: "T1", teamid: "t1", champion: "Thresh", result: 1,
            kills: 1, deaths: 2, assists: 19, teamkills: 24, teamdeaths: 8,
            doublekills: 0, triplekills: 0, quadrakills: 0, pentakills: 0,
            firstblood: 0, firstbloodkill: 0, firstbloodassist: 0, firstbloodvictim: 0,

            firstdragon: 1, dragons: 4, opp_dragons: 1, elementaldrakes: 3, opp_elementaldrakes: 1,
            infernals: 2, mountains: 1, clouds: 0, oceans: 0, chemtechs: 0, hextechs: 0, elders: 1, opp_elders: 0,
            firstherald: 1, heralds: 2, opp_heralds: 0, void_grubs: 6, opp_void_grubs: 0,
            firstbaron: 1, barons: 2, opp_barons: 0,
            firsttower: 1, towers: 9, opp_towers: 2, turretplates: 4, opp_turretplates: 0,
            inhibitors: 3, opp_inhibitors: 0,

            damagetochampions: 8420, dpm: 231, damageshare: 8.2,
            damagetakenperminute: 234, damagemitigatedperminute: 187,

            wardsplaced: 42, wpm: 1.15, wardskilled: 18, wcpm: 0.49,
            controlwardsbought: 12, visionscore: 89, vspm: 2.44,

            totalgold: 10280, earnedgold: 9140, earnedgoldshare: 11.2,
            goldspent: 9890, totalcs: 54, minionkills: 28, monsterkills: 26,
            monsterkillsownjungle: 8, monsterkillsenemyjungle: 18, cspm: 1.48,

            goldat10: 2450, xpat10: 3280, csat10: 18,
            opp_goldat10: 2180, opp_xpat10: 2940, opp_csat10: 15,
            golddiffat10: 270, xpdiffat10: 340, csdiffat10: 3,
            killsat10: 0, assistsat10: 2, deathsat10: 0,

            goldat15: 3980, xpat15: 5420, csat15: 28,
            golddiffat15: 380, xpdiffat15: 480, csdiffat15: 5,
            killsat15: 0, assistsat15: 6, deathsat15: 1,

            goldat20: 5840, xpat20: 7920, csat20: 38,
            golddiffat20: 540, xpdiffat20: 680, csdiffat20: 7,
            killsat20: 1, assistsat20: 12, deathsat20: 2,

            goldat25: 7890, xpat25: 10680, csat25: 47,
            golddiffat25: 720, xpdiffat25: 920, csdiffat25: 8
        },

        // 레드팀 (GEN) - TOP Kiin
        {
            participantid: 6, side: "red", position: "top", playername: "Kiin", playerid: "kiin001",
            teamname: "GEN", teamid: "gen", champion: "Camille", result: 0,
            kills: 2, deaths: 4, assists: 4, teamkills: 8, teamdeaths: 24,
            doublekills: 0, triplekills: 0, quadrakills: 0, pentakills: 0,
            firstblood: 0, firstbloodkill: 0, firstbloodassist: 0, firstbloodvictim: 1,

            firstdragon: 0, dragons: 1, opp_dragons: 4, elementaldrakes: 1, opp_elementaldrakes: 3,
            infernals: 0, mountains: 1, clouds: 0, oceans: 0, chemtechs: 0, hextechs: 0, elders: 0, opp_elders: 1,
            firstherald: 0, heralds: 0, opp_heralds: 2, void_grubs: 0, opp_void_grubs: 6,
            firstbaron: 0, barons: 0, opp_barons: 2,
            firsttower: 0, towers: 2, opp_towers: 9, turretplates: 0, opp_turretplates: 4,
            inhibitors: 0, opp_inhibitors: 3,

            damagetochampions: 18450, dpm: 506, damageshare: 28.6,
            damagetakenperminute: 612, damagemitigatedperminute: 298,

            wardsplaced: 14, wpm: 0.38, wardskilled: 3, wcpm: 0.08,
            controlwardsbought: 4, visionscore: 32, vspm: 0.88,

            totalgold: 12980, earnedgold: 11840, earnedgoldshare: 21.8,
            goldspent: 12540, totalcs: 246, minionkills: 238, monsterkills: 8,
            monsterkillsownjungle: 4, monsterkillsenemyjungle: 4, cspm: 6.75,

            goldat10: 3420, xpat10: 4380, csat10: 88,
            opp_goldat10: 3840, opp_xpat10: 4920, opp_csat10: 96,
            golddiffat10: -420, xpdiffat10: -540, csdiffat10: -8,
            killsat10: 0, assistsat10: 1, deathsat10: 1,

            goldat15: 5640, xpat15: 7620, csat15: 132,
            golddiffat15: -640, xpdiffat15: -830, csdiffat15: -13,
            killsat15: 1, assistsat15: 2, deathsat15: 2,

            goldat20: 8450, xpat20: 11290, csat20: 175,
            golddiffat20: -1270, xpdiffat20: -1560, csdiffat20: -18,
            killsat20: 2, assistsat20: 4, deathsat20: 3,

            goldat25: 11680, xpat25: 15240, csat25: 213,
            golddiffat25: -1770, xpdiffat25: -2580, csdiffat25: -22
        },

        // 레드팀 (GEN) - JUNGLE Canyon
        {
            participantid: 7, side: "red", position: "jungle", playername: "Canyon", playerid: "canyon001",
            teamname: "GEN", teamid: "gen", champion: "Nidalee", result: 0,
            kills: 3, deaths: 6, assists: 3, teamkills: 8, teamdeaths: 24,
            doublekills: 0, triplekills: 0, quadrakills: 0, pentakills: 0,
            firstblood: 0, firstbloodkill: 0, firstbloodassist: 0, firstbloodvictim: 0,

            firstdragon: 0, dragons: 1, opp_dragons: 4, elementaldrakes: 1, opp_elementaldrakes: 3,
            infernals: 0, mountains: 1, clouds: 0, oceans: 0, chemtechs: 0, hextechs: 0, elders: 0, opp_elders: 1,
            firstherald: 0, heralds: 0, opp_heralds: 2, void_grubs: 0, opp_void_grubs: 6,
            firstbaron: 0, barons: 0, opp_barons: 2,
            firsttower: 0, towers: 2, opp_towers: 9, turretplates: 0, opp_turretplates: 4,
            inhibitors: 0, opp_inhibitors: 3,

            damagetochampions: 15240, dpm: 418, damageshare: 23.6,
            damagetakenperminute: 498, damagemitigatedperminute: 156,

            wardsplaced: 18, wpm: 0.49, wardskilled: 7, wcpm: 0.19,
            controlwardsbought: 6, visionscore: 48, vspm: 1.32,

            totalgold: 11420, earnedgold: 10280, earnedgoldshare: 18.9,
            goldspent: 10980, totalcs: 154, minionkills: 38, monsterkills: 116,
            monsterkillsownjungle: 103, monsterkillsenemyjungle: 13, cspm: 4.22,

            goldat10: 2890, xpat10: 3840, csat10: 46,
            golddiffat10: -350, xpdiffat10: -440, csdiffat10: -6,
            killsat10: 0, assistsat10: 0, deathsat10: 2,

            goldat15: 5160, xpat15: 6740, csat15: 69,
            golddiffat15: -520, xpdiffat15: -680, csdiffat15: -9,
            killsat15: 1, assistsat15: 1, deathsat15: 3,

            goldat20: 7670, xpat20: 10260, csat20: 93,
            golddiffat20: -780, xpdiffat20: -1020, csdiffat20: -12,
            killsat20: 2, assistsat20: 2, deathsat20: 5,

            goldat25: 11040, xpat25: 14160, csat25: 122,
            golddiffat25: -1140, xpdiffat25: -1480, csdiffat25: -16
        },

        // 레드팀 (GEN) - MID Chovy
        {
            participantid: 8, side: "red", position: "mid", playername: "Chovy", playerid: "chovy001",
            teamname: "GEN", teamid: "gen", champion: "Corki", result: 0,
            kills: 2, deaths: 8, assists: 5, teamkills: 8, teamdeaths: 24,
            doublekills: 0, triplekills: 0, quadrakills: 0, pentakills: 0,
            firstblood: 0, firstbloodkill: 0, firstbloodassist: 0, firstbloodvictim: 0,

            firstdragon: 0, dragons: 1, opp_dragons: 4, elementaldrakes: 1, opp_elementaldrakes: 3,
            infernals: 0, mountains: 1, clouds: 0, oceans: 0, chemtechs: 0, hextechs: 0, elders: 0, opp_elders: 1,
            firstherald: 0, heralds: 0, opp_heralds: 2, void_grubs: 0, opp_void_grubs: 6,
            firstbaron: 0, barons: 0, opp_barons: 2,
            firsttower: 0, towers: 2, opp_towers: 9, turretplates: 0, opp_turretplates: 4,
            inhibitors: 0, opp_inhibitors: 3,

            damagetochampions: 24680, dpm: 677, damageshare: 38.3,
            damagetakenperminute: 398, damagemitigatedperminute: 187,

            wardsplaced: 11, wpm: 0.30, wardskilled: 2, wcpm: 0.05,
            controlwardsbought: 3, visionscore: 26, vspm: 0.71,

            totalgold: 15240, earnedgoldshare: 28.1, earnedgold: 14080,
            goldspent: 14780, totalcs: 298, minionkills: 292, monsterkills: 6,
            monsterkillsownjungle: 2, monsterkillsenemyjungle: 4, cspm: 8.17,

            goldat10: 3680, xpat10: 4620, csat10: 94,
            golddiffat10: -440, xpdiffat10: -560, csdiffat10: -8,
            killsat10: 0, assistsat10: 0, deathsat10: 1,

            goldat15: 6600, xpat15: 8760, csat15: 142,
            golddiffat15: -680, xpdiffat15: -880, csdiffat15: -14,
            killsat15: 1, assistsat15: 2, deathsat15: 3,

            goldat20: 10330, xpat20: 13340, csat20: 189,
            golddiffat20: -1120, xpdiffat20: -1480, csdiffat20: -19,
            killsat20: 2, assistsat20: 4, deathsat20: 6,

            goldat25: 14210, xpat25: 18300, csat25: 242,
            golddiffat25: -1680, xpdiffat25: -2240, csdiffat25: -26
        },

        // 레드팀 (GEN) - ADC Peyz
        {
            participantid: 9, side: "red", position: "bot", playername: "Peyz", playerid: "peyz001",
            teamname: "GEN", teamid: "gen", champion: "Ashe", result: 0,
            kills: 1, deaths: 5, assists: 6, teamkills: 8, teamdeaths: 24,
            doublekills: 0, triplekills: 0, quadrakills: 0, pentakills: 0,
            firstblood: 0, firstbloodkill: 0, firstbloodassist: 0, firstbloodvictim: 0,

            firstdragon: 0, dragons: 1, opp_dragons: 4, elementaldrakes: 1, opp_elementaldrakes: 3,
            infernals: 0, mountains: 1, clouds: 0, oceans: 0, chemtechs: 0, hextechs: 0, elders: 0, opp_elders: 1,
            firstherald: 0, heralds: 0, opp_heralds: 2, void_grubs: 0, opp_void_grubs: 6,
            firstbaron: 0, barons: 0, opp_barons: 2,
            firsttower: 0, towers: 2, opp_towers: 9, turretplates: 0, opp_turretplates: 4,
            inhibitors: 0, opp_inhibitors: 3,

            damagetochampions: 19850, dpm: 544, damageshare: 30.8,
            damagetakenperminute: 387, damagemitigatedperminute: 124,

            wardsplaced: 8, wpm: 0.22, wardskilled: 1, wcpm: 0.03,
            controlwardsbought: 2, visionscore: 19, vspm: 0.52,

            totalgold: 13920, earnedgold: 12680, earnedgoldshare: 23.4,
            goldspent: 13480, totalcs: 287, minionkills: 281, monsterkills: 6,
            monsterkillsownjungle: 1, monsterkillsenemyjungle: 5, cspm: 7.87,

            goldat10: 3540, xpat10: 4280, csat10: 89,
            golddiffat10: -380, xpdiffat10: -400, csdiffat10: -9,
            killsat10: 0, assistsat10: 0, deathsat10: 0,

            goldat15: 6300, xpat15: 7620, csat15: 132,
            golddiffat15: -590, xpdiffat15: -620, csdiffat15: -16,
            killsat15: 0, assistsat15: 1, deathsat15: 2,

            goldat20: 9700, xpat20: 11760, csat20: 176,
            golddiffat20: -980, xpdiffat20: -1180, csdiffat20: -22,
            killsat20: 1, assistsat20: 3, deathsat20: 3,

            goldat25: 13200, xpat25: 15740, csat25: 228,
            golddiffat25: -1420, xpdiffat25: -1840, csdiffat25: -28
        },

        // 레드팀 (GEN) - SUPPORT Lehends
        {
            participantid: 10, side: "red", position: "support", playername: "Lehends", playerid: "lehends001",
            teamname: "GEN", teamid: "gen", champion: "Braum", result: 0,
            kills: 0, deaths: 1, assists: 7, teamkills: 8, teamdeaths: 24,
            doublekills: 0, triplekills: 0, quadrakills: 0, pentakills: 0,
            firstblood: 0, firstbloodkill: 0, firstbloodassist: 0, firstbloodvictim: 0,

            firstdragon: 0, dragons: 1, opp_dragons: 4, elementaldrakes: 1, opp_elementaldrakes: 3,
            infernals: 0, mountains: 1, clouds: 0, oceans: 0, chemtechs: 0, hextechs: 0, elders: 0, opp_elders: 1,
            firstherald: 0, heralds: 0, opp_heralds: 2, void_grubs: 0, opp_void_grubs: 6,
            firstbaron: 0, barons: 0, opp_barons: 2,
            firsttower: 0, towers: 2, opp_towers: 9, turretplates: 0, opp_turretplates: 4,
            inhibitors: 0, opp_inhibitors: 3,

            damagetochampions: 6420, dpm: 176, damageshare: 10.0,
            damagetakenperminute: 298, damagemitigatedperminute: 234,

            wardsplaced: 28, wpm: 0.77, wardskilled: 8, wcpm: 0.22,
            controlwardsbought: 7, visionscore: 52, vspm: 1.43,

            totalgold: 8450, earnedgold: 7280, earnedgoldshare: 13.4,
            goldspent: 8120, totalcs: 39, minionkills: 18, monsterkills: 21,
            monsterkillsownjungle: 6, monsterkillsenemyjungle: 15, cspm: 1.07,

            goldat10: 2180, xpat10: 2940, csat10: 15,
            golddiffat10: -270, xpdiffat10: -340, csdiffat10: -3,
            killsat10: 0, assistsat10: 0, deathsat10: 0,

            goldat15: 3600, xpat15: 4940, csat15: 23,
            golddiffat15: -380, xpdiffat15: -480, csdiffat15: -5,
            killsat15: 0, assistsat15: 2, deathsat15: 0,

            goldat20: 5300, xpat20: 7240, csat20: 31,
            golddiffat20: -540, xpdiffat20: -680, csdiffat20: -7,
            killsat20: 0, assistsat20: 5, deathsat20: 1,

            goldat25: 7170, xpat25: 9760, csat25: 39,
            golddiffat25: -720, xpdiffat25: -920, csdiffat25: -8
        }
    ]
};


const getChampionImageUrl = (championName) => {
    return `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${championName}.png`;
};

// 시간 포맷팅
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// 밴 챔피언 컴포넌트 (대각선 포함)
const BannedChampion = ({ championName, size = 32 }) => (
    <Box style={{ position: 'relative', display: 'inline-block' }}>
        <Avatar
            src={getChampionImageUrl(championName)}
            size={size}
            radius="sm"
        />
        {/* 얇고 짧은 대각선 흰색 줄 */}
        <Box
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${size * 0.7}px`, // 더 짧게
                height: '1px', // 더 얇게
                backgroundColor: 'white',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                zIndex: 1,
                boxShadow: '0 0 1px rgba(0,0,0,0.5)'
            }}
        />
    </Box>
);

const GameRecordPage = () => {
    const { gameId } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    // 팀별 데이터 분리
    const blueTeamPlayers = gameData.players.filter(p => p.side === 'blue');
    const redTeamPlayers = gameData.players.filter(p => p.side === 'red');

    const blueTeamName = blueTeamPlayers[0]?.teamname || 'Blue Team';
    const redTeamName = redTeamPlayers[0]?.teamname || 'Red Team';

    const blueTeamResult = blueTeamPlayers[0]?.result === 1;
    const redTeamResult = redTeamPlayers[0]?.result === 0 && !blueTeamResult;

    return (
        <Container size="xl" px={{ base: 12, sm: 24, md: 32 }}>
            <Stack gap="lg" mt="md">
                {/* 모던한 헤더 디자인 - 통일된 스타일 */}
                <Paper
                    p={{ base: "lg", md: "xl" }}
                    withBorder
                    bg="white"
                    radius="md" // 기존 서비스와 통일된 radius
                    style={{
                        border: '1px solid #dee2e6', // 기존 서비스와 통일된 border 색상
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' // 미묘한 그림자
                    }}
                >
                    <Stack gap="xl">
                        {/* 미니멀한 게임 정보 */}
                        <Group justify="space-between" align="center" wrap="wrap">
                            <Group gap="lg" wrap="wrap">
                                <Text size="xl" fw={700} c="dark">
                                    {gameData.league}
                                </Text>
                                <Group gap="sm">
                                    <Text size="md" c="gray.6">
                                        {gameData.playoffs ? "플레이오프" : "정규시즌"}
                                    </Text>
                                    <Text size="sm" c="gray.5">•</Text>
                                    <Text size="md" c="gray.6">
                                        {gameData.split}
                                    </Text>
                                </Group>
                            </Group>
                            <Group gap="md" wrap="wrap">
                                <Text size="sm" c="gray.6">{gameData.date}</Text>
                                <Text size="sm" c="gray.5">•</Text>
                                <Text size="sm" c="gray.6">Game {gameData.game}</Text>
                                <Text size="sm" c="gray.5">•</Text>
                                <Text size="sm" c="gray.6">{gameData.patch}</Text>
                                <Text size="sm" c="gray.5">•</Text>
                                <Text size="sm" c="gray.6">{formatTime(gameData.gamelength)}</Text>
                            </Group>
                        </Group>

                        {/* 세련된 구분선 */}
                        <Divider size="sm" color="gray.3" />

                        {/* 클린한 팀 대결 및 밴픽 */}
                        <Stack gap="xl">
                            {/* 데스크톱 버전 */}
                            <Group justify="center" gap={80} visibleFrom="md">
                                {/* 블루팀 */}
                                <Stack align="center" gap="lg" style={{ minWidth: '320px' }}>
                                    <Group gap="sm" align="center">
                                        <Text size="2rem" fw={800} c="blue.7">
                                            {blueTeamName}
                                        </Text>
                                        {blueTeamResult && (
                                            <Text size="xl" fw={700} c="black">
                                                (승)
                                            </Text>
                                        )}
                                    </Group>

                                    {/* 픽 - 통일된 스타일 */}
                                    <Flex gap="md" wrap="nowrap" justify="center">
                                        {blueTeamPlayers.map((player, idx) => (
                                            <Stack key={idx} align="center" gap="xs">
                                                <Avatar
                                                    src={getChampionImageUrl(player.champion)}
                                                    size={64}
                                                    radius="sm" // 통일된 radius
                                                    style={{
                                                        border: '2px solid #339af0',
                                                        boxShadow: '0 2px 8px rgba(51, 154, 240, 0.15)'
                                                    }}
                                                />
                                                <Text
                                                    size="xs"
                                                    ta="center"
                                                    c="gray.7"
                                                    fw={500}
                                                    style={{
                                                        width: '64px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {player.playername}
                                                </Text>
                                            </Stack>
                                        ))}
                                    </Flex>

                                    {/* 밴 - 작고 깔끔하게 */}
                                    <Flex gap="xs" wrap="nowrap" justify="center" mt="sm">
                                        {gameData.bans.blue.map((champion, idx) => (
                                            <BannedChampion
                                                key={idx}
                                                championName={champion}
                                                size={36}
                                            />
                                        ))}
                                    </Flex>
                                </Stack>

                                <Center>
                                    <Box
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '8px', // 기존 서비스와 통일된 radius
                                            backgroundColor: '#f8f9fa',
                                            border: '1px solid #dee2e6', // 통일된 border
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text size="lg" fw={700} c="gray.6">VS</Text>
                                    </Box>
                                </Center>

                                {/* 레드팀 */}
                                <Stack align="center" gap="lg" style={{ minWidth: '320px' }}>
                                    <Group gap="sm" align="center">
                                        <Text size="2rem" fw={800} c="red.7">
                                            {redTeamName}
                                        </Text>
                                        {redTeamResult && (
                                            <Text size="xl" fw={700} c="black">
                                                (승)
                                            </Text>
                                        )}
                                    </Group>

                                    {/* 픽 */}
                                    <Flex gap="md" wrap="nowrap" justify="center">
                                        {redTeamPlayers.map((player, idx) => (
                                            <Stack key={idx} align="center" gap="xs">
                                                <Avatar
                                                    src={getChampionImageUrl(player.champion)}
                                                    size={64}
                                                    radius="sm" // 통일된 radius
                                                    style={{
                                                        border: '2px solid #fa5252',
                                                        boxShadow: '0 2px 8px rgba(250, 82, 82, 0.15)'
                                                    }}
                                                />
                                                <Text
                                                    size="xs"
                                                    ta="center"
                                                    c="gray.7"
                                                    fw={500}
                                                    style={{
                                                        width: '64px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {player.playername}
                                                </Text>
                                            </Stack>
                                        ))}
                                    </Flex>

                                    {/* 밴 */}
                                    <Flex gap="xs" wrap="nowrap" justify="center" mt="sm">
                                        {gameData.bans.red.map((champion, idx) => (
                                            <BannedChampion
                                                key={idx}
                                                championName={champion}
                                                size={36}
                                            />
                                        ))}
                                    </Flex>
                                </Stack>
                            </Group>

                            {/* 태블릿 버전 */}
                            <Group justify="center" gap="xl" visibleFrom="sm" hiddenFrom="md">
                                {/* 블루팀 */}
                                <Stack align="center" gap="md" style={{ minWidth: '280px' }}>
                                    <Group gap="xs" align="center">
                                        <Text size="xl" fw={700} c="blue.7">
                                            {blueTeamName}
                                        </Text>
                                        {blueTeamResult && (
                                            <Text size="lg" fw={700} c="black">
                                                (승)
                                            </Text>
                                        )}
                                    </Group>


                                    {/* 픽 */}
                                    <Flex gap="sm" wrap="nowrap" justify="center">
                                        {blueTeamPlayers.map((player, idx) => (
                                            <Stack key={idx} align="center" gap="xs">
                                                <Avatar
                                                    src={getChampionImageUrl(player.champion)}
                                                    size={50}
                                                    radius="sm" // 통일된 radius
                                                    style={{
                                                        border: '2px solid #339af0',
                                                        boxShadow: '0 2px 8px rgba(51, 154, 240, 0.15)'
                                                    }}
                                                />
                                                <Text size="xs" ta="center" c="gray.7" fw={500} style={{
                                                    width: '50px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {player.playername}
                                                </Text>
                                            </Stack>
                                        ))}
                                    </Flex>

                                    {/* 밴 */}
                                    <Flex gap="xs" wrap="nowrap" justify="center">
                                        {gameData.bans.blue.map((champion, idx) => (
                                            <BannedChampion
                                                key={idx}
                                                championName={champion}
                                                size={32}
                                            />
                                        ))}
                                    </Flex>
                                </Stack>

                                <Center>
                                    <Box
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '6px', // 통일된 radius
                                            backgroundColor: '#f8f9fa',
                                            border: '1px solid #dee2e6', // 통일된 border
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text size="md" fw={600} c="gray.6">VS</Text>
                                    </Box>
                                </Center>

                                {/* 레드팀 - 태블릿 버전 */}
                                <Stack align="center" gap="md" style={{ minWidth: '280px' }}>
                                    <Group gap="xs" align="center">
                                        <Text size="xl" fw={700} c="red.7">
                                            {redTeamName}
                                        </Text>
                                        {redTeamResult && (
                                            <Text size="lg" fw={700} c="black">
                                                (승)
                                            </Text>
                                        )}
                                    </Group>

                                    <Flex gap="sm" wrap="nowrap" justify="center">
                                        {redTeamPlayers.map((player, idx) => (
                                            <Stack key={idx} align="center" gap="xs">
                                                <Avatar
                                                    src={getChampionImageUrl(player.champion)}
                                                    size={50}
                                                    radius="sm" // 통일된 radius
                                                    style={{
                                                        border: '2px solid #fa5252',
                                                        boxShadow: '0 2px 8px rgba(250, 82, 82, 0.15)'
                                                    }}
                                                />
                                                <Text size="xs" ta="center" c="gray.7" fw={500} style={{
                                                    width: '50px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {player.playername}
                                                </Text>
                                            </Stack>
                                        ))}
                                    </Flex>

                                    <Flex gap="xs" wrap="nowrap" justify="center">
                                        {gameData.bans.red.map((champion, idx) => (
                                            <BannedChampion
                                                key={idx}
                                                championName={champion}
                                                size={32}
                                            />
                                        ))}
                                    </Flex>
                                </Stack>
                            </Group>

                            {/* 모바일 버전 */}
                            <Stack gap="xl" hiddenFrom="sm">
                                {/* 블루팀 */}
                                <Stack align="center" gap="md">
                                    <Group gap="xs" align="center">
                                        <Text size="lg" fw={700} c="blue.7">
                                            {blueTeamName}
                                        </Text>
                                        {blueTeamResult && (
                                            <Text size="md" fw={700} c="black">
                                                (승)
                                            </Text>
                                        )}
                                    </Group>

                                    <Flex justify="center" gap="xs" wrap="nowrap">
                                        {blueTeamPlayers.map((player, idx) => (
                                            <Stack key={idx} align="center" gap="xs">
                                                <Avatar
                                                    src={getChampionImageUrl(player.champion)}
                                                    size={44}
                                                    radius="sm" // 통일된 radius
                                                    style={{
                                                        border: '2px solid #339af0'
                                                    }}
                                                />
                                                <Text size="xs" ta="center" c="gray.7" fw={500} style={{
                                                    width: '44px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {player.playername}
                                                </Text>
                                            </Stack>
                                        ))}
                                    </Flex>

                                    <Flex gap="xs" wrap="nowrap" justify="center">
                                        {gameData.bans.blue.map((champion, idx) => (
                                            <BannedChampion
                                                key={idx}
                                                championName={champion}
                                                size={28}
                                            />
                                        ))}
                                    </Flex>
                                </Stack>

                                <Center>
                                    <Box
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '4px', // 통일된 radius
                                            backgroundColor: '#f8f9fa',
                                            border: '1px solid #dee2e6', // 통일된 border
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text size="sm" fw={600} c="gray.6">VS</Text>
                                    </Box>
                                </Center>

                                {/* 레드팀 - 모바일 */}
                                <Stack align="center" gap="md">
                                    <Group gap="xs" align="center">
                                        <Text size="lg" fw={700} c="red.7">
                                            {redTeamName}
                                        </Text>
                                        {redTeamResult && (
                                            <Text size="md" fw={700} c="black">
                                                (승)
                                            </Text>
                                        )}
                                    </Group>

                                    <Flex justify="center" gap="xs" wrap="nowrap">
                                        {redTeamPlayers.map((player, idx) => (
                                            <Stack key={idx} align="center" gap="xs">
                                                <Avatar
                                                    src={getChampionImageUrl(player.champion)}
                                                    size={44}
                                                    radius="sm" // 통일된 radius
                                                    style={{
                                                        border: '2px solid #fa5252'
                                                    }}
                                                />
                                                <Text size="xs" ta="center" c="gray.7" fw={500} style={{
                                                    width: '44px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {player.playername}
                                                </Text>
                                            </Stack>
                                        ))}
                                    </Flex>

                                    <Flex gap="xs" wrap="nowrap" justify="center">
                                        {gameData.bans.red.map((champion, idx) => (
                                            <BannedChampion
                                                key={idx}
                                                championName={champion}
                                                size={28}
                                            />
                                        ))}
                                    </Flex>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>

                {/* 나머지 탭들도 통일된 스타일 적용 */}
                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List style={{ borderBottom: '1px solid #dee2e6' }}>
                        <Tabs.Tab value="overview" style={{ fontWeight: 600 }}>경기 개요</Tabs.Tab>
                        <Tabs.Tab value="players" style={{ fontWeight: 600 }}>선수 기록</Tabs.Tab>
                        <Tabs.Tab value="objectives" style={{ fontWeight: 600 }}>오브젝트</Tabs.Tab>
                        <Tabs.Tab value="timeline" style={{ fontWeight: 600 }}>타임라인 분석</Tabs.Tab>
                    </Tabs.List>

                    {/* 경기 개요 탭 - 통일된 스타일 */}
                    {/* 경기 개요 탭 - OP.GG 스타일로 개선 */}
                    {/* 경기 개요 탭 - 네이버 스포츠 스타일 */}
                    {/* 경기 개요 탭 - 간소화된 네이버 스포츠 스타일 */}
                    {/* 경기 개요 탭 - 사진2 스타일 */}
                    <Tabs.Panel value="overview">
                        <Stack gap="lg" mt="lg">
                            {/* 팀명 VS */}
                            <Group justify="center" mb="lg" gap="md">
                                <Text fw={700} c="black" size="xl">{blueTeamName}</Text>
                                <Text fw={700} c="black" size="xl">VS</Text>
                                <Text fw={700} c="black" size="xl">{redTeamName}</Text>
                            </Group>

                            {/* 팀 스탯 비교 */}
                            <Paper p="lg" withBorder radius="md">
                                <Title order={3} mb="lg" ta="center">팀 스탯 비교</Title>
                                <Stack gap="xl">
                                    {[
                                        { key: 'teamkills', label: '킬', dataSource: 'first' },
                                        { key: 'totalgold', label: '총 골드', format: v => `${Math.round(v/1000)}K`, dataSource: 'sum' },
                                        { key: 'damagetochampions', label: '챔피언 데미지', format: v => `${Math.round(v/1000)}K`, dataSource: 'sum' },
                                        { key: 'totalcs', label: '총 CS', dataSource: 'sum' },
                                        { key: 'visionscore', label: '시야 점수', dataSource: 'sum' },
                                    ].map(({key, label, format, dataSource}) => {
                                        const b = dataSource === 'first'
                                            ? (blueTeamPlayers[0]?.[key] || 0)
                                            : blueTeamPlayers.reduce((s,p) => s + (p[key] || 0), 0);
                                        const r = dataSource === 'first'
                                            ? (redTeamPlayers[0]?.[key] || 0)
                                            : redTeamPlayers.reduce((s,p) => s + (p[key] || 0), 0);
                                        const total = b + r || 1;

                                        return (
                                            <Group align="center" justify="center" wrap="nowrap" key={key}>
                                                {/* 왼쪽 숫자 */}
                                                <Text c="black" fw={700} size="lg">{ format ? format(b) : b }</Text>

                                                {/* 왼쪽 막대 */}
                                                <Box mx="xs" style={{flex:1}}>
                                                    <Progress
                                                        value={(b/total)*100}
                                                        size="sm" radius="xs"
                                                        color="#0093FF" bg="#F1F3F5"
                                                        style={{transform:'scaleX(-1)','& .mantine-Progress-bar':{transform:'scaleX(-1)'}}}
                                                    />
                                                </Box>

                                                {/* 가운데 제목 */}
                                                <Text c="black" fw={600} size="sm" maw="80px">{label}</Text>

                                                {/* 오른쪽 막대 */}
                                                <Box mx="xs" style={{flex:1}}>
                                                    <Progress
                                                        value={(r/total)*100}
                                                        size="sm" radius="xs"
                                                        color="#FF5353" bg="#F1F3F5"
                                                    />
                                                </Box>

                                                {/* 오른쪽 숫자 */}
                                                <Text c="black" fw={700} size="lg">{ format ? format(r) : r }</Text>
                                            </Group>
                                        );
                                    })}
                                </Stack>
                            </Paper>

                            {/* 오브젝트 현황 */}
                            <Paper p="lg" withBorder radius="md">
                                <Title order={3} mb="lg" ta="center">오브젝트 현황</Title>
                                <Stack gap="xl">
                                    {[
                                        { key: 'dragons', oppKey: 'opp_dragons', label: '드래곤', firstKey: 'firstdragon' },
                                        { key: 'barons', oppKey: 'opp_barons', label: '바론', firstKey: 'firstbaron' },
                                        { key: 'heralds', oppKey: 'opp_heralds', label: '전령', firstKey: 'firstherald' },
                                        { key: 'towers', oppKey: 'opp_towers', label: '타워', firstKey: 'firsttower' },
                                        { key: 'elders', oppKey: 'opp_elders', label: '아타칸' },
                                        { key: 'void_grubs', oppKey: 'opp_void_grubs', label: '공허 유충' },
                                        { key: 'inhibitors', oppKey: 'opp_inhibitors', label: '억제기' },
                                    ].map(({key, oppKey, label, firstKey}) => {
                                        const b = blueTeamPlayers[0]?.[key] || 0;
                                        const r = blueTeamPlayers[0]?.[oppKey] || 0;
                                        const total = b + r || 1;

                                        return (
                                            <Box key={key}>
                                                <Group align="center" justify="center" wrap="nowrap">
                                                    {/* 왼쪽 숫자 */}
                                                    <Text c="black" fw={700} size="lg">{b}</Text>

                                                    {/* 왼쪽 막대 */}
                                                    <Box mx="xs" style={{flex:1}}>
                                                        <Progress
                                                            value={(b/total)*100}
                                                            size="sm" radius="xs"
                                                            color="#0093FF" bg="#F1F3F5"
                                                            style={{transform:'scaleX(-1)','& .mantine-Progress-bar':{transform:'scaleX(-1)'}}}
                                                        />
                                                    </Box>

                                                    {/* 가운데 제목 */}
                                                    <Text c="black" fw={600} size="sm" maw="80px">{label}</Text>

                                                    {/* 오른쪽 막대 */}
                                                    <Box mx="xs" style={{flex:1}}>
                                                        <Progress
                                                            value={(r/total)*100}
                                                            size="sm" radius="xs"
                                                            color="#FF5353" bg="#F1F3F5"
                                                        />
                                                    </Box>

                                                    {/* 오른쪽 숫자 */}
                                                    <Text c="black" fw={700} size="lg">{r}</Text>
                                                </Group>

                                                {/* 첫 오브젝트 배지 */}
                                                {firstKey && (
                                                    <Group justify="center" mt="xs">
                                                        {blueTeamPlayers[0]?.[firstKey] === 1 && (
                                                            <Badge size="xs" color="blue" radius="sm">첫 {label}</Badge>
                                                        )}
                                                        {blueTeamPlayers[0]?.[firstKey] === 0 && (
                                                            <Badge size="xs" color="red" radius="sm">첫 {label}</Badge>
                                                        )}
                                                    </Group>
                                                )}
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Paper>
                        </Stack>
                    </Tabs.Panel>




                    <Tabs.Panel value="players">
                        <Stack gap="lg" mt="lg">
                            {[
                                { name: blueTeamName, players: blueTeamPlayers, color: 'blue' },
                                { name: redTeamName, players: redTeamPlayers, color: 'red' }
                            ].map((team, teamIdx) => (
                                <Paper key={teamIdx} p="lg" withBorder radius="md" style={{ border: '1px solid #dee2e6' }}>
                                    <Group mb="md">
                                        <Text size="lg" fw={700} c={team.color}>
                                            {team.name}
                                        </Text>
                                        {team.players[0]?.result === 1 && (
                                            <Badge color={team.color} radius="sm">승리</Badge>
                                        )}
                                    </Group>

                                    <ScrollArea>
                                        <Table striped highlightOnHover>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>선수</Table.Th>
                                                    <Table.Th>K/D/A</Table.Th>
                                                    <Table.Th>CS</Table.Th>
                                                    <Table.Th>골드</Table.Th>
                                                    <Table.Th>데미지</Table.Th>
                                                    <Table.Th>DPM</Table.Th>
                                                    <Table.Th>시야점수</Table.Th>
                                                    <Table.Th>KP</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {team.players.map((player, idx) => (
                                                    <Table.Tr key={idx}>
                                                        <Table.Td>
                                                            <Group gap="xs">
                                                                <Stack gap={2} align="center">
                                                                    <Avatar
                                                                        src={getChampionImageUrl(player.champion)}
                                                                        size={32}
                                                                        radius="sm" // 통일된 radius
                                                                    />
                                                                    <Badge size="xs" color="gray" radius="sm">{player.position}</Badge>
                                                                </Stack>
                                                                <div>
                                                                    <Text size="sm" fw={600}>{player.playername}</Text>
                                                                    <Text size="xs" c="dimmed">{player.champion}</Text>
                                                                </div>
                                                            </Group>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            <Text size="sm" fw={600}>
                                                                {player.kills}/{player.deaths}/{player.assists}
                                                            </Text>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            <Text size="sm">{player.totalcs}</Text>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            <Text size="sm">{(player.totalgold / 1000).toFixed(1)}K</Text>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            <Text size="sm">{(player.damagetochampions / 1000).toFixed(1)}K</Text>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            <Text size="sm">{player.dpm}</Text>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            <Text size="sm">{player.visionscore}</Text>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            <Text size="sm">
                                                                {Math.round(((player.kills + player.assists) / player.teamkills) * 100)}%
                                                            </Text>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    </ScrollArea>
                                </Paper>
                            ))}
                        </Stack>
                    </Tabs.Panel>

                    {/* 오브젝트 탭 - 통일된 스타일 */}
                    <Tabs.Panel value="objectives">
                        <Stack gap="lg" mt="lg">
                            <Paper p="lg" withBorder radius="md" style={{ border: '1px solid #dee2e6' }}>
                                <Title order={3} mb="md" size={{ base: 'h4', sm: 'h3' }}>드래곤 상세 분석</Title>
                                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                                    <Stack>
                                        <Text fw={600}>원소 드래곤</Text>
                                        <Group gap="md">
                                            <Stack gap="xs" flex={1}>
                                                <Group justify="space-between">
                                                    <Text size="sm">화염 드래곤</Text>
                                                    <Text size="sm">{blueTeamPlayers[0]?.infernals || 0}</Text>
                                                </Group>
                                                <Group justify="space-between">
                                                    <Text size="sm">산악 드래곤</Text>
                                                    <Text size="sm">{blueTeamPlayers[0]?.mountains || 0}</Text>
                                                </Group>
                                                <Group justify="space-between">
                                                    <Text size="sm">구름 드래곤</Text>
                                                    <Text size="sm">{blueTeamPlayers[0]?.clouds || 0}</Text>
                                                </Group>
                                                <Group justify="space-between">
                                                    <Text size="sm">대양 드래곤</Text>
                                                    <Text size="sm">{blueTeamPlayers[0]?.oceans || 0}</Text>
                                                </Group>
                                            </Stack>
                                        </Group>
                                    </Stack>

                                    <Stack>
                                        <Text fw={600}>기타 오브젝트</Text>
                                        <Group justify="space-between">
                                            <Text size="sm">공허 유충</Text>
                                            <Text size="sm">{blueTeamPlayers[0]?.void_grubs || 0} : {blueTeamPlayers[0]?.opp_void_grubs || 0}</Text>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text size="sm">타워 플레이트</Text>
                                            <Text size="sm">{blueTeamPlayers[0]?.turretplates || 0} : {blueTeamPlayers[0]?.opp_turretplates || 0}</Text>
                                        </Group>
                                    </Stack>
                                </SimpleGrid>
                            </Paper>
                        </Stack>
                    </Tabs.Panel>

                    {/* 타임라인 분석 탭 */}
                    <Tabs.Panel value="timeline">
                        <TimelineAnalysisTab gameData={gameData} />
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </Container>
    );
};

export default GameRecordPage;
