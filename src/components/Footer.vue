<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import IconSet from './IconSet.vue'
const { profile } = portfolio
const year = new Date().getFullYear()

const root = ref(null)
useReveal(root)
const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent('Hello Ganesh — from your portfolio')}`
</script>

<template>
  <footer ref="root">
    <div class="container">
      <div class="foot-cta" data-reveal data-dir="up">
        <div class="foot-cta-text">
          <div class="foot-cta-kicker font-mono">OPEN TO ROLES</div>
          <h3 class="font-display">Have a role in mind?<br><span class="text-gradient">Let's talk.</span></h3>
        </div>
        <div class="foot-cta-actions">
          <a :href="emailUrl" target="_blank" rel="noopener" class="btn btn-primary">Email Me <IconSet name="arrow-up-right" :size="15" /></a>
          <a href="#contact" class="btn btn-ghost">Contact <IconSet name="arrow-right" :size="15" /></a>
        </div>
      </div>

      <div class="foot-top">
        <span class="font-display foot-brand">GB<span class="text-gradient">.DEV</span></span>
        <div class="foot-links font-mono">
          <a :href="profile.github" target="_blank" rel="noopener"><IconSet name="github" :size="14" />GitHub</a>
          <a :href="profile.linkedin" target="_blank" rel="noopener"><IconSet name="linkedin" :size="14" />LinkedIn</a>
          <a :href="emailUrl" target="_blank" rel="noopener"><IconSet name="mail" :size="14" />Email</a>
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
.foot-cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
  padding: clamp(40px, 6vw, 72px) 0;
}
.foot-cta-kicker {
  font-size: 11px;
  letter-spacing: 0.35em;
  color: var(--cyan);
  margin-bottom: 14px;
}
.foot-cta h3 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0;
}
.foot-cta-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.foot-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding-bottom: 24px;
  border-top: 1px solid var(--line);
  padding-top: 24px;
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
