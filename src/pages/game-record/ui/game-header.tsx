"use client";

import { Paper, Stack, Group, Text, Avatar, Box } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconClock, IconDots } from "@tabler/icons-react";
import { ReplayButton } from "@/pages/home/ui/replay-button";
import Lck from "@/shared/assets/images/lck-home.svg";
import Lpl from "@/shared/assets/images/lpl-home.svg";
import Lec from "@/shared/assets/images/lec-home.svg";
import type {
  GameDetailPlayer,
  GameSetNav,
  GameBans,
} from "@/entities/games/model/games.dto";
import { sortByPosition } from "@/shared/lib/sort-by-position";

const hasVodInSets = (sets: GameSetNav["sets"] | undefined) => {
  return sets?.some((s) => s.vodUrl && s.vodUrl.length > 0) ?? false;
};

interface TeamData {
  name: string;
  result: number;
  players: GameDetailPlayer[];
  bans: string[];
}

interface GameInfo {
  league: string;
  matchTitle: string;
  split: string;
  playoffs: number;
  date: string;
  game: number;
  patch: string;
  gamelength: number;
}

interface GameHeaderProps {
  gameId: number;
  gameInfo: GameInfo;
  blueTeam: TeamData;
  redTeam: TeamData;
  setNav: GameSetNav;
  bans: GameBans;
  getChampionImageUrl: (name: string) => string;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
};

const leagueIconMap: Record<string, typeof Lck> = {
  LCK: Lck,
  LEC: Lec,
  LPL: Lpl,
};

export function GameHeader({
  gameId,
  gameInfo,
  blueTeam,
  redTeam,
  setNav,
  bans,
  getChampionImageUrl,
}: GameHeaderProps) {
  const router = useRouter();
  const hasVod = hasVodInSets(setNav.sets);

  const leagueKey = Object.keys(leagueIconMap).find((key) =>
    gameInfo.league.toUpperCase().includes(key),
  );
  const LeagueIcon = leagueKey ? leagueIconMap[leagueKey] : Lck;

  const handleGameSelect = (gameId: number) => {
    router.push(`/pro-matches/${gameId}/record`);
  };

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

  const BannedChampion = ({
    championName,
    size = 32,
  }: {
    championName: string;
    size?: number;
  }) => (
    <Box style={{ position: "relative" }}>
      <Avatar
        src={getChampionImageUrl(championName)}
        size={size}
        radius="sm"
        style={{ filter: "grayscale(50%)" }}
      />
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `calc(${size}px * 1.2)`,
          height: "2px",
          backgroundColor: "rgba(100, 100, 100, 0.8)",
          transform: "translate(-50%, -50%) rotate(-45deg)",
          borderRadius: "2px",
        }}
      />
    </Box>
  );

  const renderTeamDisplay = (team: TeamData, color: "blue" | "red") => {
    const isBlue = color === "blue";
    const sideLabel = isBlue ? "Blue Side" : "Red Side";
    const resultText = team.result === 1 ? "(승)" : "(패)";
    const banList = isBlue ? bans.blue : bans.red;

    return (
      <div className="flex flex-col items-center gap-2 sm:gap-6 flex-1 min-w-0">
        <Text
          className="text-xs sm:text-sm"
          fw={600}
          fz={16}
          c={isBlue ? "blue.7" : "red.7"}
        >
          {sideLabel}
        </Text>

        <div className="flex items-center gap-2">
          <Text fw={700} fz={22} c="var(--nar-text-primary)">
            {team.name}
          </Text>
          <Text
            fw={600}
            fz={22}
            c={team.result === 1 ? "red.6" : "var(--nar-text-tertiary-sub)"}
          >
            {resultText}
          </Text>
        </div>

        <div className="flex gap-1 sm:gap-3 justify-center flex-wrap">
          {sortByPosition(team.players).map((player) => (
            <div
              key={player.participantid}
              className="flex flex-col items-center gap-0.5 sm:gap-1 w-[46px]"
            >
              <Avatar
                src={getChampionImageUrl(player.champion)}
                size={46}
                radius="md"
                className="hidden sm:block border-[3px]"
                style={{
                  borderColor: `var(--mantine-color-${color}-6)`,
                  backgroundColor: `var(--mantine-color-${color}-1)`,
                }}
              />
              <Text
                className="text-[10px] sm:text-xs w-11 sm:w-14"
                ta="center"
                c="var(--nar-text-tertiary)"
                fw={500}
                truncate="end"
              >
                {player.playername}
              </Text>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1 sm:gap-2 mt-2">
          {banList.map((champion, idx) => (
            <div key={idx} className="hidden sm:block">
              <BannedChampion championName={champion} size={36} />
            </div>
          ))}
          {banList.map((champion, idx) => (
            <div key={idx} className="block sm:hidden">
              <BannedChampion championName={champion} size={28} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="w-full flex gap-2.5 items-center py-4 px-[14px]">
        <LeagueIcon />
        <Text fz={28} fw={590} c="var(--nar-text-secondary)">
          {gameInfo.league}
        </Text>
      </div>
      <div>
        <div
          className="border-t border-(--nar-line-2) relative flex flex-col sm:flex-row sm:flex-wrap md:flex-nowrap md:items-center gap-5 overflow-hidden px-[14px] py-[24px]"
          style={{ borderLeftColor: "var(--nar-bg-tertiary)" }}
        >
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

              {/* 스코어 */}
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

              {/* 레드팀 */}
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

        <div className="flex items-center gap-[3px]">
          {setNav.sets.map((set) => {
            const isActive = set.gameId === gameId;
            return (
              <button
                key={set.setNumber}
                onClick={() => handleGameSelect(set.gameId)}
                className={`rounded-t-lg px-[14px] py-[7px] transition-colors
                    ${
                      isActive
                        ? "bg-[var(--nar-bg-tertiary)] border border-b-0 border-[var(--nar-line)]"
                        : "bg-[var(--nar-navchip-bg-defualt)] border-none"
                    }`}
              >
                <Text
                  fw={600}
                  fz={16}
                  c={
                    isActive
                      ? "var(--nar-text-secondary)"
                      : "var(--nar-text-tertiary-sub)"
                  }
                >
                  Game {set.setNumber}
                </Text>
              </button>
            );
          })}
        </div>

        <div className="bg-(--nar-bg-tertiary) p-[10px] pb-5 flex flex-col gap-[10px] rounded-tr-[14px] border border-(--nar-line) border-b-0">
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
                {formatTime(gameInfo.gamelength)}
              </Text>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 mt-4">
            {renderTeamDisplay(blueTeam, "blue")}
            <div className="px-4 sm:px-0">
              <Text fw={700} fz={26} c="var(--nar-text-tertiary-sub)">
                vs
              </Text>
            </div>
            {renderTeamDisplay(redTeam, "red")}
          </div>
        </div>
      </div>
    </div>
  );
}
