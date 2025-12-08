import React, { useEffect, useRef } from "react";

const KakaoAdFit = ({ adUnit, adWidth, adHeight }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. 기존 내용을 깨끗하게 비웁니다 (중복 방지)
    const container = containerRef.current;
    container.innerHTML = "";

    // 2. <ins> 태그를 동적으로 생성합니다.
    // (React가 아니라 JS가 직접 만들기 때문에 충돌이 없습니다)
    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.style.width = "100%";
    ins.setAttribute("data-ad-unit", adUnit);
    ins.setAttribute("data-ad-width", adWidth);
    ins.setAttribute("data-ad-height", adHeight);

    // 3. 스크립트 태그 생성
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    script.type = "text/javascript";

    // 4. DOM에 순서대로 추가 (ins 먼저, 그 뒤에 script)
    container.appendChild(ins);
    container.appendChild(script);

    // Clean-up: 컴포넌트가 사라질 때 내용물 삭제
    return () => {
      container.innerHTML = "";
    };
  }, [adUnit, adWidth, adHeight]); // 광고 단위가 바뀌면 새로고침

  // 5. JSX에서는 껍데기(container)만 렌더링합니다.
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
};

export default KakaoAdFit;
