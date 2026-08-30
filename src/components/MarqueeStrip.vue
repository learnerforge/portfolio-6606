<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { portfolio } from '../data/portfolio.js'

function flat(r) {
  const out = []
  for (const k in r) {
    if (Array.isArray(r[k])) out.push(...r[k])
  }
  return out.filter(Boolean)
}

const sk = portfolio.skills || {}
const tech = flat(sk)
const badges = [
  'AI / ML', 'LLM Engineering', 'NLP', 'Agentic Systems', 'Prompt Engineering',
  'Full Stack', 'Python', 'FastAPI', 'React', 'Vue', 'PostgreSQL', 'Docker', 'Three.js'
]

// Row A — half is one pass; duplicated twice so GSAP can loop seamlessly.
const halfA = badges.map((w, i) => ({ w, grad: i % 3 !== 1 }))
const rowA = [...halfA, ...halfA]

// Row B — small tracking label row (opposite direction)
const halfB = [...tech, 'Open to Work'].map((t, i) => ({ t, alt: i % 4 === 0 }))
const rowB = [...halfB, ...halfB]

const trackA = ref(null)
const trackB = ref(null)
let tweenA = null
let tweenB = null
let io = null
let boostT = null
let inView = false

onMounted(async () => {
  const mod = await import('gsap')
  const gsap = mod.gsap
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return

  tweenA = gsap.fromTo(trackA.value,
    { x: 0 },
    { x: () => -(trackA.value.scrollWidth / 2), duration: 44, ease: 'none', repeat: -1, paused: true }
  )
  tweenB = gsap.fromTo(trackB.value,
    { x: () => -(trackB.value.scrollWidth / 2) },
    { x: 0, duration: 70, ease: 'none', repeat: -1, paused: true }
  )

  const speed = (tw, scale) => {
    gsap.to(tw, { timeScale: scale, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
  }

  const pause = () => { tweenA.pause(); tweenB.pause() }
  const play = () => { if (inView && !document.hidden) { tweenA.play(); tweenB.play() } }

  io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    if (inView) play()
    else pause()
  }, { rootMargin: '120px' })
  io.observe(trackA.value.parentElement.closest('.marquee'))

  const onVisChange = () => { if (document.hidden) pause(); else play() }
  window.addEventListener('scroll', () => {
    if (!tweenA) return
    speed(tweenA, 2.6); speed(tweenB, 2.6)
    clearTimeout(boostT)
    boostT = setTimeout(() => {
      speed(tweenA, 1); speed(tweenB, 1)
    }, 340)
  }, { passive: true })
  document.addEventListener('visibilitychange', onVisChange)

  play()
})
onBeforeUnmount(() => {
  if (tweenA) tweenA.kill()
  if (tweenB) tweenB.kill()
  if (io) io.disconnect()
  if (boostT) clearTimeout(boostT)
})
</script>

<template>
  <section class="marquee" aria-label="Technologies and stack">
    <div class="mq-eyebrow section-eyebrow">Technologies · Tools · Platforms</div>

    <div class="mq-viewport">
      <div class="mq-row mq-row-main" ref="trackA">
        <span v-for="(it, i) in rowA" :key="`a${i}`" class="mq-item">
          <span class="mq-word" :class="it.grad ? 'grad' : 'outline'">{{ it.w }}</span>
          <span class="dot"></span>
        </span>
      </div>
    </div>

    <div class="mq-viewport mq-viewport-sub">
      <div class="mq-row mq-row-sub" ref="trackB">
        <span v-for="(it, i) in rowB" :key="`b${i}`" class="mq-item">
          <span class="mq-word" :class="it.alt && tech.length ? 'grad' : ''">{{ it.t }}</span>
          <span class="dot"></span>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mq-viewport { overflow: hidden; position: relative; }
.mq-viewport-sub { margin-top: 20px; opacity: 0.85; }
</style>