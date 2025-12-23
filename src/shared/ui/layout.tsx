"use client";
import type { ReactNode } from "react";
import { Box, Container, Stack } from "@mantine/core";
import { Header } from "./header";
import { Footer } from "./footer";
import { KakaoAdFit } from "./kakao-ad-fit";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Stack gap={0} style={{ minHeight: "100vh" }}>
      <Header />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
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

      <main
        style={{
          flex: 1,
          backgroundColor: "#f8f9fa",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <Container
          size="lg"
          px={{ base: 16, sm: 24, md: 32 }}
          style={{ maxWidth: "1200px" }}
        >
          {children}
        </Container>
      </main>

      <Footer />
    </Stack>
  );
}
