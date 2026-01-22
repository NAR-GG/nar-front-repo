"use client";

import { Text } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { ReplayButton } from "./replay-button";
import { SpoilerCard } from "./spoiler-card";

type MatchCardProps = {
  badgeTheme: "live" | "default";
  badgeText: string;
  tournamentTitle: string;

  leftTeamName?: string;
  leftTeamImage?: string;
  rightTeamName?: string;
  rightTeamImage?: string;

  leftScore?: number;
  rightScore?: number;

  isLive?: boolean;
  setText?: string;
  setTextColor?: string;

  buttonLabel: string;
  buttonTheme: "gray" | "line";
  buttonDisabled?: boolean;

  borderColorVar: string;

  sets?: { setNumber: number; vodUrl: string }[];
  state?: string;
  liveStreamUrl?: string;
};

export function MatchCard({
  badgeTheme,
  badgeText,
  tournamentTitle,
  leftTeamName,
  leftTeamImage,
  rightTeamName,
  rightTeamImage,
  leftScore,
  rightScore,
  isLive,
  setText,
  setTextColor = "var(--nar-text-red)",
  buttonLabel,
  buttonTheme,
  buttonDisabled,
  borderColorVar,
  sets,
  state,
  liveStreamUrl,
}: MatchCardProps) {
  const [revealed, setRevealed] = useState(false);

  const btnClass = `btn-${buttonTheme} btn-sm ${
    buttonDisabled ? "btn-disabled" : ""
  }`;

  const hasVod = sets?.some((s) => s.vodUrl && s.vodUrl.length > 0);
  const showReplayButton = state === "completed" && hasVod;

  return (
    <div
      className="bg-[var(--nar-bg-cont-livebox)] border-l-[3px] min-h-[115px] p-4 relative flex flex-col sm:flex-row sm:flex-wrap md:flex-nowrap md:items-center gap-3 overflow-hidden"
      style={{ borderLeftColor: borderColorVar }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center md:flex-col md:items-start gap-1 sm:gap-2 md:gap-1 shrink-0 md:order-1 md:flex-1 md:basis-0">
        {badgeTheme === "live" ? (
          <span className="badge-live">
            <span className="w-1.5 h-1.5 shrink-0 bg-[var(--mantine-color-red-8)] rounded-full animate-pulse" />
            LIVE
          </span>
        ) : (
          <span className="badge-default">{badgeText}</span>
        )}
        <Text
          fz={12}
          fw={600}
          c="var(--nar-text-tertiary-sub)"
          className="whitespace-nowrap"
        >
          {tournamentTitle}
        </Text>
      </div>

      <div className="hidden sm:block ml-auto md:ml-0 md:order-3 md:flex-1 md:basis-0 md:flex md:justify-end shrink-0">
        {showReplayButton && sets ? (
          <ReplayButton
            games={sets.map((s) => ({
              gameNumber: s.setNumber,
              vodUrl: s.vodUrl,
            }))}
          />
        ) : (
          <button
            type="button"
            disabled={buttonDisabled}
            className={btnClass}
            onClick={() => {
              if (liveStreamUrl) window.open(liveStreamUrl, "_blank");
            }}
          >
            {buttonLabel}
          </button>
        )}
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
              {leftTeamName}
            </Text>
            <div className="w-12.5 h-12.5 bg-[var(--nar-bg-teamlogobox)] rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
              {leftTeamImage && (
                <Image
                  src={leftTeamImage}
                  alt={leftTeamName || ""}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center shrink-0 mx-6">
            {state === "unstarted" || revealed ? (
              <>
                <div className="flex items-center gap-3.5">
                  <Text
                    fz={{ base: 28, sm: 36 }}
                    fw={700}
                    c={
                      isLive
                        ? "var(--nar-text-score)"
                        : "var(--nar-text-tertiary-sub)"
                    }
                  >
                    {typeof leftScore === "number" ? leftScore : "-"}
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
                      isLive
                        ? "var(--nar-text-tertiary)"
                        : "var(--nar-text-tertiary-sub)"
                    }
                  >
                    {typeof rightScore === "number" ? rightScore : "-"}
                  </Text>
                </div>

                {setText ? (
                  <Text
                    fz={14}
                    fw={400}
                    c={setTextColor}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {setText}
                  </Text>
                ) : null}
              </>
            ) : (
              <SpoilerCard onReveal={() => setRevealed(true)} />
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-1 justify-start min-w-0 basis-0">
            <div className="w-12.5 h-12.5 bg-[var(--nar-bg-teamlogobox)] rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
              {rightTeamImage && (
                <Image
                  src={rightTeamImage}
                  alt={rightTeamName || ""}
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
              {rightTeamName}
            </Text>
          </div>
        </div>
      </div>

      <div className="sm:hidden">
        {showReplayButton && sets ? (
          <ReplayButton
            games={sets.map((s) => ({
              gameNumber: s.setNumber,
              vodUrl: s.vodUrl,
            }))}
          />
        ) : (
          <button
            type="button"
            disabled={buttonDisabled}
            className={`${btnClass} w-full`}
            onClick={() => {
              if (liveStreamUrl) window.open(liveStreamUrl, "_blank");
            }}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
