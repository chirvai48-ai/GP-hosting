import type { NextConfig } from "next";

// R2-hosted job/news imagery is served from the public r2.dev domain — pull
// the host out of the env var so prod/staging/dev each lock to their own
// bucket's host instead of the wildcard "**" every https host was allowed
// under before.
const r2Hostname = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  ? new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: r2Hostname
      ? [{ protocol: "https", hostname: r2Hostname }]
      : [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
