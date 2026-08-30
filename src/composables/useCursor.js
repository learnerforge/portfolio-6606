/**
 * useCursor — lightweight custom cursor (dot + lagging ring) that inverts over
 * any background via mix-blend-mode: difference, so it reads clearly in both
 * themes. The ring grows over interactive elements. Skipped on touch devices and
 * under prefers-reduced-motion; native cursor is hidden only while active.
 * Returns the cleanup function.
 */
let cleanup = null

export function useCursor() {
  if (cleanup) return cleanup

  const fine = window.matchMedia('(pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduced) return null

  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  dot.setAttribute('aria-hidden', 'true')
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  ring.setAttribute('aria-hidden', 'true')
  document.body.append(dot, ring)
  document.documentElement.classList.add('has-cursor')

  const HOVER =
    'a, button, [role="button"], [data-cursor], input, textarea, select, .dock-item, .theme-toggle, .back-top, .ai-fab, .nav-burger'

  let mx = window.innerWidth / 2
  let my = window.innerHeight / 2
  let rx = mx
  let ry = my
  let scale = 1
  let targetScale = 1
  let raf = null
  let looping = false
  let lastMove = 0

  // Loop only while the pointer recently moved or the ring/scale still needs to
  // converge; otherwise cancel the rAF and sit at ~0 CPU.
  const start = () => {
    if (looping || document.hidden) return
    looping = true
    raf = requestAnimationFrame(loop)
  }
  const stop = () => {
    looping = false
    if (raf) cancelAnimationFrame(raf)
    raf = null
  }

  const onMove = (e) => {
    mx = e.clientX
    my = e.clientY
    lastMove = performance.now()
    start()
  }
  const onOver = (e) => {
    targetScale = e.target.closest ? (e.target.closest(HOVER) ? 1.9 : 1) : 1
    lastMove = performance.now()
    start()
  }
  const onLeave = () => {
    targetScale = 1
    start()
  }
  const onVis = () => {
    if (document.hidden) stop()
    else start()
  }

  const loop = () => {
    rx += (mx - rx) * 0.16
    ry += (my - ry) * 0.16
    scale += (targetScale - scale) * 0.18
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`
    const idle = performance.now() - lastMove > 150
    const moving = Math.abs(rx - mx) > 1 || Math.abs(ry - my) > 1 || Math.abs(scale - targetScale) > 0.02
    if (idle && !moving) {
      stop()
    } else {
      raf = requestAnimationFrame(loop)
    }
  }

  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mouseover', onOver, { passive: true })
  document.documentElement.addEventListener('mouseleave', onLeave)
  document.addEventListener('visibilitychange', onVis)
  start()

  cleanup = () => {
    stop()
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseover', onOver)
    document.documentElement.removeEventListener('mouseleave', onLeave)
    document.removeEventListener('visibilitychange', onVis)
    dot.remove()
    ring.remove()
    document.documentElement.classList.remove('has-cursor')
    cleanup = null
  }
  return cleanup
}