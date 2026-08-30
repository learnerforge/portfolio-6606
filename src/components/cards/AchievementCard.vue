<script setup>
defineProps({
  achievement: { type: Object, required: true },
  dir: { type: String, default: 'left' },
  delay: { type: Number, default: 0 }
})
</script>

<template>
  <div class="ach-card reveal" data-reveal :data-dir="dir" :data-delay="delay">
    <div class="ach-tag">{{ achievement.tag }}</div>
    <h3 class="ach-title">{{ achievement.title }}</h3>
    <div class="ach-org">{{ achievement.org }}</div>
    <p class="ach-desc">{{ achievement.desc }}</p>
    <div class="ach-corner"></div>
  </div>
</template>

<style scoped>
.ach-card {
  position: relative;
  border: 1px solid var(--hairline);
  border-radius: var(--radius-lg);
  padding: 26px;
  background: var(--surface-card);
  transition: border-color var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out);
}
.ach-card:hover {
  border-color: var(--accent-hair);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}
.ach-tag {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: var(--fw-semibold);
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}
.ach-title { font-size: 1.25rem; font-weight: var(--fw-semibold); margin-top: 14px; }
.ach-org { color: var(--accent); font-size: 13px; margin-top: 6px; }
.ach-desc { color: var(--text-secondary); font-size: 14px; line-height: 1.65; margin-top: 14px; }
</style>