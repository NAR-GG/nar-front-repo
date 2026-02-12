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
    unoptimized: true,
    loader: "custom",
    loaderFile: "./src/shared/lib/image-loader.ts",
  },
};

export default nextConfig;
