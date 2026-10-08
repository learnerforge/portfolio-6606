import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { portfolio } from '../content/portfolio'
import { useMedia, usePrefersReducedMotion } from './hooks'
import {
  GhostCta,
  HeroBackground,
  StaggerText,
  StarfieldButton,
  Typewriter,
} from './kit'

const RAIL = [
  { label: 'github', href: portfolio.profile.github, handle: portfolio.profile.githubHandle },
  { label: 'linkedin', href: portfolio.profile.linkedin, handle: portfolio.profile.linkedinHandle },
  { label: 'email', href: `mailto:${portfolio.profile.email}`, handle: portfolio.profile.email },
]

export default function Hero() {
  const reduce = usePrefersReducedMotion()
  const finePointer = useMedia('(pointer: fine)')
  const p = portfolio.profile
  const sectionRef = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 })
  const py = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 })

  const onMove = (e) => {
    if (!finePointer) return
    const r = sectionRef.current?.getBoundingClientRect()
    if (!r) return
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
      id="top"
      ref={sectionRef}
      onPointerMove={onMove}
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-5 sm:px-8"
    >
      <HeroBackground />

      <motion.div style={reduce ? undefined : { x: px, y: py }} className="relative z-[5] mx-auto w-full max-w-6xl">
        <motion.div style={{ opacity: fadeOut, y: rise }}>
          <p className="eyebrow mb-6">
            <span className="text-accent">➜</span> hello world, i'm
          </p>

          <h1 className="font-display text-[13.5vw] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink sm:text-[7rem] lg:text-[9rem]">
            <StaggerText text={p.first} className="block" delay={0.15} />
            <StaggerText text={p.last} className="block pl-[0.14em]" delay={0.5} />
          </h1>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm text-mute sm:text-base">
            <span className="text-faint">&gt;</span>
            <Typewriter roles={p.roles} />
          </div>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            <StaggerText text={p.tagline} delay={0.9} />
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <StarfieldButton href="#work" className="h-12 min-w-[172px] px-7 text-sm font-semibold">
              See the work
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </StarfieldButton>
            <GhostCta href={`mailto:${p.email}`}>ping me</GhostCta>
          </div>

          <p className="mt-8 font-mono text-xs text-faint">
            <span className="text-accent">located</span> — {p.location}
          </p>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-10 left-8 z-[5] hidden flex-col gap-4 sm:flex">
        {RAIL.map((r, i) => (
          <a
            key={r.label}
            href={r.href}
            target={r.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-faint transition-colors hover:text-accent"
            style={{ transform: `translateY(${i * 26}px)` }}
          >
            <span className="h-px w-6 bg-faint/50 transition-all group-hover:w-9 group-hover:bg-accent" />
            {r.label}
          </a>
        ))}
      </div>

      <div
        className="pointer-events-none absolute bottom-8 right-8 z-[5] flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-faint"
        aria-hidden="true"
      >
        <span>scroll</span>
        <motion.span
          className="block h-10 w-px bg-gradient-to-b from-accent to-transparent"
          animate={reduce ? undefined : { scaleY: [0.2, 1, 0.2], originY: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </section>
  )
}