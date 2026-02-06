import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy all /api requests to HF Space backend
    // This makes cookies same-origin (no third-party cookie blocking)
    const backendUrl = "https://tayyabaali-todoflow-backend.hf.space";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
