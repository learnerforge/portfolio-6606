<script setup>
import { portfolio } from '../data/portfolio.js'
import IconSet from './IconSet.vue'
const { profile } = portfolio
const year = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="container">
      <div class="foot-top">
        <span class="font-display foot-brand">GB<span class="text-gradient">.DEV</span></span>
        <div class="foot-links font-mono">
          <a :href="profile.github" target="_blank" rel="noopener"><IconSet name="github" :size="14" />GitHub</a>
          <a :href="profile.linkedin" target="_blank" rel="noopener"><IconSet name="linkedin" :size="14" />LinkedIn</a>
          <a href="mailto:bakkeraganesh@gmail.com"><IconSet name="mail" :size="14" />Email</a>
        </div>
      </div>
      <div class="foot-bottom font-mono">
        <span>© {{ year }} Ganesh Bakkera</span>
        <span>Designed &amp; built with Vue 3 · Three.js · Theatre.js · GSAP</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.foot-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}
.foot-brand { font-size: 1.4rem; font-weight: 700; letter-spacing: 0.1em; }
.foot-links { display: flex; gap: 26px; }
.foot-links a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-dim);
  text-decoration: none;
  font-size: 12px;
  letter-spacing: 0.1em;
  transition: color 0.3s ease;
}
.foot-links a:hover { color: var(--cyan); }
.foot-bottom {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 24px;
  color: var(--text-faint);
  font-size: 11px;
  letter-spacing: 0.08em;
}
</style>
