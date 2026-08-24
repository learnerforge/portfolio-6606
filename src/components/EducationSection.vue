<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import IconSet from './IconSet.vue'

const root = ref(null)
useReveal(root)
const edu = portfolio.education[0]
</script>

<template>
  <section id="education" class="section" ref="root">
    <div class="container">
      <div class="section-head" data-reveal>
        <div class="index"><IconSet name="book-open" :size="14" />03 // EDUCATION</div>
        <h2>Foundations &amp;<br><span class="text-gradient">systems thinking</span></h2>
      </div>

      <div class="edu-grid">
        <div class="edu-card glass reveal" data-reveal data-dir="left">
          <div class="edu-head">
            <div class="edu-badge font-display">{{ edu.degree }}</div>
            <div>
              <h3 class="edu-program">{{ edu.program }}</h3>
              <div class="edu-institution">{{ edu.institution }}</div>
              <div class="edu-meta">{{ edu.period }} · {{ edu.location }}</div>
            </div>
          </div>

          <div class="divider-glow"></div>

          <h4 class="edu-sub">Core coursework</h4>
          <div class="chip-row">
            <span v-for="c in edu.coursework" :key="c" class="chip">{{ c }}</span>
          </div>
        </div>

        <div class="edu-note glass reveal" data-reveal data-dir="right">
          <h4 class="font-display">Currently leveling up</h4>
          <ul class="note-list">
            <li><span class="note-dot"></span>Advanced deep learning &amp; model deployment</li>
            <li><span class="note-dot"></span>Agentic AI architectures &amp; memory</li>
            <li><span class="note-dot"></span>Production ML — MLOps &amp; monitoring</li>
            <li><span class="note-dot"></span>System design at scale</li>
          </ul>
          <a href="#projects" class="btn btn-ghost">See it in action</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.edu-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}
.edu-card, .edu-note { padding: clamp(24px, 3.5vw, 40px); }
.edu-head { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 26px; }
.edu-head > div { min-width: 0; }
.edu-badge {
  flex-shrink: 0;
  width: 64px; height: 64px;
  border-radius: 16px;
  background: var(--grad);
  display: grid;
  place-items: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--panel);
  box-shadow: 0 10px 30px -10px rgba(124, 58, 237, 0.3);
}
.edu-program { font-size: 1.35rem; font-weight: 600; line-height: 1.2; }
.edu-institution { color: var(--cyan); margin-top: 8px; }
.edu-meta { color: var(--text-faint); font-family: var(--font-mono); font-size: 12px; margin-top: 6px; }
.edu-sub {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 26px 0 14px;
}
.chip-row { display: flex; flex-wrap: wrap; gap: 10px; }

.edu-note h4 { font-size: 1.3rem; margin-bottom: 18px; }
.note-list { list-style: none; margin: 0 0 26px; padding: 0; display: grid; gap: 12px; }
.note-list li { color: var(--text-dim); display: flex; align-items: center; gap: 10px; }
.note-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--grad); flex-shrink: 0;
}

@media (max-width: 820px) {
  .edu-grid { grid-template-columns: 1fr; }
}
</style>
