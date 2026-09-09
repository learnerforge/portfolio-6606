'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { portfolio } from '@/content/portfolio'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const featured = portfolio.projects.find((p) => p.flagship)
  const others = portfolio.projects.filter((p) => !p.flagship)
  const wrapRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const text = textRef.current
    if (!wrap || !text) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrap, start: 'top 85%', end: 'bottom 35%', scrub: 0.8 }
    })
    tl.fromTo(
      wrap.querySelector('[data-featured-visual]'),
      { scale: 0.86, opacity: 0.4 },
      { scale: 1, opacity: 1, ease: 'none' },
      0
    ).fromTo(
      text,
      { x: 64, opacity: 0 },
      { x: 0, opacity: 1, ease: 'none' },
      0
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section id="projects" className="section-shell">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="05 — Projects"
          title="The work that"
          grad="talks."
          sub="Six shipped products, one flagship. Built end-to-end — backend to UI to deployment."
        />

        <div ref={wrapRef} className="relative mt-14">
          <div
            data-featured-visual
            className={`relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br ${featured.gradient} shadow-card`}
          >
            <div className="relative min-h-[420px] p-6 md:min-h-[520px] md:p-10">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-white/40" />
                <span className="h-3 w-3 rounded-full bg-white/40" />
                <span className="h-3 w-3 rounded-full bg-white/40" />
                <span className="ml-3 rounded-md bg-black/20 px-3 py-1 font-mono text-[11px] text-white/80">
                  pathforge-ai · production
                </span>
              </div>

              <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 800 520" fill="none" aria-hidden="true">
                <path d="M120 150 L320 90 L520 210 L680 140" stroke="white" strokeWidth="1.5" opacity="0.5" />
                <path d="M120 150 L260 330 L520 210 L660 400" stroke="white" strokeWidth="1.5" opacity="0.4" />
                <circle cx="120" cy="150" r="10" fill="white" opacity="0.9" />
                <circle cx="320" cy="90" r="8" fill="white" opacity="0.9" />
                <circle cx="520" cy="210" r="14" fill="white" opacity="0.95" />
                <circle cx="680" cy="140" r="7" fill="white" opacity="0.9" />
                <circle cx="260" cy="330" r="13" fill="white" opacity="0.95" />
                <circle cx="660" cy="400" r="9" fill="white" opacity="0.9" />
                <circle cx="120" cy="150" r="26" stroke="white" strokeWidth="1" opacity="0.35" />
                <circle cx="520" cy="210" r="30" stroke="white" strokeWidth="1" opacity="0.35" />
                <circle cx="260" cy="330" r="26" stroke="white" strokeWidth="1" opacity="0.35" />
              </svg>

              <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div ref={textRef} className="max-w-lg bg-gradient-to-r from-black/45 to-transparent p-5 md:p-0">
                  <span className="inline-block rounded-full bg-black/25 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                    Flagship
                  </span>
                  <h3 className="mt-4 font-display text-3xl font-extrabold text-white md:text-5xl">
                    {featured.title}
                  </h3>
                  <p className="mt-3 text-base font-medium leading-relaxed text-white/90">{featured.subtitle}</p>
                  <p className="mt-2 hidden max-w-md text-sm leading-relaxed text-white/75 md:block">
                    {featured.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {featured.highlight.map((h) => (
                    <div key={h} className="rounded-xl border border-white/25 bg-black/25 px-4 py-3 backdrop-blur-sm">
                      <p className="font-display text-sm font-bold text-white">{h}</p>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={featured.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary absolute right-6 bottom-6 px-5 py-2.5 text-xs md:right-10"
              >
                Source on GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {others.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.08} className="h-full">
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-3/40 hover:shadow-card-hover"
              >
                <div className={`relative h-36 overflow-hidden bg-gradient-to-br ${p.gradient}`}>
                  <div className="absolute inset-0 flex items-center justify-between px-6">
                    <span className="font-display text-5xl font-extrabold text-white/25 transition-transform duration-500 group-hover:scale-110">
                      {p.num}
                    </span>
                    <div className="flex gap-2">
                      {p.highlight.slice(0, 3).map((h) => (
                        <span key={h} className="rounded-md bg-black/20 px-2.5 py-1 text-[10px] font-semibold text-white/85">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-bold transition-colors duration-300 group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-mute">{p.subtitle}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-mute">{p.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t, k) => (
                      <motion.span
                        key={t}
                        className="chip"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ delay: 0.03 * k, duration: 0.4 }}
                      >
                        {t}
                      </motion.span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    View source
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}