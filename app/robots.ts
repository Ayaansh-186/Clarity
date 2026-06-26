import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://clarity-delta-two.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/login',
          '/how-it-works',
          '/ai-notes-app',
          '/second-brain',
          '/notion-alternative',
          '/discover',
        ],
        disallow: [
          '/api/',
          '/home',
          '/analyze',
          '/chapter-notes',
          '/graph',
          '/digest',
          '/shared/',
          '/reset-password',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
