'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'
import Icon from '../ui/Icon'
import { useDrag, useReducedMotion } from '../wm/useOs'

const SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.9 }

export default function Window({ win, active, onFocus, onClose, onMinimize, onMove, os, isMobile }) {
  const drag = useDrag({ onMove: (dx, dy) => onMove(win.app.id, dx, dy) })
  const reduced = useReducedMotion()
  const resize = useRef(null)

  const onResizeStart = (e) => {
    if (isMobile || e.button !== 0) return
    onFocus()
    resize.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onResizeMove = (e) => {
    if (!resize.current) return
    const dx = e.clientX - resize.current.x
    const dy = e.clientY - resize.current.y
    resize.current = { x: e.clientX, y: e.clientY }
    os.resize(win.app.id, dx, dy)
  }
  const onResizeStop = () => {
    resize.current = null
  }

  return (
    <motion.div
      role="dialog"
      aria-label={win.app.title}
      initial={{ opacity: 0, scale: 0.92, y: 26, rotateX: reduced ? 0 : -7, filter: 'blur(6px)' }}
      animate={{ opacity: active ? 1 : 0.92, scale: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
      exit={
        win.minimized
          ? { opacity: 0, y: 90, scale: 0.8, filter: 'blur(4px)', transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }
          : { opacity: 0, scale: 0.9, filter: 'blur(4px)', transition: { duration: 0.2 } }
      }
      transition={SPRING}
      className={`os-window ${
        active ? 'os-window--active' : 'os-window--inactive'
      } ${isMobile ? 'fixed top-[86px] bottom-[86px] left-0 right-0 w-auto h-auto rounded-none' : 'absolute'}`}
      style={
        isMobile
          ? { zIndex: win.z, transformPerspective: 1100 }
          : { zIndex: win.z, left: win.x, top: win.y, width: win.w, height: win.h, transformPerspective: 1100 }
      }
      onPointerDown={onFocus}
      onContextMenu={(e) => e.stopPropagation()}
    >
      <div
        className={`flex shrink-0 items-center justify-between border-b border-line px-3.5 py-2.5 ${
          active ? 'bg-surface-2/40' : 'bg-transparent'
        } ${isMobile ? '' : 'cursor-grab touch-none active:cursor-grabbing'}`}
        {...(isMobile ? {} : drag)}
        data-window-title
      >
        <div className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-indigo-500/25 to-fuchsia-500/25 text-accent ring-1 ring-line">
            <Icon name={win.app.icon} size={13} />
          </span>
          <span className="text-[13px] font-semibold tracking-tight">{win.app.title}</span>
        </div>
        <div className="group/tl flex items-center gap-2" data-no-drag>
          <button
            onClick={onMinimize}
            aria-label={`Minimize ${win.app.title}`}
            className="tl tl-min"
            title="Minimize"
          >
            <Icon name="minus" size={9} className="text-black/70" />
          </button>
          <button
            onClick={onClose}
            aria-label={`Close ${win.app.title}`}
            className="tl tl-close"
            title="Close"
          >
            <Icon name="x" size={9} className="text-black/70" />
          </button>
        </div>
      </div>

      <div className="os-scroll flex-1">
        <win.app.component os={os} />
      </div>

      {!isMobile && (
        <div
          className="absolute bottom-0 right-0 z-10 h-5 w-5 cursor-nwse-resize touch-none"
          onPointerDown={onResizeStart}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeStop}
          onPointerCancel={onResizeStop}
          aria-hidden="true"
        >
          <Icon name="chevron" size={11} className="absolute bottom-1 right-1 text-faint/60" />
        </div>
      )}
    </motion.div>
  )
}