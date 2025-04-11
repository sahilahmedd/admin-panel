import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  // redirects: async () => [
  //   {
  //     source: "/",
  //     destination: "/login",
  //     permanent: false, // Use false if this is temporary
  //   },
  // ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "ibb.co",
      },
      {
        protocol: "https",
        hostname: "rangrezsamaj.kunxite.com",
      },
    ],
  },
};

export default nextConfig;
