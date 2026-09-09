'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Icon from './ui/Icon'
import Logo from './ui/Logo'
import { APPS } from './apps'

export default function CommandPalette({ open, onClose, os, actions }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    const apps = APPS.map((a) => ({
      id: `app:${a.id}`,
      icon: a.id === 'welcome' ? 'sparkles' : a.icon,
      label: a.title,
      hint: os.windows.some((w) => w.app.id === a.id && !w.minimized) ? 'open' : 'open',
      group: 'Apps',
      run: () => {
        os.open(a.id)
        os.navigate(a.id)
        onClose()
      }
    }))
    const flat = [...apps, ...actions]
    if (!q) return flat
    return flat.filter((it) => it.label.toLowerCase().includes(q))
  }, [query, actions, os, onClose])

  useEffect(() => {
    if (index > items.length - 1) setIndex(Math.max(0, items.length - 1))
  }, [items.length, index])

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-selected="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [index])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setIndex((i) => Math.min(i + 1, items.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        items[index]?.run()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, items, index, onClose])

  let lastGroup = null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[16vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            role="dialog"
            aria-label="Command palette"
            className="os-window w-full max-w-md overflow-visible !rounded-2xl"
            initial={{ opacity: 0, y: -16, scale: 0.96, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, scale: 0.97, filter: 'blur(4px)' }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Icon name="bolt" size={17} className="text-accent" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setIndex(0)
                }}
                placeholder="Type a command or search…"
                className="palette-input"
                aria-label="Command search"
              />
              <span className="kbd shrink-0">esc</span>
            </div>

            <div ref={listRef} className="os-scroll max-h-80 overflow-y-auto p-1.5">
              {items.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-faint">No results for “{query}”</p>
              ) : (
                items.map((it, i) => {
                  const groupHeader = it.group && it.group !== lastGroup
                  if (groupHeader) lastGroup = it.group
                  return (
                    <div key={it.id}>
                      {groupHeader && (
                        <p className="px-2.5 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-faint">
                          {it.group}
                        </p>
                      )}
                      <button
                        data-selected={i === index}
                        onMouseEnter={() => setIndex(i)}
                        onClick={it.run}
                        className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm transition-colors ${
                          i === index ? 'bg-accent/15 text-ink' : 'text-mute'
                        }`}
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-bg-2 text-accent ring-1 ring-line">
                          {it.id === 'app:welcome' ? <Logo size={16} /> : <Icon name={it.icon} size={14} />}
                        </span>
                        <span className="flex-1">{it.label}</span>
                        {it.hint && <span className="font-mono text-[10px] text-faint">{it.hint}</span>}
                        <Icon name="arrow" size={12} className={i === index ? 'text-accent' : 'text-faint/0'} />
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-line px-4 py-2 text-[11px] text-faint">
              <span>
                <span className="kbd mr-1">↵</span>run
              </span>
              <span>
                <span className="kbd mr-1">↑↓</span>navigate
              </span>
              <span className="ml-auto font-mono">GANESH OS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}