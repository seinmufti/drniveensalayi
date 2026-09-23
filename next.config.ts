import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/drniveen",
  allowedDevOrigins: [
    "192.168.1.*",
    "172.20.10.*",
    "10.*.*.*",
  ],
};

export default nextConfig;
