import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/champions-meta",
        permanent: false,
      },
      {
        source: "/pro-matches",
        destination: "/pro-matches/schedule",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
