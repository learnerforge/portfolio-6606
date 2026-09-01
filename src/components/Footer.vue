<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import IconSet from './IconSet.vue'
const { profile, codingProfiles } = portfolio
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
          <div class="foot-cta-kicker section-eyebrow">Open to roles</div>
          <h3 class="font-display">Have a role in mind?<br><span class="text-gradient">Let's talk.</span></h3>
        </div>
        <div class="foot-cta-actions">
          <a :href="emailUrl" target="_blank" rel="noopener" class="pill-btn">Email Me <IconSet name="arrow-up-right" :size="15" /></a>
          <a href="#contact" class="pill-btn-secondary">Contact <IconSet name="arrow-right" :size="15" /></a>
        </div>
      </div>

      <div class="hairline"></div>

      <div class="foot-top">
        <span class="foot-brand font-display">BAKKERA<span class="text-gradient">.dev</span></span>

        <div class="foot-cols">
          <div class="foot-col">
            <div class="foot-col-title">Explore</div>
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
          </div>
          <div class="foot-col">
            <div class="foot-col-title">Connect</div>
            <a :href="profile.github" target="_blank" rel="noopener"><IconSet name="github" :size="13" />GitHub</a>
            <a :href="profile.linkedin" target="_blank" rel="noopener"><IconSet name="linkedin" :size="13" />LinkedIn</a>
            <a :href="emailUrl" target="_blank" rel="noopener"><IconSet name="mail" :size="13" />Email</a>
          </div>
          <div class="foot-col" v-if="codingProfiles && codingProfiles.length">
            <div class="foot-col-title">Credentials</div>
            <a v-for="c in codingProfiles" :key="c.name" :href="c.url" target="_blank" rel="noopener"><IconSet name="code" :size="13" />{{ c.name }}</a>
          </div>
        </div>
      </div>

      <div class="foot-bottom">
        <span>Copyright © {{ year }} Ganesh Bakkera.</span>
        <span>Designed &amp; built with Vue 3 · Three.js · GSAP</span>
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
.foot-cta h3 {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: var(--fw-semibold);
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 18px 0 0;
}
.foot-cta-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.foot-top {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  align-items: start;
  padding: 32px 0 28px;
}
.foot-brand { font-size: 1.15rem; font-weight: var(--fw-semibold); letter-spacing: 0.02em; }
.foot-cols {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.foot-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.foot-col-title {
  font-size: 12px;
  font-weight: var(--fw-semibold);
  letter-spacing: 0.02em;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.foot-col a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 12px;
  transition: color var(--duration-fast) var(--ease-out);
}
.foot-col a:hover { color: var(--accent-link); }
.foot-bottom {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 24px;
  border-top: 1px solid var(--hairline);
  color: var(--text-tertiary);
  font-size: 11px;
}

@media (max-width: 720px) {
  .foot-top { grid-template-columns: 1fr; }
  .foot-cols { justify-content: flex-start; gap: 36px; }
}
</style>