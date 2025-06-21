import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "d3tcpqi372xhby.cloudfront.net",
      },
    ],
  }
};

export default nextConfig;
