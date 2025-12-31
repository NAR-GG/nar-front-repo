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

            {/* 상단 가로 배너 영역 */}
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

            {/* 메인 콘텐츠 + 사이드 배너 영역 */}
            <main
                style={{
                    flex: 1,
                    backgroundColor: "#f8f9fa",
                    paddingTop: "2rem",
                    paddingBottom: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                }}
            >
                {/* [왼쪽] 사이드 배너 (화면이 넓을 때만 표시: xl 이상) */}
                <Box visibleFrom="xl" style={{ width: "160px", flexShrink: 0 }}>
                    <div style={{ position: "sticky", top: "20px" }}>
                        <KakaoAdFit
                            adUnit="DAN-aEADHI4jj0hEG751"
                            adWidth="160"
                            adHeight="600"
                        />
                    </div>
                </Box>

                {/* [중앙] 메인 콘텐츠 */}
                <Container
                    size="lg"
                    px={{ base: 16, sm: 24, md: 32 }}
                    style={{
                        maxWidth: "1200px",
                        width: "100%",
                        margin: 0
                    }}
                >
                    {children}
                </Container>

                {/* [오른쪽] 사이드 배너 (화면이 넓을 때만 표시: xl 이상) */}
                <Box visibleFrom="xl" style={{ width: "160px", flexShrink: 0 }}>
                    <div style={{ position: "sticky", top: "20px" }}>
                        <KakaoAdFit
                            adUnit="DAN-aEADHI4jj0hEG751"
                            adWidth="160"
                            adHeight="600"
                        />
                    </div>
                </Box>
            </main>

            <Footer />
        </Stack>
    );
}