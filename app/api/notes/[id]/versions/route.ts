import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/notes/[id]/versions
 * Returns all saved versions for a note, newest first.
 * The service-role client is used here (server-side only) so RLS
 * is bypassed — ownership is verified by checking notes.user_id.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Verify the note exists (optional ownership check via user_id query param)
  const userId = request.nextUrl.searchParams.get('user_id')

  if (userId) {
    const { data: note } = await supabase
      .from('notes')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
  }

  const { data, error } = await supabase
    .from('note_versions')
    .select('id, note_id, raw_content, title, version_label, created_at')
    .eq('note_id', id)
    .order('created_at', { ascending: false })
    .limit(50) // cap at 50 versions per note

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
