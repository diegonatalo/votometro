import type { NextConfig } from "next";
import { REDIRECTS } from "@/lib/redirects";
import { SECURITY_HEADERS } from "@/lib/security-headers";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  redirects: async () => REDIRECTS,
  headers: async () => SECURITY_HEADERS,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
