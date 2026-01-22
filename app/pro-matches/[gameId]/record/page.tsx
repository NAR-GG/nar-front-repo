import { GameRecordPage } from "@/pages/game-record/ui/game-record-page";
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

  // TODO: 실제 경기 데이터 fetch해서 팀명 등 동적으로 가져올 수 있음
  return {
    title: `경기 기록 #${gameId}`,
    description: `프로 경기 #${gameId}의 상세 기록을 확인하세요. 챔피언 조합, 밴픽, 골드 그래프, 타임라인 등 상세 분석.`,
    alternates: {
      canonical: `/pro-matches/${gameId}/record`,
    },
    openGraph: {
      title: `경기 기록 #${gameId} | 나르지지 NAR.GG`,
      description: `프로 경기 #${gameId}의 상세 기록과 분석을 확인하세요.`,
      url: `https://nar.kr/pro-matches/${gameId}/record`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { gameId } = await params;
  return <GameRecordPage gameId={gameId} />;
}
