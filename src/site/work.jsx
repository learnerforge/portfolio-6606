import { useMemo, useState } from 'react'
import { motion, useMotionValue } from 'motion/react'
import { portfolio } from '../content/portfolio'
import { useMedia, usePrefersReducedMotion } from './hooks'
import { artFor, FloatingPreview, GhostCta, GlowCard, GradientText } from './kit'
import { Chip, SectionHead } from './ui'

export default function Work() {
  const { projects } = portfolio
  const featured = projects.find((p) => p.flagship)
  const rest = projects.filter((p) => !p.flagship)
  const finePointer = useMedia('(pointer: fine)')
  const reduce = usePrefersReducedMotion()

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const [hovered, setHovered] = useState(null)

  const onMove = (e) => {
    if (!finePointer) return
    px.set(e.clientX)
    py.set(e.clientY)
  }

  const previewOn = finePointer && !reduce

  return (
    <section id="work" className="relative z-[5] mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <SectionHead index={1} label="Selected Work" accent="Engineered." title="Software that ships." />

      {featured && (
        <GlowCard className="mt-14 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
              <img
                src={artFor(featured.id, featured.title, featured.num, { w: 800, h: 520 })}
                alt={`${featured.title} preview`}
                className="h-full w-full object-cover transition-transform duration-700 [timing-function:cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent md:bg-gradient-to-r md:from-transparent md:to-bg/60" />
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                <span className="text-accent">★ flagship</span>
                <span>/{featured.id}</span>
              </div>

              <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                <GradientText>{featured.title}</GradientText>
              </h3>
              <p className="mt-1.5 font-mono text-sm text-mute">{featured.subtitle}</p>

              <p className="mt-5 text-[15px] leading-relaxed text-mute">{featured.longDescription}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {featured.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {(featured.highlight || []).map((h) => (
                  <li key={h} className="flex items-center gap-2 font-mono text-xs text-faint">
                    <span className="h-1 w-1 rounded-full bg-accent" /> {h}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <GhostCta href={featured.github}>view repository</GhostCta>
              </div>
            </div>
          </div>
        </GlowCard>
      )}

      <div
        className="mt-16"
        onPointerMove={onMove}
        onPointerLeave={() => previewOn && setHovered(null)}
      >
        {previewOn && (
          <FloatingPreview item={hovered ? rest.find((r) => r.id === hovered) : null} x={px} y={py} />
        )}

        {rest.map((project) => (
          <a
            key={project.id}
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onPointerEnter={() => setHovered(project.id)}
            onPointerDown={() => setHovered(project.id)}
            className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line-soft py-6 transition-colors hover:border-accent-3/30 sm:gap-6 sm:py-8"
            data-hover
          >
            <span className="font-mono text-xs text-faint transition-colors group-hover:text-accent sm:text-sm">
              {project.num}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-xl font-semibold text-ink transition-transform duration-400 [timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 sm:text-3xl">
                {project.title}
              </span>
              <span className="mt-1 block font-mono text-xs text-faint sm:text-sm">{project.subtitle}</span>
            </span>
            <span className="flex items-center gap-4">
              <span className="hidden max-w-[300px] flex-wrap justify-end gap-1.5 lg:flex">
                {project.tags.slice(0, 3).map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </span>
              <motion.span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-soft bg-surface text-accent transition-all duration-500 [timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:border-accent-3/40 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-fuchsia-500 group-hover:text-white"
                whileHover={{ rotate: 45 }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </motion.span>
            </span>
          </a>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between font-mono text-xs text-faint">
        <span>{rest.length + 1} repositories · live on github</span>
        <a
          href={portfolio.profile.github}
          target="_blank"
          rel="noreferrer"
          className="link-underline text-mute transition-colors hover:text-accent"
        >
          @{portfolio.profile.githubHandle} →
        </a>
      </div>
    </section>
  )
}