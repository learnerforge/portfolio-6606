'use client'

import { AnimatePresence } from 'motion/react'
import { useIsMobile } from './wm/useOs'
import useWindowManager from './wm/useWindowManager'
import Window from './wm/Window'
import MenuBar from './MenuBar'
import Dock from './Dock'
import Starfield from './Starfield'

export default function Desktop() {
  const os = useWindowManager()
  const isMobile = useIsMobile()

  return (
    <div className="relative flex h-full flex-col overflow-hidden" data-desktop>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-2 via-bg to-bg-2" />
        <Starfield />
        <div className="orb left-[-10%] top-[12%] h-96 w-96 bg-indigo-600/15" style={{ animation: 'drift 18s ease-in-out infinite' }} />
        <div className="orb right-[-8%] bottom-[15%] h-96 w-96 bg-fuchsia-600/10" style={{ animation: 'drift 22s ease-in-out infinite', animationDelay: '-8s' }} />
      </div>

      <MenuBar os={os} />

      <main className="relative z-10 flex-1" aria-label="Desktop windows">
        <AnimatePresence>
          {os.openWindows.map((win) => (
            <Window
              key={win.id}
              win={win}
              os={os}
              isMobile={isMobile}
              active={os.activeId === win.app.id}
              onFocus={() => os.focus(win.app.id)}
              onClose={() => os.close(win.app.id)}
              onMinimize={() => os.minimize(win.app.id)}
              onMove={os.move}
            />
          ))}
        </AnimatePresence>
      </main>

      <Dock os={os} isMobile={isMobile} />
    </div>
  )
}