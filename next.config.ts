/**
 * [INPUT]: Next.js configuration types and the Markdown article route convention.
 * [OUTPUT]: NextConfig for Markdown rewrites, cached routes, and Tailwind processing.
 * [POS]: Application framework configuration shared by development and production builds.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [];
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
