'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Logo from './ui/Logo'
import { portfolio } from '../content/portfolio'

const BOOT_LINES = [
  ['mounting', 'desktop modules'],
  ['loading', 'icons + windows'],
  ['linking', 'terminal · github · ai lab'],
  ['compiling', 'ganesh · bakkera']
]

export default function Boot({ onDone }) {
  const [leaving, setLeaving] = useState(false)

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-bg"
      aria-hidden="true"
      animate={leaving ? { y: '-100%' } : { y: 0 }}
      transition={leaving ? { duration: 0.6, ease: [0.76, 0, 0.24, 1] } : { duration: 0.2 }}
      onAnimationComplete={(def) => {
        if (leaving) onDone()
      }}
    >
      <div className="flex flex-col items-center gap-9">
        <div className="relative">
          <motion.div
            className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/40 via-violet-500/40 to-fuchsia-500/40 blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            initial={{ scale: 0.7, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo size={84} />
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="font-display text-2xl font-extrabold tracking-tight">
            <span className="grad-text">GANESH OS</span>
          </p>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-faint">
            {portfolio.os.version} · {portfolio.profile.core}
          </p>
        </div>

        <div className="w-60 space-y-2">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.05, ease: 'easeInOut' }}
              onAnimationComplete={() => setLeaving(true)}
            />
          </div>
          <div className="min-h-[3.5rem] pt-1 font-mono text-[11px] leading-5 text-faint">
            {BOOT_LINES.map(([k, v], i) => (
              <motion.p
                key={k}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.24 }}
              >
                <span className="text-violet-400">✓</span> {k} {v}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}