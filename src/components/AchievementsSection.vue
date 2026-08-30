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
        <div class="index"><IconSet name="award" :size="14" />05 — Track record</div>
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
  border: 1px solid var(--hairline);
  border-radius: var(--radius-lg);
  padding: 26px;
  background: var(--surface-card);
  transition: border-color var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out);
}
.ach-card:hover {
  border-color: var(--accent-hair);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}
.ach-tag {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: var(--fw-semibold);
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}
.ach-title { font-size: 1.25rem; font-weight: var(--fw-semibold); margin-top: 14px; }
.ach-org { color: var(--accent); font-size: 13px; margin-top: 6px; }
.ach-desc { color: var(--text-secondary); font-size: 14px; line-height: 1.65; margin-top: 14px; }
</style>
