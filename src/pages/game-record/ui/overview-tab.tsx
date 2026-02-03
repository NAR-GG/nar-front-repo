"use client";

import { Stack, Paper, Title, Divider } from "@mantine/core";
import { TeamStatsTab } from "./team-stats-tab";
import { ObjectivesTab } from "./objectives-tab";

interface TeamStats {
  kills: number;
  totalGold: number;
  totalDamage: number;
  visionScore: number;
  dragons: number;
  barons: number;
  heralds: number;
  towers: number;
  inhibitors: number;
  voidGrubs: number;
  firstDragon: boolean;
  firstBaron: boolean;
  firstHerald: boolean;
  firstTower: boolean;
  infernals: number;
  mountains: number;
  clouds: number;
  oceans: number;
  chemtechs: number;
  hextechs: number;
  elders: number;
  oppElders: number;
  oppTurretPlates: number;
}

interface TeamData {
  name: string;
  stats: TeamStats;
}

interface OverviewTabProps {
  blueTeam: TeamData;
  redTeam: TeamData;
}

const ICON_BASE_PATH = "/shared/assets/icons/";

export function OverviewTab({ blueTeam, redTeam }: OverviewTabProps) {
  if (!blueTeam?.stats || !redTeam?.stats) return null;

  return (
    <div className="bg-[var(--nar-bg-secondary)] w-full flex flex-col items-center justify-center">
      <div className="bg-[var(--nar-bg-secondary)] w-full sm:w-[719px] flex flex-col items-center justify-center">
        <TeamStatsTab blueTeam={blueTeam} redTeam={redTeam} />
        <ObjectivesTab blueTeam={blueTeam} redTeam={redTeam} />
      </div>
    </div>
  );
}
