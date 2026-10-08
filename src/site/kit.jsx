import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useSpring } from 'motion/react'
import {
  useInView,
  useMedia,
  usePrefersReducedMotion,
} from './hooks'

/* ============================================================
   Project "art" — deterministic procedural preview images
   (stand-in for real screenshots; generated per project)
   ============================================================ */

export const ART = {
  'pathforge-ai': ['#6366f1', '#a855f7', '#e879f9'],
  'ai-github-repo-analyzer': ['#0ea5e9', '#6366f1', '#a855f7'],
  'remote-mouse': ['#10b981', '#14b8a6', '#22d3ee'],
  nexasite: ['#f59e0b', '#f97316', '#f43f5e'],
  'js-components': ['#d946ef', '#a855f7', '#6366f1'],
  'push-to-github': ['#64748b', '#94a3b8', '#475569'],
}

export function artFor(id, label, num, { w = 640, h = 420 } = {}) {
  const [c1, c2, c3] = ART[id] || ['#6366f1', '#a855f7', '#e879f9']
  const gr = `<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c1}"/>
    <stop offset="0.55" stop-color="${c2}"/>
    <stop offset="1" stop-color="${c3}"/>
  </linearGradient>
  <radialGradient id="r" cx="0.3" cy="0.25" r="1">
    <stop offset="0" stop-color="${c3}" stop-opacity="0.55"/>
    <stop offset="1" stop-color="transparent"/>
  </radialGradient>
  <filter id="b"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="#0a0b18"/>
<rect width="${w}" height="${h}" fill="url(#r)"/>
<g opacity="0.16" filter="url(#b)">
  <circle cx="${w * 0.82}" cy="${h * 0.24}" r="${w * 0.22}" fill="${c2}"/>
  <circle cx="${w * 0.12}" cy="${h * 0.8}" r="${w * 0.2}" fill="${c1}"/>
</g>
<g opacity="0.09" stroke="#eef0ff" stroke-width="1">
  ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${(h / 7) * (i + 1)}" x2="${w}" y2="${(h / 7) * (i + 1)}"/>`).join('')}
  ${Array.from({ length: 10 }, (_, i) => `<line x1="${(w / 9) * (i + 1)}" y1="0" x2="${(w / 9) * (i + 1)}" y2="${h}"/>`).join('')}
</g>
<circle cx="${w * 0.5}" cy="${h * 0.5}" r="${h * 0.3}" fill="none" stroke="url(#g)" stroke-width="1.5" opacity="0.85"/>
<circle cx="${w * 0.5}" cy="${h * 0.5}" r="${h * 0.3 - 10}" fill="none" stroke="url(#g)" stroke-width="1" opacity="0.35" stroke-dasharray="2 6"/>
<g fill="#fff" opacity="0.9" text-anchor="middle">
  <text x="${w * 0.5}" y="${h * 0.45}" font-family="Sora, Inter, sans-serif" font-size="64" font-weight="800" letter-spacing="-1">${(label || 'GB').slice(0, 10)}</text>
  <text x="${w * 0.5}" y="${h * 0.45 + 66}" font-family="JetBrains Mono, monospace" font-size="15" letter-spacing="6" opacity="0.65">0${num || '0'} — /work/${(id || 'project')}</text>
</g>`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${gr}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/* ============================================================
   Typewriter — rotating roles with caret
   ============================================================ */

export function Typewriter({ roles, className = '' }) {
  const reduce = usePrefersReducedMotion()
  const [i, setI] = useState(0)
  const [len, setLen] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduce) {
      setLen(roles[0].length)
      return
    }
    let t = setTimeout(
      () => {
        const word = roles[i]
        if (!deleting) {
          if (len < word.length) {
            setLen(len + 1)
          } else {
            setDeleting(true)
          }
        } else if (len > 0) {
          setLen(len - 1)
        } else {
          setDeleting(false)
          setI((i + 1) % roles.length)
        }
      },
      deleting ? 34 : len === 0 ? 420 : 58
    )
    return () => clearTimeout(t)
  }, [i, len, deleting, roles, reduce])

  const word = roles[i]
  const text = reduce ? roles[0] : word.slice(0, len)

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span className="text-accent-2">{text}</span>
      {!reduce && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-accent-2"
          style={{ animation: 'blink 1.1s steps(1) infinite' }}
        />
      )}
    </span>
  )
}

/* ============================================================
   GradientText — flowing gradient headline
   ============================================================ */

export function GradientText({ children, className = '' }) {
  return (
    <motion.span
      className={className}
      style={{
        backgroundImage:
          'linear-gradient(90deg,#818cf8 0%,#e879f9 25%,#a78bfa 50%,#f0abfc 75%,#818cf8 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline-block',
      }}
      animate={{ backgroundPosition: ['0% center', '-200% center'] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </motion.span>
  )
}

/* ============================================================
   StaggerText — per-character rise/blur reveal
   ============================================================ */

export function StaggerText({ text, as: Tag = 'span', className = '', delay = 0, once = true }) {
  const [ref, inView] = useInView({ threshold: 0.3, once, rootMargin: '0px 0px -10% 0px' })
  const reduce = usePrefersReducedMotion()
  const chars = (text ?? '').split('')

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {chars.map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
          style={{ display: 'inline-block' }}
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={reduce ? false : { y: '112%', opacity: 0, filter: 'blur(8px)' }}
            animate={reduce || inView ? { y: '0%', opacity: 1, filter: 'blur(0px)' } : {}}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.026,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {c === ' ' ? '\u00A0' : c}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* ============================================================
   BlockReveal — mask/slide paragraph, accent keywords
   ============================================================ */

export function BlockReveal({ text, accent = [], className = '', delay = 0, as: Tag = 'p' }) {
  const [ref, inView] = useInView({ threshold: 0.25, rootMargin: '0px 0px -12% 0px' })
  const reduce = usePrefersReducedMotion()
  const words = useMemo(() => (text ?? '').split(' '), [text])
  const accentSet = useMemo(() => new Set(accent), [accent])

  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => {
        const clean = w.replace(/[^a-zA-Z]/g, '')
        const hot = accentSet.has(clean) || accentSet.has(w)
        return (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block overflow-hidden align-top"
          >
            <motion.span
              className={hot ? 'inline-block text-accent-2' : 'inline-block'}
              initial={reduce ? false : { y: '118%', opacity: 0 }}
              animate={reduce || inView ? { y: '0%', opacity: 1 } : {}}
              transition={{ duration: 0.62, delay: delay + i * 0.011, ease: [0.16, 1, 0.3, 1] }}
            >
              {'\u00A0' + w}
            </motion.span>
          </span>
        )
      })}
    </Tag>
  )
}

/* ============================================================
   StarfieldButton — twinkle-fill CTA (Originkit `starfield-button` slot)
   ============================================================ */

export function StarfieldButton({ children, className = '', onClick, href, type = 'button' }) {
  const canvasRef = useRef(null)
  const reduce = usePrefersReducedMotion()
  const [ready, setReady] = useState(false)
  const hover = useRef(false)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const N = 90
    const stars = Array.from({ length: N }, (_, i) => ({
      x: ((i * 53) % 97) / 97,
      y: ((i * 37) % 89) / 89,
      s: 0.8 + ((i * 11) % 10) / 9,
      ph: ((i * 29) % 360),
      tint: i % 3,
    }))

    const resize = () => {
      const r = cv.getBoundingClientRect()
      w = r.width
      h = r.height
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    if (reduce) {
      ctx.clearRect(0, 0, w, h)
      stars.forEach((st) => {
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fillRect(st.x * w, st.y * h, st.s, st.s)
      })
      return
    }

    const colors = ['255,255,255', '167,139,250', '232,121,249']
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      const act = hover.current ? 1 : 0.25
      stars.forEach((st) => {
        const tw = (Math.sin(t / 400 + st.ph) + 1) / 2
        const a = (0.12 + tw * 0.88) * act
        ctx.fillStyle = `rgba(${colors[st.tint]},${a})`
        ctx.beginPath()
        ctx.arc(st.x * w, st.y * h, st.s, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduce])

  const cls = `glow-border gb-spin relative grid place-items-center overflow-hidden rounded-full bg-surface text-ink transition-transform duration-300 ${className}`
  const inner = (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-1.5 rounded-full"
        onPointerEnter={() => {
          hover.current = true
          setReady(true)
        }}
        onPointerLeave={() => (hover.current = false)}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

/* ============================================================
   GhostCta — arrow-badge expand (Originkit `arrow-reveal-button` slot)
   ============================================================ */

export function GhostCta({ children, className = '', href, onClick, mono = true }) {
  const cls = `group inline-flex items-center gap-3 rounded-full border border-line bg-surface/60 pl-5 text-ink transition-colors duration-300 hover:border-accent-3/50 ${className}`
  const inner = (
    <>
      <span
        className={`relative z-10 transition-colors duration-300 group-hover:text-accent ${
          mono ? 'font-mono text-sm' : 'text-sm font-semibold'
        }`}
      >
        {children}
      </span>
      <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface-2 transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-accent transition-transform duration-500 group-hover:rotate-45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <span className="absolute inset-0 -translate-x-full rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

/* ============================================================
   GlowCard — cursor-tracked spotlight + rotating conic border
   ============================================================ */

export function GlowCard({ className = '', children, spin = true, as: Tag = 'div' }) {
  const ref = useRef(null)
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false })

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setSpot({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      on: true,
    })
  }

  return (
    <Tag
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setSpot((s) => ({ ...s, on: false }))}
      className={`glow-border ${spin ? 'gb-spin' : ''} panel group relative rounded-3xl ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-500"
        style={{
          opacity: spot.on ? 1 : 0,
          background: `radial-gradient(360px circle at ${spot.x}% ${spot.y}%, rgba(167,139,250,0.14), transparent 65%)`,
        }}
      />
      {children}
    </Tag>
  )
}

/* ============================================================
   FloatingPreview — cursor-following project preview
   (Originkit `hover-image-reveal` slot)
   ============================================================ */

export function FloatingPreview({ item, x, y }) {
  const reduce = usePrefersReducedMotion()
  const sx = useSpring(x, { stiffness: 340, damping: 34, mass: 0.8 })
  const sy = useSpring(y, { stiffness: 340, damping: 34, mass: 0.8 })

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] w-[270px] rounded-2xl border border-line bg-surface p-1.5 shadow-deep sm:w-[300px]"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-58%',
        rotate: reduce ? 0 : 2,
        opacity: item ? 1 : 0,
        scale: item ? 1 : 0.85,
      }}
      transition={{ duration: 0.18 }}
    >
      <div className="overflow-hidden rounded-xl">
        <img
          src={item ? artFor(item.id, item.title, item.num) : ''}
          alt=""
          className="aspect-[3/2] w-full object-cover"
        />
      </div>
    </motion.div>
  )
}

/* ============================================================
   CursorAmbient — premium custom cursor
   (Originkit `cursor-ring-field` slot)
   ============================================================ */

export function CursorAmbient() {
  const fine = useMedia('(pointer: fine)')
  const reduce = usePrefersReducedMotion()
  const [show, setShow] = useState(false)

  const mx = useSpring(-100, { stiffness: 260, damping: 30, mass: 0.4 })
  const my = useSpring(-100, { stiffness: 260, damping: 30, mass: 0.4 })
  const rx = useSpring(-100, { stiffness: 420, damping: 34, mass: 0.28 })
  const ry = useSpring(-100, { stiffness: 420, damping: 34, mass: 0.28 })
  const scale = useSpring(0, { stiffness: 300, damping: 26 })

  useEffect(() => {
    if (!fine || reduce) return
    const onMove = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      rx.set(e.clientX)
      ry.set(e.clientY)
      setShow(true)
      document.body.classList.add('has-cursor')
    }
    const onOver = (e) => {
      const hot = e.target.closest('a, button, input, [data-hover]')
      scale.set(hot ? 1 : 0)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
    }
  }, [fine, reduce, mx, my, rx, ry, scale])

  if (!fine || reduce) return null

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[95] h-[22px] w-[22px] rounded-full border border-accent/70"
        style={{
          x: rx,
          y: ry,
          translateX: '-50%',
          translateY: '-50%',
          opacity: show ? 1 : 0,
          scale: 0.55 + scale,
        }}
        transition={{ duration: 0.12 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[94] h-1.5 w-1.5 rounded-full bg-accent"
        style={{ x: mx, y: my, translateX: '-50%', translateY: '-50%', opacity: show ? 1 : 0 }}
      />
    </>
  )
}

/* ============================================================
   HeroBackground — layered parallax starfield + nebula
   ============================================================ */

export function HeroBackground({ className = '' }) {
  const ref = useRef(null)
  const reduce = usePrefersReducedMotion()
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const stars = Array.from({ length: 210 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.25 + Math.pow(Math.random(), 2) * 0.75,
      s: 0.4 + Math.random() * 1.1,
      tw: Math.random() * Math.PI * 2,
      tint: i % 4,
    }))
    const colors = ['255,255,255', '255,255,255', '167,139,250', '232,121,249']

    const resize = () => {
      const r = cv.getBoundingClientRect()
      w = r.width
      h = r.height
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const onResize = () => {
      resize()
      if (reduce) draw()
    }
    const onMove = (e) => {
      const r = cv.getBoundingClientRect()
      targetRef.current.x = (e.clientX - r.left) / r.width - 0.5
      targetRef.current.y = (e.clientY - r.top) / r.height - 0.5
    }

    const draw = (t = 0) => {
      ctx.clearRect(0, 0, w, h)
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.06
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.06
      stars.forEach((st) => {
        const depth = st.z
        const par = 1 - depth * 0.85
        const ix = st.x * w + mouseRef.current.x * 40 * depth
        const iy = st.y * h + mouseRef.current.y * 26 * depth
        const b = (Math.sin(t / 800 + st.tw) + 1) / 2
        const a = (0.14 + b * 0.6) * (par + 0.15)
        ctx.fillStyle = `rgba(${colors[st.tint]},${a})`
        ctx.beginPath()
        ctx.arc(ix, iy, st.s * depth + 0.3, 0, Math.PI * 2)
        ctx.fill()
      })
      if (!reduce) raf = requestAnimationFrame(draw)
    }

    if (reduce) draw()
    else raf = requestAnimationFrame(draw)

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduce])

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} />
}

/* ============================================================
   Marquee — infinite ticker
   ============================================================ */

export function Marquee({ items = [], className = '', reverse = false, speed = 26 }) {
  const row = items.map((t, i) => (
    <span key={i} className="mx-5 flex shrink-0 items-center gap-5 font-mono text-sm tracking-[0.18em] text-faint uppercase">
      {t}
      <span className="text-accent/60">✦</span>
    </span>
  ))

  return (
    <div
      className={`marquee paused ${reverse ? '' : ''} ${className}`}
      aria-hidden="true"
      style={{ '--marquee-dur': `${speed}s` }}
    >
      <div className={`marquee-track items-center ${reverse ? 'reverse' : ''}`}>
        {row}
        {row}
      </div>
    </div>
  )
}