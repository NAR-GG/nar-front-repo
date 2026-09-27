import { ImageResponse } from "next/og";
import { getGameDetail } from "@/entities/games/api/games.api";

export const alt = "경기 기록";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND_GRADIENT =
  "linear-gradient(90deg, #e26212 -7.5%, #950371 40.14%, #250657 120.4%)";

// next/og(ImageResponse)는 satori로 렌더링되어 Tailwind/전역 CSS를 읽지 못하고
// 인라인 style만 인식한다 — 프로젝트의 "인라인 스타일 금지" 규칙의 의도적 예외.
function TeamBadge({
  code,
  name,
  imageUrl,
  score,
  isWinner,
}: {
  code: string | null;
  name: string;
  imageUrl?: string | null;
  score: number;
  isWinner: boolean;
}) {
  const label = code ?? name;
  // satori의 원격 이미지 렌더링이 webp를 못 읽는 경우가 있어 png로 강제 변환
  const pngImageUrl = imageUrl?.replace("f_webp", "f_png");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 220 }}>
      {pngImageUrl ? (
        <img
          src={pngImageUrl}
          alt=""
          width={96}
          height={96}
          style={{ borderRadius: 16, objectFit: "contain" }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            width: 96,
            height: 96,
            borderRadius: 16,
            background: "#25262b",
          }}
        />
      )}
      <div
        style={{
          marginTop: 20,
          fontSize: label.length > 6 ? 24 : 40,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: -1,
          textAlign: "center",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 64,
          fontWeight: 700,
          color: isWinner ? "#ff6b6b" : "#909296",
        }}
      >
        {/* satori는 숫자를 JSX 자식으로 그대로 받으면 렌더링에 실패해 문자열로 변환 */}
        {String(score)}
      </div>
    </div>
  );
}

function FallbackImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#101113",
        }}
      >
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700, color: "#ffffff" }}>
          NAR.GG
        </div>
      </div>
    ),
    size,
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;

  try {
    const gameData = await getGameDetail({ gameId });
    const { blueTeam, redTeam } = gameData.setNav;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "#101113",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 10,
              background: BRAND_GRADIENT,
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "48px 64px 0 64px",
            }}
          >
            <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#ff6c11" }}>
              NAR.GG
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 600,
                color: "#a6a7ab",
              }}
            >
              {`${gameData.league} · ${gameData.year}`}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 64,
            }}
          >
            <TeamBadge
              code={blueTeam.code}
              name={blueTeam.name}
              imageUrl={blueTeam.imageUrl}
              score={blueTeam.score}
              isWinner={blueTeam.score > redTeam.score}
            />
            <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#5c5f66" }}>
              VS
            </div>
            <TeamBadge
              code={redTeam.code}
              name={redTeam.name}
              imageUrl={redTeam.imageUrl}
              score={redTeam.score}
              isWinner={redTeam.score > blueTeam.score}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: 48,
              fontSize: 22,
              color: "#5c5f66",
            }}
          >
            MATCH RECORD · NAR.GG
          </div>
        </div>
      ),
      size,
    );
  } catch {
    return FallbackImage();
  }
}
