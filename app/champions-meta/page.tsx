import { Suspense } from "react";
import { ChampionsMetaComponent } from "@/src/pages/champions-meta/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "챔피언 메타",
  description:
    "LCK, LPL, LEC 프로 경기에서 가장 많이 픽/밴되는 챔피언과 승률, 티어를 확인하세요. 실시간 프로 메타 분석.",
  alternates: {
    canonical: "/champions-meta",
  },
  openGraph: {
    title: "챔피언 메타 | 나르지지 NAR.GG",
    description:
      "LCK, LPL, LEC 프로 경기에서 가장 많이 픽/밴되는 챔피언과 승률, 티어를 확인하세요.",
    url: "https://nar.kr/champions-meta",
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ChampionsMetaComponent />
    </Suspense>
  );
}
