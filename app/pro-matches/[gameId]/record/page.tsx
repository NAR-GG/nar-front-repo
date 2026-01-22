import { GameRecordPage } from "@/pages/game-record/ui/game-record-page";
import { getGameDetail } from "@/entities/games/api/games.api";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    gameId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { gameId } = await params;

  try {
    const gameData = await getGameDetail({ gameId });

    const blueTeam = gameData.players.find((p) => p.side === "Blue")?.teamname;
    const redTeam = gameData.players.find((p) => p.side === "Red")?.teamname;
    const matchTitle = `${blueTeam} vs ${redTeam}`;

    return {
      title: `${matchTitle} 경기 기록`,
      description: `${gameData.league} ${matchTitle} 경기의 상세 기록을 확인하세요. 챔피언 조합, 밴픽, 골드 그래프, 타임라인 등 상세 분석.`,
      alternates: {
        canonical: `/pro-matches/${gameId}/record`,
      },
      openGraph: {
        title: `${matchTitle} 경기 기록 | 나르지지 NAR.GG`,
        description: `${gameData.league} ${matchTitle} 경기의 상세 기록과 분석을 확인하세요.`,
        url: `https://nar.kr/pro-matches/${gameId}/record`,
      },
    };
  } catch {
    return {
      title: `경기 기록`,
      description: `프로 경기의 상세 기록을 확인하세요. 챔피언 조합, 밴픽, 골드 그래프, 타임라인 등 상세 분석.`,
      alternates: {
        canonical: `/pro-matches/${gameId}/record`,
      },
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { gameId } = await params;
  return <GameRecordPage gameId={gameId} />;
}
