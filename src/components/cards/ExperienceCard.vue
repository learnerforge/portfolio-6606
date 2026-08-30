<script setup>
defineProps({
  job: { type: Object, required: true }
})
</script>

<template>
  <div class="tl-item glass tl-card reveal" data-reveal data-dir="up">
    <div class="tl-head">
      <div>
        <h3 class="tl-company">{{ job.company }}</h3>
        <div class="tl-role">{{ job.role }}</div>
      </div>
      <div class="tl-meta">
        <span class="tl-period">{{ job.period }}</span>
        <span class="tl-type">{{ job.type }}</span>
      </div>
    </div>
    <p v-if="job.summary" class="tl-summary">{{ job.summary }}</p>
    <ul v-if="job.points && job.points.length" class="tl-points">
      <li v-for="pt in job.points" :key="pt">{{ pt }}</li>
    </ul>
    <div v-if="job.tags && job.tags.length" class="tl-tags">
      <span v-for="t in job.tags" :key="t" class="tag">{{ t }}</span>
    </div>
  </div>
</template>

<style scoped>
.tl-card { padding: clamp(22px, 3.5vw, 36px); }
.tl-card.tl-item { padding-left: 44px; }
.tl-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.tl-company { font-size: 1.45rem; font-weight: var(--fw-semibold); letter-spacing: -0.01em; }
.tl-role { color: var(--accent); font-family: var(--font-body); font-size: 13px; margin-top: 6px; }
.tl-meta { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
.tl-period { color: var(--text-tertiary); font-size: 12px; }
.tl-type {
  font-family: var(--font-body);
  font-size: 11px;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--hairline);
  background: var(--canvas-raised);
  color: var(--text-secondary);
}
.tl-summary { color: var(--text-secondary); margin: 16px 0; line-height: 1.7; }
.tl-points { margin: 0 0 18px; padding-left: 18px; display: grid; gap: 8px; color: var(--text-secondary); }
.tl-points li::marker { color: var(--accent); }
.tl-tags { display: flex; flex-wrap: wrap; gap: 8px; }
</style>