import React, { useEffect, useRef } from 'react';

const KakaoAdFit = ({ adUnit, adWidth, adHeight }) => {
    const adContainerRef = useRef(null);

    useEffect(() => {
        const container = adContainerRef.current;

        if (!window.adfit) {
            // 스크립트 1회 로드
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js'; // 프로토콜 명시 권장
            script.async = true;
            container?.appendChild(script);
        } else {
            if (window.adfit.render) window.adfit.render(adUnit);
        }

        // clean-up
        return () => {
            if (container) container.innerHTML = '';
        };
    }, [adUnit]); // adUnit 변경 시만 재실행

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <div ref={adContainerRef}>
                <ins
                    className="kakao_ad_area"
                    style={{ display: 'none' }}
                    data-ad-unit={adUnit}
                    data-ad-width={adWidth}
                    data-ad-height={adHeight}
                />
            </div>
        </div>
    );
};

export default KakaoAdFit;
