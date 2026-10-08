import { useState } from 'react'
import { motion, useMotionValue } from 'motion/react'
import { portfolio } from '../content/portfolio'
import { useMedia, usePrefersReducedMotion } from './hooks'
import {
  artFor,
  BlockReveal,
  FloatingPreview,
  GhostCta,
  GlowCard,
  GradientText,
  StaggerText,
} from './kit'
import { Chip, SectionHead } from './ui'

const EASE = [0.16, 1, 0.3, 1]

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi))

function ProjectRow({ project, index, reduce, onHover }) {
  const id = project?.id ?? 'project'
  const num = project?.num ?? ''
  const title = project?.title ?? ''
  const subtitle = project?.subtitle ?? ''
  const blurb = project?.blurb ?? project?.description ?? ''
  const tags = (project?.tags ?? []).filter(Boolean)
  const github = project?.github ?? ''
  const live = project?.live ?? ''
  const primary = github || live

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.05, 0.25), ease: EASE }}
      onPointerEnter={() => onHover(id)}
      className="group relative border-b border-line-soft transition-colors hover:border-accent-3/30"
      data-hover
    >
      {primary ? (
        <a
          href={primary}
          target="_blank"
          rel="noreferrer"
          aria-label={`${title || id} — open project`}
          className="absolute inset-0 z-0 rounded-sm"
        />
      ) : null}

      <div className="pointer-events-none relative z-[1] grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 sm:gap-6 sm:py-8">
        <span className="font-mono text-xs text-faint transition-colors group-hover:text-accent sm:text-sm">
          {num}
        </span>

        <div className="min-w-0">
          <span className="block font-display text-xl font-semibold text-ink transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 sm:text-3xl">
            <StaggerText text={title} />
          </span>
          {subtitle ? (
            <span className="mt-1 block font-mono text-xs text-faint sm:text-sm">{subtitle}</span>
          ) : null}
          {blurb ? (
            <BlockReveal
              text={blurb}
              className="mt-2 block max-w-xl text-sm leading-relaxed text-mute"
            />
          ) : null}
        </div>

        <span className="flex items-center gap-3 sm:gap-4">
          <span className="hidden max-w-[300px] flex-wrap justify-end gap-1.5 lg:flex">
            {tags.slice(0, 3).map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </span>
          {live ? (
            <a
              href={live}
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto relative z-10 inline-flex min-h-9 items-center rounded-full border border-line-soft bg-surface px-3 font-mono text-[11px] text-mute transition-colors hover:border-accent-3/40 hover:text-accent"
            >
              live ↗
            </a>
          ) : null}
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-soft bg-surface text-accent transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:border-accent-3/40 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-fuchsia-500 group-hover:text-white"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </span>
        </span>
      </div>
    </motion.div>
  )
}

export default function Work() {
  const projects = portfolio?.projects ?? []
  const isFlagship = (p) => p?.featured?.flagship === true || p?.flagship === true
  const featured = projects.find(isFlagship) ?? null
  const rest = projects.filter((p) => !isFlagship(p))
  const profile = portfolio?.profile ?? {}
  const repoCount = (featured ? 1 : 0) + rest.length

  const finePointer = useMedia('(pointer: fine)')
  const reduce = usePrefersReducedMotion()
  const previewOn = finePointer && !reduce

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const [hovered, setHovered] = useState(null)

  const onMove = (e) => {
    if (!previewOn) return
    const vw = window.innerWidth || 1280
    const vh = window.innerHeight || 800
    const halfW = vw < 640 ? 151 : 166
    px.set(clamp(e.clientX, halfW, Math.max(halfW, vw - halfW)))
    py.set(clamp(e.clientY, 148, Math.max(148, vh - 96)))
  }

  const previewItem = hovered ? projects.find((p) => p?.id === hovered) ?? null : null

  const fTitle = featured?.title ?? ''
  const fSubtitle = featured?.subtitle ?? ''
  const fLong = featured?.longDescription ?? featured?.description ?? ''
  const fStack = featured?.stack ?? ''
  const fRole = featured?.role ?? ''
  const fTags = (featured?.tags ?? []).filter(Boolean)
  const fHighlights = (featured?.highlight ?? []).filter(Boolean)
  const fGithub = featured?.github ?? ''
  const fLive = featured?.live ?? ''

  return (
    <section id="work" className="relative z-[5] mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <SectionHead index={1} label="Selected Work" accent="Engineered." title="Software that ships." />

      <div onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
        {previewOn ? <FloatingPreview item={previewItem} x={px} y={py} /> : null}

        {featured ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: EASE }}
            onPointerEnter={() => setHovered(featured?.id ?? null)}
            className="mt-14"
          >
            <GlowCard className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
                  <img
                    src={artFor(featured?.id, fTitle, featured?.num, { w: 800, h: 520 })}
                    alt={`${fTitle || 'Flagship'} preview`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent md:bg-gradient-to-r md:from-transparent md:to-bg/60" />
                </div>

                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                    <span className="text-accent">★ flagship</span>
                    <span>/{featured?.id ?? 'project'}</span>
                  </div>

                  <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                    <GradientText>{fTitle}</GradientText>
                  </h3>
                  {fSubtitle ? <p className="mt-1.5 font-mono text-sm text-mute">{fSubtitle}</p> : null}
                  {fRole ? (
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-faint">
                      my role — {fRole}
                    </p>
                  ) : null}

                  {fLong ? (
                    <BlockReveal
                      text={fLong}
                      accent={['AI', 'Dockerized']}
                      className="mt-5 text-[15px] leading-relaxed text-mute"
                    />
                  ) : null}

                  {fStack ? (
                    <p className="mt-4 font-mono text-xs leading-relaxed text-faint">{fStack}</p>
                  ) : null}

                  {fTags.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {fTags.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  ) : null}

                  {fHighlights.length ? (
                    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                      {fHighlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 font-mono text-xs text-faint">
                          <span className="h-1 w-1 rounded-full bg-accent" /> {h}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {fGithub ? <GhostCta href={fGithub}>view repository</GhostCta> : null}
                    {fLive ? (
                      <a
                        href={fLive}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline inline-flex min-h-9 items-center font-mono text-sm text-mute transition-colors hover:text-accent"
                      >
                        live demo ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ) : null}

        <div className="mt-16">
          {rest.map((project, i) => (
            <ProjectRow
              key={project?.id ?? i}
              project={project}
              index={i}
              reduce={reduce}
              onHover={setHovered}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between font-mono text-xs text-faint">
        <span>
          {repoCount} {repoCount === 1 ? 'repository' : 'repositories'} · live on github
        </span>
        {profile.github ? (
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="link-underline text-mute transition-colors hover:text-accent"
          >
            @{profile.githubHandle ?? 'github'} →
          </a>
        ) : null}
      </div>
    </section>
  )
}
