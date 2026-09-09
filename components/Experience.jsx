import { portfolio } from '@/content/portfolio'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Experience() {
  return (
    <section id="experience" className="section-shell">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="04 — Experience"
          title="Research &"
          grad="real-world roles."
        />

        <div className="mt-12 flex flex-col gap-5">
          {portfolio.experience.map((x, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="group rounded-2xl border border-line bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 font-display text-lg font-bold text-white transition-transform duration-300 group-hover:scale-105">
                      {x.company.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold">{x.company}</h3>
                      <p className="text-sm text-mute">{x.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-line px-3 py-1 text-xs text-faint">{x.period}</span>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">{x.type}</span>
                  </div>
                </div>

                {x.points?.length > 0 && (
                  <ul className="mt-5 space-y-2 text-sm leading-relaxed text-mute">
                    {x.points.map((p) => (
                      <li key={p} className="flex gap-2.5">
                        <span className="text-accent">▹</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}