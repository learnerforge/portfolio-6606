'use client'

import { motion } from 'motion/react'
import { portfolio } from '@/content/portfolio'
import SectionHeading from './ui/SectionHeading'

export default function Contact() {
  const socials = [
    { name: 'GitHub', url: portfolio.profile.github, short: 'gh', color: 'hover:text-[#c9d1d9]' },
    { name: 'LinkedIn', url: portfolio.profile.linkedin, short: 'in', color: 'hover:text-[#0a66c2]' },
    { name: 'Email', url: `mailto:${portfolio.profile.email}`, short: '✉', color: 'hover:text-accent' },
    { name: 'X', url: 'https://x.com/ganesh_047', short: 'x', color: 'hover:text-white' }
  ]

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } }
  }
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-violet-600/15 animate-drift blur-[140px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
        <SectionHeading
          eyebrow="08 — Contact"
          title="Let's build the next"
          grad="big thing together."
          center
        />

        <motion.p
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mute"
        >
          {portfolio.openTo.map((s) => (
            <span key={s} className="chip mx-1 my-1 inline-block">
              {s}
            </span>
          ))}
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <motion.a variants={item} href={`mailto:${portfolio.profile.email}`} className="btn btn-primary px-8 py-4 text-sm">
            Get in touch
          </motion.a>
          <motion.span variants={item} className="text-xs text-faint">
            or find me on socials
          </motion.span>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {socials.map((s) => (
            <motion.a
              key={s.name}
              variants={item}
              href={s.url}
              target={s.name === 'Email' ? undefined : '_blank'}
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-mute shadow-card transition-colors duration-300 hover:border-accent-3/40 ${s.color}`}
            >
              <span>{s.short}</span>
              <span className="text-ink">{s.name}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}