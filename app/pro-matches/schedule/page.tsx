import { Suspense } from "react";
import { SchedulePageComponent } from "@/src/pages/pro-matches/schedule/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "경기 일정",
  description:
    "LCK, LPL, LEC 프로 경기 일정을 확인하세요. 오늘의 경기, 예정된 경기, 지난 경기 결과를 한눈에 볼 수 있습니다.",
  alternates: {
    canonical: "/pro-matches/schedule",
  },
  openGraph: {
    title: "경기 일정 | 나르지지 NAR.GG",
    description:
      "LCK, LPL, LEC 프로 경기 일정을 확인하세요. 오늘의 경기, 예정된 경기, 지난 경기 결과를 한눈에.",
    url: "https://nar.kr/pro-matches/schedule",
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SchedulePageComponent />
    </Suspense>
  );
}
