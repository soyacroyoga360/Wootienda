import type { NextConfig } from "next";

// Self-hosted Supabase is reached by raw IP:port today (no domain yet), so
// this can't be a static "*.supabase.co" pattern — read it from the same env
// var the app itself uses, so it stays correct once a real domain is added.
const supabaseRemotePattern = (() => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || undefined,
    }
  } catch {
    return null
  }
})()

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
        // Supabase Cloud, if that's ever what NEXT_PUBLIC_SUPABASE_URL points to.
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      ...(supabaseRemotePattern ? [supabaseRemotePattern] : []),
    ],
  },
};

export default nextConfig;
