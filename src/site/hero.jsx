import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { portfolio } from '../content/portfolio'
import { useMedia, usePrefersReducedMotion } from './hooks'
import { useSiteEntered } from './ambient'
import { GhostCta, HeroBackground, StaggerText, StarfieldButton } from './kit'

const EASE = [0.16, 1, 0.3, 1]

function enterProps(reduce, delay) {
  if (reduce) return {}
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  }
}

const RAIL = [
  { label: 'github', href: portfolio?.profile?.github },
  { label: 'linkedin', href: portfolio?.profile?.linkedin },
  { label: 'email', href: portfolio?.profile?.email ? `mailto:${portfolio.profile.email}` : null },
].filter((r) => typeof r.href === 'string' && r.href.length > 0)

/* ============================================================
   RoleCycle — rotating roles with a proper read-pause.

   Kit's Typewriter holds the full word for only ~90ms and grows
   the line without reserving width (CLS), so the hero renders
   this local cycle instead: type -> hold 1.5s -> delete -> gap,
   with the box width pinned to the longest role.
   ============================================================ */

function RoleCycle({ roles }) {
  const reduce = usePrefersReducedMotion()
  const words = roles
  const maxLen = words.reduce((m, w) => Math.max(m, w.length), 0)
  const [st, setSt] = useState({ i: 0, len: 0, mode: 'type' })

  useEffect(() => {
    if (reduce || words.length === 0) return undefined
    const word = words[st.i] ?? ''
    let delay
    let advance
    if (st.mode === 'type') {
      if (st.len < word.length) {
        delay = st.len === 0 ? 300 : 52
        advance = () => setSt((s) => ({ ...s, len: s.len + 1 }))
      } else {
        delay = 1500
        advance = () => setSt((s) => ({ ...s, mode: 'delete' }))
      }
    } else if (st.len > 0) {
      delay = 30
      advance = () => setSt((s) => ({ ...s, len: s.len - 1 }))
    } else {
      delay = 320
      advance = () => setSt((s) => ({ mode: 'type', len: 0, i: (s.i + 1) % words.length }))
    }
    const t = setTimeout(advance, delay)
    return () => clearTimeout(t)
  }, [st, reduce, words])

  const word = words[st.i] ?? ''
  const text = reduce ? (words[0] ?? '') : word.slice(0, st.len)

  return (
    <span className="inline-flex items-baseline">
      <span className="sr-only">{words.join(', ')}</span>
      <span
        aria-hidden="true"
        className="inline-flex items-baseline"
        style={maxLen ? { minWidth: `calc(${maxLen}ch + 6px)` } : undefined}
      >
        <span className="text-accent-2">{text}</span>
        {!reduce && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-accent-2"
            style={{ animation: 'blink 1.1s steps(1) infinite' }}
          />
        )}
      </span>
    </span>
  )
}

export default function Hero() {
  const reduce = usePrefersReducedMotion()
  const finePointer = useMedia('(pointer: fine)')
  const entered = useSiteEntered()
  const p = portfolio?.profile ?? {}
  const sectionRef = useRef(null)
  const rectRef = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 })
  const py = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 })

  const roles = useMemo(
    () => (Array.isArray(p.roles) ? p.roles.filter((r) => typeof r === 'string' && r.trim()) : []),
    [p.roles]
  )

  const status = useMemo(() => {
    if (typeof p.status === 'string' && p.status.trim()) return p.status.trim()
    const first = Array.isArray(portfolio?.openTo) ? portfolio.openTo[0] : null
    return typeof first === 'string' && first.trim() ? `open to ${first.trim()}` : ''
  }, [p.status])

  useEffect(() => {
    const measure = () => {
      rectRef.current = sectionRef.current?.getBoundingClientRect() ?? null
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
    }
  }, [entered])

  const onMove = (e) => {
    if (!finePointer || reduce) return
    const r = rectRef.current
    if (!r || r.width === 0 || r.height === 0) return
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 14)
    my.set(((e.clientY - r.top) / r.height - 0.5) * 10)
  }

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', '60% start'],
  })
  const fadeOut = useTransform(scrollYProgress, [0, 1], [1, 0])
  const rise = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerMove={onMove}
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-5 sm:px-8"
    >
      <span id="top" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" />

      {entered && (
        <>
          <HeroBackground className="pointer-events-none" />

          <motion.div style={reduce ? undefined : { x: px, y: py }} className="relative z-[5] mx-auto w-full max-w-6xl">
            <motion.div style={reduce ? undefined : { opacity: fadeOut, y: rise }}>
              <motion.p {...enterProps(reduce, 0.05)} className="eyebrow mb-6">
                <span className="text-accent">➜</span> hello world, i'm
              </motion.p>

              <h1 className="font-display text-[13.5vw] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink sm:text-[7rem] lg:text-[9rem]">
                <StaggerText text={p.first ?? ''} className="block" delay={0.15} />
                <StaggerText text={p.last ?? ''} className="block pl-[0.14em]" delay={0.5} />
              </h1>

              <motion.div
                {...enterProps(reduce, 0.78)}
                className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm text-mute sm:text-base"
              >
                <span className="text-faint">&gt;</span>
                {roles.length > 0 ? <RoleCycle roles={roles} /> : <span className="text-faint">{p.core ?? ''}</span>}
              </motion.div>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
                <StaggerText text={p.tagline ?? ''} delay={0.9} />
              </p>

              <motion.div {...enterProps(reduce, 1.05)} className="mt-9 flex flex-wrap items-center gap-4">
                <StarfieldButton href="#work" className="h-12 min-w-[172px] px-7 text-sm font-semibold">
                  See the work
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </StarfieldButton>
                <GhostCta href={`mailto:${p.email ?? ''}`}>ping me</GhostCta>
              </motion.div>

              <motion.div {...enterProps(reduce, 1.2)} className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                {status && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                      style={{ animation: 'pulse-soft 2.2s ease-in-out infinite' }}
                    />
                    {status}
                  </span>
                )}
                <p className="font-mono text-xs text-faint">
                  <span className="text-accent">located</span> — {p.location ?? ''}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            {...enterProps(reduce, 1.35)}
            className="pointer-events-none absolute bottom-10 left-8 z-[5] hidden flex-col gap-4 sm:flex"
          >
            {RAIL.map((r) => (
              <a
                key={r.label}
                href={r.href}
                target={r.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                data-hover
                className="group pointer-events-auto flex min-h-9 items-center gap-2 py-1.5 font-mono text-[11px] uppercase tracking-widest text-faint transition-colors hover:text-accent"
              >
                <span className="h-px w-6 bg-faint/50 transition-all group-hover:w-9 group-hover:bg-accent" />
                {r.label}
              </a>
            ))}
          </motion.div>

          <motion.div
            {...enterProps(reduce, 1.35)}
            className="pointer-events-none absolute bottom-8 right-8 z-[5] flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-faint"
            aria-hidden="true"
          >
            <span>scroll</span>
            <motion.span
              className="block h-10 w-px bg-gradient-to-b from-accent to-transparent"
              animate={reduce ? undefined : { scaleY: [0.2, 1, 0.2], originY: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </>
      )}
    </section>
  )
}
