import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // -- DITAMBAHKAN UNTUK MENGHEMAT RAM SAAT BUILD DI STB --
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // -------------------------------------------------------

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
