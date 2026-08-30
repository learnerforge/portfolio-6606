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
    const { createParticleBackdrop } = await import('../three/particleBackdrop.js')
    backdrop = createParticleBackdrop(banner.value)
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
