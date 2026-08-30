<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import SectionHeader from './ui/SectionHeader.vue'
import AchievementCard from './cards/AchievementCard.vue'

const root = ref(null)
useReveal(root)
const { achievements } = portfolio
</script>

<template>
  <section id="achievements" class="section" ref="root">
    <div class="container">
      <SectionHeader icon="award" eyebrow="05 — Track record" title1="Proof of" titleGrad="momentum" />

      <div class="ach-grid">
        <AchievementCard
          v-for="(a, i) in achievements"
          :key="a.title"
          :achievement="a"
          :dir="i % 2 === 0 ? 'left' : 'right'"
          :delay="i * 0.08"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.ach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
</style>
