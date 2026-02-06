import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy all /api requests to HF Space backend
    // This makes cookies same-origin (no third-party cookie blocking)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "https://tayyabaali-todoflow-backend.hf.space";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
