"use client";
import type { ReactNode } from "react";
import { Box, Stack } from "@mantine/core";
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

            {/* --- [상단] 가로 배너 영역 --- */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                    paddingBottom: "10px",
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

            {/* --- [중앙] 메인 콘텐츠 + 사이드 배너 --- */}
            <main
                style={{
                    flex: 1,
                    backgroundColor: "#f8f9fa",
                    paddingTop: "1rem",
                    paddingBottom: "2rem",
                    display: "flex",
                    justifyContent: "center", // 전체 래퍼를 화면 중앙에 정렬
                }}
            >
                <Box
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "20px",
                        width: "100%",
                        maxWidth: "1600px",
                        padding: "0 20px", // 모바일/작은 화면에서의 좌우 여백
                    }}
                >
                    {/* [왼쪽] 사이드 배너 (XL 화면 이상만 표시) */}
                    <Box visibleFrom="xl" style={{ width: "160px", flexShrink: 0 }}>
                        <div style={{ position: "sticky", top: "20px" }}>
                            <KakaoAdFit
                                adUnit="DAN-aEADHI4jj0hEG751"
                                adWidth="160"
                                adHeight="600"
                            />
                        </div>
                    </Box>

                    {/* [중앙] 본문 콘텐츠 */}
                    <Box
                        style={{
                            flex: 1, // 남은 공간을 모두 사용
                            minWidth: 0, // Flex item 축소 문제 방지
                        }}
                    >
                        {children}
                    </Box>

                    {/* [오른쪽] 사이드 배너 (XL 화면 이상만 표시) */}
                    <Box visibleFrom="xl" style={{ width: "160px", flexShrink: 0 }}>
                        <div style={{ position: "sticky", top: "20px" }}>
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
        </Stack>
    );
}