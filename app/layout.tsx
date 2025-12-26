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
  title: "나르지지 NAR.GG - LOL 프로 경기 챔피언 조합 분석",
  description:
    "LCK, LPL, LEC 프로 경기의 챔피언 조합, 1v1 매치업, 승률 통계를 분석합니다. 롤 프로 경기 메타 분석 사이트.",
  keywords: [
    "나르지지",
    "nar.gg",
    "롤",
    "리그오브레전드",
    "프로경기",
    "LCK",
    "LPL",
    "LEC",
    "챔피언 조합",
    "매치업",
    "승률",
    "메타 분석",
  ],
  icons: {
    icon: "/images/nar-browser-icon.png",
  },
  openGraph: {
    title: "나르지지 NAR.GG - LOL 프로 경기 챔피언 조합 분석",
    description:
      "LCK, LPL, LEC 프로 경기의 챔피언 조합, 1v1 매치업, 승률 통계를 분석합니다.",
    url: "https://nar.gg",
    siteName: "나르지지 NAR.GG",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "나르지지 NAR.GG - LOL 프로 경기 챔피언 조합 분석",
    description:
      "LCK, LPL, LEC 프로 경기의 챔피언 조합, 1v1 매치업, 승률 통계를 분석합니다.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://nar.kr",
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
