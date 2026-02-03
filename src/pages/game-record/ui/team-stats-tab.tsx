import NarSet2Ward from "@/shared/assets/icons/nar_icon_set2_ward.svg";
import NarSet2Coin from "@/shared/assets/icons/nar_icon_set2_coin.svg";
import NarSet2Kills from "@/shared/assets/icons/nar_icon_set2_kills.svg";
import { Text } from "@mantine/core";

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
}

interface TeamData {
  name: string;
  stats: TeamStats;
}

interface TeamStatsTabProps {
  blueTeam: TeamData;
  redTeam: TeamData;
}

export function TeamStatsTab({ blueTeam, redTeam }: TeamStatsTabProps) {
  const totalDamage = blueTeam.stats.totalDamage + redTeam.stats.totalDamage;
  const bluePercent =
    totalDamage > 0 ? (blueTeam.stats.totalDamage / totalDamage) * 100 : 50;
  const redPercent =
    totalDamage > 0 ? (redTeam.stats.totalDamage / totalDamage) * 100 : 50;

  return (
    <div className="w-full flex flex-col items-center justify-between px-3 py-[22px]">
      <div className="py-[22px] px-4 w-full">
        <div className="grid grid-cols-2 gap-4 w-full sm:flex sm:items-center sm:gap-[51px] sm:justify-between">
          <div className="col-span-2 flex items-center gap-[17px] justify-center sm:col-span-1 sm:order-3">
            <Text c="var(--nar-blue-600)" fw={700} fz={34}>
              {blueTeam.stats.kills}
            </Text>
            <NarSet2Kills />
            <Text c="var(--nar-red-600)" fw={700} fz={34}>
              {redTeam.stats.kills}
            </Text>
          </div>

          <div className="flex flex-col items-start sm:order-1 sm:flex-row sm:items-center sm:gap-[51px]">
            <div className="flex items-center gap-2">
              <NarSet2Ward />
              <Text c="var(--nar-blue-600)" fw={700} fz={22}>
                {blueTeam.stats.visionScore}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <NarSet2Coin />
              <Text c="var(--nar-blue-600)" fw={700} fz={22}>
                {blueTeam.stats.totalGold}
              </Text>
            </div>
          </div>

          <div className="flex flex-col items-end sm:order-5 sm:flex-row sm:items-center sm:gap-[51px]">
            <div className="flex items-center gap-2">
              <Text c="var(--nar-red-600)" fw={700} fz={22}>
                {redTeam.stats.visionScore}
              </Text>
              <NarSet2Ward />
            </div>
            <div className="flex items-center gap-2">
              <Text c="var(--nar-red-600)" fw={700} fz={22}>
                {redTeam.stats.totalGold}
              </Text>
              <NarSet2Coin />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-(--nar-line)" />
      <div className="w-full py-6 px-4 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <Text c="var(--nar-blue-600)" fw={700} fz={{ base: 14, sm: 18 }}>
            {blueTeam.stats.totalDamage.toLocaleString()}
          </Text>
          <Text c="var(--nar-text-secondary)" fz={{ base: 14, sm: 16 }}>
            Total Damage
          </Text>
          <Text c="var(--nar-red-600)" fw={700} fz={{ base: 14, sm: 18 }}>
            {redTeam.stats.totalDamage.toLocaleString()}
          </Text>
        </div>

        <div className="w-full h-3 flex overflow-hidden rounded-full">
          <div
            style={{
              width: `${bluePercent}%`,
              backgroundColor: "var(--nar-blue-600)",
              opacity: 0.5,
            }}
          />
          <div
            style={{
              width: `${redPercent}%`,
              backgroundColor: "var(--nar-red-600)",
              opacity: 0.5,
            }}
          />
        </div>

        <div className="flex items-center justify-between w-full">
          <Text c="var(--nar-blue-600)" fw={700} fz={{ base: 12, sm: 14 }}>
            {bluePercent.toFixed(1)}%
          </Text>
          <Text c="var(--nar-red-600)" fw={700} fz={{ base: 12, sm: 14 }}>
            {redPercent.toFixed(1)}%
          </Text>
        </div>
      </div>
    </div>
  );
}
