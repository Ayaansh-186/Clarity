/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't fail production builds on lint errors/warnings.
    // Run `npx eslint .` locally to see and fix issues.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'buoloivoecavrflaehos.supabase.co',
      },
    ],
  },
}

export default nextConfig
