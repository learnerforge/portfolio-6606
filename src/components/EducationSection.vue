<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import SectionHeader from './ui/SectionHeader.vue'
import EducationCard from './cards/EducationCard.vue'

const root = ref(null)
useReveal(root)
const edu = portfolio.education[0]
</script>

<template>
  <section id="education" class="section" ref="root">
    <div class="container">
      <SectionHeader icon="book-open" eyebrow="03 — Education" title1="Foundations &" titleGrad="systems thinking" />

      <div class="edu-grid">
        <EducationCard :edu="edu" />

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
.edu-note { padding: clamp(24px, 3.5vw, 40px); }
.edu-note { background: var(--fill-sunken); }
.edu-note h4 { font-size: 1.35rem; margin-bottom: 18px; }
.note-list { list-style: none; margin: 0 0 26px; padding: 0; display: grid; gap: 12px; }
.note-list li { color: var(--text-secondary); display: flex; align-items: center; gap: 10px; }
.note-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--accent); flex-shrink: 0;
}

@media (max-width: 820px) {
  .edu-grid { grid-template-columns: 1fr; }
}
</style>
