import { Suspense } from "react";
import { MatchListPage } from "@/pages/pro-matches/list/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "경기 목록",
  description:
    "LCK, LPL, LEC 프로 경기 전체 목록과 결과를 확인하세요. 팀별, 시즌별로 경기 기록을 검색할 수 있습니다.",
  alternates: {
    canonical: "/pro-matches/list",
  },
  openGraph: {
    title: "경기 목록 | 나르지지 NAR.GG",
    description:
      "LCK, LPL, LEC 프로 경기 전체 목록과 결과를 확인하세요. 팀별, 시즌별로 경기 기록 검색.",
    url: "https://nar.kr/pro-matches/list",
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MatchListPage />
    </Suspense>
  );
}
