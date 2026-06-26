import type { Metadata } from 'next'
import Link from 'next/link'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://clarity-delta-two.vercel.app'

export const metadata: Metadata = {
  title: 'ClearMind — AI Notes App | Your Self-Organizing Second Brain',
  description: 'ClearMind is an AI-powered notes app that transforms scattered thoughts into organized knowledge. Capture ideas by text, voice, or photo — AI automatically titles, formats, and clusters everything. Free.',
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'ClearMind — AI Notes App | Your Self-Organizing Second Brain',
    description: 'Drop any thought. AI sorts, formats, and clusters it instantly.',
    url: siteUrl,
    type: 'website',
  },
}

const features = [
  { icon: '✦', title: 'Auto-clustering', desc: 'Every note sorted into Work, Ideas, Personal, Learning, or Health — the moment you save it.' },
  { icon: '🎙️', title: 'Voice capture', desc: 'Record anywhere. Whisper AI transcribes and formats it into a clean, titled note.' },
  { icon: '🔗', title: 'Related notes', desc: 'AI surfaces the 4 most semantically related notes every time you open one.' },
  { icon: '⌘', title: 'Command palette', desc: 'Jump to any note or view instantly with ⌘K. Built for keyboard lovers.' },
  { icon: '📅', title: 'Reminders', desc: 'Snooze a note to resurface in an hour, tomorrow, or any custom date.' },
  { icon: '🌐', title: 'Discover feed', desc: 'Browse public notes from the community. Save anything interesting to your library.' },
]

const steps = [
  { n: '01', title: 'Drop any thought', body: 'Type, record your voice, or snap a photo. As messy as you like.' },
  { n: '02', title: 'AI does the rest', body: 'Titles it, formats it, clusters it, and links it to related notes — instantly.' },
  { n: '03', title: 'Find anything, always', body: 'Search, browse by cluster, or ask the AI chat. Nothing gets lost.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ClearMind',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  description: 'Self-organising AI notes app. Capture ideas, voice notes, and thoughts — AI sorts, formats, and clusters them automatically.',
  url: siteUrl,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

        {/* Nav */}
        <nav style={{ borderBottom: '1px solid var(--card-border)' }}>
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-md" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
                  <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z"/>
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight">
                Clear<span className="brand-gradient">Mind</span>
              </span>
            </Link>
            <div className="hidden items-center gap-6 text-sm sm:flex" style={{ color: 'var(--muted)' }}>
              <Link href="/how-it-works" className="transition hover:text-indigo-500">How it works</Link>
              <Link href="/ai-notes-app" className="transition hover:text-indigo-500">AI Notes</Link>
              <Link href="/second-brain" className="transition hover:text-indigo-500">Second Brain</Link>
              <Link href="/discover" className="transition hover:text-indigo-500">Discover</Link>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/login" className="hidden text-sm font-medium transition hover:text-indigo-500 sm:block" style={{ color: 'var(--muted)' }}>
                Sign in
              </Link>
              <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                Get started free →
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
            style={{ borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.06)', color: '#6366f1' }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
            Free · No credit card · Works in browser
          </div>
          <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Notes that think<br />
            <span className="brand-gradient">for themselves</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
            Drop any thought — a quick idea, a voice memo, a photo. ClearMind uses AI to sort, format, and connect it automatically. No folders needed.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className="w-full rounded-2xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 sm:w-auto"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              Start for free — no card needed
            </Link>
            <Link href="/discover" className="w-full rounded-2xl border px-8 py-3.5 text-sm font-medium transition hover:opacity-80 sm:w-auto"
              style={{ borderColor: 'var(--card-border)', color: 'var(--muted)', background: 'var(--card)' }}>
              Browse community notes →
            </Link>
          </div>
        </section>


        {/* How it works */}
        <section className="mx-auto max-w-3xl px-6 pb-24">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight">Three steps, zero filing</h2>
          <div className="space-y-4">
            {steps.map(s => (
              <div key={s.n} className="flex gap-5 rounded-2xl p-5"
                style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {s.n}
                </div>
                <div>
                  <div className="mb-1 text-sm font-semibold">{s.title}</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/how-it-works" className="text-sm font-medium text-indigo-500 hover:underline">
              See the full breakdown →
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight">Everything your brain needs</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(f => (
              <div key={f.title} className="rounded-2xl p-6 card-lift transition"
                style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
                <div className="mb-3 text-2xl">{f.icon}</div>
                <h3 className="mb-1.5 text-sm font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product Hunt embed */}
        <section className="pb-16 text-center">
          <a
            href="https://www.producthunt.com/products/clearmind-9?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-clearmind-9"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="ClearMind - Notes that organise themselves with AI. | Product Hunt"
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1180685&theme=light"
              style={{ width: 250, height: 54, margin: '0 auto' }}
              width="250"
              height="54"
            />
          </a>
        </section>

        {/* CTA */}
        <section className="py-20 text-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white">Your second brain, sorted.</h2>
          <p className="mb-8 text-indigo-200">Free. Works in your browser. No setup needed.</p>
          <Link href="/login" className="inline-flex rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-600 shadow-lg transition hover:bg-indigo-50">
            Get started free →
          </Link>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8" style={{ borderTop: '1px solid var(--card-border)' }}>
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
                </svg>
              </div>
              <span className="text-sm font-bold">Clear<span className="brand-gradient">Mind</span></span>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              © {new Date().getFullYear()} ClearMind. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-5 text-xs" style={{ color: 'var(--muted)' }}>
              <Link href="/how-it-works" className="hover:text-indigo-500 transition">How it works</Link>
              <Link href="/ai-notes-app" className="hover:text-indigo-500 transition">AI Notes</Link>
              <Link href="/second-brain" className="hover:text-indigo-500 transition">Second Brain</Link>
              <Link href="/discover" className="hover:text-indigo-500 transition">Discover</Link>
              <Link href="/login" className="hover:text-indigo-500 transition">Sign in</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
