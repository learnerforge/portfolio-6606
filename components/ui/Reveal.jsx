'use client'

import { motion } from 'motion/react'

export default function Reveal({
  children,
  delay = 0,
  y = 26,
  x = 0,
  once = true,
  className = '',
  ...rest
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: '-70px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}