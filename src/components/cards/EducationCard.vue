<script setup>
defineProps({
  edu: { type: Object, required: true }
})
</script>

<template>
  <div class="edu-card glass reveal" data-reveal data-dir="left">
    <div class="edu-head">
      <div class="edu-badge font-display">{{ edu.degree }}</div>
      <div>
        <h3 class="edu-program">{{ edu.program }}</h3>
        <div class="edu-institution">{{ edu.institution }}</div>
        <div class="edu-meta">{{ edu.period }} · {{ edu.location }}</div>
      </div>
    </div>

    <div class="divider-glow"></div>

    <h4 class="edu-sub">Core coursework</h4>
    <div class="chip-row">
      <span v-for="c in edu.coursework" :key="c" class="chip">{{ c }}</span>
    </div>
  </div>
</template>

<style scoped>
.edu-card { padding: clamp(24px, 3.5vw, 40px); }
.edu-head { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 26px; }
.edu-head > div { min-width: 0; }
.edu-badge {
  flex-shrink: 0;
  width: 56px; height: 56px;
  border-radius: 14px;
  background: var(--btn-fill);
  display: grid;
  place-items: center;
  font-size: 1rem;
  font-weight: var(--fw-semibold);
  color: var(--text-on-accent);
}
.edu-program { font-size: 1.4rem; font-weight: var(--fw-semibold); line-height: 1.2; letter-spacing: -0.01em; }
.edu-institution { color: var(--accent); margin-top: 8px; font-size: 15px; }
.edu-meta { color: var(--text-tertiary); font-size: 12px; margin-top: 6px; }
.edu-sub {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: var(--fw-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 26px 0 14px;
}
.chip-row { display: flex; flex-wrap: wrap; gap: 10px; }
</style>