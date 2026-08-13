<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'

const root = ref(null)
useReveal(root)
const { about } = portfolio
</script>

<template>
  <section id="about" class="section" ref="root">
    <div class="container">
      <div class="section-head" data-reveal>
        <div class="index">01 // ABOUT</div>
        <h2>Turning curiosity<br>into <span class="text-gradient">shipped software</span></h2>
        <p class="sub">{{ about.paragraphs[0] }}</p>
      </div>

      <div class="about-grid">
        <div class="about-visual reveal" data-dir="left">
          <div class="avatar-ring">
            <img :src="portfolio.profile.avatar" :alt="portfolio.profile.name" />
          </div>
          <div class="float-chip chip chip-a">Hyderabad, IN</div>
          <div class="float-chip chip chip-b">B.Tech · AI &amp; ML</div>
        </div>

        <div class="about-body">
          <p class="reveal" data-delay="0.1">{{ about.paragraphs[1] }}</p>

          <div class="about-focus">
            <h4 class="reveal" data-delay="0.15">Focus areas</h4>
            <div class="chip-row reveal" data-delay="0.2">
              <span v-for="f in about.focus" :key="f" class="chip">{{ f }}</span>
            </div>
          </div>

          <div class="stats reveal" data-delay="0.25">
            <div v-for="s in about.stats" :key="s.label" class="stat">
              <div class="value">{{ s.value }}</div>
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
  gap: clamp(32px, 5vw, 72px);
  align-items: start;
}
.about-visual { position: relative; max-width: 340px; }
.avatar-ring { width: min(100%, 320px); }
.float-chip {
  position: absolute;
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--panel);
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 34px -12px rgba(0, 0, 0, 0.7);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--text-dim);
}
.chip-a { top: 12%; right: -8px; }
.chip-b { bottom: 14%; left: -12px; }

.about-body > p {
  color: var(--text-dim);
  font-size: 17px;
  line-height: 1.8;
  margin-bottom: 28px;
}
.about-focus h4 {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 14px;
}
.chip-row { display: flex; flex-wrap: wrap; gap: 10px; }
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid var(--line);
}

@media (max-width: 820px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-visual { max-width: 260px; margin: 0 auto; }
}
</style>
