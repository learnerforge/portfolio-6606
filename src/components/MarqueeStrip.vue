<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useReveal } from '../composables/useReveal.js'

const items = ref([
  'AI / ML', 'Full Stack', 'LLM Engineering', 'NLP', 'Prompt Engineering',
  'Agentic Systems', 'Python', 'Vue', 'React', 'FastAPI', 'PostgreSQL',
  'Docker', 'Three.js', 'GSAP'
])
const track = ref(null)
const root = ref(null)
useReveal(root)
let gsap = null
let tween = null
let io = null
let inView = false

onMounted(async () => {
  const mod = await import('gsap')
  gsap = mod.gsap
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced) {
    tween = gsap.to(track.value, {
      x: () => -track.value.scrollWidth / 2,
      duration: 40,
      ease: 'none',
      repeat: -1
    })
    tween.pause()
    io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView && !document.hidden) tween.play()
      else tween.pause()
    }, { rootMargin: '100px' })
    io.observe(track.value)
    document.addEventListener('visibilitychange', onVisChange)
  }
})
function onVisChange() {
  if (!tween) return
  if (document.hidden) tween.pause()
  else if (inView) tween.play()
}
onBeforeUnmount(() => {
  if (tween) tween.kill()
  if (io) io.disconnect()
  document.removeEventListener('visibilitychange', onVisChange)
})
</script>

<template>
  <div class="marquee" data-reveal data-dir="left" ref="root">
    <div class="marquee-track" ref="track">
      <template v-for="n in 2" :key="n">
        <span v-for="(it, i) in items" :key="`${n}-${i}`" class="marquee-item">
          {{ it }}<span class="dot"></span>
        </span>
      </template>
    </div>
  </div>
</template>
