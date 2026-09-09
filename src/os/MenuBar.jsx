'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Logo from './ui/Logo'
import Icon from './ui/Icon'
import { useClock } from './wm/useOs'
import { APPS } from './apps'
import { portfolio } from '../content/portfolio'

const NAV_APPS = ['about', 'projects', 'ai-lab', 'credentials', 'contact']

export default function MenuBar({ os, theme, onToggleTheme, onOpenPalette }) {
  const time = useClock()
  const [menuOpen, setMenuOpen] = useState(false)

  const pick = (id) => {
    setMenuOpen(false)
    os.open(id)
    os.navigate(id)
  }

  return (
    <header className="os-bar relative z-40 flex h-10 shrink-0 items-center justify-between gap-3 border-b px-3">
      <button
        onClick={() => pick('welcome')}
        className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-surface-2"
        aria-label="Open Welcome"
      >
        <Logo size={22} />
        <span className="font-display text-sm font-bold tracking-tight">
          <span className="grad-text">GANESH OS</span>
        </span>
        <span className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint sm:inline">
          {portfolio.os.version}
        </span>
      </button>

      <nav className="relative hidden items-center gap-1 lg:flex" aria-label="Primary">
        {APPS.filter((a) => NAV_APPS.includes(a.id)).map((a) => (
          <button
            key={a.id}
            onClick={() => pick(a.id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors hover:bg-surface-2 ${
              os.activeId === a.id ? 'text-ink' : 'text-mute'
            }`}
          >
            <Icon name={a.icon} size={14} className="text-accent" />
            {a.title}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenPalette}
          aria-label="Open command palette"
          className="hidden h-8 items-center gap-2 rounded-lg border border-line px-2 text-faint transition-colors hover:text-ink sm:flex"
        >
          <Icon name="search" size={13} />
          <span className="text-xs">Search</span>
          <span className="kbd">⌘K</span>
        </button>

        <button
          onClick={onOpenPalette}
          aria-label="Search"
          className="grid h-8 w-8 place-items-center rounded-lg text-mute transition-colors hover:bg-surface-2 hover:text-ink sm:hidden"
        >
          <Icon name="search" size={15} />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="All apps"
            aria-expanded={menuOpen}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line text-mute transition-colors hover:text-ink"
          >
            <Icon name="grid" size={16} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <button
                  className="fixed inset-0 z-10 cursor-default"
                  aria-label="Close apps menu"
                  onClick={() => setMenuOpen(false)}
                />
                <motion.div
                  className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-line os-bar p-1.5 shadow-window"
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                >
                  {APPS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => pick(a.id)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-mute transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      <Icon name={a.icon} size={15} className="text-accent" />
                      {a.title}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="grid h-8 w-8 place-items-center rounded-lg text-mute transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
        </button>

        <span className="hidden rounded-lg px-2 py-1 font-mono text-xs text-mute lg:inline">{time}</span>

        <button
          onClick={() => window.location.reload()}
          aria-label="Restart GANESH OS"
          className="grid h-8 w-8 place-items-center rounded-lg text-mute transition-colors hover:bg-red-500/15 hover:text-red-400"
        >
          <Icon name="power" size={15} />
        </button>
      </div>
    </header>
  )
}