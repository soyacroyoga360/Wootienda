import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // sharp's runtime deps are handled by a dedicated Docker stage instead
  // (outputFileTracingIncludes did not fix it under Turbopack — see Dockerfile).
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Supabase Storage — hosts AI-generated product images and user uploads.
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
