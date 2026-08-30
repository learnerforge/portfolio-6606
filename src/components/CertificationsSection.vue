<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import SectionHeader from './ui/SectionHeader.vue'
import CertificationCard from './cards/CertificationCard.vue'

const root = ref(null)
useReveal(root)
const { certifications, codingProfiles } = portfolio
</script>

<template>
  <section id="certifications" class="section" ref="root">
    <div class="container">
      <SectionHeader icon="check-circle" eyebrow="06 — Credentials" title1="Certifications &" titleGrad="platforms" />

      <div class="cert-grid">
        <div class="cert-col">
          <CertificationCard
            v-for="(c, i) in certifications"
            :key="c.name"
            variant="cert"
            :name="c.name"
            :issuer="c.issuer"
            :initial="c.issuer.slice(0, 1)"
            :delay="i * 0.06"
          />
        </div>

        <div class="cert-col">
          <CertificationCard
            v-for="(p, i) in codingProfiles"
            :key="p.name"
            variant="code"
            :name="p.name"
            :url="p.url"
            :delay="i * 0.06"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cert-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.cert-col { display: grid; gap: 12px; align-content: start; }

@media (max-width: 760px) {
  .cert-grid { grid-template-columns: 1fr; }
}
</style>
