<script setup>
import IconSet from '../IconSet.vue'

defineProps({
  icon: { type: String, required: true },
  eyebrow: { type: String, required: true },
  title1: { type: String, required: true },
  titleGrad: { type: String, required: true },
  sub: { type: String, default: '' }
})
</script>

<template>
  <div class="section-head" data-reveal>
    <div class="index"><IconSet :name="icon" :size="14" />{{ eyebrow }}</div>
    <h2>{{ title1 }}<br><span class="text-gradient">{{ titleGrad }}</span></h2>
    <p v-if="sub" class="sub">{{ sub }}</p>
  </div>
</template>