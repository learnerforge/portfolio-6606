'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Icon from './ui/Icon'
import Logo from './ui/Logo'
import { useReducedMotion } from './wm/useOs'
import { APPS } from './apps'

export default function Dock({ os, isMobile }) {
  const reduced = useReducedMotion()
  const refs = useRef({})

  useEffect(() => {
    if (!isMobile || !os.topId) return
    const el = refs.current[os.topId]
    if (el) el.scrollIntoView({ inline: 'center', behavior: reduced ? 'auto' : 'smooth' })
  }, [isMobile, os.topId, reduced])

  const cell = (app, i) => {
    const win = os.windows.find((w) => w.app.id === app.id)
    const isOpen = !!win && !win.minimized
    const isActive = os.topId === app.id

    return (
      <motion.button
        key={app.id}
        ref={(el) => {
          refs.current[app.id] = el
        }}
        onClick={() => os.toggle(app.id)}
        initial={{ opacity: 0, y: 28, scale: 0.6 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ delay: 0.15 + i * 0.045, type: 'spring', stiffness: 380, damping: 26 }}
        aria-label={`${app.title}${isActive ? ' (open)' : ''}`}
        className={`group relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-transform duration-200 ${
          isActive
            ? 'scale-[1.18] text-ink'
            : isOpen
              ? 'text-mute'
              : 'text-faint hover:text-ink'
        }`}
        title={`${app.title}${win?.minimized ? ' (minimized)' : ''}`}
      >
        <span
          className={`absolute inset-0 rounded-2xl bg-bg ring-1 ring-line transition-opacity duration-200 ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        />
        {isActive && (
          <span
            className="absolute -inset-1.5 rounded-[20px] bg-accent/15 blur-lg transition-opacity"
            aria-hidden="true"
          />
        )}
        <span className="relative">
          {app.id === 'welcome' ? <Logo size={23} /> : <Icon name={app.icon} size={20} />}
        </span>

        <span
          className={`absolute -bottom-2.5 left-1/2 h-1 -translate-x-1/2 rounded-full transition-all duration-200 ${
            isActive ? 'w-4 bg-gradient-to-r from-indigo-400 to-fuchsia-400' : 'w-0 bg-faint'
          }`}
          style={{ opacity: isOpen || isActive ? 1 : 0 }}
        />

        <span className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg glass px-2.5 py-1.5 text-xs font-medium text-ink shadow-card opacity-0 backdrop-blur-xl transition-all duration-200 group-hover:-top-12 group-hover:opacity-100">
          <span className="flex items-center gap-1.5">
            {app.title}
            {win?.minimized && <span className="rounded bg-[#2c2852] px-1 font-mono text-[9px] text-[#a78bfa]">min</span>}
          </span>
        </span>
      </motion.button>
    )
  }

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-40 flex justify-center"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div
        className={`os-bar relative flex max-w-full items-center gap-1.5 rounded-[22px] px-3 py-2 ${
          isMobile ? 'overflow-x-auto' : 'overflow-visible'
        }`}
      >
        <AnimatePresence>{APPS.map(cell)}</AnimatePresence>
      </div>
    </div>
  )
}