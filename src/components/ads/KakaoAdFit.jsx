import React, { useEffect, useRef } from 'react';

const KakaoAdFit = ({ adUnit, adWidth, adHeight }) => {
    // 광고 컨테이너를 참조하기 위해 useRef를 사용합니다.
    const adContainerRef = useRef(null);

    useEffect(() => {
        // 이 컴포넌트가 처음 화면에 그려질 때(마운트될 때)만 실행됩니다.
        // React.StrictMode를 사용하면 개발 환경에서 두 번 호출될 수 있으나, 프로덕션 환경에서는 한 번만 실행됩니다.
        if (adContainerRef.current && adContainerRef.current.childElementCount === 0) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
            script.async = true;

            adContainerRef.current.appendChild(script);
        }
    }, []); // 의존성 배열을 비워두어 최초 1회만 실행되도록 설정

    return (
        // 광고를 가운데 정렬하기 위한 wrapper div
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <ins
                className="kakao_ad_area"
                style={{ display: 'none' }}
                data-ad-unit={adUnit}
                data-ad-width={adWidth}
                data-ad-height={adHeight}
            ></ins>
            {/* 스크립트를 동적으로 추가할 컨테이너 */}
            <div ref={adContainerRef}></div>
        </div>
    );
};

export default KakaoAdFit;