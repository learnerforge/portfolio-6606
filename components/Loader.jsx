'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

export default function Loader() {
  const [gone, setGone] = useState(false)
  if (gone) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-bg"
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.65, delay: 0.75, ease: 'easeInOut' }}
      onAnimationComplete={() => setGone(true)}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 font-display text-2xl font-bold text-white shadow-glow"
          initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          GB
        </motion.div>
        <div className="flex items-center gap-2 text-xs text-faint">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-400" />
          ganesh bakkera loading
        </div>
      </div>
    </motion.div>
  )
}