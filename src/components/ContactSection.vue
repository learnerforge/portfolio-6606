<script setup>
import { ref } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { useReveal } from '../composables/useReveal.js'
import ContactCard from './cards/ContactCard.vue'

const root = ref(null)
useReveal(root)
const { profile } = portfolio
const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent('Hello Ganesh — from your portfolio')}`
</script>

<template>
  <section id="contact" class="section" ref="root">
    <div class="container">
      <ContactCard :profile="profile" :email-url="emailUrl" />
    </div>
  </section>
</template>

<style scoped>
.section { background: var(--canvas-alt); }
</style>
