import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 약관·정책 문서 리다이렉트. 앱(Warding)이 nar.kr/terms, /privacy 를 가리킨다 —
  // 문서 실물(노션)의 주소가 바뀌어도 앱 재심사 없이 여기만 고치면 된다.
  // /account-deletion 은 Play 콘솔 Data safety 의 "계정 삭제 URL" 제출용.
  async redirects() {
    return [
      {
        source: "/terms",
        destination:
          "https://same-robin-1ff.notion.site/Warding-3c9fa15530f7803a85d8d7d8d06c3768",
        permanent: false,
      },
      {
        source: "/privacy",
        destination:
          "https://same-robin-1ff.notion.site/Warding-39dfa15530f780d7809eed00f266a631",
        permanent: false,
      },
      {
        source: "/account-deletion",
        destination:
          "https://same-robin-1ff.notion.site/Warding-3a1fa15530f780baad3ef35f7ea10100",
        permanent: false,
      },
    ];
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgProps: {
                className: "block",
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
