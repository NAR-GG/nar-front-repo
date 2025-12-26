import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { combinationsQueries } from "@/entities/combinations/model/combinations.queries";

export const metadata: Metadata = {
  title: "나르지지 NAR.GG - 롤 프로 경기 챔피언 조합 분석",
  description:
    "나르지지(NAR.GG)에서 리그 오브 레전드 프로 팀과 선수들의 상세한 챔피언 통계 및 경기 데이터를 확인하세요.",
  icons: {
    icon: "/images/nar-browser-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(combinationsQueries.lastUpdate());

  return (
    <html lang="ko">
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
