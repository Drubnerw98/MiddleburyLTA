// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["storage.googleapis.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // Optional: keep if you're doing file uploads
    },
  },
};

export default nextConfig;
