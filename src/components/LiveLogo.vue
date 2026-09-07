<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { theme } from '../composables/useTheme.js'

/**
 * LiveLogo — real-time animated brand mark rendered on a tiny (28×28) canvas.
 *
 * A mini "orbit ember": a luminous core orbited by ring satellites that leave
 * soft additive trails — a quiet echo of the hero's holographic core scene.
 *
 * - Continuous smooth motion, frame-rate independent (pure function of time)
 * - Hovering the mark triggers an energy surge (bezier-eased via dt smoothing)
 * - Theme-aware: re-reads `--accent` whenever the theme toggles
 * - Pauses the loop when off-screen or the tab is hidden; static under
 *   prefers-reduced-motion. Zero per-frame allocations.
 */
const props = defineProps({
  monogram: { type: String, default: 'GB' }
})

const wrap = ref(null)
const cv = ref(null)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SIZE = 28
const CENTER = SIZE / 2

const RINGS = [
  { a: 8.6, b: 3.4, rot: -0.5, omega: 1.9, dir: 1, alpha: 0.5 },
  { a: 11.2, b: 4.3, rot: 0.9, omega: 1.3, dir: -1, alpha: 0.32 }
]

const SATELLITES = [
  { ring: 0, phase: 0, r: 1.7 },
  { ring: 0, phase: Math.PI, r: 1.3 },
  { ring: 1, phase: 0.6, r: 1.5 }
]

const TAIL = 7
const TAIL_STEP = 0.13

let ctx = null
let accent = [56, 189, 248]
let raf = 0
let rafRunning = false
let running = true
let lastTs = 0
let boost = 0
let hover = 0
let time = 0
let io = null

function readAccent() {
  const cs = getComputedStyle(document.documentElement)
  const v = cs.getPropertyValue('--accent').trim()
  const m = v.match(/#([0-9a-f]{6})/i)
  if (!m) return
  const n = parseInt(m[1], 16)
  accent = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function ringPoint(ring, theta) {
  const c = Math.cos(ring.rot)
  const s = Math.sin(ring.rot)
  const px = Math.cos(theta) * ring.a
  const py = Math.sin(theta) * ring.b
  return [CENTER + c * px - s * py, CENTER + s * px + c * py]
}

function rgba(base, alpha) {
  return `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${alpha})`
}

function draw() {
  const g = ctx
  g.clearRect(0, 0, SIZE, SIZE)

  const breathe = 1 + 0.025 * Math.sin(time * 1.6) + boost * 0.05
  const sp = 1 + boost * 1.5
  const brighten = 1 + boost * 0.35
  const c = Math.cos

  for (let i = 0; i < RINGS.length; i++) {
    const r = RINGS[i]
    g.beginPath()
    g.ellipse(CENTER, CENTER, r.a * breathe, r.b * breathe, r.rot, 0, Math.PI * 2)
    g.strokeStyle = rgba(accent, r.alpha * brighten * 0.7)
    g.lineWidth = i === 0 ? 1 : 0.8
    g.stroke()
  }

  g.globalCompositeOperation = 'lighter'
  for (let i = 0; i < SATELLITES.length; i++) {
    const sat = SATELLITES[i]
    const ring = RINGS[sat.ring]
    const theta = (th) => sat.phase + ring.dir * ring.omega * th * sp

    let prev = null
    for (let k = 0; k <= TAIL; k++) {
      const p = ringPoint(ring, theta(time - k * TAIL_STEP))
      if (prev) {
        const t = 1 - (k - 1) / TAIL
        g.strokeStyle = rgba(accent, 0.34 * t * brighten)
        g.lineWidth = (k === 1 ? 1.6 : 1) * t
        g.beginPath()
        g.moveTo(prev[0], prev[1])
        g.lineTo(p[0], p[1])
        g.stroke()
      }
      prev = p
    }

    const head = ringPoint(ring, theta(time))
    g.fillStyle = 'rgba(255, 255, 255, 0.85)'
    g.beginPath()
    g.arc(head[0], head[1], sat.r * brighten, 0, Math.PI * 2)
    g.fill()
  }
  g.globalCompositeOperation = 'source-over'

  const pulse = 0.8 + 0.2 * Math.sin(time * 2.4)
  const coreR = 2.6 * pulse
  const grad = g.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, 7.5)
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
  grad.addColorStop(0.24, rgba(accent, 0.9 * brighten))
  grad.addColorStop(1, rgba(accent, 0))
  g.fillStyle = grad
  g.beginPath()
  g.arc(CENTER, CENTER, 7.5, 0, Math.PI * 2)
  g.fill()

  g.fillStyle = 'rgba(255, 255, 255, 0.9)'
  g.beginPath()
  g.arc(CENTER, CENTER, coreR * 0.55, 0, Math.PI * 2)
  g.fill()
}

function requestFrame() {
  if (!running || reduced || rafRunning) return
  rafRunning = true
  raf = requestAnimationFrame(frame)
}

function frame(now) {
  raf = 0
  rafRunning = false
  if (!running) return
  const dt = lastTs ? Math.min((now - lastTs) / 1000, 0.1) : 0.016
  lastTs = now
  boost += (hover - boost) * (1 - Math.exp(-dt * 7))
  time = now / 1000
  draw()
  if (running) requestFrame()
}

function setRunning(v) {
  running = v
  if (v) {
    requestFrame()
  } else {
    cancelAnimationFrame(raf)
    raf = 0
    rafRunning = false
  }
}

const onVisChange = () => setRunning(!document.hidden)

onMounted(() => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  cv.value.width = SIZE * dpr
  cv.value.height = SIZE * dpr
  ctx = cv.value.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  readAccent()

  if (reduced) {
    boost = 1
    draw()
    return
  }

  io = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting))
  io.observe(wrap.value)
  document.addEventListener('visibilitychange', onVisChange)
  requestFrame()
})

watch(theme, readAccent)

onBeforeUnmount(() => {
  setRunning(false)
  if (io) io.disconnect()
  document.removeEventListener('visibilitychange', onVisChange)
})
</script>

<template>
  <span class="logo-glyph" ref="wrap" @mouseenter="hover = 1" @mouseleave="hover = 0">
    <canvas ref="cv" aria-hidden="true"></canvas>
    <span class="sr-only">{{ monogram }}</span>
  </span>
</template>

<style scoped>
.logo-glyph {
  width: 28px;
  height: 28px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: var(--radius-sm);
  background: var(--fill-sunken);
  overflow: hidden;
}
.logo-glyph canvas {
  display: block;
  width: 28px;
  height: 28px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
}
</style>