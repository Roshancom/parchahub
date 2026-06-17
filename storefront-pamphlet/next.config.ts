import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
