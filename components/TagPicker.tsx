'use client'

import { useEffect, useRef, useState } from 'react'
import { Tag as TagIcon, Plus, X, Check, Loader2 } from 'lucide-react'
import type { Tag } from '@/lib/types'
import { TAG_COLORS } from '@/lib/types'

type Props = {
  userId: string
  noteId: string
  noteTags: Tag[]
  allTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  onTagCreated: (tag: Tag) => void
}

export function TagPicker({ userId, noteId, noteTags, allTags, onTagsChange, onTagCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState<string | null>(null) // tag id currently toggling, or 'new'
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const noteTagIds = new Set(noteTags.map(t => t.id))
  const filtered = allTags.filter(t => t.name.toLowerCase().includes(search.trim().toLowerCase()))
  const exactMatch = allTags.some(t => t.name.toLowerCase() === search.trim().toLowerCase())
  const canCreate = search.trim().length > 0 && !exactMatch

  async function toggleTag(tag: Tag) {
    setBusy(tag.id)
    const isAttached = noteTagIds.has(tag.id)
    try {
      if (isAttached) {
        const res = await fetch(`/api/notes/${noteId}/tags?tag_id=${tag.id}`, { method: 'DELETE' })
        if (res.ok) onTagsChange(await res.json())
      } else {
        const res = await fetch(`/api/notes/${noteId}/tags`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tag_id: tag.id }),
        })
        if (res.ok) onTagsChange(await res.json())
      }
    } finally {
      setBusy(null)
    }
  }

  async function createAndAttach() {
    const name = search.trim()
    if (!name) return
    setBusy('new')
    try {
      const color = TAG_COLORS[allTags.length % TAG_COLORS.length]
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, name, color }),
      })
      if (!res.ok) return
      const tag: Tag = await res.json()
      onTagCreated(tag)

      const attachRes = await fetch(`/api/notes/${noteId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_id: tag.id }),
      })
      if (attachRes.ok) onTagsChange(await attachRes.json())
      setSearch('')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 rounded-full border border-dashed border-zinc-300 px-2.5 py-1 text-xs text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-600 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-zinc-300"
      >
        <TagIcon size={11} />
        {noteTags.length === 0 ? 'Add tag' : 'Edit tags'}
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-60 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          <input
            ref={inputRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && canCreate) createAndAttach() }}
            placeholder="Search or create tag..."
            className="mb-2 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-500"
          />

          <div className="max-h-48 space-y-0.5 overflow-y-auto">
            {filtered.map(tag => {
              const attached = noteTagIds.has(tag.id)
              const isBusy = busy === tag.id
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag)}
                  disabled={isBusy}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span className="min-w-0 flex-1 truncate text-zinc-700 dark:text-zinc-200">{tag.name}</span>
                  {isBusy ? (
                    <Loader2 size={12} className="animate-spin text-zinc-400" />
                  ) : attached ? (
                    <Check size={12} className="text-zinc-900 dark:text-zinc-100" />
                  ) : null}
                </button>
              )
            })}

            {filtered.length === 0 && !canCreate && (
              <p className="px-2 py-3 text-center text-xs text-zinc-400">No tags yet</p>
            )}
          </div>

          {canCreate && (
            <button
              onClick={createAndAttach}
              disabled={busy === 'new'}
              className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-zinc-100 px-2 py-2 text-left text-xs text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              {busy === 'new' ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              Create "{search.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Compact read-only chip list, used on NoteCard
export function TagChips({ tags, max = 3 }: { tags: Tag[]; max?: number }) {
  if (!tags || tags.length === 0) return null
  const visible = tags.slice(0, max)
  const extra = tags.length - visible.length

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map(tag => (
        <span
          key={tag.id}
          className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: tag.color + '1a', color: tag.color }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
          {tag.name}
        </span>
      ))}
      {extra > 0 && (
        <span className="text-[10px] text-zinc-400">+{extra}</span>
      )}
    </div>
  )
}

// Removable chip, used inside NoteDetail's tag editor row
export function RemovableTagChip({ tag, onRemove, busy }: { tag: Tag; onRemove: () => void; busy?: boolean }) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-full py-1 pl-2.5 pr-1.5 text-xs font-medium"
      style={{ backgroundColor: tag.color + '1a', color: tag.color }}
    >
      {tag.name}
      <button
        onClick={onRemove}
        disabled={busy}
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full transition hover:bg-black/10"
      >
        {busy ? <Loader2 size={9} className="animate-spin" /> : <X size={9} />}
      </button>
    </span>
  )
}
