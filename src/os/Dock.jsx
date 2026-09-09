'use client'

import { motion, AnimatePresence } from 'motion/react'
import Icon from './ui/Icon'
import Logo from './ui/Logo'
import { APPS } from './apps'

export default function Dock({ os, isMobile }) {
  const cell = (app, i) => {
    const win = os.windows.find((w) => w.app.id === app.id)
    const isOpen = !!win && !win.minimized
    const isActive = os.topId === app.id

    return (
      <motion.button
        key={app.id}
        onClick={() => os.toggle(app.id)}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-label={`${app.title}${isActive ? ' (open)' : ''}`}
        className={`group relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-all duration-200 ${
          isActive
            ? 'border-accent-3/50 bg-surface-2 text-ink shadow-glow'
            : isOpen
              ? 'border-line bg-surface text-mute'
              : 'border-transparent text-faint hover:border-line hover:bg-surface hover:text-ink'
        }`}
        title={`${app.title}${win?.minimized ? ' (minimized)' : ''}`}
      >
        {app.id === 'welcome' ? <Logo size={22} /> : <Icon name={app.icon} size={19} />}

        <motion.span
          className={`absolute left-1/2 -top-2 h-1 w-1 -translate-x-1/2 rounded-full transition-colors ${
            isActive ? 'bg-gradient-to-r from-indigo-400 to-fuchsia-400' : 'bg-faint'
          }`}
          initial={false}
          animate={{ opacity: isOpen || isActive ? 1 : 0 }}
        />

        <span className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line os-bar px-2.5 py-1.5 text-xs font-medium text-ink opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100">
          {app.title}
        </span>
      </motion.button>
    )
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 flex justify-center pb-3">
      <div
        className={`os-bar relative flex max-w-full items-end gap-1.5 rounded-2xl border px-3 py-2 shadow-window ${
          isMobile ? 'overflow-x-auto' : 'overflow-visible'
        }`}
      >
        <AnimatePresence>{APPS.map(cell)}</AnimatePresence>
      </div>
    </div>
  )
}