<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import SectionHeader from './ui/SectionHeader.vue'
import SkillCell from './cards/SkillCell.vue'

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
      <SectionHeader icon="layers" eyebrow="07 — Toolbox" title1="The stack I" titleGrad="reach for" />

      <div class="bento">
        <SkillCell
          v-for="cell in cells"
          :key="cell.key"
          :title="cell.title"
          :skills="skills[cell.key]"
          :span="cell.span"
        />
      </div>
    </div>
  </section>
</template>
