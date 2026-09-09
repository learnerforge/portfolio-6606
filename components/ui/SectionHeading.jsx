import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, grad, sub, center = false }) {
  return (
    <Reveal className={center ? 'text-center' : ''}>
      <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-8 bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
        {eyebrow}
      </div>
      <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight md:text-[2.6rem]">
        {title}{' '}
        {grad && <span className="grad-text">{grad}</span>}
      </h2>
      {sub && <p className="mt-4 max-w-xl leading-relaxed text-mute">{sub}</p>}
    </Reveal>
  )
}