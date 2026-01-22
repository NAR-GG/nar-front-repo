import { Suspense } from "react";
import { SchedulePageComponent } from "@/src/pages/pro-matches/schedule/ui";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{
    date?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { date } = await searchParams;

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
  };

  const dateTitle = date ? `${formatDate(date)} ` : "";
  const dateDesc = date ? `${formatDate(date)} ` : "";

  return {
    title: `${dateTitle}경기 일정`,
    description: `${dateDesc}LCK, LPL, LEC 프로 경기 일정을 확인하세요. 오늘의 경기, 예정된 경기, 지난 경기 결과를 한눈에 볼 수 있습니다.`,
    alternates: {
      canonical: `/pro-matches/schedule${date ? `?date=${date}` : ""}`,
    },
    openGraph: {
      title: `${dateTitle}경기 일정 | 나르지지 NAR.GG`,
      description: `${dateDesc}LCK, LPL, LEC 프로 경기 일정을 확인하세요.`,
      url: `https://nar.kr/pro-matches/schedule${date ? `?date=${date}` : ""}`,
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SchedulePageComponent />
    </Suspense>
  );
}
