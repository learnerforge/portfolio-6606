'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Icon from '../ui/Icon'
import { portfolio, staticRepos } from '../../content/portfolio'

export default function GitHubWindow() {
  const [repos, setRepos] = useState(null)
  const [user, setUser] = useState(null)
  const handle = portfolio.profile.githubHandle

  useEffect(() => {
    let ok = true
    const fallback = () => {
      if (!ok) return
      setUser(null)
      setRepos(staticRepos)
    }
    if (typeof window === 'undefined') return undefined

    fetch(`https://api.github.com/users/${handle}`, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((u) => {
        if (ok) setUser(u)
      })
      .catch(() => {})

    fetch(`https://api.github.com/users/${handle}/repos?per_page=100&sort=updated`, {
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list) => {
        if (!ok) return
        const clean = list.filter((r) => !r.fork && !r.archived)
        setRepos(
          [...clean]
            .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
            .slice(0, 8)
            .map((r) => ({
              name: r.name,
              description: r.description || 'No description.',
              language: r.language,
              stars: r.stargazers_count || 0,
              forks: r.forks_count || 0,
              html_url: r.html_url
            }))
        )
      })
      .catch(fallback)

    return () => {
      ok = false
    }
  }, [handle])

  const list = repos || staticRepos

  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-ink">
              <Icon name="github" size={22} />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight">{handle}</h2>
              <p className="text-xs text-faint">
                {user ? `${user.public_repos} public repos · ${user.followers} followers` : 'live from the GitHub API'}
              </p>
            </div>
          </div>
          <a
            href={portfolio.profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost shrink-0 px-3.5 py-2 text-xs"
          >
            Open profile
          </a>
        </div>
      </motion.div>

      <div className="space-y-2.5">
        {list.map((r, i) => (
          <motion.a
            key={r.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
            href={r.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start justify-between gap-3 rounded-xl border border-line bg-bg/30 p-4 transition-colors hover:border-accent-3/40"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-mono text-sm font-semibold text-ink">{r.name}</p>
                {r.stars > 0 && (
                  <span className="flex shrink-0 items-center gap-1 text-[11px] text-faint">
                    ★ {r.stars}
                  </span>
                )}
                {r.language && (
                  <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                    {r.language}
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-mute">{r.description}</p>
            </div>
            <Icon name="arrow" size={14} className="mt-1 shrink-0 text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent" />
          </motion.a>
        ))}
      </div>
    </div>
  )
}