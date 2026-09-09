'use client'

import { motion } from 'motion/react'
import { portfolio } from '@/content/portfolio'

export default function Footer() {
  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      className="relative border-t border-line"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-12 md:flex-row md:justify-between md:px-8">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="font-display text-lg font-extrabold">
            <span className="grad-text">GB</span>
          </span>
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} Ganesh Bakkera · Built with Next.js · Tailwind · Motion
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a href={portfolio.profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-4 py-2 text-xs">
            GitHub
          </a>
          <a href={portfolio.profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-4 py-2 text-xs">
            LinkedIn
          </a>
        </div>

        <button
          onClick={goTop}
          aria-label="Back to top"
          className="group grid h-12 w-12 place-items-center rounded-full border border-line bg-surface shadow-card transition-transform duration-300 hover:-translate-y-1"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-mute transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-accent"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </motion.footer>
  )
}