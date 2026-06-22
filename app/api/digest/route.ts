import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

async function callGroq(prompt: string, maxTokens = 600): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  })
  if (!res.ok) throw new Error('Groq error')
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() ?? ''
}

export async function POST(request: NextRequest) {
  try {
    const { user_id } = await request.json()
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Notes created or updated this week
    const { data: recentNotes } = await supabase
      .from('notes')
      .select('id, title, raw_content, cluster, created_at, updated_at, is_pinned')
      .eq('user_id', user_id)
      .eq('is_archived', false)
      .gte('updated_at', weekAgo.toISOString())
      .order('updated_at', { ascending: false })
      .limit(30)

    // Stale notes: created > 2 weeks ago, not touched recently, not pinned
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    const { data: staleNotes } = await supabase
      .from('notes')
      .select('id, title, raw_content, cluster, created_at, updated_at, is_pinned')
      .eq('user_id', user_id)
      .eq('is_archived', false)
      .eq('is_pinned', false)
      .lt('updated_at', twoWeeksAgo.toISOString())
      .order('relevance', { ascending: false })
      .limit(10)

    // Pinned notes not touched in 7+ days (dormant priorities)
    const { data: dormantPinned } = await supabase
      .from('notes')
      .select('id, title, raw_content, cluster, created_at, updated_at, is_pinned')
      .eq('user_id', user_id)
      .eq('is_archived', false)
      .eq('is_pinned', true)
      .lt('updated_at', weekAgo.toISOString())
      .limit(5)

    // Total note count
    const { count: totalCount } = await supabase
      .from('notes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('is_archived', false)

    const formatNotes = (notes: typeof recentNotes) =>
      (notes ?? []).map(n =>
        `- [${n.cluster ?? 'misc'}] "${n.title ?? 'Untitled'}" — ${(n.raw_content ?? '').slice(0, 100)}...`
      ).join('\n')

    const prompt = `You are Clarity, a thoughtful AI note assistant. Generate a weekly digest for a user.

RECENT (this week, ${recentNotes?.length ?? 0} notes):
${formatNotes(recentNotes)}

STALE NOTES TO RESURFACE (${staleNotes?.length ?? 0} notes — not touched in 2+ weeks):
${formatNotes(staleNotes)}

DORMANT PRIORITIES (pinned but untouched 7+ days, ${dormantPinned?.length ?? 0} notes):
${formatNotes(dormantPinned)}

TOTAL ACTIVE NOTES: ${totalCount ?? 0}

Write a warm, concise weekly digest in markdown. Structure:
1. **This week** — 2-3 sentences summarising themes and activity
2. **Worth revisiting** — bullet list of 2-3 stale notes worth re-reading (mention titles)
3. **Dormant priorities** — mention any pinned notes that haven't been touched (gently nudge)
4. **One insight** — a single useful observation about patterns across their notes

Keep it under 250 words. Be specific, not generic. Reference actual note titles where possible. Tone: a smart friend doing a weekly review with you.`

    const digest = await callGroq(prompt)

    // Compute cluster breakdown for the week
    const clusterCounts: Record<string, number> = {}
    for (const n of recentNotes ?? []) {
      const c = n.cluster ?? 'other'
      clusterCounts[c] = (clusterCounts[c] ?? 0) + 1
    }

    return NextResponse.json({
      digest,
      stats: {
        thisWeek: recentNotes?.length ?? 0,
        stale: staleNotes?.length ?? 0,
        dormantPinned: dormantPinned?.length ?? 0,
        total: totalCount ?? 0,
        clusterBreakdown: clusterCounts,
      },
      staleNoteIds: (staleNotes ?? []).map(n => n.id),
      dormantPinnedIds: (dormantPinned ?? []).map(n => n.id),
    })
  } catch (err) {
    console.error('Digest error:', err)
    return NextResponse.json({ error: 'Failed to generate digest' }, { status: 500 })
  }
}
