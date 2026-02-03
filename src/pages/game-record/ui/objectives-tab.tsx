import React from "react";
import { Text } from "@mantine/core";
import NarDargon from "@/shared/assets/icons/nar_icon_dragon.svg";
import NarElder from "@/shared/assets/icons/nar_icon_elder.svg";
import NarBaron from "@/shared/assets/icons/nar_icon_baron.svg";
import NarHerald from "@/shared/assets/icons/nar_icon_herald.svg";
import NarVoidGrub from "@/shared/assets/icons/nar_icon_voidgrub.svg";
import NarTower from "@/shared/assets/icons/nar_icon_tower.svg";
import NarInhib from "@/shared/assets/icons/nar_icon_inhib.svg";
import NarTurretPlat from "@/shared/assets/icons/nar_icon_turret_plating.svg";
import WindDragon from "@/shared/assets/icons/wind_dragon.svg";
import OceanDragon from "@/shared/assets/icons/ocean_dragon.svg";
import HextechDragon from "@/shared/assets/icons/hextech_dragon.svg";
import ChemtechDragon from "@/shared/assets/icons/chemtech_dragon.svg";
import InfernalDragon from "@/shared/assets/icons/infernal_dragon.svg";
import MountainDragon from "@/shared/assets/icons/mountain_dragon.svg";
import ElderDragon from "@/shared/assets/icons/nar_icon_elder.svg";

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

interface ObjectivesTabProps {
  blueTeam: TeamData;
  redTeam: TeamData;
}

function renderDragonIcons(stats: TeamStats) {
  const dragons: React.JSX.Element[] = [];

  for (let i = 0; i < stats.infernals; i++) {
    dragons.push(
      <InfernalDragon key={`infernal-${i}`} width={24} height={24} />,
    );
  }
  for (let i = 0; i < stats.mountains; i++) {
    dragons.push(
      <MountainDragon key={`mountain-${i}`} width={24} height={24} />,
    );
  }
  for (let i = 0; i < stats.clouds; i++) {
    dragons.push(<WindDragon key={`cloud-${i}`} width={24} height={24} />);
  }
  for (let i = 0; i < stats.oceans; i++) {
    dragons.push(<OceanDragon key={`ocean-${i}`} width={24} height={24} />);
  }
  for (let i = 0; i < stats.chemtechs; i++) {
    dragons.push(
      <ChemtechDragon key={`chemtech-${i}`} width={24} height={24} />,
    );
  }
  for (let i = 0; i < stats.hextechs; i++) {
    dragons.push(<HextechDragon key={`hextech-${i}`} width={24} height={24} />);
  }
  for (let i = 0; i < stats.elders; i++) {
    dragons.push(<ElderDragon key={`elder-${i}`} width={24} height={24} />);
  }

// 드래곤이 없으면 빈 div 반환
  if (dragons.length === 0) {
    return [<div key="empty" style={{ width: 24, height: 24 }} />];
  }

  return dragons;
}

export function ObjectivesTab({ blueTeam, redTeam }: ObjectivesTabProps) {
  return (
    <div className="px-4 py-3 flex flex-col w-full gap-[30px]">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[var(--nar-line)]" />
        <Text
          c="var(--nar-text-tertiary-sub)"
          fz={14}
          fw={400}
          className="whitespace-nowrap"
        >
          주요 오브젝트
        </Text>
        <div className="flex-1 h-px bg-[var(--nar-line)]" />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col items-start gap-1 w-[33.3%] sm:flex-row sm:items-center sm:gap-6 sm:justify-start">
          <div className="flex items-center gap-6">
            <NarDargon />
            <Text c="var(--nar-blue-600)" fz={16} fw={700}>
              {blueTeam.stats.dragons}
            </Text>
          </div>

          <div className="flex items-center gap-3">
            {renderDragonIcons(blueTeam.stats)}
          </div>
        </div>
        <Text
          c="--nar-text-tertiary"
          fz={14}
          className="w-[33.3%] justify-center flex"
        >
          드래곤
        </Text>
        <div className="flex flex-col items-end gap-1 w-[33.3%] sm:flex-row sm:items-center sm:gap-6 sm:justify-end">
          <div className="flex items-center gap-6 sm:order-2">
            <Text c="var(--nar-red-600)" fz={16} fw={700}>
              {redTeam.stats.dragons}
            </Text>
            <NarDargon />
          </div>
          <div className="flex items-center gap-3 justify-end sm:order-1">
            {renderDragonIcons(redTeam.stats)}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-6 w-[33.3%]">
          <NarElder />
          <Text c="var(--nar-blue-600)" fz={16} fw={700}>
            {blueTeam.stats.elders}
          </Text>
        </div>
        <Text
          c="--nar-text-tertiary"
          fz={14}
          className="w-[33.3%] justify-center flex"
        >
          장로
        </Text>
        <div className="flex items-center gap-6 w-[33.3%] justify-end">
          <Text c="var(--nar-red-600)" fz={16} fw={700}>
            {redTeam.stats.elders}
          </Text>
          <NarElder />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-6 w-[33.3%]">
          <NarBaron />
          <Text c="var(--nar-blue-600)" fz={16} fw={700}>
            {blueTeam.stats.barons}
          </Text>
        </div>
        <Text
          c="--nar-text-tertiary"
          fz={14}
          className="w-[33.3%] justify-center flex"
        >
          바론
        </Text>
        <div className="flex items-center gap-6 w-[33.3%] justify-end">
          <Text c="var(--nar-red-600)" fz={16} fw={700}>
            {redTeam.stats.barons}
          </Text>
          <NarBaron />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-6 w-[33.3%]">
          <NarHerald />
          <Text c="var(--nar-blue-600)" fz={16} fw={700}>
            {blueTeam.stats.heralds}
          </Text>
        </div>
        <Text
          c="--nar-text-tertiary"
          fz={14}
          className="w-[33.3%] justify-center flex"
        >
          전령
        </Text>
        <div className="flex items-center gap-6 w-[33.3%] justify-end">
          <Text c="var(--nar-red-600)" fz={16} fw={700}>
            {redTeam.stats.heralds}
          </Text>
          <NarHerald />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-6 w-[33.3%]">
          <NarVoidGrub />
          <Text c="var(--nar-blue-600)" fz={16} fw={700}>
            {blueTeam.stats.voidGrubs}
          </Text>
        </div>
        <Text
          c="--nar-text-tertiary"
          fz={14}
          className="w-[33.3%] justify-center flex"
        >
          공허 유충
        </Text>
        <div className="flex items-center gap-6 w-[33.3%] justify-end">
          <Text c="var(--nar-red-600)" fz={16} fw={700}>
            {redTeam.stats.voidGrubs}
          </Text>
          <NarVoidGrub />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[var(--nar-line)]" />
        <Text
          c="var(--nar-text-tertiary-sub)"
          fz={14}
          fw={400}
          className="whitespace-nowrap"
        >
          구조물
        </Text>
        <div className="flex-1 h-px bg-[var(--nar-line)]" />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-6 w-[33.3%]">
          <NarTower />
          <Text c="var(--nar-blue-600)" fz={16} fw={700}>
            {blueTeam.stats.towers}
          </Text>
        </div>
        <Text
          c="--nar-text-tertiary"
          fz={14}
          className="w-[33.3%] justify-center flex"
        >
          타워
        </Text>
        <div className="flex items-center gap-6 w-[33.3%] justify-end">
          <Text c="var(--nar-red-600)" fz={16} fw={700}>
            {redTeam.stats.towers}
          </Text>
          <NarTower />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-6 w-[33.3%]">
          <NarInhib />
          <Text c="var(--nar-blue-600)" fz={16} fw={700}>
            {blueTeam.stats.inhibitors}
          </Text>
        </div>
        <Text
          c="--nar-text-tertiary"
          fz={14}
          className="w-[33.3%] justify-center flex"
        >
          억제기
        </Text>
        <div className="flex items-center gap-6 w-[33.3%] justify-end">
          <Text c="var(--nar-red-600)" fz={16} fw={700}>
            {redTeam.stats.inhibitors}
          </Text>
          <NarInhib />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-6 w-[33.3%]">
          <NarTurretPlat />
          <Text c="var(--nar-blue-600)" fz={16} fw={700}>
            {blueTeam.stats.oppTurretPlates}
          </Text>
        </div>
        <Text
          c="--nar-text-tertiary"
          fz={14}
          className="w-[33.3%] justify-center flex"
        >
          타워 플레이트
        </Text>
        <div className="flex items-center gap-6 w-[33.3%] justify-end">
          <Text c="var(--nar-red-600)" fz={16} fw={700}>
            {redTeam.stats.oppTurretPlates}
          </Text>
          <NarTurretPlat />
        </div>
      </div>
    </div>
  );
}
