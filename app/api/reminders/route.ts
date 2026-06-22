import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/reminders?user_id=xxx  — fetch all non-dismissed reminders for the user
export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get('user_id')
  if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('note_reminders')
    .select(`
      id,
      note_id,
      remind_at,
      label,
      dismissed,
      created_at,
      notes (id, title, raw_content, cluster, is_archived)
    `)
    .eq('user_id', user_id)
    .eq('dismissed', false)
    .order('remind_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST /api/reminders — create a reminder
// Body: { user_id, note_id, remind_at (ISO string), label? }
export async function POST(request: NextRequest) {
  try {
    const { user_id, note_id, remind_at, label } = await request.json()
    if (!user_id || !note_id || !remind_at) {
      return NextResponse.json({ error: 'user_id, note_id, remind_at required' }, { status: 400 })
    }

    // Upsert: one active reminder per note (replace existing undismissed one)
    const { data: existing } = await supabase
      .from('note_reminders')
      .select('id')
      .eq('user_id', user_id)
      .eq('note_id', note_id)
      .eq('dismissed', false)
      .maybeSingle()

    if (existing) {
      const { data, error } = await supabase
        .from('note_reminders')
        .update({ remind_at, label: label ?? null })
        .eq('id', existing.id)
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('note_reminders')
      .insert({ user_id, note_id, remind_at, label: label ?? null, dismissed: false })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// DELETE /api/reminders?id=xxx — dismiss a reminder
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabase
    .from('note_reminders')
    .update({ dismissed: true })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
