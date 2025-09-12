import type { NextConfig } from "next";

const BACKEND_ORIGIN =
  process.env.BACKEND_ORIGIN ??
  (process.env.NODE_ENV === "production"
    ? "https://api.ro-eh.com"      // or "https://api.ro-eh.com:9090"
    : "http://localhost:3000");

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true }, // TEMP while you finish strict typing

  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND_ORIGIN}/api/:path*` },
      { source: "/ask",        destination: `${BACKEND_ORIGIN}/ask` },
      { source: "/ask/stream", destination: `${BACKEND_ORIGIN}/ask/stream` },
      { source: "/health",     destination: `${BACKEND_ORIGIN}/health` },
    ];
  },
};

export default nextConfig;
