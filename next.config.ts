import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgnews.pstatic.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.lolesports.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
