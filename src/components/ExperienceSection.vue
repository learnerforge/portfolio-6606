<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'

const root = ref(null)
useReveal(root)
const { experience, openTo } = portfolio
</script>

<template>
  <section id="experience" class="section" ref="root">
    <div class="container">
      <div class="section-head" data-reveal>
        <div class="index">02 // EXPERIENCE</div>
        <h2>Where I've<br>been <span class="text-gradient">building</span></h2>
      </div>

      <div class="timeline">
        <div
          v-for="(job, i) in experience"
          :key="i"
          class="tl-item glass tl-card reveal"
          data-dir="up"
        >
          <div class="tl-head">
            <div>
              <h3 class="tl-company">{{ job.company }}</h3>
              <div class="tl-role">{{ job.role }}</div>
            </div>
            <div class="tl-meta">
              <span class="tl-period">{{ job.period }}</span>
              <span class="tl-type">{{ job.type }}</span>
            </div>
          </div>
          <p class="tl-summary">{{ job.summary }}</p>
          <ul class="tl-points">
            <li v-for="pt in job.points" :key="pt">{{ pt }}</li>
          </ul>
          <div class="tl-tags">
            <span v-for="t in job.tags" :key="t" class="tag">{{ t }}</span>
          </div>
        </div>
      </div>

      <div class="open-box reveal" data-dir="up">
        <span class="open-label">Open to</span>
        <span v-for="o in openTo" :key="o" class="chip">{{ o }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline { display: grid; gap: 36px; }
.tl-card { padding: clamp(22px, 3.5vw, 36px); }
.tl-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.tl-company { font-size: 1.6rem; font-weight: 600; }
.tl-role { color: var(--cyan); font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.12em; margin-top: 6px; }
.tl-meta { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
.tl-period { color: var(--text); font-family: var(--font-mono); font-size: 12px; }
.tl-type {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em;
  padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(34, 211, 238, 0.4);
  color: var(--cyan); text-transform: uppercase;
}
.tl-summary { color: var(--text-dim); margin: 16px 0; line-height: 1.7; }
.tl-points { margin: 0 0 18px; padding-left: 18px; display: grid; gap: 8px; color: var(--text-dim); }
.tl-points li::marker { color: var(--cyan); }
.tl-tags { display: flex; flex-wrap: wrap; gap: 8px; }

.open-box {
  margin-top: 40px;
  padding: 26px;
  border-radius: 18px;
  border: 1px dashed var(--line-strong);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.open-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-right: 8px;
}
</style>
