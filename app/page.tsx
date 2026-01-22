import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { HomeComponent } from "@/src/pages/home/ui";
import { homeQueries } from "@/entities/home/model/home.queries";
import dayjs from "dayjs";

export const metadata = {
  title: "나르지지 NAR.GG - 롤 프로 경기 챔피언 조합 분석",
  description:
    "LCK, LPL, LEC 프로 경기의 챔피언 조합, 1v1 매치업, 승률 통계를 실시간으로 분석합니다. 오늘의 경기 일정, 챔피언 티어, 프로 선수 랭킹을 확인하세요.",
  alternates: {
    canonical: "/",
  },
};

// JSON-LD 구조화 데이터
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "나르지지 NAR.GG",
  alternateName: ["NAR.GG", "나르지지"],
  url: "https://nar.kr",
  description:
    "LCK, LPL, LEC 프로 경기의 챔피언 조합, 1v1 매치업, 승률 통계를 분석합니다.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nar.kr/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function Page() {
  const queryClient = new QueryClient();

  const today = dayjs().format("YYYY-MM-DD");

  // 서버에서 데이터 미리 가져오기 (Prefetch)
  await Promise.all([
    queryClient.prefetchQuery(homeQueries.championTop5()),
    queryClient.prefetchQuery(homeQueries.playerTop5()),
    queryClient.prefetchQuery(homeQueries.newsList()),
    queryClient.prefetchQuery(homeQueries.community({ sort: "popular" })),
    queryClient.prefetchQuery(
      homeQueries.schedule({ date: today, league: "ALL" })
    ),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeComponent />
      </HydrationBoundary>
    </>
  );
}
