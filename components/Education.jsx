'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { portfolio } from '@/content/portfolio'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

gsap.registerPlugin(ScrollTrigger)

export default function Education() {
  const lineRef = useRef(null)

  useEffect(() => {
    const line = lineRef.current
    if (!line) return undefined
    const tween = gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: line, start: 'top 85%', end: 'bottom 55%', scrub: 0.6 }
      }
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section id="education" className="section-shell">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="03 — Education"
          title="The journey so far:"
          grad="CS (AI & ML)."
          sub="Currently studying — building production products alongside the degree."
        />

        <div className="relative mt-14 flex flex-col gap-10">
          <div className="absolute left-[9px] top-2 bottom-2 w-px bg-line" aria-hidden="true" />
          <div
            ref={lineRef}
            className="absolute left-[9px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-indigo-500 via-violet-500 to-fuchsia-500"
            aria-hidden="true"
          />

          {portfolio.education.map((e) => (
            <div key={e.institution} className="relative pl-12">
              <Reveal delay={0.1}>
                <div className="absolute left-[2px] top-9 h-[15px] w-[15px] rounded-full border-2 border-violet-500 bg-bg shadow-glow" />
                <div className="rounded-2xl border border-line bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3.5 py-1 text-xs font-bold text-white">
                      {e.period}
                    </span>
                    <span className="chip">{e.degree}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold">{e.institution}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-mute">{e.program}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {e.coursework.map((c) => (
                      <span key={c} className="chip">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}