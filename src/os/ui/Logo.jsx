'use client'

export default function Logo({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brand-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#818cf8" />
          <stop offset="0.55" stopColor="#c084fc" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
      </defs>

      <rect x="1.5" y="1.5" width="45" height="45" rx="13.5" fill="var(--color-surface)" stroke="var(--color-line)" />
      <rect x="6" y="6" width="36" height="36" rx="10" fill="url(#brand-mark)" opacity="0.14" />
      <rect
        x="7.5"
        y="7.5"
        width="33"
        height="33"
        rx="8.5"
        fill="none"
        stroke="url(#brand-mark)"
        strokeWidth="1"
        opacity="0.5"
      />
      <text
        x="24"
        y="25"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="19"
        fontWeight="800"
        letterSpacing="0.5"
        fontFamily="var(--font-display)"
        fill="url(#brand-mark)"
      >
        GB
      </text>
      <circle cx="37" cy="11" r="2.4" fill="url(#brand-mark)" />
    </svg>
  )
}