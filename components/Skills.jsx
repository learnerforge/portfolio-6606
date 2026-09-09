import { portfolio } from '@/content/portfolio'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

const CATEGORIES = [
  { key: 'languages', label: 'Languages', accent: 'from-cyan-400 to-sky-500' },
  { key: 'frontend', label: 'Frontend', accent: 'from-indigo-400 to-violet-500' },
  { key: 'backend', label: 'Backend', accent: 'from-emerald-400 to-teal-500' },
  { key: 'devops', label: 'DevOps & Ops', accent: 'from-amber-400 to-orange-500' },
  { key: 'ai', label: 'AI / ML', accent: 'from-fuchsia-400 to-purple-500' }
]

export default function Skills() {
  return (
    <section id="skills" className="section-shell">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="02 — Toolbox"
          title="A stack chosen for"
          grad="shipping."
          sub="Real categories, honest levels — no fake percentages. Everything here has shipped into a working product."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, ci) => (
            <Reveal key={c.key} delay={(ci % 3) * 0.06} className="h-full">
              <div className="group h-full rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                <div className="mb-5 flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${c.accent} transition-transform duration-300 group-hover:scale-125`} />
                  <h3 className="font-display text-sm font-semibold tracking-wide">{c.label}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills[c.key].map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.18} className="h-full">
            <div className="h-full rounded-2xl border border-accent-3/30 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 p-6 shadow-card transition-transform duration-300 hover:-translate-y-1.5">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500 transition-transform duration-300 group-hover:scale-125" />
                <h3 className="font-display text-sm font-semibold tracking-wide">Specialties</h3>
              </div>
              <ul className="space-y-4">
                {portfolio.expertise.map((e) => (
                  <li key={e.domain} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{e.domain}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-faint">{e.detail}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                      {e.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}