<script setup>
import IconSet from '../IconSet.vue'

const props = defineProps({
  project: { type: Object, required: true }
})
const emit = defineEmits(['open'])

function open() {
  emit('open', props.project)
}
</script>

<template>
  <article class="project-card" data-reveal data-dir="up">
    <div class="num">{{ project.num }}</div>
    <div class="pc-body">
      <div class="pc-top">
        <div class="pc-title-wrap">
          <span v-if="project.flagship" class="tag tag-hl"><IconSet name="sparkles" :size="12" />FLAGSHIP</span>
          <h3 class="pc-title">{{ project.title }}</h3>
          <div class="pc-subtitle">{{ project.subtitle }}</div>
        </div>
        <button class="pc-case" @click="open">Case study<IconSet name="arrow-right" :size="14" /></button>
      </div>

      <p class="pc-desc">{{ project.description }}</p>

      <div class="pc-tags">
        <span v-for="t in project.tags" :key="t" class="tag">{{ t }}</span>
      </div>

      <div class="pc-links">
        <a :href="project.github" target="_blank" rel="noopener" class="link">
          <IconSet name="github" :size="14" />GitHub
        </a>
        <button class="link" @click="open">Details<IconSet name="arrow-right" :size="14" /></button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.pc-body { position: relative; z-index: 1; }
.pc-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; flex-wrap: wrap; }
.pc-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: var(--fw-semibold); margin-top: 10px; letter-spacing: -0.01em; }
.pc-subtitle { color: var(--accent); font-size: 12px; letter-spacing: 0.02em; margin-top: 6px; }
.pc-case {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--fill-sunken);
  border: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  padding: 0 18px;
  height: 40px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}
.pc-case:hover { background: var(--fill-hover); color: var(--accent); }
.pc-desc { color: var(--text-secondary); margin: 18px 0; max-width: 640px; line-height: 1.7; }
.pc-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.pc-links { display: flex; gap: 22px; margin-top: 22px; align-items: center; }
.pc-links button.link {
  background: none;
  padding: 0;
  cursor: pointer;
  border: none;
  border-bottom: 1px solid var(--accent-hair);
  border-radius: 0;
  color: var(--accent-link);
  font-family: var(--font-body);
  font-size: 13px;
}
.pc-links button.link:hover { color: var(--accent-link-hover); border-color: var(--accent-link-hover); }
.pc-links a.link { font-family: var(--font-body); font-size: 13px; }
</style>