import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

async function callGroq(prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 200,
    }),
  })
  if (!res.ok) throw new Error('Groq error')
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() ?? '{}'
}

export async function POST(request: NextRequest) {
  try {
    const { note_id, user_id } = await request.json()
    if (!note_id || !user_id) {
      return NextResponse.json({ error: 'note_id and user_id required' }, { status: 400 })
    }

    // Fetch the source note
    const { data: source } = await supabase
      .from('notes')
      .select('id, title, raw_content, cluster')
      .eq('id', note_id)
      .single()

    if (!source) return NextResponse.json({ error: 'Note not found' }, { status: 404 })

    // Fetch up to 60 other notes from the same user (exclude current, exclude archived)
    const { data: candidates } = await supabase
      .from('notes')
      .select('id, title, raw_content, cluster, created_at')
      .eq('user_id', user_id)
      .eq('is_archived', false)
      .neq('id', note_id)
      .order('created_at', { ascending: false })
      .limit(60)

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ related: [] })
    }

    // Build a compact candidate list for the model
    const candidateList = candidates.map((n, i) =>
      `[${i}] id=${n.id} | cluster=${n.cluster ?? 'unknown'} | title=${n.title ?? 'Untitled'} | preview=${(n.raw_content ?? '').slice(0, 120)}`
    ).join('\n')

    const prompt = `You are a knowledge assistant. Given a source note and a list of candidate notes, return the IDs of the 4 most semantically related candidates.

SOURCE NOTE:
Title: ${source.title ?? 'Untitled'}
Cluster: ${source.cluster ?? 'unknown'}
Content: ${(source.raw_content ?? '').slice(0, 400)}

CANDIDATES (format: [index] id=... | cluster=... | title=... | preview=...):
${candidateList}

Return ONLY a valid JSON object like: {"ids": ["<id1>", "<id2>", "<id3>", "<id4>"]}
Pick notes that share topics, themes, or concepts with the source. No explanation, no markdown, just JSON.`

    let raw = '{}'
    try {
      raw = await callGroq(prompt)
    } catch {
      return NextResponse.json({ related: [] })
    }
    let relatedIds: string[] = []
    try {
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      relatedIds = (parsed.ids ?? []).filter((id: unknown) =>
        typeof id === 'string' && candidates.some(c => c.id === id)
      ).slice(0, 4)
    } catch {
      return NextResponse.json({ related: [] })
    }

    // Fetch full note data for the related IDs (with tags)
    if (relatedIds.length === 0) return NextResponse.json({ related: [] })

    const { data: related } = await supabase
      .from('notes')
      .select('id, title, raw_content, cluster, created_at, is_pinned, is_archived, relevance, image_url, formatted_content, updated_at, user_id')
      .in('id', relatedIds)

    return NextResponse.json({ related: related ?? [] })
  } catch (err) {
    console.error('Related notes error:', err)
    return NextResponse.json({ related: [] })
  }
}
