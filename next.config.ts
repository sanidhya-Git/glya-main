import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.cloudinary.com" },
    ],
  },

  async headers() {
    return [
      {
        // Allow the admin dashboard to call the storefront's API routes if needed
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin",  value: "https://glya-admin.vercel.app" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
