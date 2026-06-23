'use client'

import { useState } from 'react'
import { Archive, Download, Loader2, Tag, Trash2, X } from 'lucide-react'
import type { Tag as TagType } from '@/lib/types'

type Props = {
  count: number
  selectedIds: string[]
  allTags: TagType[]
  userId: string
  onArchive: () => void
  onDelete: () => void
  onExport: (format: 'md' | 'txt') => void
  onTagAll: (tagId: string) => void
  onClear: () => void
}

export function BulkActionBar({ count, selectedIds, allTags, userId, onArchive, onDelete, onExport, onTagAll, onClear }: Props) {
  const [showExport, setShowExport] = useState(false)
  const [showTag, setShowTag] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [archiving, setArchiving] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete ${count} note${count > 1 ? 's' : ''}? This cannot be undone.`)) return
    setDeleting(true)
    await onDelete()
    setDeleting(false)
  }

  async function handleArchive() {
    setArchiving(true)
    await onArchive()
    setArchiving(false)
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
        {/* Count + clear */}
        <button onClick={onClear} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
          <X size={16} />
        </button>
        <span className="mr-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {count} selected
        </span>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Archive */}
          <button
            onClick={handleArchive}
            disabled={archiving}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition"
          >
            {archiving ? <Loader2 size={13} className="animate-spin" /> : <Archive size={13} />}
            Archive
          </button>

          {/* Tag */}
          <div className="relative">
            <button
              onClick={() => { setShowTag(v => !v); setShowExport(false) }}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition"
            >
              <Tag size={13} /> Tag
            </button>
            {showTag && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTag(false)} />
                <div className="absolute left-0 top-9 z-20 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                  {allTags.length === 0 && (
                    <p className="px-3 py-3 text-xs text-zinc-400">No tags yet</p>
                  )}
                  {allTags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => { onTagAll(tag.id); setShowTag(false) }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900 transition"
                    >
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                      {tag.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => { setShowExport(v => !v); setShowTag(false) }}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition"
            >
              <Download size={13} /> Export
            </button>
            {showExport && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExport(false)} />
                <div className="absolute left-0 top-9 z-20 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                  {(['md', 'txt'] as const).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => { onExport(fmt); setShowExport(false) }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900 transition"
                    >
                      {fmt === 'md' ? '📄 Markdown (.md)' : '📃 Plain text (.txt)'}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20 transition"
          >
            {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
