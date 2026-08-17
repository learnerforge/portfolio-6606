<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import IconSet from './IconSet.vue'

const root = ref(null)
useReveal(root)
const { achievements } = portfolio
</script>

<template>
  <section id="achievements" class="section" ref="root">
    <div class="container">
      <div class="section-head" data-reveal>
        <div class="index"><IconSet name="award" :size="14" />05 // TRACK RECORD</div>
        <h2>Proof of<br><span class="text-gradient">momentum</span></h2>
      </div>

      <div class="ach-grid">
        <div v-for="(a, i) in achievements" :key="a.title" class="ach-card reveal" data-reveal :data-dir="i % 2 === 0 ? 'left' : 'right'" :data-delay="i * 0.08">
          <div class="ach-tag">{{ a.tag }}</div>
          <h3 class="ach-title">{{ a.title }}</h3>
          <div class="ach-org">{{ a.org }}</div>
          <p class="ach-desc">{{ a.desc }}</p>
          <div class="ach-corner"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
.ach-card {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 26px;
  overflow: hidden;
  background:
    radial-gradient(120% 120% at 100% 0%, rgba(139, 92, 246, 0.12), transparent 45%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.008));
  transition: border-color 0.4s ease, transform 0.4s ease;
}
.ach-card:hover { border-color: rgba(232, 121, 249, 0.45); transform: translateY(-4px); }
.ach-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--fuchsia);
  text-transform: uppercase;
}
.ach-title { font-size: 1.25rem; font-weight: 600; margin-top: 14px; }
.ach-org { color: var(--cyan); font-family: var(--font-mono); font-size: 12px; margin-top: 6px; }
.ach-desc { color: var(--text-dim); font-size: 14px; line-height: 1.65; margin-top: 14px; }
.ach-corner {
  position: absolute;
  top: -30px; right: -30px;
  width: 80px; height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.14), transparent 70%);
  pointer-events: none;
}
</style>
