import Image from "next/image";
import { Text } from "@mantine/core";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type SVGProps,
} from "react";
import type { PlayerCardData } from "@/entities/players/model/players.dto";
import { BackCardSurface } from "./back-card";
import { PlayerCardEffects } from "@/pages/team-players/player-list/ui/player-card-effects";
import CardFrame from "@/shared/assets/images/card-frame.svg";
import MostBg from "@/shared/assets/images/most-bg.svg";
import NarGrayBfx from "@/shared/assets/icons/nar_gray_bfx.svg";
import NarGrayBottom from "@/shared/assets/icons/nar_player_bottom.svg";
import NarGrayBrion from "@/shared/assets/icons/nar_gray_brion.svg";
import NarGrayDns from "@/shared/assets/icons/nar_gray_dn.svg";
import NarGrayDplus from "@/shared/assets/icons/nar_gray_dplus.svg";
import NarGrayDrx from "@/shared/assets/icons/nar_gray_drx.svg";
import NarGrayGeng from "@/shared/assets/icons/nar_gray_geng.svg";
import NarGrayHanwha from "@/shared/assets/icons/nar_gray_hanwha.svg";
import NarGrayJungle from "@/shared/assets/icons/nar_player_jungle.svg";
import NarGrayKt from "@/shared/assets/icons/nar_gray_kt.svg";
import NarGrayMid from "@/shared/assets/icons/nar_player_mid.svg";
import NarGrayNongsim from "@/shared/assets/icons/nar_gray_nongsim.svg";
import NarGraySupport from "@/shared/assets/icons/nar_player_support.svg";
import NarGrayT1 from "@/shared/assets/icons/nar_gray_t1.svg";
import NarGrayTop from "@/shared/assets/icons/nar_player_top.svg";
import Korea from "@/shared/assets/images/korea.svg";
import Repeat from "@/shared/assets/icons/repeat.svg";

interface PlayerCardProps {
  player: PlayerCardData;
  onActiveChange?: (isActive: boolean) => void;
}

const FRAME_INNER_CLIP_PATH =
  "polygon(2% 8%, 24.8% 1.5%, 75.2% 1.5%, 98% 8%, 98% 90.5%, 50% 99%, 2% 90.5%)";

const CARD_WIDTH = 193;
const BACK_WIDTH = 357;
const BACK_BASE_SCALE = CARD_WIDTH / BACK_WIDTH;
const ACTIVE_SCALE = BACK_WIDTH / CARD_WIDTH;

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

const POSITION_ICON_MAP: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  TOP: NarGrayTop,
  JUG: NarGrayJungle,
  JUNGLE: NarGrayJungle,
  MID: NarGrayMid,
  ADC: NarGrayBottom,
  BOT: NarGrayBottom,
  SUPPORT: NarGraySupport,
  SUP: NarGraySupport,
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const round = (value: number) => Math.round(value * 100) / 100;

const adjust = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
) => {
  if (fromMax === fromMin) return toMin;
  const progress = (value - fromMin) / (fromMax - fromMin);
  return round(toMin + (toMax - toMin) * progress);
};

const toAbsoluteImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `https://api.nar.kr${url}`;
};

function PlayerCardFace({ player }: PlayerCardProps) {
  const backgroundImageUrl = toAbsoluteImageUrl(
    player.topChampionLoadingImageUrl,
  );
  const playerImageUrl = toAbsoluteImageUrl(player.playerImageUrl);
  const TeamLogo = TEAM_LOGO_MAP[player.teamCode?.toUpperCase()] ?? null;
  const PositionIcon =
    POSITION_ICON_MAP[player.profile.position?.toUpperCase()] ?? null;

  return (
    <div className="relative h-[302px] w-[193px] overflow-hidden">
      <div
        className="absolute bottom-[13px] left-1/2 z-0 h-[214px] w-[180px] -translate-x-1/2 rounded-[3px]"
        style={{ background: "var(--nar_gradients)" }}
      />

      <div
        className="absolute inset-0 z-10 overflow-hidden bg-[#130520]"
        style={{
          clipPath: FRAME_INNER_CLIP_PATH,
          WebkitClipPath: FRAME_INNER_CLIP_PATH,
        }}
      >
        {backgroundImageUrl && (
          <Image
            src={backgroundImageUrl}
            alt={player.playerName}
            fill
            sizes="193px"
            className="object-cover"
          />
        )}
      </div>

      <PlayerCardEffects clipPath={FRAME_INNER_CLIP_PATH} />

      <div className="pointer-events-none absolute left-[19px] top-[28px] z-30 flex items-start gap-2">
        {TeamLogo && <TeamLogo className="h-[39px] w-[39px]" />}
        <div className="flex flex-col items-start justify-start">
          <Text c="var(--nar-white)" fz={16} fw={500}>
            {player.teamCode}
          </Text>
          <div className="flex items-center justify-center gap-[2px]">
            <Text c="var(--nar-white)" fz={8} fw={300}>
              {player.playerName}{" "}
            </Text>
            <Korea
              width={10}
              height={6}
              aria-label="국가"
              className="inline-block align-middle"
            />
          </div>
        </div>
      </div>

      {PositionIcon && (
        <PositionIcon className="pointer-events-none absolute right-[19px] top-[73px] z-20 h-[77px] w-[77px] opacity-80" />
      )}

      <MostBg className="pointer-events-none absolute left-1/2 top-[203px] z-40 h-[95px] w-[187px] -translate-x-1/2" />

      {playerImageUrl && (
        <div className="pointer-events-none absolute left-1/2 top-[79px] z-30 h-[143px] w-[143px] -translate-x-1/2">
          <Image
            src={playerImageUrl}
            alt={player.playerName}
            fill
            sizes="143px"
            className="object-contain"
          />
        </div>
      )}

      <div className="absolute left-1/2 top-[203px] z-[45] flex h-[95px] w-[187px] -translate-x-1/2 flex-col items-center justify-center gap-[4px]">
        <Text c="var(--nar-text-tertiary-sub)" fz={9} fw={300}>
          Most Champion
        </Text>
        <div className="flex items-center justify-center gap-[10px]">
          {player.mostChampions.slice(0, 3).map((champion) => {
            const championImageUrl = toAbsoluteImageUrl(
              champion.championImageUrl,
            );
            if (!championImageUrl) return null;

            return (
              <div
                key={champion.championId}
                className="rounded-full p-[1.5px]"
                style={{ background: "var(--nar_gradients)" }}
              >
                <Image
                  src={championImageUrl}
                  alt={champion.championNameKr}
                  width={33}
                  height={33}
                  className="h-[33px] w-[33px] rounded-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

      <CardFrame
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-0 z-50 h-full w-full"
      />
    </div>
  );
}

export function PlayerCard({ player, onActiveChange }: PlayerCardProps) {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const faceToggleRef = useRef<HTMLButtonElement | null>(null);
  const closeCardRef = useRef<() => void>(() => {});
  const repositionTimerRef = useRef<number | null>(null);
  const interactTimerRef = useRef<number | null>(null);
  const firstPopRef = useRef(true);

  const [isInViewport, setIsInViewport] = useState(false);
  const [active, setActive] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [pointerX, setPointerX] = useState(50);
  const [pointerY, setPointerY] = useState(50);
  const [cardOpacity, setCardOpacity] = useState(0);
  const [backgroundX, setBackgroundX] = useState(50);
  const [backgroundY, setBackgroundY] = useState(50);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateDelta, setRotateDelta] = useState(0);
  const [faceRotation, setFaceRotation] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [originLeft, setOriginLeft] = useState(0);
  const [originTop, setOriginTop] = useState(0);

  const closeCard = useCallback(() => {
    setActive(false);
    onActiveChange?.(false);
    setTranslateX(0);
    setTranslateY(0);
    setRotateDelta(0);
    setFaceRotation(0);
    setRotateX(0);
    setRotateY(0);
    setOriginLeft(0);
    setOriginTop(0);
    setPointerX(50);
    setPointerY(50);
    setCardOpacity(0);
    setBackgroundX(50);
    setBackgroundY(50);
    setInteracting(false);
  }, [onActiveChange]);

  useEffect(() => {
    closeCardRef.current = closeCard;
  }, [closeCard]);

  useEffect(() => {
    if (!slotRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting);
        });
      },
      {
        threshold: 0.5,
        rootMargin: "50% 0px 50% 0px",
      },
    );

    observer.observe(slotRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;

    const updateCenter = () => {
      if (!slotRef.current) return;
      const rect = slotRef.current.getBoundingClientRect();
      setOriginLeft(round(rect.left));
      setOriginTop(round(rect.top));
      setTranslateX(round(window.innerWidth / 2 - rect.left - rect.width / 2));
      setTranslateY(round(window.innerHeight / 2 - rect.top - rect.height / 2));
    };

    updateCenter();

    const handleReposition = () => {
      if (repositionTimerRef.current !== null) {
        window.clearTimeout(repositionTimerRef.current);
      }
      repositionTimerRef.current = window.setTimeout(updateCenter, 300);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCardRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
      if (repositionTimerRef.current !== null) {
        window.clearTimeout(repositionTimerRef.current);
        repositionTimerRef.current = null;
      }
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [active]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!active || !cardRef.current) return;
      const target = event.target as Node;
      const clickedCard = cardRef.current.contains(target);
      const clickedToggle = faceToggleRef.current?.contains(target) ?? false;

      if (!clickedCard && !clickedToggle) {
        closeCardRef.current();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [active]);

  const handleInteract = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const percentX = clamp(
      round((100 / rect.width) * (event.clientX - rect.left)),
    );
    const percentY = clamp(
      round((100 / rect.height) * (event.clientY - rect.top)),
    );
    const centerX = percentX - 50;
    const centerY = percentY - 50;

    setInteracting(true);
    setPointerX(percentX);
    setPointerY(percentY);
    setCardOpacity(1);
    setBackgroundX(adjust(percentX, 0, 100, 37, 63));
    setBackgroundY(adjust(percentY, 0, 100, 33, 67));
    setRotateX(round(-(centerX / 3.5)));
    setRotateY(round(centerY / 3.5));
  };

  const handleInteractEnd = (delay = 500) => {
    if (interactTimerRef.current !== null) {
      window.clearTimeout(interactTimerRef.current);
    }

    interactTimerRef.current = window.setTimeout(() => {
      setInteracting(false);
      setPointerX(50);
      setPointerY(50);
      setRotateX(0);
      setRotateY(0);
      setCardOpacity(0);
      setBackgroundX(50);
      setBackgroundY(50);
    }, delay);
  };

  const openCard = () => {
    setActive(true);
    onActiveChange?.(true);
    setInteracting(false);
    setRotateX(0);
    setRotateY(0);
    setPointerX(50);
    setPointerY(50);
    setCardOpacity(0);
    setBackgroundX(50);
    setBackgroundY(50);

    if (firstPopRef.current) {
      setRotateDelta(360);
      firstPopRef.current = false;
      handleInteractEnd(1000);
    }
  };

  const toggleFace = () => {
    setFaceRotation((prev) => (prev === 0 ? 180 : 0));
  };

  const handleCardBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
    const nextFocusTarget = event.relatedTarget as Node | null;
    const focusedCard = nextFocusTarget
      ? cardRef.current?.contains(nextFocusTarget)
      : false;
    const focusedToggle = nextFocusTarget
      ? faceToggleRef.current?.contains(nextFocusTarget)
      : false;

    if (!focusedCard && !focusedToggle) {
      closeCard();
    }
  };

  const cardScale = active ? ACTIVE_SCALE : 1;
  const pointerFromCenter = clamp(
    Math.sqrt((pointerY - 50) ** 2 + (pointerX - 50) ** 2) / 50,
    0,
    1,
  );

  const dynamicStyles = {
    "--pointer-x": `${pointerX}%`,
    "--pointer-y": `${pointerY}%`,
    "--pointer-from-center": `${pointerFromCenter}`,
    "--pointer-from-top": `${pointerY / 100}`,
    "--pointer-from-left": `${pointerX / 100}`,
    "--card-opacity": `${cardOpacity}`,
    "--background-x": `${backgroundX}%`,
    "--background-y": `${backgroundY}%`,
    "--rotate-x": `${rotateX + rotateDelta}deg`,
    "--rotate-y": `${rotateY}deg`,
    "--card-scale": `${cardScale}`,
    "--translate-x": `${translateX}px`,
    "--translate-y": `${translateY}px`,
    "--hover-tilt-x": `${pointerX / 100}`,
    "--hover-tilt-y": `${pointerY / 100}`,
    "--hover-tilt-opacity": `${cardOpacity}`,
    left: active ? `${originLeft}px` : undefined,
    top: active ? `${originTop}px` : undefined,
    transform: `translate3d(${translateX}px, ${translateY}px, ${cardScale * 150}px) scale(${cardScale})`,
    transformStyle: "preserve-3d",
    transition: "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
  } as CSSProperties;

  return (
    <div
      ref={slotRef}
      className="relative mx-auto h-[302px] w-[193px]"
      style={{ zIndex: active ? 999 : interacting ? 120 : 1 }}
    >
      {active ? (
        <button
          type="button"
          aria-label="선수 카드 닫기"
          onClick={closeCard}
          className="fixed inset-0 bg-[var(--nar-bg-playercard)]"
        />
      ) : null}
      <div
        className={active ? "fixed h-[302px] w-[193px]" : "absolute inset-0"}
        style={dynamicStyles}
      >
        <button
          ref={cardRef}
          type="button"
          onClick={() => (active ? closeCard() : openCard())}
          onPointerMove={handleInteract}
          onPointerLeave={() => handleInteractEnd(active ? 100 : 500)}
          onBlur={handleCardBlur}
          aria-label={`${player.playerName} 선수 카드 확대`}
          className="block h-[302px] w-[193px] cursor-pointer border-0 bg-transparent p-0 [perspective:600px]"
        >
          <div
            className="relative h-full w-full [transform-style:preserve-3d]"
            style={{
              transform: "rotateY(var(--rotate-x)) rotateX(var(--rotate-y))",
              transition:
                "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 400ms ease",
            }}
          >
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: faceRotation === 0 ? 1 : 0,
              }}
            >
              {active || isInViewport ? (
                <PlayerCardFace player={player} />
              ) : (
                <div className="relative h-[302px] w-[193px] overflow-hidden rounded-[8px] bg-[#12051d]">
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{ background: "var(--nar-cardbg)" }}
                  />
                  <CardFrame
                    preserveAspectRatio="xMidYMid meet"
                    className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                  />
                </div>
              )}
            </div>
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: faceRotation === 180 ? 1 : 0,
              }}
            >
              <div
                className="absolute left-1/2 top-1/2 origin-center"
                style={{
                  transform: `translate(-50%, -50%) scale(${BACK_BASE_SCALE})`,
                }}
              >
                {active ? <BackCardSurface player={player} /> : null}
              </div>
            </div>
          </div>
        </button>
        {active ? (
          <button
            ref={faceToggleRef}
            type="button"
            onClick={toggleFace}
            className="absolute left-5 top-full z-[2000] flex items-center gap-2 pointer-events-auto"
            style={{
              transform: `translateY(-5px) scale(${1 / cardScale})`,
              transformOrigin: "top left",
            }}
          >
            <Text c="var(--nar-text-tertiary)" fz={16} fw={500}>
              {faceRotation === 0 ? "카드 뒷면" : "카드 앞면"}
            </Text>
            <Repeat
              aria-hidden="true"
              className="shrink-0 text-[var(--nar-text-tertiary)]"
            />
          </button>
        ) : null}
      </div>
    </div>
  );
}
