'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useIsMobile, useTheme, useReducedMotion } from './wm/useOs'
import useWindowManager from './wm/useWindowManager'
import Window from './wm/Window'
import MenuBar from './MenuBar'
import Dock from './Dock'
import Starfield from './Starfield'
import CommandPalette from './CommandPalette'
import ContextMenu from './ContextMenu'
import ToastStack, { useToasts } from './Toasts'
import { DOCK_APPS } from './apps'
import { portfolio } from '../content/portfolio'

export default function Desktop() {
  const os = useWindowManager()
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()
  const { theme, toggle } = useTheme()
  const { toasts, push, dismiss } = useToasts()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [menu, setMenu] = useState(null)

  useEffect(() => {
    const isModal = paletteOpen || !!menu
    if (isModal) document.documentElement.setAttribute('data-modal', '1')
    else document.documentElement.removeAttribute('data-modal')
    return () => document.documentElement.removeAttribute('data-modal')
  }, [paletteOpen, menu])

  useEffect(() => {
    const t = window.setTimeout(() => push('System ready — welcome to GANESH OS'), 1200)
    const t2 = window.setTimeout(() => push('⌘K or Ctrl+K — command palette'), 5800)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeActive = useCallback(() => {
    if (os.activeId) {
      os.close(os.activeId)
      return true
    }
    return false
  }, [os])

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return

      const typing = e.target.matches('input, textarea, [contenteditable="true"]')

      if (e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
        return
      }
      if (typing) return

      const k = e.key.toLowerCase()
      if (k >= '1' && k <= '6') {
        e.preventDefault()
        const app = DOCK_APPS[Number(k) - 1]
        if (app) {
          os.open(app)
          os.navigate(app)
        }
        return
      }
      if (k === 't') {
        e.preventDefault()
        toggle()
      } else if (k === 'w') {
        e.preventDefault()
        closeActive()
      } else if (k === 'm') {
        e.preventDefault()
        if (os.activeId) os.minimize(os.activeId)
      } else if (k === 'r') {
        e.preventDefault()
        window.location.reload()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [os, toggle, closeActive])

  const onDesktopContext = useCallback((e) => {
    if (e.target.closest('.os-bar')) return
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const paletteActions = useMemo(() => {
    const email = portfolio.profile.email
    return [
      {
        id: 'action:theme',
        icon: theme === 'dark' ? 'sun' : 'moon',
        label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
        hint: '⌘T',
        group: 'Actions',
        run: () => {
          toggle()
          setPaletteOpen(false)
        }
      },
      {
        id: 'action:close',
        icon: 'x',
        label: 'Close active window',
        hint: os.activeId ? `⌘W` : '—',
        group: 'Actions',
        run: () => {
          closeActive()
          setPaletteOpen(false)
        }
      },
      {
        id: 'action:email',
        icon: 'mail',
        label: 'Email Ganesh',
        hint: 'mailto',
        group: 'Actions',
        run: () => {
          setPaletteOpen(false)
          window.open(`mailto:${email}`)
        }
      },
      {
        id: 'action:restart',
        icon: 'power',
        label: 'Restart GANESH OS',
        hint: '⌘R',
        group: 'Actions',
        run: () => window.location.reload()
      }
    ]
  }, [theme, os.activeId, toggle, closeActive])

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      data-desktop
      onContextMenu={onDesktopContext}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-2 via-bg to-bg-2" />
        <Starfield />
        <div
          className="orb left-[-12%] top-[8%] h-[26rem] w-[26rem] bg-indigo-600/20"
          style={{ animation: reduced ? 'none' : 'breathe 16s ease-in-out infinite' }}
        />
        <div
          className="orb right-[-10%] bottom-[12%] h-[24rem] w-[24rem] bg-fuchsia-600/15"
          style={{ animation: reduced ? 'none' : 'breathe 20s ease-in-out infinite', animationDelay: '-8s' }}
        />
        <div
          className="orb left-[38%] top-[45%] h-[20rem] w-[20rem] bg-accent-3/10"
          style={{ animation: reduced ? 'none' : 'breathe 24s ease-in-out infinite', animationDelay: '-16s' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.5))] dark:opacity-100" />
      </div>

      <MenuBar os={os} theme={theme} onToggleTheme={toggle} onOpenPalette={() => setPaletteOpen(true)} />

      <main className="relative z-10 flex-1" aria-label="Desktop windows">
        <AnimatePresence>
          {os.openWindows.map((win) => (
            <Window
              key={win.id}
              win={win}
              os={os}
              isMobile={isMobile}
              active={os.activeId === win.app.id}
              onFocus={() => os.focus(win.app.id)}
              onClose={() => os.close(win.app.id)}
              onMinimize={() => os.minimize(win.app.id)}
              onMove={os.move}
            />
          ))}
        </AnimatePresence>
      </main>

      <Dock os={os} isMobile={isMobile} />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} os={os} actions={paletteActions} />
      <ContextMenu
        state={menu}
        onClose={() => setMenu(null)}
        os={os}
        onRestart={(kind) => {
          setMenu(null)
          if (kind === 'theme') toggle()
          else window.location.reload()
        }}
      />
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}