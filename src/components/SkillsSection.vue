<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import IconSet from './IconSet.vue'

const root = ref(null)
useReveal(root)
const { skills } = portfolio

const cells = [
  { span: 3, key: 'languages', title: 'Languages' },
  { span: 5, key: 'frontend', title: 'Frontend' },
  { span: 4, key: 'backend', title: 'Backend' },
  { span: 4, key: 'devops', title: 'DevOps' },
  { span: 8, key: 'ai', title: 'AI / ML' }
]
</script>

<template>
  <section id="skills" class="section" ref="root">
    <div class="container">
      <div class="section-head" data-reveal>
        <div class="index"><IconSet name="layers" :size="14" />07 // TOOLBOX</div>
        <h2>The stack I<br><span class="text-gradient">reach for</span></h2>
      </div>

      <div class="bento">
        <div
          v-for="cell in cells"
          :key="cell.key"
          class="bento-cell reveal"
          data-reveal
          data-dir="up"
          :style="{ gridColumn: `span ${cell.span}` }"
        >
          <h4>{{ cell.title }}</h4>
          <div class="chip-wrap">
            <span v-for="s in skills[cell.key]" :key="s" class="skill-chip">{{ s }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chip-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
@media (max-width: 900px) {
  .bento-cell { grid-column: span 12 !important; }
}
</style>
