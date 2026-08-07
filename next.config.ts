import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // The standalone build's file tracer includes sharp's native addon but
  // drops the libvips shared library it dlopen()s at runtime (confirmed via
  // ERR_DLOPEN_FAILED in production on Alpine/musl) — force it in explicitly.
  outputFileTracingIncludes: {
    '/api/ai/generate-image': ['./node_modules/sharp/**/*', './node_modules/@img/**/*'],
  },
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
