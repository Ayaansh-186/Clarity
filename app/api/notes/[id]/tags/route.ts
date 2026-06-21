import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/notes/[id]/tags  { tag_id }
// Attaches a tag to a note. Idempotent (composite PK prevents duplicates).
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: noteId } = await params
  const body = await request.json().catch(() => ({}))
  const tagId = body.tag_id as string | undefined

  if (!tagId) {
    return NextResponse.json({ error: 'tag_id is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('note_tags')
    .upsert({ note_id: noteId, tag_id: tagId }, { onConflict: 'note_id,tag_id' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return the note's full updated tag list
  const { data: tags } = await supabase
    .from('note_tags')
    .select('tags(*)')
    .eq('note_id', noteId)

  const flat = (tags ?? []).map((row: unknown) => (row as { tags: unknown }).tags)
  return NextResponse.json(flat)
}

// DELETE /api/notes/[id]/tags?tag_id=...
// Detaches a tag from a note.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: noteId } = await params
  const tagId = request.nextUrl.searchParams.get('tag_id')

  if (!tagId) {
    return NextResponse.json({ error: 'tag_id is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('note_tags')
    .delete()
    .eq('note_id', noteId)
    .eq('tag_id', tagId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: tags } = await supabase
    .from('note_tags')
    .select('tags(*)')
    .eq('note_id', noteId)

  const flat = (tags ?? []).map((row: unknown) => (row as { tags: unknown }).tags)
  return NextResponse.json(flat)
}
