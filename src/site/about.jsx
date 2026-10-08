import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { portfolio } from '../content/portfolio'
import { useCountUp, useInView, usePrefersReducedMotion } from './hooks'
import { BlockReveal, GlowCard, GradientText } from './kit'
import { Chip, SectionHead } from './ui'

/* ============================================================
   Stat — count-up metric
   ============================================================ */

function Stat({ stat }) {
  const [ref, inView] = useInView({ threshold: 0.4 })
  const value = useCountUp(stat.value, { active: inView, duration: 1500 })
  return (
    <div ref={ref} className="flex flex-col items-center gap-1 p-6 text-center">
      <span className="font-display text-4xl font-bold text-ink tabular-nums sm:text-5xl">
        {Math.round(value)}
        <span className="text-accent">{stat.suffix}</span>
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{stat.label}</span>
    </div>
  )
}

/* ============================================================
   MiniTerminal — interactive terminal easter egg
   ============================================================ */

const COLOR = {
  ink: 'text-ink',
  mute: 'text-mute',
  accent: 'text-accent',
  faint: 'text-faint',
}
const HELP = `available commands: whoami · ls ./now · cat ./goal.toml · status --energy · focus · help · clear`

function MiniTerminal() {
  const reduce = usePrefersReducedMotion()
  const { personality } = portfolio
  const boot = personality.terminal
  const intro = [
    { t: 'ganesh@portfolio:~$', o: 'welcome. type help to begin.', c: 'mute' },
    { t: 'ganesh@portfolio:~$', o: `status: ${portfolio.openTo[0].toLowerCase()}.`, c: 'accent' },
  ]
  const [lines, setLines] = useState(intro)
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase()
    const prompt = 'ganesh@portfolio:~$'
    let out = null

    const match = boot.find((b) => b.cmd.toLowerCase() === cmd)
    if (match) out = match.out
    else if (cmd === 'help') out = HELP
    else if (cmd === 'focus') out = portfolio.personality.currentlyLearning.join(' · ')
    else if (cmd === 'clear') {
      setLines([])
      return
    } else if (cmd === '') {
      setLines((l) => [...l, { t: prompt, o: '', c: 'ink' }])
      return
    } else out = `command not found: ${raw}. try 'help'.`

    setLines((l) => [...l, { t: prompt, o: raw, c: 'ink' }, { t: '➜', o: out, c: 'mute' }])
  }

  const onKey = (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setLines([])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const cands = boot.map((b) => b.cmd).filter((c) => c.startsWith(input.trim().toLowerCase()))
      if (cands.length === 1) setInput(cands[0])
      else if (cands.length > 1) {
        setLines((l) => [...l, { t: '➜', o: cands.join('   '), c: 'faint' }])
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(input)
      setInput('')
    }
  }

  return (
    <GlowCard spin={false} className="term">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-faint">ganesh@portfolio — zsh</span>
      </div>
      <div ref={bodyRef} className="h-64 overflow-y-auto p-4 pb-2">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {l.t !== '➜' ? (
              <span className="text-faint">{l.t}</span>
            ) : (
              <span className="text-accent">➜</span>
            )}
            <span className={`${COLOR[l.c] || 'text-mute'}`}> {l.o}</span>
          </div>
        ))}
        <div className="flex items-center">
          <span className="shrink-0 text-faint">ganesh@portfolio:~$</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            className="prompt-input ml-2"
            spellCheck={false}
            autoComplete="off"
            enterKeyHint="send"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </GlowCard>
  )
}

export default function About() {
  const p = portfolio.profile
  const about = portfolio.about
  const reduce = usePrefersReducedMotion()

  return (
    <>
      <section id="about" className="relative z-[5] mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 pt-24 sm:px-8 sm:pt-32">
        <SectionHead index={2} label="About" accent="Full stack," title="full product." />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="text-lg leading-relaxed text-mute sm:text-xl">
            {about.paragraphs.map((para, i) => (
              <BlockReveal
                key={i}
                text={para}
                accent={['end-to-end', 'AI', 'LLM', 'production', 'deployment']}
                className="mb-5"
                delay={i * 0.15}
              />
            ))}

            <div className="mt-8 flex flex-wrap gap-2">
              {about.focus.map((f) => (
                <Chip key={f}>{f}</Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <GlowCard className="p-6">
              <p className="eyebrow">
                <span className="text-accent">➜</span> open to
              </p>
              <ul className="mt-4 space-y-3">
                {portfolio.openTo.map((o) => (
                  <li key={o} className="flex items-center gap-3 font-mono text-sm text-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400" />
                    {o}
                  </li>
                ))}
              </ul>
            </GlowCard>

            <GlowCard className="p-6">
              <p className="eyebrow">
                <span className="text-accent">➜</span> currently
              </p>
              <p className="mt-4 text-sm leading-relaxed text-mute">
                Research intern at <span className="text-ink">BrightPitch</span> — exploring agent
                memory, tool-use and agentic workflows with CopilotKit.
              </p>
            </GlowCard>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 divide-x divide-y divide-line-soft border border-line-soft sm:grid-cols-4 sm:divide-y-0">
          {about.stats.map((s) => (
            <Stat key={s.label} stat={s} />
          ))}
        </div>
      </section>

      <section id="craft" className="relative z-[5] mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 pt-24 sm:px-8 sm:pt-32">
        <SectionHead index={3} label="Craft" accent="Deep," title="not just demos." />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {[
            { name: 'languages', items: portfolio.skills.languages, art: 'from-indigo-500 to-violet-500' },
            { name: 'frontend', items: portfolio.skills.frontend, art: 'from-violet-500 to-fuchsia-500' },
            { name: 'backend', items: portfolio.skills.backend, art: 'from-sky-500 to-indigo-500' },
            { name: 'devops · mlops', items: portfolio.skills.devops, art: 'from-emerald-500 to-teal-500' },
            { name: 'ai · llms', items: portfolio.skills.ai, art: 'from-fuchsia-500 to-rose-500' },
          ].map((group, gi) => (
            <motion.div
              key={group.name}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 0.7, delay: gi * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="panel group rounded-2xl p-6 transition-shadow duration-500 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${group.art}`} />
                <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-faint">/{group.name}</h3>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </motion.div>
          ))}

          <MiniTerminal />
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <GlowCard className="p-7">
            <p className="eyebrow">
              <span className="text-accent">➜</span> experience
            </p>
            {portfolio.experience.map((e) => (
              <div key={e.company} className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-ink">{e.role}</h3>
                  {e.current && (
                    <span className="rounded-full border border-accent-3/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                      now
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-faint">
                  {e.company} · {e.type} · {e.period}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {e.points.map((pt) => (
                    <li key={pt} className="flex gap-2 text-sm text-mute">
                      <span className="text-accent">—</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </GlowCard>

          <GlowCard className="p-7">
            <p className="eyebrow">
              <span className="text-accent">➜</span> trail
            </p>
            <div className="mt-5 space-y-4">
              {portfolio.achievements.map((a) => (
                <div key={a.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400" />
                    <span className="h-full w-px bg-line-soft" />
                  </div>
                  <div className="pb-1">
                    <p className="text-sm font-semibold text-ink">
                      {a.title} <span className="ml-1 font-mono text-[10px] text-faint">{a.tag}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-mute">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-line-soft pt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">education</p>
              {portfolio.education.map((ed) => (
                <p key={ed.degree} className="mt-2 text-sm text-mute">
                  <span className="text-ink">{ed.institution}</span> — {ed.program} · {ed.period}
                </p>
              ))}
              <div className="mt-4 flex flex-wrap gap-2">
                {portfolio.certifications.map((c) => (
                  <Chip key={c.name}>
                    {c.name} · {c.issuer}
                  </Chip>
                ))}
              </div>
            </div>
          </GlowCard>
        </div>
      </section>
    </>
  )
}