import { portfolio } from '@/content/portfolio'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import CountUp from './ui/CountUp'

export default function About() {
  return (
    <section id="about" className="section-shell">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading eyebrow="01 — About" title="Engineer by default," grad="builder by choice." />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            {portfolio.about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-lg leading-relaxed text-mute">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.22}>
              <div className="flex flex-wrap gap-2 pt-2">
                {portfolio.about.focus.map((f) => (
                  <span key={f} className="chip">
                    {f}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {portfolio.about.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="rounded-2xl border border-line bg-surface p-6 shadow-card transition-transform duration-300 hover:-translate-y-1.5">
                  <p className="font-display text-4xl font-extrabold grad-text">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1.5 text-sm text-mute">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}