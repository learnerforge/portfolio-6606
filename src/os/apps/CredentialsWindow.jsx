'use client'

import { motion } from 'motion/react'
import Icon from '../ui/Icon'
import { portfolio } from '../../content/portfolio'

export default function CredentialsWindow() {
  const { achievements, certifications, codingProfiles } = portfolio

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-xl font-bold tracking-tight">
          Proof of <span className="grad-text">work.</span>
        </h2>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        {achievements.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 + i * 0.05 }}
            className="rounded-xl border border-line bg-bg/30 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white">
                <Icon name="trophy" size={15} />
              </span>
              <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-faint">{a.tag}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold">{a.title}</h3>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{a.org}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-mute">{a.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
        >
          <h3 className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-faint">
            Certifications
          </h3>
          <div className="space-y-2">
            {certifications.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-lg border border-line bg-bg/30 px-3 py-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line font-display text-xs font-bold text-accent">
                  {c.issuer.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{c.name}</p>
                  <p className="text-[11px] text-faint">{c.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.34 }}
        >
          <h3 className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-faint">
            Profiles
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {codingProfiles.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-lg border border-line bg-bg/30 px-3 py-2.5 transition-colors hover:border-accent-3/40"
              >
                <span className="truncate text-xs font-semibold">{p.name}</span>
                <Icon name="link" size={13} className="shrink-0 text-faint transition-colors group-hover:text-accent" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}