'use client'

import { useEffect, useRef, useState } from 'react'
import { portfolio } from '../../content/portfolio'
import { useTheme } from '../wm/useOs'

const APP_IDS = ['welcome', 'about', 'skills', 'projects', 'ai-lab', 'experience', 'credentials', 'personality', 'terminal', 'github', 'contact']

const APP_TITLES = {
  welcome: 'Welcome',
  about: 'About',
  skills: 'Toolbox',
  projects: 'Projects',
  'ai-lab': 'AI Lab',
  experience: 'Path',
  credentials: 'Credentials',
  personality: 'Personality',
  terminal: 'Terminal',
  github: 'GitHub',
  contact: 'Say hi'
}

const COMMANDS = [
  ['help', 'show this list'],
  ['whoami', 'the user behind the shell'],
  ['about', 'the short story'],
  ['skills', 'the stack'],
  ['projects', 'shipped work'],
  ['apps', 'list installed apps'],
  ['launch <app>', 'open an app window'],
  ['open <app>', 'open an app window'],
  ['repo', 'clickable github profile'],
  ['email', 'clickable mail link'],
  ['github', 'github + coding profiles'],
  ['contact', 'socials + email'],
  ['neofetch', 'system splash'],
  ['theme', 'toggle light/dark'],
  ['date', 'system time'],
  ['echo <text>', 'repeat after me'],
  ['history', 'numbered command history'],
  ['sudo <cmd>', 'escalate? you are already root'],
  ['matrix', 'wake up, follower'],
  ['hack', 'alias for matrix'],
  ['credits', 'production credits'],
  ['clear', 'reset the screen']
]

const COMPLETIONS = [...new Set(COMMANDS.map(([n]) => n.split(' ')[0]))]

const G = [' ███ ', '█    ', '█ ██ ', '█   █', ' ███ ']
const A = ['  █  ', ' █ █ ', '█████', '█   █', '█   █']
const N = ['█   █', '██  █', '█ █ █', '█  ██', '█   █']
const E = ['█████', '█    ', '███  ', '█    ', '█████']
const S = ['█████', '█    ', ' ███ ', '    █', '█████']
const H = ['█   █', '█   █', '█████', '█   █', '█   █']
const O = [' ███ ', '█   █', '█   █', '█   █', ' ███ ']

const BANNER = Array.from({ length: 5 }, (_, r) =>
  [G, A, N, E, S, H].map((gl) => gl[r]).join(' ') + '  ' + [O, S].map((gl) => gl[r]).join(' ')
)

const lineClass = (l) => {
  if (l.t === 'err') return 'text-red-400'
  if (l.t === 'cmd' || l.t === 'ok') return 'text-emerald-400'
  if (l.t === 'info') return 'text-violet-300'
  if (l.t === 'faint') return 'text-[var(--term-faint)]'
  if (l.t === 'link' || l.t === 'app') return ''
  return 'text-[var(--term-mute)]'
}

export default function TerminalWindow({ os }) {
  const { theme, toggle } = useTheme()
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const completion = useRef(null)

  useEffect(() => {
    const p = portfolio.profile
    setLines([
      ...BANNER.map((b) => ({ t: 'info', v: b })),
      { t: 'info', v: `${portfolio.os.name} ${portfolio.os.version} — ${p.name}` },
      { t: 'faint', v: 'interactive shell · type `help` for commands' }
    ])
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines, input])

  const write = (arr) => setLines((l) => [...l, ...arr])

  const launchApp = (id) => {
    write([{ t: 'ok', v: `launching ${id}…` }])
    os.open(id)
    os.navigate(id)
    inputRef.current?.focus()
  }

  const run = (raw) => {
    const [cmd, ...args] = raw.trim().split(/\s+/)
    const arg = args.join(' ')
    write([{ t: 'cmd', v: `${portfolio.os.user}@${portfolio.os.hostname}:~$ ${raw.trim()}` }])

    const p = portfolio.profile

    switch (cmd.toLowerCase()) {
      case 'help':
        write([{ t: 'faint', v: 'GANESH OS shell — available commands' }])
        COMMANDS.forEach(([name, desc]) => write([{ t: 'out', v: `  ${name.padEnd(16)}${desc}` }]))
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
          write([{ t: 'out', v: `${pr.num}. ${pr.title} — ${pr.subtitle}` }, { t: 'link', v: `   ${pr.github}`, href: pr.github, external: true }])
        )
        break
      case 'apps':
        write([{ t: 'faint', v: 'installed apps — click to open' }])
        APP_IDS.forEach((id) => write([{ t: 'app', appId: id, v: `  ${id.padEnd(12)}${APP_TITLES[id] || ''}` }]))
        break
      case 'launch':
      case 'open': {
        const target = arg.split(/\s+/)[0]
        if (APP_IDS.includes(target.toLowerCase())) {
          launchApp(target.toLowerCase())
        } else {
          write([{ t: 'err', v: `unknown app: ${target || '(none)'} · try \`apps\`` }])
        }
        break
      }
      case 'repo':
        write([
          { t: 'out', v: `  @${p.githubHandle} on github` },
          { t: 'link', v: `  ${p.github}`, href: p.github, external: true }
        ])
        break
      case 'email':
        write([
          { t: 'out', v: '  drop a line — replies are fast:' },
          { t: 'link', v: `  ${p.email}`, href: `mailto:${p.email}` }
        ])
        break
      case 'github':
        write([
          { t: 'out', v: `  profile  @${p.githubHandle}` },
          { t: 'link', v: `  ${p.github}`, href: p.github, external: true },
          { t: 'faint', v: '  coding profiles' }
        ])
        portfolio.codingProfiles.forEach((c) => write([{ t: 'link', v: `  ${c.url}`, href: c.url, external: true }]))
        break
      case 'contact':
        write([
          { t: 'out', v: '  email' },
          { t: 'link', v: `  ${p.email}`, href: `mailto:${p.email}` },
          { t: 'out', v: '  linkedin' },
          { t: 'link', v: `  ${p.linkedin}`, href: p.linkedin, external: true }
        ])
        break
      case 'neofetch':
        write([
          { t: 'out', v: `  User     ${portfolio.os.user}@${portfolio.os.hostname}` },
          { t: 'out', v: `  OS       ${portfolio.os.name} ${portfolio.os.version}` },
          { t: 'out', v: `  Host     ${p.location}` },
          { t: 'link', v: `  Email    ${p.email}`, href: `mailto:${p.email}` },
          { t: 'out', v: '  Shell    zsh' },
          { t: 'out', v: `  Theme    ${theme}` },
          { t: 'out', v: `  Role     ${p.core}` },
          { t: 'out', v: '  Status   open to work' }
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
      case 'history':
        if (!hist.length) {
          write([{ t: 'faint', v: '  history is empty' }])
        } else {
          hist.forEach((h, i) => write([{ t: 'out', v: `  ${String(i + 1).padStart(3)}  ${h}` }]))
        }
        break
      case 'sudo':
        write([{ t: 'err', v: `sudo: ${arg || '(no command)'} — ganesh is already root, nothing to escalate. nice try.` }])
        break
      case 'matrix':
      case 'hack':
        write([
          { t: 'ok', v: '  01101100 01100101 01110100 00100000 01110100 01101000 01100101 00100000 01101101 01100001 01110100 01110010 01101001 01111000' },
          { t: 'ok', v: '  01001000 01000101 01001100 01001100 01001111 00100000 01110111 01101111 01110010 01101100 01100100' },
          { t: 'info', v: '  ▒▒▒░░▒█ [ OK ]  neural uplink established' },
          { t: 'info', v: '  > decrypting reality… this is where the rabbits are' },
          { t: 'out', v: '  > the matrix has you, ganesh.' },
          { t: 'out', v: '  > hacking in progress ▓▓▓░░░ 42% — static burst, take it easy' },
          { t: 'out', v: '  > tracing the red pill… 0 hops outside this browser tab' },
          { t: 'ok', v: '  01110111 01100001 01101011 01100101 00100000 01110101 01110000 00100000 01101110 01100101 01101111' },
          { t: 'info', v: '  > wake up…  it was all a dream (or a very fast `cat` command)' }
        ])
        break
      case 'credits':
        write([
          { t: 'info', v: `  ${portfolio.os.name} ${portfolio.os.version}` },
          { t: 'out', v: '  concept · design · build    Ganesh Bakkera' },
          { t: 'out', v: '  stack    React 19 · Vite · Tailwind v4 · motion/react' },
          { t: 'out', v: '  ui       lucide icons · JetBrains Mono' },
          { t: 'out', v: '  engineered at 92% energy, 8% morning coffee' },
          { t: 'link', v: `  feedback → ${p.email}`, href: `mailto:${p.email}` }
        ])
        break
      case 'clear':
        setLines([])
        break
      case '':
        break
      default:
        write([{ t: 'err', v: `command not found: ${cmd} — try \`help\`` }])
    }
    inputRef.current?.focus()
  }

  const onSubmit = (e) => {
    e.preventDefault()
    completion.current = null
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

  const complete = () => {
    const raw = input
    if (!raw.trim()) return
    const leading = raw.length - raw.trimStart().length
    const rest = raw.slice(leading)
    const appMatch = rest.match(/^(launch|open)\s+(\S*)$/i)
    const multi = rest.split(/\s+/).length > 1
    let matches = null
    let base = null

    if (appMatch) {
      base = raw.slice(0, leading) + appMatch[1] + ' '
      matches = APP_IDS.filter((id) => id.startsWith(appMatch[2].toLowerCase()))
    } else if (!multi) {
      base = raw.slice(0, raw.length - rest.length)
      matches = COMPLETIONS.filter((c) => c.startsWith(rest.toLowerCase()))
    }

    if (!matches || matches.length === 0) {
      completion.current = null
      return
    }

    if (!completion.current || completion.current.base !== base || completion.current.matches.join() !== matches.join()) {
      completion.current = { matches, idx: 0, base }
    } else {
      completion.current.idx = (completion.current.idx + 1) % matches.length
    }
    setInput(completion.current.base + completion.current.matches[completion.current.idx])
  }

  const onKeyDown = (e) => {
    if (e.ctrlKey && (e.key.toLowerCase() === 'l')) {
      e.preventDefault()
      setLines([])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      complete()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      completion.current = null
      const idx = histIdx < 0 ? hist.length - 1 : Math.max(0, histIdx - 1)
      if (hist[idx]) {
        setHistIdx(idx)
        setInput(hist[idx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      completion.current = null
      const idx = histIdx >= 0 && histIdx < hist.length - 1 ? histIdx + 1 : -1
      setHistIdx(idx)
      setInput(idx === -1 ? '' : hist[idx])
    }
  }

  return (
    <div className="term flex h-full flex-col bg-[#08080f]">
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="os-scroll flex-1 cursor-text px-5 py-4 font-mono text-[11px] leading-5 sm:text-[13px] sm:leading-6"
      >
        {lines.map((l, i) => (
          <p key={i} className={lineClass(l)}>
            {l.t === 'link' ? (
              <a
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
                className="cursor-pointer text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent-2 hover:decoration-accent-2"
              >
                {l.v}
              </a>
            ) : l.t === 'app' ? (
              <button
                type="button"
                onClick={() => launchApp(l.appId)}
                className="cursor-pointer bg-transparent text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent-2 hover:decoration-accent-2"
              >
                {l.v}
              </button>
            ) : (
              l.v
            )}
          </p>
        ))}
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <span className="shrink-0 text-emerald-400">
            {portfolio.os.user}@{portfolio.os.hostname}:~$
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              completion.current = null
              setInput(e.target.value)
            }}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            enterKeyHint="send"
            aria-label="Terminal input"
            className="prompt-input w-full"
          />
        </form>
      </div>
    </div>
  )
}