'use client'

import { motion } from 'motion/react'
import Icon from '../ui/Icon'
import { portfolio } from '../../content/portfolio'

const EXPERIMENTS = [
  {
    title: 'AI-guided roadmaps',
    body: 'PathForge AI imports 87 roadmaps, renders an interactive topic graph, and layers AI explanations, quizzes, and weekly plans on top.',
    tags: ['Gemini', 'Prompt chain', 'ReactFlow'],
    github: 'https://github.com/learnerforge/Roadmaps-generator'
  },
  {
    title: 'Self-improving audits',
    body: 'Repo Quality Analyzer scores any GitHub repo across 9 dimensions in under 30 seconds — offline NLP with a Q-learning tuner.',
    tags: ['spaCy', 'TextRank', 'Q-Learning'],
    github: 'https://github.com/learnerforge/AI-GitHub-Repository-Analyzer'
  },
  {
    title: 'Agent memory',
    body: 'Active research into agent memory, tool-use, and agent-skill ecosystems alongside BrightPitch with CopilotKit.',
    tags: ['CopilotKit', 'Agents', 'Research'],
    github: 'https://github.com/learnerforge'
  }
]

export default function AiLabWindow() {
  const { expertise } = portfolio

  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-xl font-bold tracking-tight">
          AI Lab — <span className="grad-text">experiments in production.</span>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-mute">
          Everything here powers a real product, not a Jupyter demo.
        </p>
      </motion.div>

      <div className="space-y-3">
        {EXPERIMENTS.map((e, i) => (
          <motion.div
            key={e.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
            className="group rounded-xl border border-line bg-bg/30 p-4 transition-colors hover:border-accent-3/40"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">{e.title}</h3>
              <a
                href={e.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${e.title} on GitHub`}
                className="grid h-7 w-7 place-items-center rounded-md text-faint transition-colors hover:bg-surface-2 hover:text-accent"
              >
                <Icon name="github" size={15} />
              </a>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-mute">{e.body}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {e.tags.map((t) => (
                <span key={t} className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.36 }}
        className="rounded-xl border border-line bg-bg/30 p-4"
      >
        <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-faint">
          Depth map
        </h3>
        <ul className="space-y-2">
          {expertise.slice(0, 4).map((e) => (
            <li key={e.domain} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-mute">{e.domain}</span>
              <span className="text-xs font-semibold text-ink">{e.level}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}