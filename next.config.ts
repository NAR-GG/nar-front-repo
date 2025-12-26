import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/champions-meta",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
