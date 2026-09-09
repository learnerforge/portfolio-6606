import { portfolio } from '@/content/portfolio'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Credentials() {
  return (
    <section id="credentials" className="section-shell">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="06 — Credentials"
          title="Achievements, certs &"
          grad="community profiles."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {portfolio.achievements.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08} x={i % 2 ? 40 : -40}>
              <div className="group h-full rounded-2xl border border-line bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.5 13l1 8-4.5-2.5L7.5 21l1-8" />
                    </svg>
                  </span>
                  <span className="rounded-full border border-line px-3 py-1 text-xs text-faint">{a.tag}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold">{a.title}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">{a.org}</p>
                <p className="mt-3 text-sm leading-relaxed text-mute">{a.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal>
              <h3 className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.18em] text-mute">
                Certifications
              </h3>
            </Reveal>
            <div className="flex flex-col gap-4">
              {portfolio.certifications.map((c, i) => (
                <Reveal key={c.name} delay={i * 0.07} x={-30}>
                  <div className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-x-1 hover:border-accent-3/40">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-bg font-display text-sm font-bold text-accent transition-transform duration-300 group-hover:scale-110">
                      {c.issuer.slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      <p className="text-xs text-faint">{c.issuer}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <Reveal>
              <h3 className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.18em] text-mute">
                Profiles
              </h3>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {portfolio.codingProfiles.map((p, i) => (
                <Reveal key={p.name} delay={(i % 2) * 0.07}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-line bg-surface px-5 py-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent-3/40"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-bg text-xs font-bold text-accent">
                        {p.name.slice(0, 1)}
                      </span>
                      <span className="text-sm font-semibold">{p.name}</span>
                    </span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    >
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}