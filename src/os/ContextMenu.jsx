'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Icon from './ui/Icon'

export default function ContextMenu({ state, onClose, os, onRestart }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!state) return
    const close = () => onClose()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('pointerdown', close)
    window.addEventListener('keydown', onKey)
    document.documentElement.addEventListener('contextmenu', close, true)
    return () => {
      window.removeEventListener('pointerdown', close)
      window.removeEventListener('keydown', onKey)
      document.documentElement.removeEventListener('contextmenu', close, true)
    }
  }, [state, onClose])

  const items = [
    { icon: 'terminal', label: 'Open Terminal', run: () => os.open('terminal') },
    { icon: 'rocket', label: 'Open Projects', run: () => os.open('projects') },
    { icon: 'bolt', label: 'Open AI Lab', run: () => os.open('ai-lab') },
    { icon: 'sun', label: 'Toggle theme', run: () => onRestart('theme') },
    { icon: 'power', label: 'Restart GANESH OS', run: () => onRestart('reboot'), danger: true }
  ]

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          ref={ref}
          role="menu"
          className="os-window fixed z-50 w-52 !overflow-visible !rounded-xl p-1.5"
          style={{
            left: clamp(state.x, 4, window.innerWidth - 220),
            top: clamp(state.y, 36, window.innerHeight - 240)
          }}
          initial={{ opacity: 0, scale: 0.9, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -4 }}
          transition={{ duration: 0.14 }}
          onContextMenu={(e) => e.stopPropagation()}
        >
          <p className="px-2.5 pb-1.5 pt-1 font-mono text-[10px] uppercase tracking-widest text-faint">
            GANESH OS · Desktop
          </p>
          {items.map((it) => (
            <button
              key={it.label}
              role="menuitem"
              onClick={it.run}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-accent/15 hover:text-ink ${
                it.danger ? 'text-red-400' : 'text-mute'
              }`}
            >
              <Icon name={it.icon} size={14} className="text-accent" />
              {it.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}