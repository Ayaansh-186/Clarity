'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Sparkles, UserPlus, Mail, ArrowLeft } from 'lucide-react'
import { createBrowserSupabase } from '@/lib/supabase'

type Mode = 'signin' | 'signup' | 'forgot'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<Mode>('signin')

  const supabase = createBrowserSupabase()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin

  function switchMode(m: Mode) {
    setMode(m)
    setMessage(null)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/reset-password`,
      })
      setLoading(false)
      if (error) {
        setMessage({ text: error.message, type: 'error' })
      } else {
        setMessage({ text: 'Check your email for a password reset link.', type: 'success' })
      }
      return
    }

    const { data: authData, error: authError } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    if (authError) {
      setMessage({ text: authError.message, type: 'error' })
      setLoading(false)
      return
    }

    if (mode === 'signup' && !authData.session) {
      setMessage({ text: 'Account created! Check your email to confirm, then sign in.', type: 'success' })
      setMode('signin')
      setLoading(false)
      return
    }

    router.replace('/home')
  }

  async function signInWithGoogle() {
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${appUrl}/home` },
    })
    if (error) {
      setMessage({ text: error.message, type: 'error' })
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 px-4 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Clarity</h1>
              <p className="text-sm text-zinc-500">
                {mode === 'signin' ? 'Sign in to your notes'
                  : mode === 'signup' ? 'Create your account'
                  : 'Reset your password'}
              </p>
            </div>
          </div>

          {/* Google OAuth */}
          {mode !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.9z"/>
                  <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.5 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.2 26.8 36 24 36c-5.2 0-9.6-3.1-11.3-7.9l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.4-2.4 4.5-4.5 6l6.2 5.2C41 35.5 44 30.2 44 24c0-1.3-.1-2.5-.4-3.9z"/>
                </svg>
                Continue with Google
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                <span className="text-xs text-zinc-400">or</span>
                <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
              </div>
            </>
          )}

          {/* Email/Password Form */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
                required
                autoComplete="email"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium" htmlFor="password">Password</label>
                  {mode === 'signin' && (
                    <button type="button" onClick={() => switchMode('forgot')} className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
              </div>
            )}

            {message && (
              <p className={`rounded-lg p-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300'}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {mode === 'signin' && <><LogIn size={16} /> {loading ? 'Signing in...' : 'Sign in'}</>}
              {mode === 'signup' && <><UserPlus size={16} /> {loading ? 'Creating account...' : 'Create account'}</>}
              {mode === 'forgot' && <><Mail size={16} /> {loading ? 'Sending...' : 'Send reset link'}</>}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-4 space-y-2 text-center">
            {mode === 'forgot' ? (
              <button type="button" onClick={() => switchMode('signin')} className="flex items-center justify-center gap-1.5 w-full text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                <ArrowLeft size={14} /> Back to sign in
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                className="w-full text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
