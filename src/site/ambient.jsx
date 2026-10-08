import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'motion/react'
import { portfolio } from '../content/portfolio'
import { usePrefersReducedMotion, useScrolled } from './hooks'

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

export function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [line, setLine] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (reduce) {
      setPct(100)
      const t = setTimeout(onDone, 60)
      return () => clearTimeout(t)
    }
    const t0 = performance.now()
    const dur = 1700
    let raf = 0
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setPct(Math.round(eased * 100))
      setLine(Math.min(Math.floor(eased * BOOT_LINES.length), BOOT_LINES.length - 1))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(finish, 320)
    }
    const finish = () => setLeaving(true)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce, onDone])

  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(onDone, 700)
    return () => clearTimeout(t)
  }, [leaving, onDone])

  const name = portfolio.profile.name.split(' ')

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!leaving && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative flex h-10 items-center overflow-hidden font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {name.map((w, i) => (
              <motion.span
                key={i}
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
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-4 flex w-56 items-center justify-between font-mono text-[11px] text-mute">
            <span>{BOOT_LINES[line]}</span>
            <span className="tabular-nums text-accent">{pct}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ============================================================
   Backdrop — fixed aurora + orbs
   ============================================================ */

export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 60% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 55%), radial-gradient(70% 50% at 90% 40%, rgba(232,121,249,0.08) 0%, transparent 55%), radial-gradient(80% 55% at 5% 65%, rgba(129,140,248,0.08) 0%, transparent 55%)',
        }}
      />
      <div className="orb left-[-15%] top-[-10%] h-[44vmax] w-[44vmax] bg-indigo-600/40" />
      <div
        className="orb bottom-[-15%] right-[-12%] h-[40vmax] w-[40vmax] bg-fuchsia-600/30"
        style={{ animationDelay: '-6s' }}
      />
      <div
        className="orb left-[35%] top-[45%] h-[30vmax] w-[30vmax] bg-violet-600/20"
        style={{ animationDelay: '-12s', animationDuration: '24s' }}
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
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
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

export function Nav() {
  const scrolled = useScrolled(28)
  const reduce = usePrefersReducedMotion()
  const p = portfolio.profile

  return (
    <motion.header
      initial={reduce ? false : { y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
        scrolled
          ? 'border-b border-line-soft/60 bg-bg/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2.5"
          aria-label="Back to top"
          data-hover
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-display text-sm font-bold text-white shadow-glow">
            {p.monogram}
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight text-ink sm:block">
            {p.name}
            <span className="ml-2 font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-faint">
              /dev
            </span>
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-mute transition-colors hover:bg-surface-2 hover:text-ink"
              data-hover
            >
              <span className="font-mono text-[10px] text-faint">0{i + 1}</span>
              {l.label}
            </a>
          ))}
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