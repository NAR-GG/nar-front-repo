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
  title: "NAR.GG - LOL 프로 경기 챔피언 조합 분석",
  description:
    "LCK 프로 경기의 챔피언 조합, 1v1 매치업, 승률 통계를 분석합니다.",
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
