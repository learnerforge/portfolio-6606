/**
 * perfHud — tiny opt-in diagnostics panel. Load it with `?mem=1` in the URL.
 *
 * Reports live per-load numbers: JS heap, device RAM, DOM node count, WebGL
 * canvas count and frame-rate. Zero cost by default — it is only fetched as a
 * lazy chunk when the query flag is present.
 */

let raf = 0
let last = 0
let frames = 0
let fps = 0

export function startPerfHud() {
  const el = document.createElement('div')
  el.setAttribute('aria-hidden', 'true')
  el.style.cssText = [
    'position:fixed',
    'right:12px',
    'bottom:12px',
    'z-index:2147483000',
    'font:10px/1.6 ui-monospace, SFMono-Regular, Consolas, monospace',
    'color:#d8f3ff',
    'background:rgba(7,7,15,0.85)',
    'border:1px solid rgba(255,255,255,0.18)',
    'border-radius:8px',
    'padding:8px 10px',
    'pointer-events:none',
    'white-space:pre'
  ].join(';')
  document.body.appendChild(el)

  const heap = () =>
    performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) : 'n/a'
  const nodes = () => document.getElementsByTagName('*').length
  const canvases = () => document.querySelectorAll('canvas').length

  const tick = (t) => {
    raf = requestAnimationFrame(tick)
    if (t - last >= 1000) {
      fps = frames
      frames = 0
      last = t
    }
    frames++
  }

  const render = () => {
    el.textContent = [
      `jsHeap   : ${heap()} MB`,
      `deviceMem: ${navigator.deviceMemory || 'n/a'} GB`,
      `domNodes : ${nodes()}`,
      `canvas   : ${canvases()}`,
      `fps      : ${fps}`
    ].join('\n')
  }

  raf = requestAnimationFrame(tick)
  render()
  const iv = setInterval(render, 500)

  return () => {
    cancelAnimationFrame(raf)
    clearInterval(iv)
    el.remove()
  }
}