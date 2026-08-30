<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import IconSet from './IconSet.vue'
import { useReveal } from '../composables/useReveal.js'

const root = ref(null)
useReveal(root)
const { certifications, codingProfiles } = portfolio
</script>

<template>
  <section id="certifications" class="section" ref="root">
    <div class="container">
      <div class="section-head" data-reveal>
        <div class="index"><IconSet name="check-circle" :size="14" />06 — Credentials</div>
        <h2>Certifications &amp;<br><span class="text-gradient">platforms</span></h2>
      </div>

      <div class="cert-grid">
        <div class="cert-col">
          <div v-for="(c, i) in certifications" :key="c.name" class="cert-row glass reveal" data-reveal data-dir="left" :data-delay="i * 0.06">
            <div class="cert-badge">{{ c.issuer.slice(0, 1) }}</div>
            <div>
              <div class="cert-name">{{ c.name }}</div>
              <div class="cert-issuer">{{ c.issuer }}</div>
            </div>
            <IconSet class="cert-check" name="check" :size="15" />
          </div>
        </div>

        <div class="cert-col">
          <div v-for="(p, i) in codingProfiles" :key="p.name" class="cert-row glass reveal" data-reveal data-dir="right" :data-delay="i * 0.06">
            <div class="cert-badge"><IconSet name="code" :size="18" /></div>
            <div class="cert-name">{{ p.name }}</div>
            <a class="cert-link link" :href="p.url" target="_blank" rel="noopener">open<IconSet name="arrow-up-right" :size="13" /></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cert-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.cert-col { display: grid; gap: 12px; align-content: start; }
.cert-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
}
.cert-badge {
  flex-shrink: 0;
  width: 40px; height: 40px;
  border-radius: 10px;
  background: var(--fill-sunken);
  border: 1px solid var(--hairline);
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-weight: var(--fw-semibold);
  color: var(--accent);
}
.cert-name { font-weight: var(--fw-semibold); font-size: 15px; }
.cert-issuer { color: var(--text-tertiary); font-size: 12px; margin-top: 3px; }
.cert-check { margin-left: auto; color: var(--accent); }
.cert-link { margin-left: auto; font-size: 12px; }

@media (max-width: 760px) {
  .cert-grid { grid-template-columns: 1fr; }
}
</style>
