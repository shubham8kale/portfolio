import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack's filesystem cache (on by default since 16.3) kept serving a
  // stale app/globals.css after it changed: a build restored from Vercel's
  // cache shipped the old theme tokens (no dark mode, blank tactical board).
  // Reproduced locally by building on a previous commit's .next/cache; a
  // clean build was correct. Off for both until that is fixed upstream.
  experimental: {
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
  // profile.md is read with fs at runtime by /api/chat — force-include it in
  // the serverless bundle so Vercel's file tracing never drops it.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/profile.md"],
  },
};

export default nextConfig;
