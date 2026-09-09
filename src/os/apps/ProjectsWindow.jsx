'use client'

import { motion } from 'motion/react'
import Icon from '../ui/Icon'
import { portfolio } from '../../content/portfolio'

const featured = portfolio.projects.find((p) => p.flagship)
const others = portfolio.projects.filter((p) => !p.flagship)

export default function ProjectsWindow({ os }) {
  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-xl font-bold tracking-tight">
          The work that <span className="grad-text">talks.</span>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-mute">
          {portfolio.projects.length} shipped products, one flagship — backend to UI to deployment.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className={`relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br ${featured.gradient}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-md bg-black/25 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              Flagship
            </span>
            <span className="rounded-md border border-white/20 bg-black/20 px-2.5 py-1 font-mono text-[11px] text-white/80">
              {featured.stack.split(' · ')[0]}
            </span>
          </div>

          <h3 className="mt-4 font-display text-3xl font-extrabold text-white">{featured.title}</h3>
          <p className="mt-1 text-sm font-medium text-white/90">{featured.subtitle}</p>
          <p className="mt-3 hidden max-w-xl text-sm leading-relaxed text-white/80 sm:block">
            {featured.longDescription}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {featured.highlight.map((h) => (
              <span key={h} className="rounded-lg border border-white/25 bg-black/25 px-3 py-1.5 text-xs font-semibold text-white">
                {h}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a href={featured.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary px-5 py-2.5 text-xs text-white">
              Source on GitHub <Icon name="arrow" size={13} />
            </a>
            <button onClick={() => os.open('ai-lab')} className="btn bg-white/15 px-5 py-2.5 text-xs text-white backdrop-blur-sm hover:bg-white/25">
              Open in AI Lab
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        {others.map((p, i) => (
          <motion.a
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 + i * 0.05 }}
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-xl border border-line bg-bg/30 p-4 transition-colors hover:border-accent-3/40"
          >
            <div className={`flex items-center justify-between ${i % 2 ? 'w-full md:w-auto' : ''} flex-row gap-2`}>
              <span className="font-display text-sm font-bold">{p.title}</span>
              <Icon name="arrow" size={13} className="text-faint transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent" />
            </div>
            <p className="mt-0.5 text-xs font-medium text-faint">{p.subtitle}</p>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-mute">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tags.slice(0, 4).map((t) => (
                <span key={t} className="rounded-md border border-line px-2 py-0.5 text-[10px] text-faint">
                  {t}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}