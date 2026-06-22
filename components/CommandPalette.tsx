'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Archive, BarChart2, BookOpen, Brain, Clock3, Network, Search, Sparkles, X, Pin, FileText } from 'lucide-react'
import { clusterColors, clusters, type Note } from '@/lib/types'

type Action = {
  id: string
  label: string
  subtitle?: string
  icon: React.ReactNode
  onSelect: () => void
  group: 'navigation' | 'note' | 'tool'
}

type Props = {
  notes: Note[]
  onOpenNote: (note: Note) => void
  onChangeView: (view: string) => void
  onClose: () => void
}

export function CommandPalette({ notes, onOpenNote, onChangeView, onClose }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const navActions: Action[] = [
    { id: 'nav-surface', label: 'What matters now', icon: <Sparkles size={15} />, onSelect: () => { onChangeView('surface'); onClose() }, group: 'navigation' },
    { id: 'nav-all', label: 'All notes', icon: <Brain size={15} />, onSelect: () => { onChangeView('all'); onClose() }, group: 'navigation' },
    { id: 'nav-recent', label: 'Recent notes', icon: <Clock3 size={15} />, onSelect: () => { onChangeView('recent'); onClose() }, group: 'navigation' },
    { id: 'nav-archived', label: 'Archived notes', icon: <Archive size={15} />, onSelect: () => { onChangeView('archived'); onClose() }, group: 'navigation' },
    ...clusters.map(c => ({
      id: `nav-${c}`,
      label: `${c.charAt(0).toUpperCase() + c.slice(1)} cluster`,
      icon: <span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: clusterColors[c]?.dot }} />,
      onSelect: () => { onChangeView(c); onClose() },
      group: 'navigation' as const,
    })),
  ]

  const toolActions: Action[] = [
    { id: 'tool-analyzer', label: 'Performance Analyzer', icon: <BarChart2 size={15} />, onSelect: () => { router.push('/analyze'); onClose() }, group: 'tool' },
    { id: 'tool-chapter', label: 'Chapter Notes', icon: <BookOpen size={15} />, onSelect: () => { router.push('/chapter-notes'); onClose() }, group: 'tool' },
    { id: 'tool-graph', label: 'Knowledge Graph', icon: <Network size={15} />, onSelect: () => { router.push('/graph'); onClose() }, group: 'tool' },
    { id: 'tool-digest', label: 'Weekly Digest', icon: <Sparkles size={15} />, onSelect: () => { router.push('/digest'); onClose() }, group: 'tool' },
  ]

  const noteActions: Action[] = useMemo(() => {
    const q = query.toLowerCase().trim()
    const filtered = q
      ? notes.filter(n => {
          const title = (n.title ?? '').toLowerCase()
          const raw = n.raw_content.toLowerCase()
          return title.includes(q) || raw.includes(q)
        }).slice(0, 6)
      : notes.filter(n => n.is_pinned).slice(0, 4)

    return filtered.map(n => ({
      id: `note-${n.id}`,
      label: n.title ?? 'Untitled note',
      subtitle: (n.raw_content ?? '').slice(0, 60),
      icon: n.is_pinned ? <Pin size={14} className="text-amber-500" fill="currentColor" /> : <FileText size={14} />,
      onSelect: () => { onOpenNote(n); onClose() },
      group: 'note' as const,
    }))
  }, [query, notes, onOpenNote, onClose])

  const allActions = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return [...noteActions, ...navActions, ...toolActions]

    const filteredNav = navActions.filter(a => a.label.toLowerCase().includes(q))
    const filteredTools = toolActions.filter(a => a.label.toLowerCase().includes(q))
    return [...noteActions, ...filteredNav, ...filteredTools]
  }, [query, noteActions, navActions, toolActions])

  useEffect(() => setActiveIndex(0), [query])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, allActions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      allActions[activeIndex]?.onSelect()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const groups: { key: Action['group']; label: string }[] = [
    { key: 'note', label: query ? 'Notes' : 'Pinned notes' },
    { key: 'navigation', label: 'Navigation' },
    { key: 'tool', label: 'Tools' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-x-4 top-[10vh] z-[61] mx-auto max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <Search size={17} className="shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search notes or jump to a view…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
          />
          <button onClick={onClose} className="shrink-0 rounded-md p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
            <X size={15} />
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
          {allActions.length === 0 && (
            <p className="py-8 text-center text-sm text-zinc-400">No results for "{query}"</p>
          )}

          {groups.map(group => {
            const items = allActions.filter(a => a.group === group.key)
            if (items.length === 0) return null
            const globalOffset = allActions.findIndex(a => a.group === group.key)
            return (
              <div key={group.key} className="mb-2">
                <p className="mb-1 px-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  {group.label}
                </p>
                {items.map((action, localIdx) => {
                  const globalIdx = globalOffset + localIdx
                  const isActive = globalIdx === activeIndex
                  return (
                    <button
                      key={action.id}
                      data-index={globalIdx}
                      onClick={action.onSelect}
                      onMouseEnter={() => setActiveIndex(globalIdx)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                        isActive
                          ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                          : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <span className={`shrink-0 ${isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        {action.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{action.label}</span>
                        {action.subtitle && (
                          <span className={`block truncate text-xs ${isActive ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400'}`}>
                            {action.subtitle}
                          </span>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Footer hint */}
        <div className="border-t border-zinc-100 px-4 py-2 dark:border-zinc-900">
          <div className="flex items-center gap-4 text-[10px] text-zinc-400">
            <span><kbd className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">↑↓</kbd> navigate</span>
            <span><kbd className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">↵</kbd> select</span>
            <span><kbd className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">esc</kbd> close</span>
          </div>
        </div>
      </div>
    </>
  )
}
