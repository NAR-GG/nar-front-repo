"use client";

import { useEffect, useRef } from "react";

interface KakaoAdFitProps {
  adUnit: string;
  adWidth: string;
  adHeight: string;
}

export function KakaoAdFit({ adUnit, adWidth, adHeight }: KakaoAdFitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // 1. 기존 내용 초기화
    container.innerHTML = "";

    // 2. ins 태그 생성 (광고 자리)
    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.style.width = "100%";

    ins.setAttribute("data-ad-unit", adUnit);
    ins.setAttribute("data-ad-width", adWidth);
    ins.setAttribute("data-ad-height", adHeight);

    // 3. 스크립트 생성
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    script.type = "text/javascript";

    // 4. DOM 삽입
    container.appendChild(ins);
    container.appendChild(script);

    // 클린업
    return () => {
      container.innerHTML = "";
    };
  }, [adUnit, adWidth, adHeight]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        margin: "20px 0",
      }}
    />
  );
}
