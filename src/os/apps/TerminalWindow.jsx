'use client'

import { useEffect, useRef, useState } from 'react'
import { portfolio } from '../../content/portfolio'
import { useTheme } from '../wm/useOs'

const APP_IDS = ['welcome', 'about', 'skills', 'projects', 'ai-lab', 'experience', 'credentials', 'personality', 'terminal', 'github', 'contact']

export default function TerminalWindow({ os }) {
  const { theme, toggle } = useTheme()
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const p = portfolio.profile
    setLines([
      { t: 'info', v: `GANESH OS v4.0.0 — ${p.name}` },
      { t: 'info', v: 'interactive shell · type `help` for commands' },
      { t: 'cmd', v: 'help' },
      { t: 'out', v: 'Available: help · whoami · about · skills · projects · open <app> · github · contact · neofetch · theme · clear · date' }
    ])
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines, input])

  const write = (arr) => setLines((l) => [...l, ...arr])

  const run = (raw) => {
    const [cmd, ...args] = raw.trim().split(/\s+/)
    const arg = args.join(' ')
    write([{ t: 'cmd', v: `${portfolio.os.user}@${portfolio.os.hostname}:~$ ${raw.trim()}` }])

    const p = portfolio.profile
    const appRoute = APP_IDS.includes(arg.toLowerCase())

    switch (cmd.toLowerCase()) {
      case 'help':
        write([
          { t: 'out', v: 'help            — show this list' },
          { t: 'out', v: 'whoami          — who is this?' },
          { t: 'out', v: 'about           — the short story' },
          { t: 'out', v: 'skills          — the stack' },
          { t: 'out', v: 'projects        — shipped work' },
          { t: 'out', v: 'open <app>      — open a window' },
          { t: 'out', v: 'github          — learnerforge links' },
          { t: 'out', v: 'contact         — say hi' },
          { t: 'out', v: 'neofetch        — system splash' },
          { t: 'out', v: 'theme           — toggle light/dark' },
          { t: 'out', v: 'date            — system time' },
          { t: 'out', v: 'clear           — reset the screen' }
        ])
        break
      case 'whoami':
        write([{ t: 'out', v: `${p.first} ${p.last} — ${p.core}` }, { t: 'out', v: `${p.location} · ${p.tagline}` }])
        break
      case 'about':
        write([{ t: 'out', v: 'Engineering student (CSE AI & ML) at MGIT, Hyderabad.' }, { t: 'out', v: 'Ships production AI products end-to-end.' }])
        break
      case 'skills':
        write([
          { t: 'out', v: 'AI/ML   → LLMs, NLP (spaCy/TextRank), scikit-learn, agents' },
          { t: 'out', v: 'Backend → FastAPI, Flask, Node.js, PostgreSQL, Docker' },
          { t: 'out', v: 'Frontend→ React, Vite, Tailwind, Motion, Three.js/WebGL' }
        ])
        break
      case 'projects':
        portfolio.projects.forEach((pr) =>
          write([{ t: 'out', v: `${pr.num}. ${pr.title} — ${pr.subtitle}` }, { t: 'out', v: `   ${pr.github}` }])
        )
        break
      case 'open':
        if (appRoute) {
          write([{ t: 'out', v: `launching ${arg}…` }])
          os.open(arg)
        } else {
          write([{ t: 'err', v: `unknown app: ${arg || '(none)'} · try: ${APP_IDS.join(', ')}` }])
        }
        break
      case 'github':
        write([{ t: 'out', v: p.github }, { t: 'out', v: `${portfolio.codingProfiles.map((c) => `${c.name}`).join(' · ')}` }])
        break
      case 'contact':
        write([{ t: 'out', v: `${p.email} · ${p.linkedin}` }])
        break
      case 'neofetch':
        write([
          { t: 'out', v: `  GANESH   ${portfolio.os.name}` },
          { t: 'out', v: `  OS       ${portfolio.os.name} ${portfolio.os.version}` },
          { t: 'out', v: `  Host     ${p.location}` },
          { t: 'out', v: `  Shell    zsh` },
          { t: 'out', v: `  Role     ${p.core}` },
          { t: 'out', v: `  Theme    ${theme}` },
          { t: 'out', v: `  Flagship PathForge AI` },
          { t: 'out', v: `  Status   open to work` }
        ])
        break
      case 'theme':
        toggle()
        write([{ t: 'out', v: `theme → ${theme === 'dark' ? 'light' : 'dark'}` }])
        break
      case 'date':
        write([{ t: 'out', v: new Date().toString() }])
        break
      case 'echo':
        write([{ t: 'out', v: arg }])
        break
      case 'clear':
        setLines([])
        break
      case '':
        break
      default:
        write([{ t: 'err', v: `command not found: ${cmd} — try \`help\`` }])
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const v = input
    if (!v.trim()) {
      write([{ t: 'cmd', v: `${portfolio.os.user}@${portfolio.os.hostname}:~$ ` }])
      setInput('')
      return
    }
    setHist((h) => [...h, v])
    setHistIdx(-1)
    setInput('')
    run(v)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = histIdx < 0 ? hist.length - 1 : Math.max(0, histIdx - 1)
      if (hist[idx]) {
        setHistIdx(idx)
        setInput(hist[idx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = histIdx >= 0 && histIdx < hist.length - 1 ? histIdx + 1 : -1
      setHistIdx(idx)
      setInput(idx === -1 ? '' : hist[idx])
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#08080f]">
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="os-scroll flex-1 cursor-text px-5 py-4 font-mono text-[13px] leading-6"
      >
        {lines.map((l, i) => (
          <p
            key={i}
            className={
              l.t === 'err'
                ? 'text-red-400'
                : l.t === 'cmd'
                  ? 'text-emerald-400'
                  : l.t === 'info'
                    ? 'text-violet-300'
                    : 'text-zinc-300'
            }
          >
            {l.v}
          </p>
        ))}
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <span className="shrink-0 text-emerald-400">
            {portfolio.os.user}@{portfolio.os.hostname}:~$
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            className="prompt-input w-full"
          />
        </form>
      </div>
    </div>
  )
}