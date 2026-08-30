<script setup>
defineProps({
  expertise: { type: Object, required: true },
  delay: { type: Number, default: 0 }
})

const icons = {
  bot: 'M8 3 1 9l7 6 7-6-7-6z',
  message: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z',
  brain: 'M12 2a4 4 0 0 0-4 4c-1.5 0-3 1-3 3a3 3 0 0 0 1 5.5V18a3 3 0 0 0 6 .5 3 3 0 0 0 6-.5v-3.5A3 3 0 0 0 19 9c0-2-1.5-3-3-3a4 4 0 0 0-4-4z',
  chip: 'M7 7h10v10H7z M4 9h2 M4 15h2 M18 9h2 M18 15h2 M9 4h2 M15 4h2 M9 20h2 M15 20h2',
  sparkles: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z'
}
</script>

<template>
  <div class="exp-card glass reveal" data-reveal data-dir="up" :data-delay="delay">
    <div class="exp-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path :d="icons[expertise.icon]" />
      </svg>
    </div>
    <div class="exp-head">
      <h3 class="exp-domain">{{ expertise.domain }}</h3>
      <span class="exp-level" :class="{ hl: expertise.level === 'Advanced' }">{{ expertise.level }}</span>
    </div>
    <p class="exp-detail">{{ expertise.detail }}</p>
  </div>
</template>

<style scoped>
.exp-card { padding: 28px; }
.exp-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: var(--fill-sunken);
  border: 1px solid var(--hairline);
  display: grid;
  place-items: center;
  color: var(--accent);
  margin-bottom: 20px;
}
.exp-icon svg { width: 22px; height: 22px; }
.exp-head { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
.exp-domain { font-size: 1.2rem; font-weight: var(--fw-semibold); flex: 1 1 auto; min-width: 0; }
.exp-level {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-secondary);
  border: 1px solid var(--hairline);
  background: var(--canvas-raised);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  flex-shrink: 0;
  white-space: nowrap;
  margin-left: auto;
}
.exp-level.hl { color: var(--accent); border-color: transparent; background: var(--accent-tint); }
.exp-detail { color: var(--text-secondary); font-size: 14px; margin-top: 12px; line-height: 1.7; }
</style>