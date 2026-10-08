import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { portfolio } from '../content/portfolio'
import { useMedia, usePrefersReducedMotion } from './hooks'
import { GhostCta, GlowCard, GradientText, StarfieldButton } from './kit'
import { Chip, SectionHead } from './ui'

/* ============================================================
   RadialConnections — orbital node field (contact backdrop)
   ============================================================ */

function RadialConnections() {
  const ref = useRef(null)
  const coarse = useMedia('(pointer: coarse)')
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const cv = ref.current
    if (!cv || reduce || coarse) return
    const ctx = cv.getContext('2d')
    let raf = 0
    let w = 0
    let h = 0
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
      const rect = cv.getBoundingClientRect()
      w = rect.width
      h = rect.height
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      mkNodes()
    }
    resize()

    const draw = (t) => {
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
      seed += 0.0006
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    const onMove = (e) => {
      const rect = cv.getBoundingClientRect()
      cur.x = e.clientX - rect.left
      cur.y = e.clientY - rect.top
    }
    const onLeave = () => {
      cur.x = 1e5
      cur.y = 1e5
    }
    window.addEventListener('resize', () => {
      resize()
      draw(performance.now())
    })
    cv.addEventListener('pointermove', onMove, { passive: true })
    cv.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerleave', onLeave)
    }
  }, [coarse, reduce])

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-80" />
}

export function Contact() {
  const p = portfolio.profile

  return (
    <section id="contact" className="relative z-[5] mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 pt-24 sm:px-8 sm:pt-32">
      <SectionHead index={4} label="Contact" />

      <div className="relative mt-12 overflow-hidden rounded-3xl border border-line-soft bg-surface/40 p-8 sm:p-14">
        <RadialConnections />

        <div className="relative z-[5] flex flex-col items-center text-center">
          <p className="eyebrow justify-center">
            <span className="text-accent">➜</span> ping me
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">
            <GradientText>Let's build something</GradientText>
            <br />
            worth shipping.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            AI products, LLM integrations, agentic systems or full-stack platforms — I take ideas
            from specification to deployment. Currently open to internsips, research collabs and
            hackathons.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <StarfieldButton href={`mailto:${p.email}`} className="h-13 min-w-[190px] px-7 text-sm font-semibold">
              {p.email}
            </StarfieldButton>
            <GhostCta href={p.github}>@{p.githubHandle}</GhostCta>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {portfolio.codingProfiles.map((c) => (
              <a key={c.name} href={c.url} target="_blank" rel="noreferrer" data-hover>
                <Chip className="cursor-pointer">{c.name}</Chip>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  const p = portfolio.profile

  return (
    <footer className="relative z-[5] border-t border-line-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-10 sm:flex-row sm:px-8">
        <p className="font-mono text-xs text-faint">
          © {year} <span className="text-ink">{p.name}</span> · engineered with motion at the core
        </p>
        <div className="flex items-center gap-6 font-mono text-xs text-faint">
          <a href={p.linkedin} target="_blank" rel="noreferrer" className="link-underline hover:text-accent">
            linkedin
          </a>
          <a href={p.github} target="_blank" rel="noreferrer" className="link-underline hover:text-accent">
            github
          </a>
          <a href="#top" className="group flex items-center gap-1.5 hover:text-accent">
            back to top
            <motion.span
              className="inline-block"
              animate={{ y: [-1, -5, -1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↑
            </motion.span>
          </a>
        </div>
      </div>
    </footer>
  )
}