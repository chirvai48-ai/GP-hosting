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
    remotePatterns: [
      ...(r2Hostname ? [{ protocol: "https" as const, hostname: r2Hostname }] : []),
      // Backend serves presigned GetObject URLs from the R2 S3 endpoint
      // (e.g. glowingpartner.<account-id>.r2.cloudflarestorage.com), not
      // the public r2.dev domain above — both hosts need to be allowed.
      { protocol: "https" as const, hostname: "*.r2.cloudflarestorage.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
