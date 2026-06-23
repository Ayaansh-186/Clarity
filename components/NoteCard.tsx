'use client'

import { Pin, CheckCircle2, Circle } from 'lucide-react'
import { clusterColors, type Note } from '@/lib/types'
import { TagChips } from '@/components/TagPicker'

type Props = {
  note: Note
  onOpen: (note: Note) => void
  onTogglePin?: (note: Note) => void
  // Bulk select
  selectable?: boolean
  selected?: boolean
  onSelect?: (note: Note) => void
}

function relativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.max(1, Math.floor(diff / 60000))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function NoteCard({ note, onOpen, onTogglePin, selectable, selected, onSelect }: Props) {
  const colors = note.cluster ? clusterColors[note.cluster] : null
  const isProcessing = !note.title

  function handleClick(e: React.MouseEvent) {
    if (selectable) { e.preventDefault(); onSelect?.(note); return }
    onOpen(note)
  }

  function handlePinClick(e: React.MouseEvent) {
    e.stopPropagation()
    onTogglePin?.(note)
  }

  function handleLongPress() {
    if (!selectable) onSelect?.(note)
  }

  // Long-press support for mobile
  let pressTimer: ReturnType<typeof setTimeout> | null = null
  function onTouchStart() {
    pressTimer = setTimeout(handleLongPress, 500)
  }
  function onTouchEnd() {
    if (pressTimer) { clearTimeout(pressTimer); pressTimer = null }
  }

  return (
    <button
      onClick={handleClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchEnd}
      className={`group relative flex min-h-[13rem] w-full flex-col rounded-xl border p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        selected
          ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 ring-2 ring-zinc-950 dark:ring-white'
          : note.is_pinned
            ? 'border-amber-200 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/10'
            : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700'
      }`}
    >
      {/* Bulk select checkbox */}
      {selectable && (
        <span className="absolute right-3 top-3 z-10">
          {selected
            ? <CheckCircle2 size={20} className="text-white dark:text-zinc-950" fill="currentColor" />
            : <Circle size={20} className="text-zinc-300 dark:text-zinc-600" />}
        </span>
      )}

      {/* Pin toggle — hide in select mode */}
      {!selectable && onTogglePin && (
        <span
          role="button"
          tabIndex={0}
          onClick={handlePinClick}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePinClick(e as unknown as React.MouseEvent) } }}
          aria-label={note.is_pinned ? 'Unpin note' : 'Pin note'}
          title={note.is_pinned ? 'Unpin note' : 'Pin note'}
          className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full transition ${
            note.is_pinned
              ? 'text-amber-500 opacity-100'
              : 'text-zinc-300 opacity-60 hover:text-zinc-500 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 dark:text-zinc-700 dark:hover:text-zinc-400'
          }`}
        >
          <Pin size={15} fill={note.is_pinned ? 'currentColor' : 'none'} className={note.is_pinned ? 'rotate-0' : '-rotate-45'} />
        </span>
      )}

      {/* Top row */}
      <div className="mb-3 flex items-center justify-between gap-2 pr-7">
        {colors ? (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${selected ? 'bg-white/20 text-white dark:bg-zinc-950/20 dark:text-zinc-950' : ''}`}
            style={!selected ? { backgroundColor: colors.bg, color: colors.text } : {}}>
            {note.cluster}
          </span>
        ) : (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${selected ? 'bg-white/20 text-white dark:bg-zinc-950/20 dark:text-zinc-950' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-900'}`}>
            {isProcessing ? (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '0ms' }} />
                <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '150ms' }} />
                <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '300ms' }} />
              </span>
            ) : 'unsorted'}
          </span>
        )}
        <span className={`shrink-0 text-xs ${selected ? 'text-white/70 dark:text-zinc-950/60' : 'text-zinc-400'}`}>{relativeTime(note.created_at)}</span>
      </div>

      {/* Title */}
      {isProcessing ? (
        <div className="space-y-2">
          <div className="h-5 w-3/4 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : (
        <h3 className={`line-clamp-2 text-base font-semibold leading-snug ${selected ? 'text-white dark:text-zinc-950' : 'text-zinc-950 dark:text-zinc-50'}`}>
          {note.title}
        </h3>
      )}

      {/* Preview */}
      <p className={`mt-2 line-clamp-2 text-sm leading-relaxed ${selected ? 'text-white/70 dark:text-zinc-950/60' : 'text-zinc-500 dark:text-zinc-400'}`}>
        {note.raw_content}
      </p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && !selected && (
        <div className="mt-3">
          <TagChips tags={note.tags} />
        </div>
      )}

      {/* Relevance dots */}
      <div className="mt-auto flex items-center gap-1 pt-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${
            i < note.relevance
              ? selected ? 'bg-white/80 dark:bg-zinc-950/80' : 'bg-zinc-800 dark:bg-zinc-200'
              : selected ? 'bg-white/20 dark:bg-zinc-950/20' : 'bg-zinc-200 dark:bg-zinc-700'
          }`} />
        ))}
        <span className={`ml-1.5 text-xs ${selected ? 'text-white/60 dark:text-zinc-950/50' : 'text-zinc-400'}`}>{note.relevance}/10</span>
      </div>
    </button>
  )
}
