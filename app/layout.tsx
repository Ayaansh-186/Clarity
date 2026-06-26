import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://clarity-delta-two.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ClearMind — AI Notes App | Your Self-Organizing Second Brain',
    template: '%s · ClearMind',
  },
  description: 'ClearMind is an AI-powered notes app that transforms scattered thoughts into organized knowledge. Capture ideas by text, voice, or photo — AI automatically titles, formats, and clusters everything. Free.',
  keywords: [
    'AI notes app',
    'AI note taking app',
    'second brain app',
    'self organizing notes',
    'AI productivity app',
    'knowledge management app',
    'Notion alternative',
    'smart notes app',
    'voice notes AI',
    'auto organize notes',
    'ClearMind',
  ],
  authors: [{ name: 'ClearMind', url: siteUrl }],
  creator: 'ClearMind',
  publisher: 'ClearMind',
  category: 'Productivity',
  applicationName: 'ClearMind',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'ClearMind',
    title: 'ClearMind — AI Notes App | Your Self-Organizing Second Brain',
    description: 'ClearMind transforms scattered thoughts into organized knowledge. AI automatically titles, formats, and clusters your notes. Free to use.',
    locale: 'en_US',
    images: [{
      url: `${siteUrl}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: 'ClearMind — AI Notes That Organise Themselves',
      type: 'image/png',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClearMind — AI Notes App | Your Self-Organizing Second Brain',
    description: 'Your scattered thoughts become organized knowledge. AI notes that sort, format, and cluster themselves.',
    images: [`${siteUrl}/opengraph-image`],
    creator: '@clearmindapp',
  },
  verification: {
    google: 'Qo96PyK2oa9EqZfTJwp0TFAtwVQ_j45WQC96H4_KB2w',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('clearmind_theme');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (theme === 'dark' || (!theme && prefersDark)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="min-h-full bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">{children}</body>
    </html>
  )
}
