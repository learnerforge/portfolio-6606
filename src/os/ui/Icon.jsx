const STROKE = {
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

const paths = {
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...STROKE} />
      <circle cx="12" cy="7" r="4" {...STROKE} />
    </>
  ),
  code: (
    <>
      <path d="m8 6-5 6 5 6" {...STROKE} />
      <path d="m16 6 5 6-5 6" {...STROKE} />
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" {...STROKE} />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" {...STROKE} />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" {...STROKE} />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" {...STROKE} />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3z" {...STROKE} />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" {...STROKE} />
    </>
  ),
  terminal: (
    <>
      <path d="m4 17 6-6-6-6" {...STROKE} />
      <path d="M12 19h8" {...STROKE} />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" {...STROKE} />
      <path d="M8 17v-6" {...STROKE} />
      <path d="M13 17V7" {...STROKE} />
      <path d="M18 17v-9" {...STROKE} />
    </>
  ),
  trophy: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" {...STROKE} />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" {...STROKE} />
      <path d="M4 22h16" {...STROKE} />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" {...STROKE} />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" {...STROKE} />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" {...STROKE} />
    </>
  ),
  book: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" {...STROKE} />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" {...STROKE} />
    </>
  ),
  chat: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...STROKE} />
    </>
  ),
  bolt: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" {...STROKE} />,
  github: (
    <path
      d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"
      fill="currentColor"
      stroke="none"
    />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="3" {...STROKE} />
      <path d="m2 7 10 7L22 7" {...STROKE} />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" {...STROKE} />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" {...STROKE} />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" {...STROKE} />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" {...STROKE} />
    </>
  ),
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" {...STROKE} />,
  power: (
    <>
      <path d="M12 2v10" {...STROKE} />
      <path d="M18.36 6.64a9 9 0 1 1-12.72 0" {...STROKE} />
    </>
  ),
  x: (
    <>
      <path d="M6 6l12 12M18 6L6 18" {...STROKE} />
    </>
  ),
  minus: <path d="M5 12h14" {...STROKE} />,
  chevron: <path d="m6 9 6 6 6-6" {...STROKE} />,
  arrow: (
    <>
      <path d="M5 12h14" {...STROKE} />
      <path d="m13 6 6 6-6 6" {...STROKE} />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" {...STROKE} />
      <rect x="14" y="3" width="7" height="7" rx="1.5" {...STROKE} />
      <rect x="14" y="14" width="7" height="7" rx="1.5" {...STROKE} />
      <rect x="3" y="14" width="7" height="7" rx="1.5" {...STROKE} />
    </>
  )
}

export default function Icon({ name, size = 18, className = '', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}