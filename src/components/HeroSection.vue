<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { portfolio } from '../data/portfolio.js'
import IconSet from './IconSet.vue'

const p = portfolio.profile
const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(p.email)}&su=${encodeURIComponent('Hello Ganesh — from your portfolio')}`
const canvas = ref(null)
const root = ref(null)
let destroyScene = null
let disposed = false
let typedTimer = null
let introTl = null
let scrollTl = null
let heroSplits = null

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
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
        i * 0.12
      )
    })

    // kinetic char reveal: split each title line into chars, cascade like a type fire
    const title = root.value.querySelector('.hero-title')
    if (title) {
      const { SplitText } = await import('gsap/SplitText')
      gsap.registerPlugin(SplitText)
      heroSplits = Array.from(title.querySelectorAll('.line')).map((line) => new SplitText(line, { type: 'chars' }))
      const chars = heroSplits.flatMap((s) => s.chars || [])
      if (chars.length) {
        introTl.fromTo(
          chars,
          { y: '0.35em', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: { each: 0.03, from: 'start' }
          },
          1.1
        )
      }
    }

    const st = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(st.ScrollTrigger)
    const heroCanvas = canvas.value.closest('.hero-canvas')
    const content = root.value.querySelector('.hero-content')
    const scrollHint = root.value.querySelector('.hero-scroll')
    const isMobile = window.innerWidth <= 768
    scrollTl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true }
    })
    if (isMobile) {
      // mobile: fade only — no big transforms (avoid jank on 100svh sections)
      scrollTl.to(content, { opacity: 0.12 }, 0)
    } else {
      scrollTl
        .to(heroCanvas, { yPercent: 10 }, 0)
        .to(content, { yPercent: -8, opacity: 0.12 }, 0)
    }
    scrollTl.to(scrollHint, { opacity: 0 }, 0)

    typeRole()
  } else {
    typed.value = p.roles[0]
    root.value.querySelectorAll('[data-hero]').forEach((el) => {
      el.style.opacity = '1'
    })
  }

  // Defer 3D init so the text intro paints smoothly on first load.
  window.setTimeout(async () => {
    if (disposed) return
    const { createHeroScene } = await import('../three/heroScene.js')
    if (disposed) return
    destroyScene = createHeroScene(canvas.value)
  }, reduced ? 0 : 400)
})

onBeforeUnmount(() => {
  disposed = true
  if (heroSplits) {
    heroSplits.forEach((s) => s.revert())
    heroSplits = null
  }
  if (destroyScene) destroyScene()
  if (typedTimer) clearTimeout(typedTimer)
  if (introTl) introTl.kill()
  if (scrollTl) {
    scrollTl.scrollTrigger && scrollTl.scrollTrigger.kill()
    scrollTl.kill()
  }
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
        <a href="#projects" class="btn">View Work <IconSet name="arrow-up-right" :size="15" /></a>
        <a :href="emailUrl" target="_blank" rel="noopener" class="btn btn-ghost">Get in Touch <IconSet name="arrow-right" :size="15" /></a>
      </div>
    </div>

    <div class="hero-scroll">
      <span>Scroll</span>
      <span class="wheel"></span>
    </div>
  </section>
</template>
