'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Loader2, RefreshCw, Sparkles, BookOpen, Pin, Archive } from 'lucide-react'
import { clusterColors } from '@/lib/types'

function getBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

type Stats = {
  thisWeek: number
  stale: number
  dormantPinned: number
  total: number
  clusterBreakdown: Record<string, number>
}

export default function DigestPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [digest, setDigest] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = getBrowserClient()
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) { router.replace('/login'); return }
      const uid = data.session.user.id
      setUserId(uid)
      generate(uid)
    })
  }, [router])

  async function generate(uid?: string) {
    const id = uid ?? userId
    if (!id) return
    setLoading(true)
    setError('')
    setDigest(null)
    setStats(null)
    try {
      const res = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setDigest(data.digest)
      setStats(data.stats)
    } catch {
      setError('Could not generate digest. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const topClusters = stats
    ? Object.entries(stats.clusterBreakdown)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : []

  return (
    <main className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 md:pl-[260px]">
      <div className="mx-auto max-w-2xl px-5 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 transition"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Weekly Digest</h1>
            <p className="mt-0.5 text-sm text-zinc-500">AI review of your notes this week</p>
          </div>
          <button
            onClick={() => generate()}
            disabled={loading}
            className="ml-auto flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Regenerate
          </button>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={<Sparkles size={16} />} label="This week" value={stats.thisWeek} color="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30" />
            <StatCard icon={<BookOpen size={16} />} label="Total notes" value={stats.total} color="bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300" />
            <StatCard icon={<Archive size={16} />} label="Stale notes" value={stats.stale} color="bg-amber-50 text-amber-600 dark:bg-amber-950/30" />
            <StatCard icon={<Pin size={16} />} label="Dormant pins" value={stats.dormantPinned} color="bg-rose-50 text-rose-600 dark:bg-rose-950/30" />
          </div>
        )}

        {/* Cluster breakdown */}
        {topClusters.length > 0 && (
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">This week by cluster</p>
            <div className="flex flex-wrap gap-2">
              {topClusters.map(([cluster, count]) => {
                const colors = clusterColors[cluster]
                return (
                  <span
                    key={cluster}
                    className="rounded-full px-3 py-1.5 text-xs font-medium capitalize"
                    style={colors ? { backgroundColor: colors.bg, color: colors.text } : {}}
                  >
                    {cluster} · {count}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Digest content */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-zinc-400">
            <Loader2 size={28} className="animate-spin" />
            <p className="text-sm">Reviewing your notes…</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        {digest && !loading && (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <Sparkles size={14} />
              </div>
              <span className="text-sm font-semibold">Clarity AI</span>
              <span className="ml-auto text-xs text-zinc-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="prose-sm text-zinc-700 dark:text-zinc-300 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:mb-2 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-zinc-900 dark:[&_strong]:text-zinc-100 leading-7 text-sm">
              <ReactMarkdown>{digest}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`mb-2 inline-flex rounded-lg p-1.5 ${color}`}>{icon}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-0.5 text-xs text-zinc-500">{label}</div>
    </div>
  )
}
