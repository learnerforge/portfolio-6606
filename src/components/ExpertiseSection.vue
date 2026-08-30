<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import SectionHeader from './ui/SectionHeader.vue'
import ExpertiseCard from './cards/ExpertiseCard.vue'

const root = ref(null)
useReveal(root)
const { expertise } = portfolio
</script>

<template>
  <section id="expertise" class="section" ref="root">
    <div class="container">
      <SectionHeader icon="cpu" eyebrow="04 — Expertise" title1="Deep in the" titleGrad="AI stack" />

      <div class="exp-grid">
        <ExpertiseCard
          v-for="(e, i) in expertise"
          :key="e.domain"
          :expertise="e"
          :delay="i * 0.08"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.exp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
</style>
