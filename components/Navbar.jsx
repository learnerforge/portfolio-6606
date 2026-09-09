'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { portfolio } from '@/content/portfolio'
import Logo from './ui/Logo'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#credentials', label: 'Credentials' },
  { href: '#personality', label: 'Personality' },
  { href: '#contact', label: 'Contact' }
]

function ThemeIcon({ dark }) {
  return dark ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark')
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menu) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [menu])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('portfolio.theme', next)
    } catch (e) {
      /* ignore */
    }
  }

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-line bg-bg/70 backdrop-blur-xl' : 'bg-transparent'
        }`}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <a href="#top" className="group flex items-center gap-2.5">
            <Logo size={36} className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-sm font-bold tracking-tight">{portfolio.profile.last}</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">
                AI · Full Stack
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-mute transition-colors hover:border-accent-3 hover:text-accent"
            >
              <ThemeIcon dark={theme === 'dark'} />
            </button>
          </div>

          <button
            onClick={() => setMenu((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenu(false)}
          >
            <div className="flex h-full flex-col items-center justify-center gap-7">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  className="font-display text-3xl font-semibold tracking-tight text-ink transition-colors hover:text-accent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  {l.label}
                </motion.a>
              ))}
              <button
                onClick={toggleTheme}
                className="mt-4 rounded-full border border-line px-6 py-2.5 text-sm font-medium text-mute transition-colors hover:border-accent-3 hover:text-accent"
              >
                {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}