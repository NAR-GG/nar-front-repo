import Image from "next/image";
import CardFrame from "@/shared/assets/images/card-back-frame.svg";
import type { PlayerCardData } from "@/entities/players/model/players.dto";
import NarPlayerBottom from "@/shared/assets/icons/nar_player_bottom.svg";
import NarGrayBfx from "@/shared/assets/icons/nar_gray_bfx.svg";
import NarGrayBrion from "@/shared/assets/icons/nar_gray_brion.svg";
import NarGrayDns from "@/shared/assets/icons/nar_gray_dn.svg";
import NarGrayDplus from "@/shared/assets/icons/nar_gray_dplus.svg";
import NarGrayDrx from "@/shared/assets/icons/nar_gray_drx.svg";
import NarGrayGeng from "@/shared/assets/icons/nar_gray_geng.svg";
import NarGrayHanwha from "@/shared/assets/icons/nar_gray_hanwha.svg";
import NarGrayKt from "@/shared/assets/icons/nar_gray_kt.svg";
import NarGrayNongsim from "@/shared/assets/icons/nar_gray_nongsim.svg";
import NarGrayT1 from "@/shared/assets/icons/nar_gray_t1.svg";
import NarPlayerJungle from "@/shared/assets/icons/nar_player_jungle.svg";
import NarPlayerMid from "@/shared/assets/icons/nar_player_mid.svg";
import NarPlayerSupport from "@/shared/assets/icons/nar_player_support.svg";
import NarPlayerTop from "@/shared/assets/icons/nar_player_top.svg";
import Korea from "@/shared/assets/images/korea.svg";
import type { ComponentType, SVGProps } from "react";
import { Text } from "@mantine/core";
import dayjs from "dayjs";

interface PlayerCardProps {
  player: PlayerCardData;
}

const BACK_CARD_EFFECT_CLIP_PATH =
  "polygon(0% 6.8%, 25.1% 0.6%, 50% 0%, 75.3% 0.6%, 100% 6.8%, 100% 91.2%, 50% 100%, 0% 91.2%)";

const POSITION_ICON_MAP: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  TOP: NarPlayerTop,
  JUG: NarPlayerJungle,
  JUNGLE: NarPlayerJungle,
  MID: NarPlayerMid,
  ADC: NarPlayerBottom,
  BOT: NarPlayerBottom,
  SUPPORT: NarPlayerSupport,
  SUP: NarPlayerSupport,
};

const TEAM_LOGO_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  BFX: NarGrayBfx,
  BRO: NarGrayBrion,
  BRION: NarGrayBrion,
  DNS: NarGrayDns,
  DNF: NarGrayDns,
  DK: NarGrayDplus,
  DPLUS: NarGrayDplus,
  DRX: NarGrayDrx,
  GEN: NarGrayGeng,
  GENG: NarGrayGeng,
  HLE: NarGrayHanwha,
  HANWHA: NarGrayHanwha,
  KT: NarGrayKt,
  NS: NarGrayNongsim,
  NONGSHIM: NarGrayNongsim,
  NONGSIM: NarGrayNongsim,
  T1: NarGrayT1,
};

const toAbsoluteImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `https://api.nar.kr${url}`;
};

export function BackCardSurface({ player }: PlayerCardProps) {
  const playerImageUrl = toAbsoluteImageUrl(player.playerImageUrl);
  const PositionIcon =
    POSITION_ICON_MAP[player.profile.position?.toUpperCase()] ?? null;
  const TeamLogo = TEAM_LOGO_MAP[player.teamCode?.toUpperCase()] ?? null;
  const topChampion = player.mostChampions[0];
  const secondChampion = player.mostChampions[1];
  const thirdChampion = player.mostChampions[2];

  const topChampionImageUrl = toAbsoluteImageUrl(topChampion?.championImageUrl);
  const secondChampionImageUrl = toAbsoluteImageUrl(
    secondChampion?.championImageUrl,
  );
  const thirdChampionImageUrl = toAbsoluteImageUrl(
    thirdChampion?.championImageUrl,
  );

  return (
    <div className="mx-auto relative h-[557px] w-[357px]">
      <div className="h-full w-full overflow-hidden">
        <CardFrame
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 z-0 h-full w-full pointer-events-none"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[10] overflow-hidden [isolation:isolate]"
          style={{
            clipPath: BACK_CARD_EFFECT_CLIP_PATH,
            WebkitClipPath: BACK_CARD_EFFECT_CLIP_PATH,
          }}
        >
          <div className="pc-back-overlay absolute inset-0" />
          <div className="pc-back-glare absolute inset-[-12%]" />
        </div>
        {TeamLogo && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[25] flex h-[332px] w-[332px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <TeamLogo
              className="aspect-square h-[332px] w-[332px]"
              style={{ opacity: 0.1 }}
            />
          </div>
        )}

        {playerImageUrl && (
          <div className="absolute left-[23px] top-[54px] z-30 h-[126px] w-[126px]">
            <Image
              src={playerImageUrl}
              alt={player.playerName}
              fill
              sizes="126px"
              className="object-contain"
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-[7px]">
          {PositionIcon && (
            <PositionIcon className="absolute left-[126px] top-[57px] z-30 h-[25px] w-[25px]" />
          )}

          <div className="absolute left-[158px] top-[52px] z-30 flex items-center justify-center gap-[4px]">
            <Text c="var(--nar-text-primary)" fz={18} fw={500}>
              {player.teamCode}
            </Text>
            <Text c="var(--nar-text-primary)" fz={18} fw={500}>
              {player.playerName}
            </Text>
          </div>
          <div className="absolute left-[158px] top-[74px] z-30 flex items-center justify-center gap-1">
            <Text c="var(--nar-text-primary)" fz={16} fw={500}>
              {player.profile.name}
            </Text>
            <Text c="var(--nar-text-primary)" fz={16} fw={500}>
              {dayjs(player.profile.birthDate).format("YYYY.MM.DD")}
            </Text>
            <Korea
              aria-label="국가"
              width={19}
              height={13}
              className="inline-block shrink-0 align-middle"
            />
          </div>
          <div className="absolute left-[158px] top-[110px] z-30 flex flex-col">
            <div className="flex items-center gap-2">
              <Text c="var(--nar-text-2)" fz={12} fw={400}>
                소속팀
              </Text>
              <Text c="var(--nar-text-primary)" fz={16} fw={400}>
                {player.teamCode}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Text c="var(--nar-text-2)" fz={12} fw={400}>
                포지션
              </Text>
              <Text c="var(--nar-text-primary)" fz={16} fw={400}>
                {player.profile.position}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Text
                c="var(--nar-text-2)"
                fz={12}
                fw={400}
                style={{ whiteSpace: "nowrap" }}
              >
                소환사명
              </Text>
              <Text c="var(--nar-text-primary)" ta="left" fz={16} fw={400}>
                {player.profile.summonerName}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Text
                c="var(--nar-text-2)"
                fz={12}
                fw={400}
                style={{ whiteSpace: "nowrap" }}
              >
                솔랭티어
              </Text>
              <Text c="var(--nar-text-primary)" fz={16} fw={400}>
                {player.profile.soloRankTier}
              </Text>
            </div>
          </div>
          <div className="absolute left-1/2 top-[262px] z-30 flex flex-nowrap -translate-x-1/2 gap-[26px] rounded-2xl bg-[rgba(112,72,232,0.12)] px-[19px] py-[13px]">
            <div className="flex shrink-0 flex-col items-center justify-center">
              <Text c="var(--nar-text-primary)" fz={14} fw={600}>
                {player.profile.gamesPlayed}
              </Text>
              <Text
                c="var(--nar-text-primary)"
                fz={10}
                fw={300}
                className="whitespace-nowrap"
              >
                경기수
              </Text>
            </div>
            <div className="flex shrink-0 flex-col items-center justify-center">
              <Text c="var(--nar-text-purple)" fz={16} fw={600}>
                {player.profile.kda}
              </Text>
              <Text
                c="var(--nar-text-purple)"
                fz={10}
                fw={300}
                className="whitespace-nowrap"
              >
                KDA
              </Text>
            </div>
            <div className="flex shrink-0 flex-col items-center justify-center">
              <Text c="var(--nar-text-purple)" fz={16} fw={600}>
                {player.profile.gpm}
              </Text>
              <Text
                c="var(--nar-text-purple)"
                fz={10}
                fw={300}
                className="whitespace-nowrap"
              >
                GPM
              </Text>
            </div>
            <div className="flex shrink-0 flex-col items-center justify-center">
              <Text c="var(--nar-text-purple)" fz={16} fw={600}>
                {player.profile.dpm}
              </Text>
              <Text
                c="var(--nar-text-purple)"
                fz={10}
                fw={300}
                className="whitespace-nowrap"
              >
                DPM
              </Text>
            </div>
          </div>
          <div className="absolute left-1/2 top-[368px] z-30 flex -translate-x-1/2 items-start gap-[14px]">
            <div className="relative flex w-[73px] flex-col items-center pt-[17px]">
              <div className="absolute left-1/2 top-0 z-10 h-[33px] w-[33px] -translate-x-1/2 overflow-hidden rounded-full border-[1.5px] border-[var(--nar-text-tertiary-sub)]">
                {secondChampionImageUrl && (
                  <Image
                    src={secondChampionImageUrl}
                    alt={secondChampion?.championNameKr ?? "2nd champion"}
                    fill
                    sizes="33px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="relative h-[80px] w-[73px] overflow-hidden rounded-[8px] border border-[var(--nar-text-tertiary-sub)] p-[8px]">
                <div className="absolute inset-0 bg-(--nar-BG-last)" />
                <div className="absolute inset-0 bg-[var(--nar-white-opacity15)] flex flex-col items-center justify-center gap-1 pt-2">
                  <Text c="var(--nar-text-primary)" fw={300} lh={1} fz={10}>
                    {secondChampion?.championNameKr}
                  </Text>
                  <Text c="var(--nar-text-primary)" fw={400} lh={1} fz={14}>
                    승률 {secondChampion?.winRatePct}%
                  </Text>
                  <Text c="var(--nar-text-primary)" fw={300} lh={1} fz={10}>
                    /{secondChampion?.playCount} 게임
                  </Text>
                </div>
              </div>
            </div>

            <div className="relative flex w-[79px] flex-col items-center pt-[24px]">
              <div
                className="absolute left-1/2 top-0 z-10 rounded-full p-[1.5px]"
                style={{
                  transform: "translateX(-50%)",
                  background: "var(--nar_gradients)",
                  boxShadow:
                    "0 0 7px 0 var(--nar_red_opacity60, rgba(250, 82, 82, 0.50))",
                }}
              >
                <div className="relative h-[47px] w-[47px] overflow-hidden rounded-full">
                  {topChampionImageUrl && (
                    <Image
                      src={topChampionImageUrl}
                      alt={topChampion?.championNameKr ?? "1st champion"}
                      fill
                      sizes="47px"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
              <div
                className="h-[94px] w-[79px] rounded-[8px] p-px"
                style={{ background: "var(--nar_gradients_LNB)" }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[7px] p-[8px]">
                  <div className="absolute inset-0 bg-(--nar-BG-last)" />
                  <div className="absolute inset-0 bg-[var(--nar-white-opacity15)] flex flex-col items-center justify-center gap-1 pt-2">
                    <Text c="var(--nar-text-primary)" fw={300} lh={1} fz={10}>
                      {topChampion?.championNameKr}
                    </Text>
                    <Text
                      component="span"
                      c="var(--nar-text-primary)"
                      className="flex gap-1"
                      fw={400}
                      lh={1}
                      fz={14}
                    >
                      승률
                      <Text
                        component="span"
                        c="var(--nar-text-percent)"
                        fw={600}
                        lh={1}
                        fz={14}
                      >
                        {topChampion?.winRatePct}%
                      </Text>
                    </Text>
                    <Text c="var(--nar-text-primary)" fw={300} lh={1} fz={10}>
                      /{topChampion?.playCount} 게임
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex w-[73px] flex-col items-center pt-[17px]">
              <div className="absolute left-1/2 top-0 z-10 h-[33px] w-[33px] -translate-x-1/2 overflow-hidden rounded-full border-[1.5px] border-[var(--nar-text-tertiary-sub)]">
                {thirdChampionImageUrl && (
                  <Image
                    src={thirdChampionImageUrl}
                    alt={thirdChampion?.championNameKr ?? "3rd champion"}
                    fill
                    sizes="33px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="relative h-[80px] w-[73px] overflow-hidden rounded-[8px] border border-[var(--nar-text-tertiary-sub)] p-[8px]">
                <div className="absolute inset-0 bg-(--nar-BG-last)" />
                <div className="absolute inset-0 bg-[var(--nar-white-opacity15)] flex flex-col items-center justify-center gap-1 pt-2">
                  <Text c="var(--nar-text-primary)" fw={300} lh={1} fz={10}>
                    {thirdChampion?.championNameKr}
                  </Text>
                  <Text c="var(--nar-text-primary)" fw={400} lh={1} fz={14}>
                    승률 {thirdChampion?.winRatePct}%
                  </Text>
                  <Text c="var(--nar-text-primary)" fw={300} lh={1} fz={10}>
                    /{thirdChampion?.playCount} 게임
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { BackCardSurface as BackCard };
