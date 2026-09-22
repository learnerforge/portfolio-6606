import { useCallback, useEffect, useRef, useState } from 'react'
import { APPS } from '../apps'
import { useHashRoute, useIsMobile } from './useOs'

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

const windowMemory = new Map()

const remember = (win) => {
  windowMemory.set(win.app.id, { x: win.x, y: win.y, w: win.w, h: win.h })
}

export default function useWindowManager() {
  const { hash, navigate } = useHashRoute()
  const isMobile = useIsMobile()
  const [windows, setWindows] = useState([])
  const [activeId, setActiveId] = useState(null)
  const zRef = useRef(10)
  const windowsRef = useRef(windows)

  useEffect(() => {
    windowsRef.current = windows
  }, [windows])

  const appById = useCallback((id) => APPS.find((a) => a.id === id), [])

  const focus = useCallback((appId) => {
    setWindows((list) =>
      list.map((w) => (w.app.id === appId ? { ...w, z: ++zRef.current, minimized: false } : w))
    )
    setActiveId(appId)
  }, [])

  const open = useCallback(
    (appId) => {
      const app = appById(appId)
      if (!app) return
      const exists = windowsRef.current.find((w) => w.app.id === appId)
      if (exists) {
        focus(appId)
        return
      }
      const vw = window.innerWidth
      const vh = window.innerHeight
      const mem = windowMemory.get(appId)
      const w = Math.min(mem ? mem.w : app.w || 640, vw - 24)
      const h = Math.min(mem ? mem.h : app.h || 480, vh - 148)
      let x
      let y
      if (mem) {
        x = clamp(mem.x, 0, Math.max(0, vw - 24))
        y = clamp(mem.y, 0, Math.max(0, vh - 60))
      } else if (isMobile) {
        x = 12
        y = 92
      } else {
        const idx = windowsRef.current.length
        x = clamp(64 + idx * 34, 12, Math.max(12, vw - w - 90))
        y = clamp(56 + idx * 26, 44, Math.max(44, vh - h - 100))
      }
      const z = ++zRef.current
      setWindows((list) => [...list, { id: appId, app, x, y, w, h, z, minimized: false }])
      setActiveId(appId)
    },
    [appById, focus, isMobile]
  )

  const close = useCallback(
    (appId) => {
      const win = windowsRef.current.find((w) => w.app.id === appId)
      if (win) remember(win)
      setWindows((list) => list.filter((w) => w.app.id !== appId))
      setActiveId((a) => (a === appId ? null : a))
      if (hash.includes(`/${appId}`)) navigate('')
    },
    [hash, navigate]
  )

  const closeAll = useCallback(() => {
    windowsRef.current.forEach(remember)
    setWindows([])
    setActiveId(null)
    navigate('')
  }, [navigate])

  const minimizeAll = useCallback(() => {
    setWindows((list) => list.map((w) => ({ ...w, minimized: true })))
    setActiveId(null)
  }, [])

  const minimize = useCallback((appId) => {
    setWindows((list) => list.map((w) => (w.app.id === appId ? { ...w, minimized: true } : w)))
    setActiveId((a) => (a === appId ? null : a))
  }, [])

  const move = useCallback((appId, dx, dy) => {
    setWindows((list) =>
      list.map((w) => {
        if (w.app.id !== appId) return w
        const vw = window.innerWidth
        const vh = window.innerHeight
        const x = clamp(w.x + dx, 0, Math.max(0, vw - 24))
        const y = clamp(w.y + dy, 0, Math.max(0, vh - w.h - 120))
        const snapX = x <= 6 ? 0 : Math.abs(x + w.w - vw) <= 6 ? vw - w.w : x
        const snapY = y <= 6 ? 0 : y
        return { ...w, x: snapX, y: snapY }
      })
    )
  }, [])

  const resize = useCallback((appId, dw, dh) => {
    setWindows((list) =>
      list.map((w) => {
        if (w.app.id !== appId) return w
        const vw = window.innerWidth
        const vh = window.innerHeight
        return {
          ...w,
          w: clamp(w.w + dw, 420, Math.max(420, vw - 36)),
          h: clamp(w.h + dh, 320, Math.max(320, vh - 36))
        }
      })
    )
  }, [])

  const toggle = useCallback(
    (appId) => {
      const w = windowsRef.current.find((x) => x.app.id === appId)
      if (!w) return open(appId)
      if (w.minimized) {
        focus(appId)
        navigate(appId)
      } else {
        minimize(appId)
      }
    },
    [open, focus, minimize, navigate]
  )

  useEffect(() => {
    const target = hash.replace(/^#\/?/, '')
    const app = appById(target)
    if (app) open(target)
    else if (!hash) open('welcome')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && activeId && !document.documentElement.hasAttribute('data-modal')) close(activeId)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId, close])

  const openWindows = windows.filter((w) => !w.minimized)
  const top = openWindows.length
    ? openWindows.reduce((acc, w) => (w.z > acc.z ? w : acc))
    : null

  return {
    windows,
    openWindows,
    activeId,
    topId: top ? top.app.id : null,
    open,
    close,
    closeAll,
    minimize,
    minimizeAll,
    focus,
    move,
    resize,
    toggle,
    navigate,
    hash,
    appById
  }
}