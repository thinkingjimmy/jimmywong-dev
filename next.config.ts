import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/writing/hello-world",
        destination: "/writing/no-loyalty-to-ai-coding-tools",
        permanent: true,
      },
      {
        source: "/writing/hello-world.md",
        destination: "/writing/no-loyalty-to-ai-coding-tools.md",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/writing/:slug.md",
        destination: "/writing/md/:slug",
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
