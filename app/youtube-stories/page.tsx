import YoutubeStoriesComponent from "@/src/pages/youtube-stories/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "유튜브 스토리",
  description:
    "LCK, LPL, LEC 프로 경기 관련 유튜브 영상과 하이라이트를 모아봤습니다. 최신 롤 e스포츠 영상을 확인하세요.",
  alternates: {
    canonical: "/youtube-stories",
  },
  openGraph: {
    title: "유튜브 스토리 | 나르지지 NAR.GG",
    description:
      "LCK, LPL, LEC 프로 경기 관련 유튜브 영상과 하이라이트를 모아봤습니다.",
    url: "https://nar.kr/youtube-stories",
  },
};

export default function Page() {
  return <YoutubeStoriesComponent />;
}
