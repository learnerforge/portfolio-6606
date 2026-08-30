<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import SectionHeader from './ui/SectionHeader.vue'

const root = ref(null)
useReveal(root)
const { about } = portfolio

const statsRoot = ref(null)
const shown = about.stats.map((s) => {
  const m = String(s.value).match(/^(\d+)(.*)$/)
  return { num: ref(m ? Number(m[1]) : 0), suffix: m ? m[2] : '' }
})
let statsIO = null
const rafIds = []

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  statsIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        statsIO.disconnect()
        shown.forEach((r, i) => {
          const target = Number(String(about.stats[i].value).match(/\d+/)?.[0] || 0)
          if (reduced) { r.num.value = target; return }
          const dur = 1500
          const start = performance.now()
          const step = (now) => {
            const t = Math.min(1, (now - start) / dur)
            const eased = 1 - Math.pow(1 - t, 3)
            r.num.value = Math.round(target * eased)
            if (t < 1) rafIds.push(requestAnimationFrame(step))
          }
          rafIds.push(requestAnimationFrame(step))
        })
      })
    },
    { threshold: 0.4 }
  )
  if (statsRoot.value) statsIO.observe(statsRoot.value)
})

onBeforeUnmount(() => {
  rafIds.forEach((id) => cancelAnimationFrame(id))
  if (statsIO) statsIO.disconnect()
})
</script>

<template>
  <section id="about" class="section" ref="root">
    <div class="container">
      <SectionHeader icon="user" eyebrow="01 — About" title1="Turning curiosity" titleGrad="shipped software" :sub="about.paragraphs[0]" />

      <div class="about-grid">
        <div class="about-visual reveal" data-reveal data-dir="left">
          <div class="avatar-ring">
            <img :src="portfolio.profile.avatar" :alt="portfolio.profile.name" loading="eager" decoding="async" width="320" height="320" data-parallax="16" />
          </div>
          <div class="float-chip chip chip-a">Hyderabad, IN</div>
          <div class="float-chip chip chip-b">B.Tech · AI &amp; ML</div>
        </div>

        <div class="about-body">
          <p class="reveal" data-reveal data-delay="0.1">{{ about.paragraphs[1] }}</p>

          <div class="about-focus">
            <h4 class="reveal" data-reveal data-delay="0.15">Focus areas</h4>
            <div class="chip-row reveal" data-reveal data-delay="0.2" data-stack>
              <span v-for="f in about.focus" :key="f" class="chip">{{ f }}</span>
            </div>
          </div>

          <div class="stats reveal" data-reveal data-delay="0.25" ref="statsRoot">
            <div v-for="(s, i) in about.stats" :key="s.label" class="stat">
              <div class="value">{{ shown[i].num.value }}{{ shown[i].suffix }}</div>
              <div class="label">{{ s.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) 1.4fr;
  gap: clamp(40px, 6vw, 88px);
  align-items: start;
}
.about-visual { position: relative; max-width: 340px; }
.avatar-ring { width: min(100%, 320px); }
.float-chip {
  position: absolute;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: var(--canvas-raised);
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-sm);
  font-family: var(--font-body);
  font-size: 12px;
  letter-spacing: 0.02em;
  color: var(--text-secondary);
  white-space: nowrap;
}
.chip-a { top: 10%; right: -6px; }
.chip-b { bottom: 12%; left: -8px; }

.about-body > p {
  color: var(--text-secondary);
  font-size: 18px;
  line-height: 1.7;
  margin-bottom: 28px;
}
.about-focus h4 {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: var(--fw-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: 14px;
}
.chip-row { display: flex; flex-wrap: wrap; gap: 10px; }
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid var(--hairline);
}

@media (max-width: 820px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-visual { max-width: 260px; margin: 0 auto; }
}
</style>
