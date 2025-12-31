import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { combinationsQueries } from "@/entities/combinations/model/combinations.queries";

const GTM_ID = "GTM-K4N8CFDR";
const GA_ID = "G-RTZ77QF42T";

export const metadata: Metadata = {
  title: "나르지지 NAR.GG - 롤 프로 경기 챔피언 조합 분석",
  description:
    "LCK, LPL, LEC 프로 경기의 챔피언 조합, 1v1 매치업, 승률 통계를 분석합니다. 롤 프로 경기 메타 분석 사이트.",
  keywords: [
    "나르지지",
    "nar.gg",
    "nar.kr",
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
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/images/nar-browser-icon.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "나르지지 NAR.GG - 롤 프로 경기 챔피언 조합 분석",
    description:
      "LCK, LPL, LEC 프로 경기의 챔피언 조합, 1v1 매치업, 승률 통계를 분석합니다.",
    url: "https://nar.gg",
    siteName: "나르지지 NAR.GG",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "나르지지 NAR.GG - 롤 프로 경기 챔피언 조합 분석",
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
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
