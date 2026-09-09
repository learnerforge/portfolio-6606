'use client'

import { motion } from 'motion/react'
import Icon from '../ui/Icon'
import { useDrag } from '../wm/useOs'

export default function Window({ win, active, onFocus, onClose, onMinimize, onMove, isMobile, os }) {
  const drag = useDrag({ onMove: (dx, dy) => onMove(win.app.id, dx, dy) })

  return (
    <motion.div
      role="dialog"
      aria-label={win.app.title}
      initial={{ opacity: 0, scale: 0.94, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`os-window ${
        isMobile ? 'fixed top-[86px] bottom-[86px] left-0 right-0 w-auto h-auto rounded-none' : 'absolute'
      }`}
      style={
        isMobile
          ? { zIndex: win.z }
          : { zIndex: win.z, left: win.x, top: win.y, width: win.w, height: win.h }
      }
      onPointerDown={onFocus}
    >
      <div
        className={`flex shrink-0 items-center justify-between border-b border-line px-4 py-2.5 ${
          active ? 'bg-surface-2' : 'bg-surface'
        } ${isMobile ? '' : 'touch-none cursor-grab active:cursor-grabbing'}`}
        {...(isMobile ? {} : drag)}
        data-window-title
      >
        <div className="flex items-center gap-2">
          <Icon name={win.app.icon} size={15} className="text-accent" />
          <span className="text-sm font-semibold tracking-tight">{win.app.title}</span>
        </div>
        <div className="flex items-center gap-1.5" data-no-drag>
          <button
            onClick={onMinimize}
            aria-label={`Minimize ${win.app.title}`}
            className="grid h-7 w-7 place-items-center rounded-md text-faint transition-colors hover:bg-bg-2 hover:text-ink"
          >
            <Icon name="minus" size={14} />
          </button>
          <button
            onClick={onClose}
            aria-label={`Close ${win.app.title}`}
            className="grid h-7 w-7 place-items-center rounded-md text-faint transition-colors hover:bg-red-500 hover:text-white"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      </div>

      <div className="os-scroll flex-1">
        <win.app.component os={os} />
      </div>
    </motion.div>
  )
}