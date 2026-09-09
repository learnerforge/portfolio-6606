'use client'

import { motion } from 'motion/react'
import { portfolio } from '../../content/portfolio'

export default function AboutWindow() {
  const { about } = portfolio

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="font-display text-xl font-bold tracking-tight">
          Engineer by default, <span className="grad-text">builder by choice.</span>
        </h2>
        <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-faint">
          About · {portfolio.profile.name}
        </p>
      </motion.div>

      <div className="space-y-4">
        {about.paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 + i * 0.08 }}
            className="text-[15px] leading-[1.7] text-mute"
          >
            {p}
          </motion.p>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-faint">
          Focus areas
        </h3>
        <div className="flex flex-wrap gap-2">
          {about.focus.map((f) => (
            <span key={f} className="chip">
              {f}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}