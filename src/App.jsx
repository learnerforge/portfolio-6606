import { useState } from 'react'
import { portfolio } from './content/portfolio'
import { Backdrop, Nav, Preloader, ScrollProgress } from './site/ambient'
import { CursorAmbient, Marquee } from './site/kit'
import About from './site/about'
import Work from './site/work'
import Hero from './site/hero'
import { Contact, Footer } from './site/contact'

const MARQUEE_ROWS = [
  [...portfolio.profile.roles, ...portfolio.about.focus],
  [...portfolio.personality.thingsIBuild, ...portfolio.openTo],
]

export default function App() {
  const [booted, setBooted] = useState(false)

  return (
    <>
      {!booted && <Preloader onDone={() => setBooted(true)} />}

      <ScrollProgress />
      <CursorAmbient />
      <Backdrop />

      <Nav />

      <main className="relative z-[5]">
        <Hero />

        <div aria-hidden="true" className="relative my-8 flex flex-col gap-6 py-4">
          <Marquee items={MARQUEE_ROWS[0]} speed={30} className="text-sm" />
          <Marquee items={MARQUEE_ROWS[1]} speed={22} reverse className="text-[11px] text-fainter" />
        </div>

        <Work />
        <About />
        <Contact />
      </main>

      <Footer />

      <div className="noise" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </>
  )
}