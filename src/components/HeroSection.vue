<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { portfolio } from '../data/portfolio.js'

const p = portfolio.profile
const canvas = ref(null)
const root = ref(null)
let destroyScene = null
let typedTimer = null
let introTl = null

const roleIndex = ref(0)
const typed = ref('')

function typeRole() {
  const roles = p.roles
  let len = 0
  let deleting = false
  const tick = () => {
    const word = roles[roleIndex.value]
    if (!deleting) {
      len++
      typed.value = word.slice(0, len)
      if (len === word.length) {
        deleting = true
        typedTimer = setTimeout(tick, 1600)
        return
      }
      typedTimer = setTimeout(tick, 60)
    } else {
      len--
      typed.value = word.slice(0, len)
      if (len === 0) {
        deleting = false
        roleIndex.value = (roleIndex.value + 1) % roles.length
        typedTimer = setTimeout(tick, 350)
        return
      }
      typedTimer = setTimeout(tick, 28)
    }
  }
  tick()
}

onMounted(async () => {
  await nextTick()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!reduced) {
    const gmod = await import('gsap')
    const gsap = gmod.gsap
    const els = gsap.utils.toArray('[data-hero]', root.value)
    introTl = gsap.timeline({ delay: 0.2 })
    els.forEach((el, i) => {
      introTl.fromTo(el,
        { opacity: 0, y: 44 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        i * 0.12
      )
    })
    typeRole()
  } else {
    typed.value = p.roles[0]
    root.value.querySelectorAll('[data-hero]').forEach((el) => {
      el.style.opacity = '1'
    })
  }

  // Defer 3D init so the text intro paints smoothly on first load.
  window.setTimeout(async () => {
    const { createHeroScene } = await import('../three/heroScene.js')
    destroyScene = createHeroScene(canvas.value)
  }, reduced ? 0 : 400)
})

onBeforeUnmount(() => {
  if (destroyScene) destroyScene()
  if (typedTimer) clearTimeout(typedTimer)
  if (introTl) introTl.kill()
})
</script>

<template>
  <section id="top" class="hero" ref="root">
    <div class="hero-canvas"><canvas ref="canvas"></canvas></div>

    <div class="hero-content">
      <span class="hero-kicker" data-hero style="opacity: 0">
        <span class="live"></span>
        Available for AI / ML opportunities
      </span>

      <h1 class="hero-title" data-hero style="opacity: 0">
        <span class="line">{{ p.first }}</span>
        <span class="line text-gradient">{{ p.last }}</span>
      </h1>

      <p class="hero-role" data-hero style="opacity: 0">
        {{ typed }}<span class="cursor">_</span>
      </p>

      <p class="hero-sub" data-hero style="opacity: 0">
        {{ p.tagline }}
      </p>

      <div class="hero-cta" data-hero style="opacity: 0">
        <a href="#projects" class="btn btn-primary">View Work</a>
        <a href="mailto:bakkeraganesh@gmail.com" class="btn btn-ghost">Get in Touch</a>
      </div>
    </div>

    <div class="hero-scroll">
      <span>Scroll</span>
      <span class="wheel"></span>
    </div>
  </section>
</template>
