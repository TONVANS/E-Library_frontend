import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/elibrary",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/elibrary",
        basePath: false,
        permanent: false,
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
