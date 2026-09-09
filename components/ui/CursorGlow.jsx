'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export default function CursorGlow() {
  const [on, setOn] = useState(false)
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 110, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 110, damping: 18, mass: 0.6 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return undefined
    setOn(true)
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  if (!on) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[5] h-[520px] w-[520px] rounded-full"
      style={{
        left: sx,
        top: sy,
        x: '-50%',
        y: '-50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 62%)'
      }}
    />
  )
}