'use client'

import { motion } from 'motion/react'
import Icon from '../ui/Icon'
import { portfolio } from '../../content/portfolio'

export default function ContactWindow() {
  const { profile, openTo } = portfolio

  const socials = [
    { name: 'GitHub', url: profile.github, icon: 'github' },
    { name: 'LinkedIn', url: profile.linkedin, icon: 'link' },
    { name: 'X', url: 'https://x.com/ganesh_047', icon: 'link' },
    { name: 'Email', url: `mailto:${profile.email}`, icon: 'mail' }
  ]

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-xl font-bold tracking-tight">
          Let's build the next <span className="grad-text">big thing.</span>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-mute">
          {profile.location} · open to {openTo[0].toLowerCase()} and research collaborations.
        </p>
      </motion.div>

      <motion.a
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        href={`mailto:${profile.email}`}
        className="btn btn-primary w-full px-5 py-4 text-sm"
      >
        <Icon name="mail" size={16} /> {profile.email}
      </motion.a>

      <div className="mt-auto space-y-2">
        {socials.map((s, i) => (
          <motion.a
            key={s.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.16 + i * 0.06 }}
            href={s.url}
            target={s.name === 'Email' ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-xl border border-line bg-bg/30 px-4 py-3.5 transition-colors hover:border-accent-3/40"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-accent">
                <Icon name={s.icon} size={16} />
              </span>
              <span className="text-sm font-semibold">{s.name}</span>
            </span>
            <Icon name="arrow" size={15} className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent" />
          </motion.a>
        ))}
      </div>
    </div>
  )
}