<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { portfolio } from '../data/portfolio.js'
import ProjectModal from './ProjectModal.vue'
import IconSet from './IconSet.vue'
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
      <div class="banner-label font-mono">// SELECTED WORK</div>
      <h2 class="banner-title font-display">Things I've <span class="text-gradient">built</span></h2>
    </div>

    <div class="container">
      <div class="projects-list">
        <article
          v-for="p in projects"
          :key="p.id"
          class="project-card"
          data-reveal
          data-dir="up"
        >
          <div class="num">{{ p.num }}</div>
          <div class="pc-body">
            <div class="pc-top">
              <div class="pc-title-wrap">
                <span v-if="p.flagship" class="tag tag-hl"><IconSet name="sparkles" :size="12" />FLAGSHIP</span>
                <h3 class="pc-title">{{ p.title }}</h3>
                <div class="pc-subtitle">{{ p.subtitle }}</div>
              </div>
              <button class="pc-case" @click="open(p)">Case study<IconSet name="arrow-right" :size="14" /></button>
            </div>

            <p class="pc-desc">{{ p.description }}</p>

            <div class="pc-tags">
              <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
            </div>

            <div class="pc-links">
              <a :href="p.github" target="_blank" rel="noopener" class="link font-mono">
                <IconSet name="github" :size="14" />GitHub
              </a>
              <button class="link font-mono" @click="open(p)">Details<IconSet name="arrow-right" :size="14" /></button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <ProjectModal v-if="active" :project="active" @close="close" />
  </section>
</template>

<style scoped>
.projects-banner {
  position: relative;
  min-height: 34vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: clamp(32px, 5vw, 56px);
  overflow: hidden;
}
.projects-banner canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.banner-label {
  position: relative;
  font-size: 11px;
  letter-spacing: 0.42em;
  color: var(--cyan);
}
.banner-title {
  position: relative;
  font-size: clamp(2.8rem, 8vw, 6rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-top: 10px;
  text-align: center;
}

.projects-list { display: grid; gap: 28px; }
.pc-body { position: relative; z-index: 1; }
.pc-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; flex-wrap: wrap; }
.pc-title { font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 600; margin-top: 10px; }
.pc-subtitle { color: var(--cyan); font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.1em; margin-top: 6px; }
.pc-case {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none; border: 1px solid var(--line-strong); color: var(--text-dim);
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em;
  padding: 10px 18px; border-radius: 999px; cursor: pointer;
  transition: all 0.3s ease; white-space: nowrap;
}
.pc-case:hover { border-color: var(--cyan); color: var(--cyan); }
.pc-desc { color: var(--text-dim); margin: 18px 0; max-width: 640px; line-height: 1.7; }
.pc-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.pc-links { display: flex; gap: 22px; margin-top: 22px; align-items: center; }
.pc-links button.link { background: none; padding: 0; cursor: pointer; border: none; border-bottom: 1px solid rgba(34, 211, 238, 0.35); border-radius: 0; }
</style>
