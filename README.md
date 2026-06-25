# ClearMind — Self-Organising AI Notes

> Drop any thought. AI sorts, formats, and clusters it automatically.

ClearMind is a self-organising notes app powered by AI. Capture ideas by typing, voice, or photo — the AI handles titling, formatting, clustering, and linking related notes. No folders. No manual tagging required.

**Live:** [clearmind.app](https://clarity-delta-two.vercel.app) · **Status:** Active development

---

## Features

- **Auto-clustering** — Notes sorted into Work, Ideas, Personal, Learning, or Health instantly
- **Voice capture** — Record audio, Whisper AI transcribes and formats it
- **AI formatting** — Raw thoughts turned into clean, titled notes
- **Related notes** — Semantic similarity surfaces the 4 most relevant notes per note
- **Knowledge graph** — D3-powered visual map of your note connections
- **Cmd+K palette** — Keyboard-first navigation across all notes and views
- **Reminders** — Snooze notes to resurface at a set time
- **Discover feed** — Opt-in public notes from the community
- **Shared notes** — Public shareable links with comments
- **Weekly digest** — AI-generated summary of your week's notes
- **Bulk actions** — Archive, delete, tag, or export multiple notes at once
- **Templates** — 6 built-in note templates to start faster
- **Export** — Download notes as Markdown or plain text
- **PWA** — Installable on mobile and desktop

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth & DB | Supabase (RLS enabled) |
| AI | Groq (Llama 3.3 · Whisper) |
| Styling | Tailwind CSS v4 |
| Graphs | D3 (CDN) |
| Deployment | Vercel |

---

## Local development

```powershell
# Clone
git clone https://github.com/Ayaansh-186/Clarity.git
cd Clarity

# Install
npm install

# Add env vars — copy the template
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, GROQ_API_KEY

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GROQ_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## License

Business Source License 1.1 — see [LICENSE](./LICENSE).

Personal and educational use is free. Commercial use requires a license.
Converts to MIT on 2029-01-01.

© 2026 Ayaansh-186
