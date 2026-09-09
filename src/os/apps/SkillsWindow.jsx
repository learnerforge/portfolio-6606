'use client'

import { motion } from 'motion/react'
import { portfolio } from '../../content/portfolio'

const CATEGORIES = [
  { key: 'languages', label: 'Languages', dot: 'from-cyan-400 to-sky-500' },
  { key: 'frontend', label: 'Frontend', dot: 'from-indigo-400 to-violet-500' },
  { key: 'backend', label: 'Backend', dot: 'from-emerald-400 to-teal-500' },
  { key: 'devops', label: 'DevOps & Ops', dot: 'from-amber-400 to-orange-500' },
  { key: 'ai', label: 'AI / ML', dot: 'from-fuchsia-400 to-purple-500' }
]

function Level({ level }) {
  const tone =
    level === 'Advanced'
      ? 'bg-emerald-400/15 text-emerald-400'
      : level === 'Intermediate'
        ? 'bg-sky-400/15 text-sky-400'
        : 'bg-amber-400/15 text-amber-400'
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}>
      {level}
    </span>
  )
}

export default function SkillsWindow() {
  const { skills, expertise } = portfolio

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-xl font-bold tracking-tight">
          A stack chosen for <span className="grad-text">shipping.</span>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-mute">
          Real categories, honest levels — no fake percentages. Everything here has shipped into a working product.
        </p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className="rounded-xl border border-line bg-bg/30 p-4"
          >
            <div className="mb-3 flex items-center gap-2.5">
              <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${c.dot}`} />
              <h3 className="text-sm font-semibold">{c.label}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills[c.key].map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="rounded-xl border border-accent-3/30 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 p-4 sm:col-span-2"
        >
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500" />
            <h3 className="text-sm font-semibold">Specialties</h3>
          </div>
          <ul className="space-y-3">
            {expertise.map((e) => (
              <li key={e.domain} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{e.domain}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-faint">{e.detail}</p>
                </div>
                <Level level={e.level} />
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}