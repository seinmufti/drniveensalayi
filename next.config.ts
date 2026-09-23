import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95],
  },
  allowedDevOrigins: [
    "192.168.1.*",
    "172.20.10.*",
    "10.*.*.*",
  ],
};

export default nextConfig;
