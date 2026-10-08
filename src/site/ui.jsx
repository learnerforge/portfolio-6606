import { Reveal } from './ambient'
import { GradientText, StaggerText } from './kit'

export function SectionHead({ index, label, title, accent, className = '', align = 'left' }) {
  return (
    <Reveal className={className}>
      <div className={align === 'center' ? 'text-center' : ''}>
        <p className={`eyebrow ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="text-accent">0{index}</span> {label}
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          {accent && (
            <GradientText className="mr-3">{accent}</GradientText>
          )}
          <StaggerText text={title} />
        </h2>
      </div>
    </Reveal>
  )
}

export function Chip({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-line-soft bg-surface-2/70 px-2.5 py-1 font-mono text-[11px] text-mute transition-colors hover:border-accent-3/40 hover:text-accent ${className}`}
      data-hover
    >
      {children}
    </span>
  )
}