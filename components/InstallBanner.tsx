'use client'

import { useEffect, useState } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Don't show if already installed (running in standalone mode)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
    if (isStandalone) return

    // Don't show if user dismissed within the last 7 days
    const lastDismissed = localStorage.getItem('clarity_install_dismissed')
    if (lastDismissed && Date.now() - Number(lastDismissed) < 7 * 24 * 60 * 60 * 1000) return

    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) && !('MSStream' in window)
    if (ios) {
      // Show iOS instructions after a short delay
      setTimeout(() => { setIsIos(true); setShow(true) }, 3000)
      return
    }

    // Android / Chrome — listen for the native install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShow(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    localStorage.setItem('clarity_install_dismissed', String(Date.now()))
    setDismissed(true)
    setShow(false)
  }

  async function install() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setShow(false)
      setDeferredPrompt(null)
    }
  }

  if (!show || dismissed) return null

  return (
    <div className="fixed bottom-[var(--mobile-nav-offset)] inset-x-0 z-30 px-3 pb-2 md:hidden">
      <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
          <Smartphone size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Add Clarity to your home screen</p>
          {isIos ? (
            <p className="mt-0.5 text-xs text-zinc-500">
              Tap <span className="font-medium">Share</span> then{' '}
              <span className="font-medium">"Add to Home Screen"</span> in Safari
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-zinc-500">
              Install as an app for faster access — works offline too
            </p>
          )}
          {!isIos && (
            <button
              onClick={install}
              className="mt-2 flex items-center gap-1.5 rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
            >
              <Download size={13} /> Install app
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 rounded-md p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
