'use client'

import { motion } from 'motion/react'
import { portfolio } from '../../content/portfolio'

export default function ExperienceWindow() {
  const { education, experience } = portfolio

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-xl font-bold tracking-tight">
          The road so <span className="grad-text">far.</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-faint">
          Education
        </h3>
        <div className="rounded-xl border border-line bg-bg/30 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
              {education[0].period}
            </span>
            <span className="chip !py-0.5">{education[0].degree}</span>
          </div>
          <h4 className="mt-3 font-display text-base font-bold">{education[0].institution}</h4>
          <p className="mt-1 text-sm leading-relaxed text-mute">{education[0].program}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {education[0].coursework.map((c) => (
              <span key={c} className="rounded-md border border-line px-2 py-0.5 text-[11px] text-faint">
                {c}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
      >
        <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-faint">
          Experience
        </h3>
        {experience.map((x) => (
          <div key={x.company} className="rounded-xl border border-line bg-bg/30 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 font-display text-sm font-bold text-white">
                  {x.company.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h4 className="font-display text-base font-bold">{x.company}</h4>
                  <p className="text-xs text-faint">{x.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-faint">{x.period}</span>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">{x.type}</span>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5">
              {x.points.map((p) => (
                <li key={p} className="flex gap-2 text-sm leading-relaxed text-mute">
                  <span className="text-accent">▹</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </div>
  )
}