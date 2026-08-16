<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import IconSet from './IconSet.vue'
import { useReveal } from '../composables/useReveal.js'

const root = ref(null)
useReveal(root)
const { profile } = portfolio
const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent('Hello Ganesh — from your portfolio')}`
</script>

<template>
  <section id="contact" class="section" ref="root">
    <div class="container">
      <div class="contact-card reveal" data-reveal data-dir="scale">
        <div class="orb orb-cyan" style="width: 340px; height: 340px; top: -140px; left: -120px;"></div>
        <div class="orb orb-violet" style="width: 380px; height: 380px; bottom: -160px; right: -100px;"></div>

        <div class="contact-index font-mono"><IconSet name="send" :size="14" />08 // CONTACT</div>
        <h2 class="contact-title font-display">
          Let's build<br>something <span class="text-gradient">intelligent</span>
        </h2>
        <p class="contact-sub">
          I'm open to AI/ML internships, research collaborations, and full-stack
          engineering roles. If you have an idea worth shipping — I want to hear it.
        </p>

        <div class="contact-actions">
          <a :href="emailUrl" target="_blank" rel="noopener" class="btn btn-primary"><IconSet name="mail" :size="15" />bakkeraganesh@gmail.com</a>
          <a :href="profile.github" target="_blank" rel="noopener" class="btn btn-ghost"><IconSet name="github" :size="15" />GitHub</a>
          <a :href="profile.linkedin" target="_blank" rel="noopener" class="btn btn-ghost"><IconSet name="linkedin" :size="15" />LinkedIn</a>
        </div>

        <div class="contact-meta font-mono">
          <span><IconSet name="location" :size="14" />{{ profile.location }}</span>
          <span><IconSet name="bolt" :size="14" />Responds within 24h</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-card {
  position: relative;
  text-align: center;
  border: 1px solid var(--line);
  border-radius: 28px;
  padding: clamp(48px, 8vw, 96px) clamp(24px, 5vw, 72px);
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.008));
}
.contact-index {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 11px;
  letter-spacing: 0.42em;
  color: var(--cyan);
}
.contact-title {
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 18px 0 0;
}
.contact-sub {
  color: var(--text-dim);
  max-width: 520px;
  margin: 22px auto 0;
  line-height: 1.75;
}
.contact-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: 38px;
}
.contact-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 44px;
  color: var(--text-faint);
  font-size: 12px;
  letter-spacing: 0.1em;
}
.contact-meta span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
