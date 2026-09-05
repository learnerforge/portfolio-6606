<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { portfolio } from '../data/portfolio.js'
import ProjectModal from './ProjectModal.vue'
import ProjectCard from './cards/ProjectCard.vue'
import { useReveal } from '../composables/useReveal.js'

const root = ref(null)
useReveal(root)
const banner = ref(null)
const projects = portfolio.projects

const active = ref(null)
let backdrop = null
let scrub = null
let io = null

function open(p) {
  active.value = p
}
function close() {
  active.value = null
}

onMounted(async () => {
  await nextTick()
  let started = false
  const init = async () => {
    if (started) return
    started = true
    if ((navigator.deviceMemory || 8) <= 4) return
    const { createParticleBackdrop } = await import('../three/particleBackdrop.js')
    backdrop = createParticleBackdrop(banner.value)

    // Scrub the backdrop opacity as the banner crosses the viewport so the
    // advertised setProgress() hook actually drives a visible effect.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    try {
      const gmod = await import('gsap')
      const stmod = await import('gsap/ScrollTrigger')
      const gsap = gmod.gsap
      gsap.registerPlugin(stmod.ScrollTrigger)
      scrub = gsap.fromTo(backdrop, { progress: 0 }, {
        progress: 1,
        ease: 'none',
        immediateRender: true,
        scrollTrigger: {
          trigger: banner.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => backdrop.setProgress(self.progress)
        }
      })
    } catch (err) {
      /* GSAP unavailable — backdrop still renders with its default opacity */
    }
  }
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) init()
    }, { rootMargin: '300px' })
    io.observe(banner.value)
  } else {
    init()
  }
})

onBeforeUnmount(() => {
  if (scrub) {
    scrub.scrollTrigger && scrub.scrollTrigger.kill()
    scrub.kill()
  }
  if (backdrop) backdrop.dispose()
  if (io) io.disconnect()
})
</script>

<template>
  <section id="projects" class="section" ref="root">
    <div class="projects-banner">
      <canvas ref="banner"></canvas>
      <div class="banner-label">Selected work</div>
      <h2 class="banner-title font-display">Things I've <span class="text-gradient">built</span></h2>
    </div>

    <div class="container">
      <div class="projects-list">
        <ProjectCard
          v-for="p in projects"
          :key="p.id"
          :project="p"
          @open="open"
        />
      </div>
    </div>

    <ProjectModal v-if="active" :project="active" @close="close" />
  </section>
</template>

<style scoped>
.projects-banner {
  position: relative;
  min-height: 30vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: clamp(40px, 6vw, 72px);
  overflow: hidden;
}
.projects-banner canvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.5; }
.banner-label {
  position: relative;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: var(--fw-medium);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}
.banner-title {
  position: relative;
  font-size: clamp(2.8rem, 8vw, 4rem);
  font-weight: var(--fw-semibold);
  letter-spacing: -0.02em;
  margin-top: 12px;
  text-align: center;
}

.projects-list { display: grid; gap: 20px; }
</style>
