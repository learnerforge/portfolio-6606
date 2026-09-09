'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from './wm/useOs'

const LAYERS = [
  { depth: 0.25, count: 0.16, r: [0.5, 1], s: [0.05, 0.1], a: [0.1, 0.28], tint: 'basic' },
  { depth: 0.55, count: 0.22, r: [0.7, 1.5], s: [0.1, 0.2], a: [0.18, 0.45], tint: 'accent' },
  { depth: 1, count: 0.08, r: [1.2, 2.4], s: [0.16, 0.32], a: [0.3, 0.65], tint: 'core' }
]

export default function Starfield() {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let w = 0
    let h = 0
    let stars = []
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

    const build = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
      stars = []
      LAYERS.forEach((L, li) => {
        const count = Math.floor((w * h * L.count) / 9000)
        const palette = ['255,255,255', '167,139,250', '232,121,249', '129,140,248']
        for (let i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            layer: li,
            depth: L.depth,
            r: L.r[0] + Math.random() * (L.r[1] - L.r[0]),
            s: L.s[0] + Math.random() * (L.s[1] - L.s[0]),
            a: L.a[0] + Math.random() * (L.a[1] - L.a[0]),
            tw: 2 + Math.random() * 6,
            ph: Math.random() * Math.PI * 2,
            color:
              L.tint === 'basic'
                ? palette[0]
                : L.tint === 'accent'
                  ? palette[Math.random() < 0.6 ? 1 : 2]
                  : palette[3]
          })
        }
      })
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      const light = document.documentElement.getAttribute('data-theme') === 'light'
      if (!light) {
        const glow = ctx.createRadialGradient(w / 2, h * 0.35, 0, w / 2, h * 0.35, Math.max(w, h) * 0.7)
        glow.addColorStop(0, 'rgba(88,58,190,0.08)')
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, w, h)
      }

      pointer.x += (pointer.tx - pointer.x) * 0.06
      pointer.y += (pointer.ty - pointer.y) * 0.06

      for (const s of stars) {
        const drift = reduced ? 0 : s.s
        let y = s.y - (t / 1000) * drift * 8
        if (y < 0) y += h
        const px = s.x + pointer.x * s.depth * 26
        const py = y + pointer.y * s.depth * 26
        const tw = reduced ? 1 : 0.72 + 0.28 * Math.sin(t / s.tw + s.ph)

        ctx.beginPath()
        ctx.arc(((px % w) + w) % w, ((py % h) + h) % h, s.r, 0, Math.PI * 2)
        if (s.layer === 2) {
          ctx.fillStyle = `rgba(${s.color},${(s.a * tw).toFixed(3)})`
          ctx.fill()
          ctx.beginPath()
          ctx.arc(((px % w) + w) % w, ((py % h) + h) % h, s.r * 3.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${s.color},${(s.a * tw * 0.16).toFixed(3)})`
          ctx.fill()
        } else {
          ctx.fillStyle = `rgba(${s.color},${(s.a * tw).toFixed(3)})`
          ctx.fill()
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      pointer.tx = (e.clientX - w / 2) / Math.max(w, 1)
      pointer.ty = (e.clientY - h / 2) / Math.max(h, 1)
    }
    const onTheme = () => {
      if (reduced) draw(0)
    }

    build()
    draw(0)
    if (!reduced) raf = requestAnimationFrame(draw)
    window.addEventListener('resize', build)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('themechange', onTheme)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', build)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('themechange', onTheme)
    }
  }, [reduced])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-75" aria-hidden="true" />
}