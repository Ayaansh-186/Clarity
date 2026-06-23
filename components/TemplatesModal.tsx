'use client'

import { useState } from 'react'
import { X, BookOpen, Briefcase, Lightbulb, Heart, GraduationCap, Calendar } from 'lucide-react'

export type Template = {
  id: string
  name: string
  icon: React.ReactNode
  cluster: string
  placeholder: string
  body: string
}

const TEMPLATES: Template[] = [
  {
    id: 'meeting',
    name: 'Meeting Notes',
    icon: <Briefcase size={18} />,
    cluster: 'work',
    placeholder: 'Fill in your meeting notes...',
    body: `Meeting: [Title]
Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Attendees: 

Agenda:
- 

Key decisions:
- 

Action items:
- [ ] 

Notes:
`,
  },
  {
    id: 'daily',
    name: 'Daily Log',
    icon: <Calendar size={18} />,
    cluster: 'personal',
    placeholder: 'How did your day go?',
    body: `Daily Log — ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

What I worked on:
- 

What went well:
- 

What to improve:
- 

Tomorrow's priorities:
- 
`,
  },
  {
    id: 'idea',
    name: 'Idea Capture',
    icon: <Lightbulb size={18} />,
    cluster: 'ideas',
    placeholder: 'Describe your idea...',
    body: `Idea: [Name]

The problem it solves:


How it works:


Why it's interesting:


Next step to explore:
`,
  },
  {
    id: 'book',
    name: 'Book Notes',
    icon: <BookOpen size={18} />,
    cluster: 'learning',
    placeholder: 'Notes from what you\'re reading...',
    body: `Book: [Title]
Author: 
Rating: /10

Key ideas:
- 

Favourite quotes:
- 

How I'll apply this:
- 

Would recommend to: 
`,
  },
  {
    id: 'health',
    name: 'Health Check-in',
    icon: <Heart size={18} />,
    cluster: 'health',
    placeholder: 'How are you feeling?',
    body: `Health Check-in — ${new Date().toLocaleDateString()}

Energy (1-10): 
Sleep last night: hrs
Mood: 

Workout / movement:


Meals:


How I'm feeling overall:


One thing to focus on tomorrow:
`,
  },
  {
    id: 'learning',
    name: 'Learning Note',
    icon: <GraduationCap size={18} />,
    cluster: 'learning',
    placeholder: 'What did you learn?',
    body: `Topic: [What I learned]
Source: 
Date: ${new Date().toLocaleDateString()}

Summary in my own words:


Why this matters:


Questions I still have:
- 

Related things I know:
- 
`,
  },
]

type Props = {
  onSelect: (body: string) => void
  onClose: () => void
}

export function TemplatesModal({ onSelect, onClose }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  const clusterColors: Record<string, string> = {
    work: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900',
    personal: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900',
    ideas: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900',
    learning: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900',
    health: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900',
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-zinc-950/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-4 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-zinc-200 bg-white pb-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg sm:rounded-2xl sm:border">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-100 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div>
            <h2 className="text-base font-semibold">Templates</h2>
            <p className="mt-0.5 text-xs text-zinc-500">Pick one to pre-fill your note</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => { onSelect(t.body); onClose() }}
              onMouseEnter={() => setHovered(t.id)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                hovered === t.id
                  ? 'border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900'
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'
              }`}
            >
              <span className={`mt-0.5 rounded-lg border p-1.5 ${clusterColors[t.cluster] ?? 'bg-zinc-100 text-zinc-600'}`}>
                {t.icon}
              </span>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="mt-0.5 text-xs capitalize text-zinc-400">{t.cluster}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
