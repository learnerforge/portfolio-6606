import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { portfolio } from '../content/portfolio'
import { usePrefersReducedMotion, useScrolled } from './hooks'

/* ============================================================
   Boot sequencing — the preloader owns WHEN the page enters.

   markSiteReady() fires exactly once, after the preloader has
   fully exited (or instantly, under reduced motion). Nav + Hero
   gate their entrance animations behind useSiteEntered(), so no
   entrance ever runs hidden behind the curtain, and the two
   never overlap: boot -> beat -> exit -> page entrance.

   A fallback timer guarantees the page still enters even if the
   preloader never resolves (crash / stalled rAF).
   ============================================================ */

const READY_EVENT = 'site:ready'
let siteReady = false

export function markSiteReady() {
  if (siteReady || typeof window === 'undefined') return
  siteReady = true
  try {
    window.dispatchEvent(new Event(READY_EVENT))
  } catch {
    /* ignore */
  }
}

export function useSiteEntered(fallbackMs = 4000) {
  const [entered, setEntered] = useState(() => siteReady)

  useEffect(() => {
    if (siteReady) {
      setEntered(true)
      return undefined
    }
    const onReady = () => setEntered(true)
    window.addEventListener(READY_EVENT, onReady)
    const t = setTimeout(() => setEntered(true), fallbackMs)
    return () => {
      window.removeEventListener(READY_EVENT, onReady)
      clearTimeout(t)
    }
  }, [fallbackMs])

  return entered
}

/* ============================================================
   Preloader — cinematic boot line
   ============================================================ */

const BOOT_LINES = [
  'mounting motion engine',
  'compositing gradients',
  'warming up shaders',
  'synchronizing typefaces',
  'ready to ship',
]

const BOOT_MS = 1400
const BEAT_MS = 260
const EXIT_MS = 0.6
const WATCHDOG_MS = 9000

function scrollToHashTarget() {
  try {
    const hash = window.location.hash
    if (!hash || hash === '#') return
    const el = document.querySelector(hash)
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView()
  } catch {
    /* malformed hash — ignore */
  }
}

export function Preloader({ onDone }) {
  const reduce = usePrefersReducedMotion()
  const [pct, setPct] = useState(0)
  const [line, setLine] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)
  const leavingRef = useRef(false)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    markSiteReady()
    onDoneRef.current?.()
  }, [])

  const beginExit = useCallback(() => {
    if (leavingRef.current || doneRef.current) return
    leavingRef.current = true
    if (reduce) {
      finish()
      return
    }
    setLeaving(true)
  }, [reduce, finish])

  /* lock scroll behind the curtain, restore (and re-apply any deep link) on exit */
  useEffect(() => {
    const body = document.body
    const prev = body.style.overflow
    body.style.overflow = 'hidden'
    return () => {
      body.style.overflow = prev
      scrollToHashTarget()
    }
  }, [])

  /* boot count — rAF driven, with a wall-clock backstop for throttled tabs */
  useEffect(() => {
    if (reduce) {
      setPct(100)
      setLine(BOOT_LINES.length - 1)
      const t = setTimeout(finish, 40)
      return () => clearTimeout(t)
    }
    const t0 = performance.now()
    let raf = 0
    let beat = 0
    const tick = (now) => {
      const p = Math.min((now - t0) / BOOT_MS, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setPct(Math.round(eased * 100))
      setLine(Math.min(Math.floor(eased * BOOT_LINES.length), BOOT_LINES.length - 1))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        beat = setTimeout(beginExit, BEAT_MS)
      }
    }
    raf = requestAnimationFrame(tick)
    const hardStop = setTimeout(beginExit, BOOT_MS + BEAT_MS + 1200)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(beat)
      clearTimeout(hardStop)
    }
  }, [reduce, finish, beginExit])

  /* skippable — click anywhere, or Escape / Enter / Space */
  useEffect(() => {
    if (leaving) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        beginExit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [leaving, beginExit])

  /* never stuck — force-resolve even if the exit callback never fires */
  useEffect(() => {
    const t = setTimeout(finish, WATCHDOG_MS)
    return () => clearTimeout(t)
  }, [finish])

  const p = portfolio?.profile ?? {}
  const nameWords = String(p.name ?? p.monogram ?? '')
    .split(' ')
    .filter(Boolean)

  return (
    <AnimatePresence onExitComplete={finish}>
      {!leaving && (
        <motion.div
          key="preloader"
          onClick={beginExit}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: EXIT_MS, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-bg select-none"
        >
          <div className="relative flex h-10 items-center overflow-hidden font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {nameWords.map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                initial={{ y: '120%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={i === 1 ? 'ml-2 grad-text' : 'ml-2'}
              >
                {w}
              </motion.span>
            ))}
          </div>

          <div className="mt-8 h-px w-56 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full w-full origin-left bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
              style={{ transform: `scaleX(${pct / 100})` }}
            />
          </div>

          <div className="mt-4 flex w-56 items-center justify-between font-mono text-[11px] text-mute">
            <span>{BOOT_LINES[line] ?? ''}</span>
            <span className="tabular-nums text-accent">{pct}%</span>
          </div>

          <button
            type="button"
            data-hover
            onClick={(e) => {
              e.stopPropagation()
              beginExit()
            }}
            className="absolute bottom-8 right-8 font-mono text-[11px] uppercase tracking-[0.25em] text-faint transition-colors hover:text-ink"
          >
            skip <span aria-hidden="true" className="text-accent">→</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ============================================================
   Backdrop — fixed aurora + orbs
   ============================================================ */

export function Backdrop() {
  const reduce = usePrefersReducedMotion()
  const calm = reduce ? { animation: 'none' } : null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 60% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 55%), radial-gradient(70% 50% at 90% 40%, rgba(232,121,249,0.08) 0%, transparent 55%), radial-gradient(80% 55% at 5% 65%, rgba(129,140,248,0.08) 0%, transparent 55%)',
        }}
      />
      <div className="orb left-[-15%] top-[-10%] h-[44vmax] w-[44vmax] bg-indigo-600/40" style={calm} />
      <div
        className="orb bottom-[-15%] right-[-12%] h-[40vmax] w-[40vmax] bg-fuchsia-600/30"
        style={calm ? { ...calm } : { animationDelay: '-6s' }}
      />
      <div
        className="orb left-[35%] top-[45%] h-[30vmax] w-[30vmax] bg-violet-600/20"
        style={calm ? { ...calm } : { animationDelay: '-12s', animationDuration: '24s' }}
      />
    </div>
  )
}

/* ============================================================
   ScrollProgress — gradient top bar
   ============================================================ */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
      style={{ scaleX }}
    />
  )
}

/* ============================================================
   Nav
   ============================================================ */

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'craft', label: 'Craft' },
  { id: 'contact', label: 'Contact' },
]

const SECTION_IDS = LINKS.map((l) => l.id)
const NAV_H = 64

function useActiveSection() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    let raf = 0
    const measure = () => {
      raf = 0
      const line = window.scrollY + NAV_H + window.innerHeight * 0.3
      let next = null
      for (let i = 0; i < SECTION_IDS.length; i++) {
        const el = document.getElementById(SECTION_IDS[i])
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= line) next = SECTION_IDS[i]
      }
      setActive((prev) => (prev === next ? prev : next))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return active
}

export function Nav() {
  const scrolled = useScrolled(28)
  const reduce = usePrefersReducedMotion()
  const active = useActiveSection()
  const entered = useSiteEntered()
  const p = portfolio?.profile ?? {}

  if (!entered) return null

  return (
    <motion.header
      initial={reduce ? false : { y: -NAV_H, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: reduce ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
        scrolled
          ? 'border-b border-line-soft/60 bg-bg/80 shadow-[0_24px_50px_-35px_rgba(0,0,0,0.9)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="pointer-events-auto mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#home"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
          aria-label="Home"
          aria-current={active === null ? 'page' : undefined}
          data-hover
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-display text-sm font-bold text-white shadow-glow">
            {p.monogram ?? ''}
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight text-ink sm:block">
            {p.name ?? ''}
            <span className="ml-2 font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-faint">
              /dev
            </span>
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((l, i) => {
            const isActive = active === l.id
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-hover
                aria-current={isActive ? 'true' : undefined}
                className={`group flex min-h-9 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isActive ? 'bg-surface-2 text-ink' : 'text-mute hover:bg-surface-2 hover:text-ink'
                }`}
              >
                <span
                  className={`font-mono text-[10px] transition-colors ${
                    isActive ? 'text-accent' : 'text-faint'
                  }`}
                >
                  0{i + 1}
                </span>
                {l.label}
              </a>
            )
          })}
          <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 md:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse-soft 2.2s ease-in-out infinite' }} />
            open to work
          </span>
        </div>
      </nav>
    </motion.header>
  )
}

/* ============================================================
   Reveal wrapper — standard scroll-in
   ============================================================ */

export function Reveal({ children, className = '', delay = 0, y = 36 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') return setInView(true)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.unobserve(e.target)
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
