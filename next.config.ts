import type { NextConfig } from "next";

const BACKEND_ORIGIN = "https://api.ro-eh.com";
  //process.env.BACKEND_ORIGIN ??
  //(process.env.NODE_ENV === "test"
    //? "https://api.ro-eh.com"
    //: "http://localhost:3000");

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },

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
