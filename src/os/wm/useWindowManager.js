import { useCallback, useEffect, useRef, useState } from 'react'
import { APPS } from '../apps'
import { useHashRoute, useIsMobile } from './useOs'

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

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
      const w = Math.min(app.w || 640, vw - 24)
      const h = Math.min(app.h || 480, vh - 148)
      const idx = windowsRef.current.length
      const x = isMobile ? 12 : clamp(64 + idx * 34, 12, Math.max(12, vw - w - 90))
      const y = isMobile ? 92 : clamp(56 + idx * 26, 44, Math.max(44, vh - h - 100))
      const z = ++zRef.current
      setWindows((list) => [...list, { id: appId, app, x, y, w, h, z, minimized: false }])
      setActiveId(appId)
    },
    [appById, focus, isMobile]
  )

  const close = useCallback(
    (appId) => {
      setWindows((list) => list.filter((w) => w.app.id !== appId))
      setActiveId((a) => (a === appId ? null : a))
      if (hash.includes(`/${appId}`)) navigate('')
    },
    [hash, navigate]
  )

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
        return {
          ...w,
          x: clamp(w.x + dx, 4, Math.max(4, vw - w.w - 40)),
          y: clamp(w.y + dy, 4, Math.max(4, vh - w.h - 120))
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
      if (e.key === 'Escape' && activeId) close(activeId)
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
    minimize,
    focus,
    move,
    toggle,
    navigate,
    hash,
    appById
  }
}