import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { portfolio } from '../content/portfolio'
import { useMedia, usePrefersReducedMotion } from './hooks'
import { BlockReveal, GhostCta, GradientText, StarfieldButton } from './kit'
import { Reveal } from './ambient'
import { Chip, SectionHead } from './ui'

const TIME_ZONE = 'Asia/Kolkata'

function localTime() {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: TIME_ZONE,
    }).format(new Date())
  } catch {
    return null
  }
}

/* ============================================================
   RadialConnections — orbital node field (contact backdrop)
   ============================================================ */

function RadialConnections() {
  const ref = useRef(null)
  const coarse = useMedia('(pointer: coarse)')
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const cv = ref.current
    const host = cv?.parentElement
    const ctx = cv?.getContext('2d')
    if (!cv || !host || !ctx) return undefined

    const lowPower =
      (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2
    const animate = !reduce && !coarse && !lowPower

    let raf = 0
    let w = 0
    let h = 0
    let running = false
    let stopped = false
    let inView = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rings = 3
    const nodes = []
    let seed = 0
    const cur = { x: 1e5, y: 1e5 }

    const mkNodes = () => {
      nodes.length = 0
      for (let r = 0; r < rings; r++) {
        const count = 10 + r * 6
        const radius = (0.22 + r * 0.2) * Math.min(w, h)
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2 + seed
          nodes.push({
            x: w / 2 + Math.cos(a) * radius,
            y: h / 2 + Math.sin(a) * radius * 0.6,
            r: 1 + (r % 2),
            ph: Math.random() * Math.PI * 2,
            ring: r,
          })
        }
      }
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      w = rect.width
      h = rect.height
      cv.width = Math.max(1, Math.round(w * dpr))
      cv.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      mkNodes()
    }
    resize()

    const paint = (t) => {
      ctx.clearRect(0, 0, w, h)
      nodes.forEach((n) => {
        const d = Math.max(1, Math.hypot(n.x - cur.x, n.y - cur.y))
        const push = Math.max(0, 1 - d / 180)
        const ox = ((n.x - cur.x) / d) * push * 26
        const oy = ((n.y - cur.y) / d) * push * 26
        const x = n.x + ox
        const y = n.y + oy

        ctx.beginPath()
        ctx.moveTo(w / 2, h / 2)
        ctx.lineTo(x, y)
        ctx.strokeStyle = `rgba(139,92,246,${0.035 + n.ring * 0.02 + push * 0.08})`
        ctx.lineWidth = 1
        ctx.stroke()

        const tw = (Math.sin(t / 900 + n.ph) + 1) / 2
        ctx.beginPath()
        ctx.arc(x, y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232,121,249,${0.25 + tw * 0.5 + push * 0.3})`
        ctx.fill()
      })
    }

    const loop = (t) => {
      paint(t)
      seed += 0.0006
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!animate || running || stopped || !inView || document.hidden) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
      running = false
    }

    const onResize = () => {
      resize()
      if (!running) paint(performance.now())
    }
    const onVis = () => {
      if (document.hidden) stop()
      else start()
    }
    const onMove = (e) => {
      const rect = host.getBoundingClientRect()
      cur.x = e.clientX - rect.left
      cur.y = e.clientY - rect.top
    }
    const onLeave = () => {
      cur.x = 1e5
      cur.y = 1e5
    }

    let io
    if (animate && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([e]) => {
          inView = e.isIntersecting
          if (inView) start()
          else stop()
        },
        { rootMargin: '150px' }
      )
      io.observe(host)
      start()
    } else {
      paint(0)
    }

    window.addEventListener('resize', onResize)
    if (animate) {
      document.addEventListener('visibilitychange', onVis)
      host.addEventListener('pointermove', onMove, { passive: true })
      host.addEventListener('pointerleave', onLeave)
    }

    return () => {
      stopped = true
      stop()
      if (io) io.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [coarse, reduce])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
    />
  )
}

export function Contact() {
  const p = portfolio.profile
  const reduce = usePrefersReducedMotion()

  return (
    <section id="contact" className="relative z-[5] mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 pt-24 sm:px-8 sm:pt-32">
      <SectionHead index={4} label="Contact" title="Get in touch." />

      <div className="relative mt-12 overflow-hidden rounded-3xl border border-line-soft bg-surface/40 p-8 sm:p-14">
        <RadialConnections />

        <div className="relative z-[5] flex flex-col items-center text-center">
          <p className="eyebrow justify-center">
            <span className="text-accent">➜</span> ping me
          </p>

          <Reveal delay={0.05}>
            <h3 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">
              <GradientText>Let's build something</GradientText>
              <br />
              worth shipping.
            </h3>
          </Reveal>

          <BlockReveal
            text="AI products, LLM integrations, agentic systems or full-stack platforms — I take ideas from specification to deployment."
            accent={['AI', 'LLM', 'agentic', 'deployment']}
            className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg"
            delay={0.1}
          />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              open to
            </span>
            {portfolio.openTo?.length ? portfolio.openTo.map((o) => (
              <Chip key={o}>{o}</Chip>
            )) : null}
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <motion.span
              className="inline-flex"
              whileHover={reduce ? undefined : { scale: 1.04 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            >
              <StarfieldButton
                href={`mailto:${p.email}`}
                className="h-13 min-w-[190px] px-5 text-xs font-semibold sm:px-7 sm:text-sm"
              >
                {p.email}
              </StarfieldButton>
            </motion.span>
            <GhostCta href={p.github}>@{p.githubHandle}</GhostCta>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {portfolio.codingProfiles.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-9 items-center"
                data-hover
              >
                <Chip>{c.name}</Chip>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   BackToTop — smooth scroll-to-top, reduced-motion aware
   ============================================================ */

export function BackToTop({ className = '' }) {
  const reduce = usePrefersReducedMotion()

  return (
    <a
      href="#top"
      data-hover
      onClick={(e) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
      }}
      className={`group inline-flex min-h-9 items-center gap-1.5 font-mono text-xs text-faint transition-colors hover:text-accent ${className}`}
    >
      back to top
      <motion.span
        className="inline-block"
        animate={reduce ? undefined : { y: [-1, -5, -1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        ↑
      </motion.span>
    </a>
  )
}

export function Footer() {
  const p = portfolio.profile
  const [time, setTime] = useState(() => localTime())

  useEffect(() => {
    const id = setInterval(() => setTime(localTime()), 30000)
    return () => clearInterval(id)
  }, [])

  const socials = [
    { label: 'linkedin', href: p.linkedin },
    { label: 'github', href: p.github },
    { label: 'email', href: `mailto:${p.email}` },
  ]

  return (
    <footer className="relative z-[5] border-t border-line-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 px-5 py-10 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-mono text-xs text-faint">
              © {new Date().getFullYear()} <span className="text-ink">{p.name}</span> · engineered
              with motion at the core
            </p>
            <p className="mt-2 break-words font-mono text-[11px] text-fainter">
              {p.roles.join(' · ')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-xs text-faint">
            {time && (
              <span className="tabular-nums" title={p.location}>
                <span className="text-accent">local</span> {time}
              </span>
            )}
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="link-underline inline-flex min-h-9 items-center transition-colors hover:text-accent"
                data-hover
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-t border-line-soft pt-5 font-mono text-[11px] text-fainter sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {portfolio.codingProfiles.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="link-underline inline-flex min-h-9 items-center transition-colors hover:text-accent"
                data-hover
              >
                {c.name.toLowerCase()}
              </a>
            ))}
          </div>
          <BackToTop />
        </div>
      </div>
    </footer>
  )
}
