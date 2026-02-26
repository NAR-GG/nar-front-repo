"use client";

import { Text } from "@mantine/core";
import Image from "next/image";
import type { ScheduleMatchSummary } from "@/entities/schedule/model/schedule.dto";
import { ReplayButton } from "@/pages/home/ui/replay-button";
import { SpoilerCard } from "@/pages/home/ui/spoiler-card";
import ChevronDown from "@/shared/assets/icons/chevron-down.svg";
import ChevronUp from "@/shared/assets/icons/chevron-up.svg";
import { GameDetail } from "./game-detail";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { scheduleQueries } from "@/src/entities/schedule/model/schedule.queries";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";

type MatchCardProps = {
  match: ScheduleMatchSummary;
};

export function MatchCard({ match }: MatchCardProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isLive = match.matchStatus === "inProgress";
  const isCompleted = match.matchStatus === "completed";
  const isUnstarted = match.matchStatus === "unstarted";

  const { data: matchDetail, isLoading: detailLoading } = useQuery({
    ...scheduleQueries.detail(expandedId ?? ""),
    enabled: !!expandedId,
  });

  const hasVod = match.sets?.some((s) => s.vodUrl && s.vodUrl.length > 0);
  const showReplayButton = isCompleted && hasVod;

  const handleLiveClick = () => {
    if (match.liveStreamUrl) {
      window.open(match.liveStreamUrl, "_blank");
    }
  };

  const handleToggleExpand = (matchId: string) => {
    setExpandedId((prev) => (prev === matchId ? null : matchId));
  };

  const handleNavigateToRecord = (gameId: number) => {
    router.push(`/pro-matches/${gameId}/record`);
  };

  const renderButton = (isMobileView = false) => {
    if (showReplayButton && match.sets) {
      return (
        <ReplayButton
          games={match.sets.map((s) => ({
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
        disabled={isUnstarted || isCompleted}
        onClick={isLive ? handleLiveClick : undefined}
        className={`btn-sm ${isMobileView ? "flex-1" : ""} ${
          isLive ? "btn-gray" : "btn-line"
        } ${isUnstarted || isCompleted ? "btn-disabled" : ""}`}
      >
        {isLive ? "중계보기" : isCompleted ? "---" : "준비 중"}
      </button>
    );
  };

  return (
    <div className="bg-[var(--nar-bg-cont-livebox)] py-6 px-[14px] gap-4 flex flex-col">
      <div
        className="border-l-[3px] relative flex flex-col sm:flex-row sm:flex-wrap md:flex-nowrap md:items-center gap-5 overflow-hidden"
        style={{ borderLeftColor: "var(--nar-bg-tertiary)" }}
      >
        <div className="flex sm:flex-col sm:flex-row items-center md:flex-col md:items-start gap-2 sm:gap-2 md:gap-1 shrink-0 md:order-1 md:flex-1 md:basis-0">
          <span className="badge-default">{match.scheduledTime}</span>
          <Text
            fz={12}
            fw={600}
            c="var(--nar-text-tertiary-sub)"
            className="whitespace-nowrap"
          >
            {match.matchTitle || "프로 경기"}
          </Text>
        </div>

        <div className="hidden md:block ml-auto md:ml-0 md:order-3 md:flex-1 md:basis-0 md:flex md:justify-end shrink-0">
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
                {match.teamA.teamCode}
              </Text>
              <div className="w-12.5 h-12.5 bg-[var(--nar-bg-teamlogobox)] rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                {match.teamA.teamImageUrl && (
                  <Image
                    src={match.teamA.teamImageUrl}
                    alt={match.teamA.teamName}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col items-center shrink-0 mx-6">
              {isUnstarted || revealed ? (
                <div className="flex items-center gap-3.5">
                  <Text
                    fz={{ base: 28, sm: 36 }}
                    fw={700}
                    c={
                      match.teamA.score > match.teamB.score
                        ? "var(--nar-text-score)"
                        : "var(--nar-text-tertiary-sub)"
                    }
                  >
                    {match.teamA.score}
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
                      match.teamB.score > match.teamA.score
                        ? "var(--nar-text-score)"
                        : "var(--nar-text-tertiary-sub)"
                    }
                  >
                    {match.teamB.score}
                  </Text>
                </div>
              ) : (
                <SpoilerCard onReveal={() => setRevealed(true)} />
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-1 justify-start min-w-0 basis-0">
              <div className="w-12.5 h-12.5 bg-[var(--nar-bg-teamlogobox)] rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                {match.teamB.teamImageUrl && (
                  <Image
                    src={match.teamB.teamImageUrl}
                    alt={match.teamB.teamName}
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
                {match.teamB.teamCode}
              </Text>
            </div>
          </div>
        </div>

        <div className="md:hidden basis-full w-full flex items-center justify-start gap-[10px]">
          <div className="flex-1 min-w-0">{renderButton(true)}</div>
          {match.isSynced && isMobile && (
            <button
              type="button"
              className="inline-flex items-center shrink-0 justify-center rounded-[8px] border-[1.5px] focus:outline-none border-[var(--nar-button-more-line)] bg-[var(--nar-button-more-bg)] text-[var(--nar-button-more-text)] w-[34px] h-[34px]"
              onClick={() => handleToggleExpand(match.matchId)}
            >
              {expandedId === null ? <ChevronDown /> : <ChevronUp />}
            </button>
          )}
        </div>
      </div>
      <GameDetail
        isExpanded={expandedId === match.matchId}
        isLoading={detailLoading && expandedId === match.matchId}
        gameDetails={
          expandedId === match.matchId ? matchDetail?.gameDetails : undefined
        }
        onNavigateToRecord={handleNavigateToRecord}
      />
      {match.isSynced && !isMobile && (
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-[8px] border-[1.5px] text-[14px] whitespace-nowrap transition-colors duration-150 focus:outline-none border-[var(--nar-button-more-line)] bg-[var(--nar-button-more-bg)] text-[var(--nar-button-more-text)] btn-sm w-full"
          onClick={() => handleToggleExpand(match.matchId)}
        >
          {expandedId === null ? "경기 상세" : "상세 접기"}
        </button>
      )}
    </div>
  );
}
