'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from './wm/useOs'

export default function Starfield() {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let w = 0
    let h = 0
    let dots = []
    const pointer = { x: 0, y: 0 }

    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
      const count = Math.min(110, Math.max(30, Math.floor((w * h) / 11000)))
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.7,
        s: 0.12 + Math.random() * 0.35,
        a: 0.15 + Math.random() * 0.45
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const light = document.documentElement.getAttribute('data-theme') === 'light'
      const tint = light ? '139,92,246' : '255,255,255'
      dots.forEach((d) => {
        if (!reduced) d.y -= d.s
        const px = d.x + pointer.x * d.r
        const py = d.y + pointer.y * d.r
        ctx.beginPath()
        ctx.arc(((px % w) + w) % w, ((py % h) + h) % h, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${tint},${d.a})`
        ctx.fill()
      })
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      pointer.x = ((e.clientX - w / 2) / w) * 3
      pointer.y = ((e.clientY - h / 2) / h) * 3
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduced])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-70" aria-hidden="true" />
}