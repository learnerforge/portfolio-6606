'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { portfolio } from '@/content/portfolio'

const HEADLINE = ['I', 'build', 'AI', 'products', 'end-to-end.']
const BADGES = [
  { label: 'Python', className: 'left-[-6%] top-[6%]', delay: '0s' },
  { label: 'FastAPI', className: 'right-[-4%] top-[22%]', delay: '0.6s' },
  { label: 'React', className: 'left-[-8%] bottom-[24%]', delay: '1.2s' },
  { label: 'PostgreSQL', className: 'right-[-6%] bottom-[6%]', delay: '1.8s' },
  { label: 'LLM', className: 'left-[12%] top-[-10%]', delay: '2.4s' },
  { label: 'Docker', className: 'right-[10%] top-[-12%]', delay: '3s' }
]

export default function Hero() {
  const { scrollYProgress } = useScroll()
  const cursorOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0])

  return (
    <section id="top" className="relative flex min-h-[100dvh] items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="orb left-[8%] top-[12%] h-72 w-72 bg-indigo-600/25" style={{ animation: 'drift 14s ease-in-out infinite' }} />
        <div className="orb right-[6%] top-[30%] h-80 w-80 bg-fuchsia-600/20" style={{ animation: 'drift 18s ease-in-out infinite', animationDelay: '-6s' }} />
        <div className="orb bottom-[10%] left-[40%] h-72 w-72 bg-violet-600/20" style={{ animation: 'drift 16s ease-in-out infinite', animationDelay: '-3s' }} />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pt-28 pb-20 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div>
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 text-xs font-medium text-mute"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {portfolio.profile.roles.join(' · ')}
          </motion.div>

          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.08] tracking-tight md:text-[3.6rem]">
            {HEADLINE.map((w, i) => (
              <motion.span
                key={i}
                className={`inline-block ${i >= 2 && i <= 3 ? 'grad-text' : ''}`}
                initial={{ opacity: 0, y: 34, rotate: 3 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.35 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
                {'\u00A0'}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-mute"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {portfolio.profile.tagline}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#projects" className="btn btn-primary px-7 py-3 text-sm">
              View projects
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="#contact" className="btn btn-ghost px-7 py-3 text-sm">
              Get in touch
            </a>
            <a
              href={portfolio.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost px-5 py-3 text-sm"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
              </svg>
              GitHub
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto w-64 md:w-80"
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -inset-4 rounded-[2.4rem] bg-gradient-to-br from-indigo-500/30 via-violet-500/30 to-fuchsia-500/30 blur-2xl" aria-hidden="true" />
          <div className="relative rounded-[2rem] border border-line bg-surface shadow-card">
            <img
              src={portfolio.profile.avatar}
              alt={`${portfolio.profile.name} avatar`}
              className="h-auto w-full rounded-[2rem]"
            />
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-display text-sm font-semibold">{portfolio.profile.name}</p>
                <p className="text-xs text-faint">{portfolio.profile.location}</p>
              </div>
              <span className="rounded-full border border-line px-3 py-1 text-[11px] font-medium text-emerald-400">
                open to work
              </span>
            </div>
          </div>

          {BADGES.map((b) => (
            <span
              key={b.label}
              className={`chip absolute ${b.className} hidden sm:inline-flex`}
              style={{ animation: `float-slow 6s ease-in-out infinite`, animationDelay: b.delay }}
            >
              {b.label}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        style={{ opacity: cursorOpacity }}
        aria-hidden="true"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-line p-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-accent"
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}