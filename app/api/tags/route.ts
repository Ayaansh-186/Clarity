import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/tags?user_id=...
// Returns all tags for a user, each with a note_count.
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id')
  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!tags || tags.length === 0) {
    return NextResponse.json([])
  }

  // Get note counts per tag (only counting non-archived notes)
  const { data: links } = await supabase
    .from('note_tags')
    .select('tag_id, notes!inner(is_archived)')
    .in('tag_id', tags.map(t => t.id))

  const counts: Record<string, number> = {}
  for (const link of links ?? []) {
    const archived = (link as unknown as { notes: { is_archived: boolean } }).notes?.is_archived
    if (!archived) {
      counts[link.tag_id] = (counts[link.tag_id] ?? 0) + 1
    }
  }

  const withCounts = tags.map(t => ({ ...t, note_count: counts[t.id] ?? 0 }))
  return NextResponse.json(withCounts)
}

// POST /api/tags  { user_id, name, color? }
// Creates a tag. Returns existing tag if name already exists (idempotent).
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const userId = body.user_id as string | undefined
  const rawName = body.name as string | undefined
  const color = (body.color as string | undefined) ?? '#6366F1'

  if (!userId || !rawName?.trim()) {
    return NextResponse.json({ error: 'user_id and name are required' }, { status: 400 })
  }

  const name = rawName.trim().slice(0, 40)

  // Check for existing tag with same name (case-insensitive)
  const { data: existing } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId)
    .ilike('name', name)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(existing)
  }

  const { data, error } = await supabase
    .from('tags')
    .insert({ user_id: userId, name, color })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
