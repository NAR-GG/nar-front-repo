"use client";
import type { ReactNode } from "react";
import { Box } from "@mantine/core";
import { Header } from "./header";
import { Footer } from "./footer";
import { KakaoAdFit } from "./kakao-ad-fit";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-(--nar-bg-GNB)">
      <Header />
      <div className="flex justify-center bg-(--nar-bg-GNB) pt-[49.9px] pb-[10px]">
        <Box visibleFrom="sm">
          <KakaoAdFit
            adUnit="DAN-S0LZlpVV3VD0jjia"
            adWidth="728"
            adHeight="90"
          />
        </Box>
        <Box hiddenFrom="sm">
          <KakaoAdFit
            adUnit="DAN-WsJIRNubTcK6liGa"
            adWidth="320"
            adHeight="100"
          />
        </Box>
      </div>
      <main className="flex flex-1 justify-center bg-(--nar-bg-GNB) pt-4 pb-8">
        <Box className="flex w-full max-w-[1600px] items-start gap-5 px-5">
          <Box visibleFrom="xl" className="w-[160px] shrink-0">
            <div className="sticky top-5">
              <KakaoAdFit
                adUnit="DAN-aEADHI4jj0hEG751"
                adWidth="160"
                adHeight="600"
              />
            </div>
          </Box>
          <Box className="flex-1 min-w-0">{children}</Box>
          <Box visibleFrom="xl" className="w-[160px] shrink-0">
            <div className="sticky top-5">
              <KakaoAdFit
                adUnit="DAN-SRIytSXAXIz7ErHf"
                adWidth="160"
                adHeight="600"
              />
            </div>
          </Box>
        </Box>
      </main>
      <Footer />
    </div>
  );
}
