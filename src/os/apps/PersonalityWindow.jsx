'use client'

import { motion } from 'motion/react'
import { portfolio } from '../../content/portfolio'

export default function PersonalityWindow({ os }) {
  const { thingsIBuild, currentlyLearning } = portfolio.personality

  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-xl font-bold tracking-tight">
          What I build, <span className="grad-text">what I love.</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="rounded-xl border border-line bg-bg/30 p-5"
      >
        <div className="mb-3 flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-faint">
            Things I build
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {thingsIBuild.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        {currentlyLearning.map((l, i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14 + i * 0.06 }}
            className={`rounded-xl border border-line bg-bg/30 p-4 ${i % 2 ? 'sm:translate-y-3' : ''}`}
          >
            <span className={`block h-2 w-2 rounded-full ${i % 2 ? 'bg-fuchsia-400' : 'bg-sky-400'}`} />
            <p className="mt-3 font-display text-sm font-bold">{l}</p>
            <p className="mt-0.5 text-xs text-faint">currently exploring</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.34 }}
        className="mt-auto rounded-xl border border-accent-3/30 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 p-4"
      >
        <p className="font-mono text-xs leading-relaxed text-mute">
          <span className="text-violet-400">➜</span> Try the interactive version in the{' '}
          <button onClick={() => os.open('terminal')} className="font-semibold text-accent underline decoration-accent/40 underline-offset-2 hover:text-accent-2">
            terminal
          </button>
          .
        </p>
      </motion.div>
    </div>
  )
}