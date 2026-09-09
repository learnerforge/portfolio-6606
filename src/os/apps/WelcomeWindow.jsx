'use client'

import { motion } from 'motion/react'
import Icon from '../ui/Icon'
import { portfolio } from '../../content/portfolio'

function Stat({ value, suffix = '', label }) {
  return (
    <div className="rounded-xl border border-line bg-bg/40 p-4">
      <p className="font-display text-3xl font-extrabold">
        <span className="grad-text">
          {value}
          {suffix}
        </span>
      </p>
      <p className="mt-1 text-xs leading-snug text-mute">{label}</p>
    </div>
  )
}

export default function WelcomeWindow({ os }) {
  const { profile, about, openTo } = portfolio

  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profile.avatar}
              alt="Ganesh Bakkera avatar"
              className="h-16 w-16 rounded-2xl border border-line object-cover"
            />
            <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-surface bg-emerald-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight">
              {profile.first} <span className="grad-text">{profile.last}</span>
            </h2>
            <p className="text-sm font-medium text-mute">{profile.core}</p>
            <p className="mt-0.5 text-xs text-faint">{profile.location}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-500">
          open to work
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="text-[15px] leading-relaxed text-mute"
      >
        {profile.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.14 }}
        className="flex flex-wrap gap-2"
      >
        {openTo.map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {about.stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.06 }}
          >
            <Stat value={s.value} suffix={s.suffix} label={s.label} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="mt-auto grid grid-cols-2 gap-2.5 border-t border-line pt-5"
      >
        <button onClick={() => os.open('projects')} className="btn btn-primary px-4 py-3 text-sm">
          <Icon name="rocket" size={15} /> View projects
        </button>
        <button onClick={() => os.open('terminal')} className="btn btn-ghost px-4 py-3 text-sm">
          <Icon name="terminal" size={15} /> Open terminal
        </button>
        <button onClick={() => os.open('ai-lab')} className="btn btn-ghost px-4 py-3 text-sm">
          <Icon name="bolt" size={15} /> AI Lab
        </button>
        <button onClick={() => os.open('github')} className="btn btn-ghost px-4 py-3 text-sm">
          <Icon name="github" size={15} /> GitHub
        </button>
      </motion.div>
    </div>
  )
}