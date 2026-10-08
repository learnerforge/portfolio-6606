import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { portfolio } from '../content/portfolio'
import { useCountUp, useInView, useMedia, usePrefersReducedMotion } from './hooks'
import { BlockReveal, GlowCard, GradientText, StaggerText } from './kit'
import { Reveal } from './ambient'
import { Chip, SectionHead } from './ui'

/* ============================================================
   Content guards — portfolio.js is the single source of truth
   ============================================================ */

const os = portfolio.os ?? {}
const PROMPT = `${os.user ?? 'user'}@${os.hostname ?? 'portfolio'}:~$`
const HOST_LABEL = `${os.user ?? 'user'}@${os.hostname ?? 'portfolio'} — zsh`

const list = (v) => (Array.isArray(v) ? v : [])
const str = (v, fallback = '') => (typeof v === 'string' && v ? v : fallback)

const ACCENT_WORDS = ['end-to-end', 'AI', 'LLM', 'production', 'deployment']

const SKILL_GROUPS = [
  { name: 'languages', items: list(portfolio.skills?.languages), art: 'from-indigo-500 to-violet-500' },
  { name: 'frontend', items: list(portfolio.skills?.frontend), art: 'from-violet-500 to-fuchsia-500' },
  { name: 'backend', items: list(portfolio.skills?.backend), art: 'from-sky-500 to-indigo-500' },
  { name: 'devops · mlops', items: list(portfolio.skills?.devops), art: 'from-emerald-500 to-teal-500' },
  { name: 'ai · llms', items: list(portfolio.skills?.ai), art: 'from-fuchsia-500 to-rose-500' },
]

const TONE = {
  ink: 'text-ink',
  mute: 'text-mute',
  accent: 'text-accent',
  faint: 'text-faint',
  err: 'text-rose-300',
}

/* ============================================================
   Stat — count-up metric, width reserved → zero CLS,
   reduced motion renders the final value instantly
   ============================================================ */

function Stat({ stat }) {
  const reduce = usePrefersReducedMotion()
  const [ref, inView] = useInView({ threshold: 0.4 })

  const end = typeof stat?.value === 'number' ? stat.value : 0
  const suffix = str(stat?.suffix, '')
  const animated = useCountUp(end, { active: inView && !reduce, duration: 1500 })

  const finalNum = String(Math.round(end))
  const shownNum = reduce ? finalNum : String(Math.round(animated))

  return (
    <div ref={ref} className="flex min-w-0 flex-col items-center gap-1.5 p-4 text-center sm:p-6">
      <span
        className="inline-block font-display text-4xl font-bold tabular-nums text-ink sm:text-5xl"
        style={{ minWidth: `${Math.max(finalNum.length + suffix.length, 1)}ch` }}
      >
        {shownNum}
        <span className="text-accent">{suffix}</span>
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{str(stat?.label, '')}</span>
    </div>
  )
}

/* ============================================================
   SkillChip — keyboard-focusable, touch-friendly sibling of
   ui.jsx Chip (Chip only accepts children/className, so focus
   + tap targets have to live here)
   ============================================================ */

function SkillChip({ children }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-9 max-w-full items-center rounded-md border border-line-soft bg-surface-2/70 px-3 py-1.5 text-left font-mono text-[11px] leading-snug text-mute transition-colors hover:border-accent-3/40 hover:text-accent"
      data-hover
    >
      <span className="min-w-0 break-words">{children}</span>
    </button>
  )
}

/* ============================================================
   GroupTitle — GradientText with a static reduced-motion path
   (kit GradientText animates forever via motion, which CSS
   prefers-reduced-motion rules cannot switch off)
   ============================================================ */

function GroupTitle({ children }) {
  const reduce = usePrefersReducedMotion()
  if (reduce) return <span className="grad-text">{children}</span>
  return <GradientText>{children}</GradientText>
}

/* ============================================================
   MetaBadge / Entry — consistent craft-column entry anatomy:
   title · org · year-range badges (percentage grid) · description
   ============================================================ */

function MetaBadge({ children, tone = 'quiet', inline = false }) {
  if (children === null || children === undefined || children === '') return null
  return (
    <span
      className={`inline-flex max-w-full break-words rounded-full border px-3 py-1 font-mono text-[10px] uppercase leading-snug tracking-[0.12em] ${
        inline ? 'w-auto shrink-0' : 'w-full'
      } ${
        tone === 'accent'
          ? 'border-accent-3/30 bg-accent/10 text-accent'
          : 'border-line-soft bg-surface-2/70 text-faint'
      }`}
    >
      {children}
    </span>
  )
}

function Entry({ title, org, aside, children }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
        <h3 className="min-w-0 font-display text-base font-semibold leading-snug text-ink sm:text-lg">
          {title}
        </h3>
        {aside}
      </div>
      {org ? (
        <p className="mt-1 min-w-0 font-mono text-[11px] leading-relaxed text-faint">{org}</p>
      ) : null}
      {children}
    </div>
  )
}

/* ============================================================
   Identity — portrait + name + roles + tagline
   ============================================================ */

function Identity() {
  const p = portfolio.profile ?? {}
  const [imgOk, setImgOk] = useState(true)
  const roles = list(p.roles)
  const avatar = str(p.avatar)
  const showAvatar = Boolean(avatar) && imgOk

  return (
    <Reveal className="mt-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-line-soft bg-surface-2 sm:h-32 sm:w-32">
          {showAvatar ? (
            <img
              src={avatar}
              alt={str(p.name, 'Profile') ? `${str(p.name, 'Profile')} — profile` : 'Profile portrait'}
              width={128}
              height={128}
              loading="lazy"
              decoding="async"
              onError={() => setImgOk(false)}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="grad-text grid h-full w-full place-items-center font-display text-3xl font-extrabold">
              {str(p.monogram, str(p.first, '·'))}
            </span>
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"
          />
        </div>

        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
            {str(roles[0], str(p.core, 'profile'))}
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            <StaggerText text={str(p.name, '')} />
          </h3>
          {roles.length > 1 ? (
            <p className="mt-2 font-mono text-xs leading-relaxed text-faint sm:text-sm">
              {roles.slice(1).join(' · ')}
            </p>
          ) : null}
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
            {str(p.tagline, '')}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            {str(p.location) ? (
              <span>
                <span className="text-accent">based</span> — {p.location}
              </span>
            ) : null}
            {str(p.status) ? (
              <span>
                <span className="text-accent">status</span> — {p.status}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* ============================================================
   MiniTerminal — interactive terminal easter egg
   ============================================================ */

function MiniTerminal() {
  const reduce = usePrefersReducedMotion()
  const fine = useMedia('(pointer: fine)')

  const personality = portfolio.personality ?? {}
  const boot = list(personality.terminal)
  const learning = list(personality.currentlyLearning)
  const altFocus = list(personality.thingsIBuild)
  const openTo = list(portfolio.openTo)

  const commands = useMemo(() => {
    const names = boot.map((b) => str(b?.cmd).toLowerCase()).filter(Boolean)
    return [...new Set([...names, 'help', 'focus', 'clear'])]
  }, [boot])

  const helpText = useMemo(() => `available commands: ${commands.join(' · ')}`, [commands])

  const intro = useMemo(
    () => [
      { t: PROMPT, o: `welcome to ${str(os.name, 'portfolio')} ${str(os.version)}`.trim(), c: 'mute' },
      { t: PROMPT, o: "type 'help' for the command list.", c: 'faint' },
      { t: PROMPT, o: `status: ${str(openTo[0], 'open to work').toLowerCase()}.`, c: 'accent' },
    ],
    [openTo],
  )

  const [lines, setLines] = useState(intro)
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)

  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const histRef = useRef([])
  const histIdxRef = useRef(-1)
  const draftRef = useRef('')
  const autoRef = useRef(false)

  const [viewRef, inView] = useInView({ threshold: 0.3, once: false, rootMargin: '0px 0px -5% 0px' })

  const setBodyRef = useCallback(
    (el) => {
      bodyRef.current = el
      viewRef.current = el
    },
    [viewRef],
  )

  /* keep the newest output visible — instant, no smooth scroll
     so reduced-motion never sees a scroll animation */
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  /* auto-focus once, desktop (fine pointer) only, never scrolls the
     page; release focus when the terminal leaves the viewport */
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    if (!inView) {
      if (typeof document !== 'undefined' && document.activeElement === el) el.blur()
      return
    }
    if (autoRef.current || !fine) return
    autoRef.current = true
    el.focus({ preventScroll: true })
  }, [inView, fine])

  const push = (entries) => setLines((prev) => [...prev, ...entries])

  const run = (raw) => {
    const typed = String(raw ?? '')
    const key = typed.trim().toLowerCase()
    const echo = { t: PROMPT, o: typed, c: 'ink' }

    if (!key) {
      push([echo])
      return
    }
    if (key === 'clear') {
      setLines([])
      return
    }

    const exact = boot.find((b) => str(b?.cmd).toLowerCase() === key)
    const token = key.split(' ')[0]
    const partial =
      key === token
        ? boot.find((b) => str(b?.cmd).toLowerCase().startsWith(`${token} `))
        : null
    const match = exact ?? partial

    let out = ''
    let c = 'mute'
    if (match) {
      out = str(match.out)
    } else if (key === 'help') {
      out = helpText
    } else if (key === 'focus') {
      out = learning.length ? learning.join(' · ') : altFocus.join(' · ')
    } else {
      out = `command not found: ${typed.trim()}. type 'help' for the list.`
      c = 'err'
    }

    push([echo, { t: c === 'err' ? '!' : '➜', o: out, c }])
  }

  const onKey = (e) => {
    const k = e.key

    if (e.ctrlKey && !e.altKey && !e.metaKey && (k === 'l' || k === 'L')) {
      e.preventDefault()
      setLines([])
      return
    }

    if (k === 'Tab') {
      e.preventDefault()
      const q = input.trim().toLowerCase()
      const cands = commands.filter((c) => c.startsWith(q))
      if (cands.length === 1) {
        setInput(cands[0])
        histIdxRef.current = -1
        return
      }
      if (cands.length > 1) {
        let prefix = cands[0]
        for (const c of cands) {
          while (!c.startsWith(prefix)) prefix = prefix.slice(0, -1)
        }
        if (prefix.length > q.length) {
          setInput(prefix)
          histIdxRef.current = -1
          return
        }
        push([{ t: '➜', o: cands.join('   '), c: 'faint' }])
        return
      }
      push([{ t: '!', o: `no completions for '${q}'.`, c: 'err' }])
      return
    }

    if (k === 'Enter') {
      e.preventDefault()
      const typed = input
      if (typed.trim()) {
        const h = histRef.current
        if (h[h.length - 1] !== typed) h.push(typed)
        histIdxRef.current = -1
        draftRef.current = ''
      }
      run(typed)
      setInput('')
      return
    }

    if (k === 'ArrowUp' || k === 'ArrowDown') {
      e.preventDefault()
      const h = histRef.current
      if (!h.length) return
      let idx = histIdxRef.current
      if (k === 'ArrowUp') {
        if (idx === -1) {
          draftRef.current = input
          idx = h.length - 1
        } else if (idx > 0) {
          idx -= 1
        }
      } else {
        if (idx === -1) return
        if (idx < h.length - 1) {
          idx += 1
        } else {
          histIdxRef.current = -1
          setInput(draftRef.current)
          return
        }
      }
      histIdxRef.current = idx
      setInput(h[idx])
      return
    }

    if (k === 'Escape') {
      if (typeof document !== 'undefined' && document.activeElement === inputRef.current) {
        inputRef.current?.blur()
      }
    }
  }

  const onBodyClick = () => {
    const sel =
      typeof window !== 'undefined' && typeof window.getSelection === 'function'
        ? window.getSelection()
        : null
    if (sel && !sel.isCollapsed) return
    autoRef.current = true
    inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <GlowCard
      spin={false}
      className={`term transition-colors duration-300 ${focused ? 'border-accent/40' : ''}`}
    >
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-mono text-[11px] text-faint">{HOST_LABEL}</span>
        <span
          aria-hidden="true"
          className="ml-auto hidden shrink-0 font-mono text-[10px] text-fainter sm:block"
        >
          tab · ↑↓ · ctrl+l
        </span>
      </div>

      <div ref={setBodyRef} onClick={onBodyClick} className="h-64 overflow-y-auto overscroll-contain p-4 pb-2">
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {lines.map((l, i) => {
            const marker =
              l.t === '!' ? 'text-rose-300' : l.t === '➜' ? 'text-accent' : 'text-faint'
            return (
              <div key={i} className="whitespace-pre-wrap break-words">
                <span className={marker}>{l.t}</span>
                <span className={TONE[l.c] ?? 'text-mute'}>{l.o ? ` ${l.o}` : ''}</span>
              </div>
            )
          })}
        </div>

        <div className="mt-1 flex items-center">
          <span className="shrink-0 text-faint">{PROMPT}</span>
          <span className="relative ml-2 min-w-0 flex-1">
            {!focused && !input ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1/2 h-[1.05em] w-[6px] -translate-y-1/2 bg-accent"
                style={reduce ? undefined : { animation: 'blink 1.1s steps(1) infinite' }}
              />
            ) : null}
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="prompt-input w-full"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              inputMode="text"
              enterKeyHint="send"
              aria-label="Terminal command input"
            />
          </span>
        </div>
      </div>
    </GlowCard>
  )
}

/* ============================================================
   About + Craft
   ============================================================ */

export default function About() {
  const about = portfolio.about ?? {}
  const reduce = usePrefersReducedMotion()

  const paragraphs = list(about.paragraphs).filter((x) => typeof x === 'string')
  const focus = list(about.focus)
  const openTo = list(portfolio.openTo)
  const experience = list(portfolio.experience)
  const achievements = list(portfolio.achievements)
  const education = list(portfolio.education)
  const certifications = list(portfolio.certifications)
  const coursework = list(education[0]?.coursework)
  const profiles = list(portfolio.codingProfiles)
  const learning = list(portfolio.personality?.currentlyLearning)

  const now = experience.find((e) => e?.current) ?? experience[0]

  /* stats: derived from real data where the data supports it,
     otherwise the authored value from portfolio.about.stats */
  const stats = useMemo(() => {
    const projects = list(portfolio.projects)
    const derived = {
      'Production-grade projects': projects.length,
      'Flagship AI product': projects.filter((x) => x?.flagship).length,
    }
    return list(about.stats).map((s) => {
      const d = derived[s?.label]
      const value = typeof d === 'number' ? d : typeof s?.value === 'number' ? s.value : 0
      return { label: str(s?.label), suffix: str(s?.suffix), value }
    })
  }, [about.stats])

  const cardMotion = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -10% 0px' },
    transition: { duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  })

  return (
    <>
      <section id="about" className="relative z-[5] mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 pt-24 sm:px-8 sm:pt-32">
        <SectionHead index={2} label="About" accent="Full stack," title="full product." />

        <Identity />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0 text-lg leading-relaxed text-mute sm:text-xl">
            {paragraphs.map((para, i) => (
              <BlockReveal
                key={i}
                text={para}
                accent={ACCENT_WORDS}
                className="mb-5"
                delay={i * 0.15}
              />
            ))}

            <div className="mt-8 flex flex-wrap gap-2">
              {focus.map((f) => (
                <SkillChip key={f}>{f}</SkillChip>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <Reveal delay={0.05}>
              <GlowCard className="p-6">
                <p className="eyebrow">
                  <span className="text-accent">➜</span> open to
                </p>
                <ul className="mt-4 space-y-3">
                  {openTo.map((o) => (
                    <li key={o} className="flex items-center gap-3 font-mono text-sm text-ink">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400" />
                      <span className="min-w-0 break-words">{o}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </Reveal>

            <Reveal delay={0.12}>
              <GlowCard className="p-6">
                <p className="eyebrow">
                  <span className="text-accent">➜</span> currently
                </p>
                {now ? (
                  <p className="mt-4 text-sm leading-relaxed text-mute">
                    <span className="text-ink">{str(now.role, str(now.company, ''))}</span>
                    {str(now.company) ? <> at <span className="text-ink">{now.company}</span></> : null}
                    {str(now.period) ? <span className="text-faint"> — {now.period}</span> : null}
                  </p>
                ) : null}
                {now && list(now.points)[0] ? (
                  <p className="mt-2 text-sm leading-relaxed text-mute">{list(now.points)[0]}</p>
                ) : null}
                {learning.length ? (
                  <p className="mt-3 font-mono text-xs leading-relaxed text-faint">
                    <span className="text-accent">learning</span> — {learning.join(' · ')}
                  </p>
                ) : null}
              </GlowCard>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 divide-x divide-y divide-line-soft border border-line-soft sm:grid-cols-4 sm:divide-y-0">
          {stats.map((s, i) => (
            <Stat key={`${s.label}-${i}`} stat={s} />
          ))}
        </div>
      </section>

      <section id="craft" className="relative z-[5] mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 pt-24 sm:px-8 sm:pt-32">
        <SectionHead index={3} label="Craft" accent="Deep," title="not just demos." />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {SKILL_GROUPS.map((group, gi) => (
            <motion.div
              key={group.name}
              {...cardMotion(gi)}
              className="panel group min-w-0 rounded-2xl p-6 transition-shadow duration-500 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 shrink-0 rounded-full bg-gradient-to-br ${group.art}`} />
                <h3 className="min-w-0 font-mono text-xs uppercase tracking-[0.22em] text-faint">
                  /<GroupTitle>{group.name}</GroupTitle>
                </h3>
                <span className="ml-auto shrink-0 font-mono text-[10px] text-fainter">
                  {group.items.length}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <SkillChip key={s}>{s}</SkillChip>
                ))}
              </div>
            </motion.div>
          ))}

          <MiniTerminal />
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {experience.length > 0 && (
            <motion.div {...cardMotion(0)} className="min-w-0">
              <GlowCard className="h-full p-7 transition-shadow duration-500 hover:shadow-card-hover">
                <p className="eyebrow">
                  <span className="text-accent">➜</span> experience
                </p>
                <div className="mt-5 space-y-7">
                  {experience.map((e, i) => (
                    <Entry
                      key={`${str(e?.company, 'exp')}-${i}`}
                      title={str(e?.role, str(e?.company, 'Experience'))}
                      org={str(e?.company)}
                      aside={e?.current ? <MetaBadge tone="accent" inline>now</MetaBadge> : null}
                    >
                      <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <MetaBadge>{str(e?.period)}</MetaBadge>
                        <MetaBadge>{str(e?.type)}</MetaBadge>
                      </div>
                      {list(e?.points).length ? (
                        <ul className="mt-3 space-y-1.5">
                          {list(e.points).map((pt) => (
                            <li key={pt} className="flex gap-2 text-sm leading-relaxed text-mute">
                              <span className="shrink-0 text-accent">—</span>
                              <span className="min-w-0 break-words">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </Entry>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          )}

          {achievements.length > 0 && (
            <motion.div {...cardMotion(1)} className="min-w-0">
              <GlowCard className="h-full p-7 transition-shadow duration-500 hover:shadow-card-hover">
                <p className="eyebrow">
                  <span className="text-accent">➜</span> trail
                </p>
                <div className="mt-5 space-y-5">
                  {achievements.map((a, i) => (
                    <div key={`${str(a?.title, 'ach')}-${i}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400" />
                        {i < achievements.length - 1 ? (
                          <span className="h-full w-px bg-line-soft" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1 pb-1">
                        <Entry title={str(a?.title, 'Achievement')} org={str(a?.org)}>
                          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <MetaBadge>{str(a?.tag)}</MetaBadge>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-mute">
                            {str(a?.desc)}
                          </p>
                        </Entry>
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          )}

          {education.length > 0 && (
            <motion.div {...cardMotion(2)} className="min-w-0">
              <GlowCard className="h-full p-7 transition-shadow duration-500 hover:shadow-card-hover">
                <p className="eyebrow">
                  <span className="text-accent">➜</span> education
                </p>
                <div className="mt-5 space-y-5">
                  {education.map((ed, i) => (
                    <Entry
                      key={`${str(ed?.institution, 'edu')}-${i}`}
                      title={str(ed?.degree, str(ed?.program, 'Education'))}
                      org={[str(ed?.institution), str(ed?.location)].filter(Boolean).join(' · ')}
                    >
                      <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <MetaBadge>{str(ed?.period)}</MetaBadge>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-mute">
                        {str(ed?.program)}
                      </p>
                    </Entry>
                  ))}
                </div>

                {coursework.length ? (
                  <div className="mt-5 border-t border-line-soft pt-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
                      coursework
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {coursework.map((c) => (
                        <Chip key={c} className="max-w-full break-words">{c}</Chip>
                      ))}
                    </div>
                  </div>
                ) : null}

                {certifications.length ? (
                  <div className="mt-5 border-t border-line-soft pt-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
                      certifications
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {certifications.map((c, i) => (
                        <Chip key={`${str(c?.name, 'cert')}-${i}`} className="max-w-full break-words">
                          {[str(c?.name), str(c?.issuer)].filter(Boolean).join(' · ')}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ) : null}
              </GlowCard>
            </motion.div>
          )}

          {profiles.length > 0 && (
            <motion.div {...cardMotion(3)} className="min-w-0">
              <GlowCard className="h-full p-7 transition-shadow duration-500 hover:shadow-card-hover">
                <p className="eyebrow">
                  <span className="text-accent">➜</span> profiles
                </p>
                <div className="mt-5 space-y-2.5">
                  {profiles.map((c, i) => {
                    const url = str(c?.url)
                    const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
                    return (
                      <a
                        key={`${str(c?.name, 'profile')}-${i}`}
                        href={url || undefined}
                        target={url.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="group flex min-w-0 items-center gap-3 rounded-xl border border-line-soft bg-surface-2/50 px-4 py-3 transition-colors hover:border-accent-3/40"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink transition-colors group-hover:text-accent">
                            {str(c?.name, host || 'Profile')}
                          </span>
                          <span className="block truncate font-mono text-[11px] text-faint">{host}</span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="shrink-0 font-mono text-xs text-faint transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
                        >
                          ↗
                        </span>
                      </a>
                    )
                  })}
                </div>
              </GlowCard>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
