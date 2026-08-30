<script setup>
import IconSet from '../IconSet.vue'

defineProps({
  variant: { type: String, required: true },
  name: { type: String, required: true },
  issuer: { type: String, default: '' },
  initial: { type: String, default: '' },
  url: { type: String, default: '' },
  delay: { type: Number, default: 0 }
})
</script>

<template>
  <div v-if="variant === 'cert'" class="cert-row glass reveal" data-reveal data-dir="left" :data-delay="delay">
    <div class="cert-badge">{{ initial }}</div>
    <div>
      <div class="cert-name">{{ name }}</div>
      <div class="cert-issuer">{{ issuer }}</div>
    </div>
    <IconSet class="cert-check" name="check" :size="15" />
  </div>

  <div v-else class="cert-row glass reveal" data-reveal data-dir="right" :data-delay="delay">
    <div class="cert-badge"><IconSet name="code" :size="18" /></div>
    <div class="cert-name">{{ name }}</div>
    <a class="cert-link link" :href="url" target="_blank" rel="noopener">open<IconSet name="arrow-up-right" :size="13" /></a>
  </div>
</template>

<style scoped>
.cert-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
}
.cert-badge {
  flex-shrink: 0;
  width: 40px; height: 40px;
  border-radius: 10px;
  background: var(--fill-sunken);
  border: 1px solid var(--hairline);
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-weight: var(--fw-semibold);
  color: var(--accent);
}
.cert-name { font-weight: var(--fw-semibold); font-size: 15px; }
.cert-issuer { color: var(--text-tertiary); font-size: 12px; margin-top: 3px; }
.cert-check { margin-left: auto; color: var(--accent); }
.cert-link { margin-left: auto; font-size: 12px; }
</style>