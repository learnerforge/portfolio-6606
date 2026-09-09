'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

const LETTERS = [
  { ch: 'G', delay: 0.1 },
  { ch: 'B', delay: 0.24 }
]

export default function Loader() {
  const [stage, setStage] = useState(0)
  const [gone, setGone] = useState(false)

  if (gone) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-bg"
      aria-hidden="true"
      animate={stage === 2 ? { y: '-100%' } : { y: 0 }}
      transition={
        stage === 2
          ? { duration: 0.65, ease: [0.76, 0, 0.24, 1] }
          : { duration: 0.3 }
      }
      onAnimationComplete={(def) => {
        if (stage === 2) setGone(true)
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -inset-40 bg-gradient-to-br from-indigo-600/15 via-violet-600/10 to-fuchsia-600/15 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center gap-8">
        <div className="relative">
          <motion.div
            className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/40 via-violet-500/40 to-fuchsia-500/40 blur-2xl"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.7 }}
          />
          <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-3xl border border-line bg-surface shadow-glow">
            <motion.span
              className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500"
              initial={{ rotate: -90, scaleX: 0 }}
              animate={{ rotate: 0, scaleX: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="relative flex font-display text-3xl font-extrabold text-white">
              {LETTERS.map(({ ch, delay }) => (
                <motion.span
                  key={ch}
                  initial={{ y: 26, opacity: 0, rotate: 10 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
            <motion.span
              className="absolute inset-0 rounded-3xl border border-white/30"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: [0, 1, 0], scale: [0.7, 1.12] }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        <div className="flex w-44 flex-col items-center gap-3">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.35 }}
              onAnimationComplete={() => setTimeout(() => setStage(2), 250)}
            />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-faint">
            ganesh bakkera · portfolio
          </p>
        </div>
      </div>
    </motion.div>
  )
}