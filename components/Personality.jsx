'use client'

import { useEffect, useState } from 'react'
import { portfolio } from '@/content/portfolio'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

function Terminal() {
  const lines = portfolio.personality.terminal
  const [done, setDone] = useState(0)
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (done >= lines.length) return undefined
    const target = lines[done].out
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(target.slice(0, i))
      if (i >= target.length) {
        clearInterval(id)
        window.setTimeout(() => setDone((d) => d + 1), 350)
      }
    }, 16)
    return () => clearInterval(id)
  }, [done, lines])

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#080812] shadow-card">
      <div className="flex items-center gap-2 border-b border-line px-5 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-faint">ganesh@portfolio — zsh</span>
      </div>
      <div className="space-y-4 p-6 font-mono text-sm leading-relaxed">
        {lines.slice(0, done).map((line, i) => (
          <div key={i}>
            <p className="text-emerald-400">
              <span className="text-violet-400">➜</span> <span className="text-sky-400">~</span>{' '}
              <span className="text-white">{line.cmd}</span>
            </p>
            <p className="mt-1 text-zinc-300">{line.out}</p>
          </div>
        ))}
        {done < lines.length && (
          <div>
            <p className="text-emerald-400">
              <span className="text-violet-400">➜</span> <span className="text-sky-400">~</span>{' '}
              <span className="text-white">{lines[done].cmd}</span>
            </p>
            <p className="mt-1 min-h-[1.5em] text-zinc-300">
              {typed}
              <span className="ml-0.5 inline-block h-[1.1em] w-[7px] translate-y-0.5 animate-pulse bg-emerald-400" />
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Personality() {
  return (
    <section id="personality" className="section-shell">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="07 — Personality"
          title="What I build,"
          grad="what I love."
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal x={-30}>
            <Terminal />
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-line bg-surface p-7 shadow-card">
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-mute">
                  Things I build
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {portfolio.personality.thingsIBuild.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2">
{portfolio.personality.currentlyLearning.map((l, i) => (
                <Reveal key={l} delay={0.15 + i * 0.08}>
                  <div className={`h-full rounded-2xl border border-line bg-surface p-6 shadow-card transition-transform duration-300 hover:-translate-y-1 ${i % 2 ? 'mt-6' : ''}`}>
                    <div className={`h-2 w-2 rounded-full ${i % 2 ? 'bg-fuchsia-400 animate-drift' : 'bg-sky-400 animate-drift'}`} />
                    <p className="mt-4 font-display text-sm font-bold">{l}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}