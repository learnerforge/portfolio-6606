<script setup>
defineProps({
  title: { type: String, required: true },
  skills: { type: Array, required: true },
  span: { type: Number, required: true }
})
</script>

<template>
  <div
    class="bento-cell reveal"
    data-reveal
    data-dir="up"
    :style="{ gridColumn: `span ${span}` }"
  >
    <h4>{{ title }}</h4>
    <div class="chip-wrap">
      <span v-for="s in skills" :key="s" class="skill-chip">{{ s }}</span>
    </div>
  </div>
</template>

<style scoped>
.chip-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
@media (max-width: 900px) {
  .bento-cell { grid-column: span 12 !important; }
}
</style>