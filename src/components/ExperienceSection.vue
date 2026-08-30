<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import SectionHeader from './ui/SectionHeader.vue'
import ExperienceCard from './cards/ExperienceCard.vue'

const root = ref(null)
useReveal(root)
const { experience, openTo } = portfolio
</script>

<template>
  <section id="experience" class="section" ref="root">
    <div class="container">
      <SectionHeader icon="briefcase" eyebrow="02 — Experience" title1="Where I've" titleGrad="been building" />

      <div class="timeline">
        <ExperienceCard
          v-for="(job, i) in experience"
          :key="i"
          :job="job"
        />
      </div>

      <div class="open-box reveal" data-reveal data-dir="up">
        <span class="open-label">Open to</span>
        <span v-for="o in openTo" :key="o" class="chip">{{ o }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline { display: grid; gap: 20px; }
.open-box {
  margin-top: 32px;
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--hairline);
  background: var(--fill-sunken);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.open-label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: var(--fw-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-right: 8px;
}
</style>
