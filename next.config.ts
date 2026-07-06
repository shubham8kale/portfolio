import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // profile.md is read with fs at runtime by /api/chat — force-include it in
  // the serverless bundle so Vercel's file tracing never drops it.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/profile.md"],
  },
};

export default nextConfig;
