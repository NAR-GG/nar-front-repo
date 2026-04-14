"use client";

import { useCallback } from "react";
import { Group, Text } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconClock, IconDots } from "@tabler/icons-react";
import { ReplayButton } from "@/pages/home/ui/replay-button";
import { CommonTabs } from "@/shared/ui/common-tabs";
import { formatGameTime } from "@/shared/lib/format-game-time";
import Lck from "@/shared/assets/images/lck-home.svg";
import Lpl from "@/shared/assets/images/lpl-home.svg";
import Lec from "@/shared/assets/images/lec-home.svg";
import Ljl from "@/shared/assets/images/lgl-home.svg";
import Lcs from "@/shared/assets/images/lcs-home.svg";
import Msi from "@/shared/assets/images/msi-home.svg";
import Worlds from "@/shared/assets/images/worlds-home.svg";
import NarGrayTop from "@/shared/assets/icons/nar_gray_top.svg";
import NarGrayJungle from "@/shared/assets/icons/nar_gray_jungle.svg";
import NarGrayMid from "@/shared/assets/icons/nar_gray_mid.svg";
import NarGrayBottom from "@/shared/assets/icons/nar_gray_bottom.svg";
import NarGraySupport from "@/shared/assets/icons/nar_gray_support.svg";
import type {
  GameDetailPlayer,
  GameSetNav,
  GameBans,
  GameFearless,
} from "@/entities/games/api/games.dto";
import type { GameInfoViewModel } from "../model/game-record.view-model";
import { sortByPosition } from "@/shared/lib/sort-by-position";
import { formatDate, hasVodInSets } from "../lib/game-record.lib";

interface TeamData {
  name: string;
  result: number;
  players: GameDetailPlayer[];
  bans: string[];
}

interface GameHeaderProps {
  gameId: number;
  gameInfo: GameInfoViewModel;
  blueTeam: TeamData;
  redTeam: TeamData;
  setNav: GameSetNav;
  bans: GameBans;
  fearless: GameFearless | null;
  getChampionImageUrl: (name: string) => string;
  getChampionLoadingImageUrl: (name: string) => string;
}

const leagueIconMap: Record<string, typeof Lck> = {
  LCK: Lck,
  LEC: Lec,
  LPL: Lpl,
  LJL: Ljl,
  LCS: Lcs,
  MSI: Msi,
  WORLDS: Worlds,
};

export function GameHeader({
  gameId,
  gameInfo,
  blueTeam,
  redTeam,
  setNav,
  bans,
  fearless,
  getChampionImageUrl,
  getChampionLoadingImageUrl,
}: GameHeaderProps) {
  const router = useRouter();
  const hasVod = hasVodInSets(setNav.sets);

  const leagueKey = Object.keys(leagueIconMap).find((key) =>
    gameInfo.league.toUpperCase().includes(key),
  );
  const LeagueIcon = leagueKey ? leagueIconMap[leagueKey] : Lck;

  const handleGameSelect = useCallback(
    (id: number) => {
      router.push(`/pro-matches/${id}/record`);
    },
    [router],
  );

  const renderButton = (isMobileView = false) => {
    if (hasVod) {
      return (
        <ReplayButton
          games={setNav.sets.map((s) => ({
            gameNumber: s.setNumber,
            vodUrl: s.vodUrl,
          }))}
          fullWidth={isMobileView}
        />
      );
    }

    return (
      <button
        type="button"
        disabled
        className={`btn-sm btn-line btn-disabled ${isMobileView ? "flex-1" : ""}`}
      >
        ---
      </button>
    );
  };

  const renderTeamDisplay = (team: TeamData, color: "blue" | "red") => {
    const isBlue = color === "blue";
    const sideLabel = isBlue ? "Blue Side" : "Red Side";
    const resultText = team.result === 1 ? "(승)" : "(패)";
    const currentBans = isBlue ? bans.blue : bans.red;

    return (
      <div className="flex flex-col gap-[9px] flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`whitespace-nowrap text-base leading-none font-[590] ${
              isBlue ? "text-[var(--mantine-color-blue-6)]" : "text-[var(--mantine-color-red-6)]"
            }`}
          >
            {sideLabel}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[22px] leading-none font-[590] text-[var(--nar-text-primary)]">
              {team.name}
            </span>
            <span
              className={`text-[22px] leading-none font-[590] ${
                team.result === 1
                  ? "text-[var(--mantine-color-red-6)]"
                  : "text-[var(--nar-text-tertiary-sub)]"
              }`}
            >
              {resultText}
            </span>
          </div>
        </div>

        <div className={`flex gap-[2px] ${isBlue ? "" : "sm:justify-end"}`}>
          {currentBans.map((champion, idx) => (
            <div
              key={`${color}-ban-${idx}`}
              className="relative w-9 h-9 rounded-lg overflow-hidden border-2 border-[var(--nar-gray-500)]"
            >
              <Image
                src={getChampionImageUrl(champion)}
                alt={champion}
                width={48}
                height={48}
                className="w-full h-full object-cover scale-110"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="block w-[44px] h-[2px] bg-[var(--nar-gray-500)] rotate-[-45deg]" />
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-[2px]">
          {sortByPosition(team.players).map((player) => (
            <div
              key={player.participantid}
              className="relative aspect-[60/101] sm:aspect-[81.5/189] overflow-hidden rounded-lg min-w-0"
            >
              <Image
                src={getChampionLoadingImageUrl(player.champion)}
                alt={player.champion}
                fill
                sizes="100px"
                className="object-cover scale-110"
              />
              <span className="absolute inset-0 shadow-[0px_-32px_55px_0px_var(--nar-dark-opacity62)_inset] pointer-events-none" />
              <span className="absolute bottom-2 left-2 text-[var(--nar-gray-0)] font-bold text-base leading-[150%]">
                {player.playername}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const positionColumns: {
    key: string;
    aliases: string[];
    Icon: typeof NarGrayTop;
  }[] = [
    { key: "top", aliases: ["top"], Icon: NarGrayTop },
    { key: "jng", aliases: ["jng", "jungle"], Icon: NarGrayJungle },
    { key: "mid", aliases: ["mid", "middle"], Icon: NarGrayMid },
    { key: "bot", aliases: ["bot", "bottom", "adc"], Icon: NarGrayBottom },
    { key: "sup", aliases: ["sup", "support", "utility"], Icon: NarGraySupport },
  ];

  const pickBySide = (
    sideMap: Record<string, string[]> | undefined,
    aliases: string[],
  ): string[] => {
    if (!sideMap) return [];
    for (const key of Object.keys(sideMap)) {
      if (aliases.includes(key.toLowerCase())) return sideMap[key] ?? [];
    }
    return [];
  };

  const seriesByPosition = positionColumns.map((col) => ({
    ...col,
    blue: pickBySide(fearless?.blue, col.aliases),
    red: pickBySide(fearless?.red, col.aliases),
  }));

  const hasSeriesBans = seriesByPosition.some(
    (col) => col.blue.length > 0 || col.red.length > 0,
  );

  return (
    <div>
      <div className="w-full flex gap-2.5 items-center py-4 px-[14px]">
        <LeagueIcon />
        <Text fz={28} fw={590} c="var(--nar-text-secondary)">
          {gameInfo.league}
        </Text>
      </div>
      <div>
        <div className="border-t border-(--nar-line-2) relative flex flex-col sm:flex-row sm:flex-wrap md:flex-nowrap md:items-center gap-5 overflow-hidden px-[14px] py-[24px]">
          <div className="flex sm:flex-col sm:flex-row items-center md:flex-col md:items-start gap-2 sm:gap-2 md:gap-1 shrink-0 md:order-1 md:flex-1 md:basis-0">
            <span className="badge-default">지난경기</span>
            <Text
              fz={12}
              fw={600}
              c="var(--nar-text-tertiary-sub)"
              className="whitespace-nowrap"
            >
              {gameInfo.matchTitle}
            </Text>
          </div>

          <div className="hidden sm:block ml-auto md:ml-0 md:order-3 md:flex-1 md:basis-0 md:flex md:justify-end shrink-0">
            {renderButton()}
          </div>

          <div className="flex items-center justify-center w-full basis-full md:basis-auto md:w-auto md:order-2 min-w-0">
            <div className="flex items-center justify-center w-full max-w-[500px]">
              <div className="flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4 flex-1 justify-end min-w-0 basis-0">
                <Text
                  fz={20}
                  fw={500}
                  c="var(--nar-text-tertiary)"
                  className="whitespace-nowrap"
                >
                  {setNav.blueTeam.code}
                </Text>
                <div className="w-12.5 h-12.5 bg-[var(--nar-bg-teamlogobox)] rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                  {setNav.blueTeam.imageUrl && (
                    <Image
                      src={setNav.blueTeam.imageUrl}
                      alt={setNav.blueTeam.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center shrink-0 mx-6">
                <div className="flex items-center gap-3.5">
                  <Text
                    fz={{ base: 28, sm: 36 }}
                    fw={700}
                    c={
                      setNav.blueTeam.score > setNav.redTeam.score
                        ? "var(--nar-text-score)"
                        : "var(--nar-text-tertiary-sub)"
                    }
                  >
                    {setNav.blueTeam.score}
                  </Text>
                  <Text
                    fz={{ base: 28, sm: 36 }}
                    fw={700}
                    c="var(--nar-text-tertiary-sub)"
                  >
                    :
                  </Text>
                  <Text
                    fz={{ base: 28, sm: 36 }}
                    fw={700}
                    c={
                      setNav.redTeam.score > setNav.blueTeam.score
                        ? "var(--nar-text-score)"
                        : "var(--nar-text-tertiary-sub)"
                    }
                  >
                    {setNav.redTeam.score}
                  </Text>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-1 justify-start min-w-0 basis-0">
                <div className="w-12.5 h-12.5 bg-[var(--nar-bg-teamlogobox)] rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                  {setNav.redTeam.imageUrl && (
                    <Image
                      src={setNav.redTeam.imageUrl}
                      alt={setNav.redTeam.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  )}
                </div>
                <Text
                  fz={20}
                  fw={500}
                  c="var(--nar-text-tertiary)"
                  className="whitespace-nowrap order-1 sm:order-none"
                >
                  {setNav.redTeam.code}
                </Text>
              </div>
            </div>
          </div>

          <div className="sm:hidden flex items-center justify-center gap-[10px]">
            {renderButton(true)}
            <button
              type="button"
              className="inline-flex items-center shrink-0 justify-center rounded-[8px] border-[1.5px] focus:outline-none border-[var(--nar-button-more-line)] bg-[var(--nar-button-more-bg)] text-[var(--nar-button-more-text)] w-[34px] h-[34px]"
            >
              <IconDots size={18} />
            </button>
          </div>
        </div>

        <CommonTabs
          variant="set-nav"
          value={gameId}
          items={setNav.sets.map((set) => ({
            id: set.setNumber,
            label: `Game ${set.setNumber}`,
            value: set.gameId,
          }))}
          onChange={(nextValue) => {
            if (typeof nextValue === "number") {
              handleGameSelect(nextValue);
            }
          }}
        />

        <div className="bg-(--nar-bg-tertiary) p-[10px] pb-5 flex flex-col gap-[10px] rounded-tr-[14px] border border-(--nar-line) border-b-0">
          {hasSeriesBans && (
            <div className="flex flex-col gap-3 rounded-lg p-[21px] sm:px-3 sm:py-4">
              <span className="text-base leading-none font-[590] text-[var(--nar-text-tertiary-sub)] text-center">
                SERIES BAN
              </span>
              <div className="grid grid-cols-2 gap-[21px] sm:grid-cols-5 sm:gap-4 justify-items-center">
                {seriesByPosition.map(({ key, Icon, blue, red }) => (
                  <div
                    key={key}
                    className="flex flex-row items-center gap-2 sm:flex-col sm:items-start min-w-0"
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <div className="grid grid-cols-4 gap-[2px]">
                      {[...blue, ...red].map((champion, idx) => (
                        <div
                          key={`${champion}-${idx}`}
                          className="w-6 h-6 sm:w-[35px] sm:h-[22px] rounded-[4px] overflow-hidden"
                        >
                          <Image
                            src={getChampionImageUrl(champion)}
                            alt={champion}
                            width={44}
                            height={44}
                            className="w-full h-full object-cover scale-125"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-(--nar-line) pt-[5px] pb-2">
            <Group gap="sm">
              <Text size="sm" fw={600} c="var(--nar-text-tertiary-sub)">
                {formatDate(gameInfo.date)}
              </Text>
              <Text size="sm" fw={600} c="var(--nar-text-tertiary-sub)">
                •
              </Text>
              <Text size="sm" fw={600} c="var(--nar-text-tertiary-sub)">
                patch {gameInfo.patch}
              </Text>
            </Group>
            <div className="flex items-center gap-[7px]">
              <IconClock size={16} color="var(--nar-text-tertiary-sub)" />
              <Text size="sm" c="var(--nar-text-tertiary-sub)" fw={600}>
                {formatGameTime(gameInfo.gamelength)}
              </Text>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-[30px] sm:gap-0 mt-4">
            {renderTeamDisplay(blueTeam, "blue")}
            <div className="flex items-center justify-center sm:mx-5">
              <span className="font-bold text-[26px] leading-[150%] text-[var(--nar-text-tertiary-sub)] text-center">
                VS
              </span>
            </div>
            {renderTeamDisplay(redTeam, "red")}
          </div>
        </div>
      </div>
    </div>
  );
}
