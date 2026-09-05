<script setup>
import { defineAsyncComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import MarqueeStrip from './components/MarqueeStrip.vue'
import AboutSection from './components/AboutSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import EducationSection from './components/EducationSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ExpertiseSection from './components/ExpertiseSection.vue'
import AchievementsSection from './components/AchievementsSection.vue'
import CertificationsSection from './components/CertificationsSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ContactSection from './components/ContactSection.vue'
import Footer from './components/Footer.vue'
import FloatingDock from './components/FloatingDock.vue'
import IconSet from './components/IconSet.vue'
import { portfolio } from './data/portfolio.js'
import { useSmoothScroll, scrollToTarget } from './composables/useSmoothScroll.js'
import { useCursor } from './composables/useCursor.js'

const AiAssistant = defineAsyncComponent(() => import('./components/AiAssistant.vue'))

const dockItems = [
  { icon: 'home', label: 'Home', href: '#top' },
  { icon: 'user', label: 'About', href: '#about' },
  { icon: 'briefcase', label: 'Experience', href: '#experience' },
  { icon: 'rocket', label: 'Projects', href: '#projects' },
  { icon: 'cpu', label: 'Expertise', href: '#expertise' },
  { icon: 'award', label: 'Achievements', href: '#achievements' },
  { icon: 'check-circle', label: 'Credentials', href: '#certifications' },
  { icon: 'terminal', label: 'Toolbox', href: '#skills' },
  { icon: 'send', label: 'Contact', href: '#contact' },
  { icon: 'github', label: 'GitHub', href: portfolio.profile.github }
]

let gsap
let ScrollTrigger
let progressST = null

const showTop = ref(false)
let onScroll = null
const toTop = () => {
  scrollToTarget(0, { offset: 0 })
}

let scrollRaf = null
let smoothCleanup = null
let cursorCleanup = null
let magneticCleanup = null

function initMagnetic() {
  if (!gsap) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const fine = window.matchMedia('(pointer: fine)').matches
  if (reduced || !fine) return

  const cleanups = gsap.utils.toArray('.btn, .pill-btn').map((b) => {
    const dx = gsap.quickTo(b, 'x', { duration: 0.4, ease: 'power3.out' })
    const dy = gsap.quickTo(b, 'y', { duration: 0.4, ease: 'power3.out' })
    const onMove = (e) => {
      const r = b.getBoundingClientRect()
      dx((e.clientX - (r.left + r.width / 2)) * 0.32)
      dy((e.clientY - (r.top + r.height / 2)) * 0.32)
    }
    const onLeave = () => {
      dx(0)
      dy(0)
    }
    b.addEventListener('mousemove', onMove)
    b.addEventListener('mouseleave', onLeave)
    return () => {
      b.removeEventListener('mousemove', onMove)
      b.removeEventListener('mouseleave', onLeave)
      gsap.set(b, { x: 0, y: 0 })
    }
  })
  magneticCleanup = () => cleanups.forEach((fn) => fn())
}

onMounted(async () => {
  onScroll = () => {
    if (scrollRaf) return
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = null
      showTop.value = window.scrollY > 560
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  const gmod = await import('gsap')
  const stmod = await import('gsap/ScrollTrigger')
  gsap = gmod.gsap
  ScrollTrigger = stmod.ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)

  smoothCleanup = (await useSmoothScroll()) || undefined
  cursorCleanup = useCursor() || undefined
  initMagnetic()

  // scroll progress bar (create once)
  const bar = document.querySelector('.scroll-progress')
  if (bar && !bar.__gsapBound) {
    bar.__gsapBound = true
    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.4 }
    })
    progressST = tween.scrollTrigger
  }
})

onBeforeUnmount(() => {
  if (progressST) progressST.kill()
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  if (onScroll) window.removeEventListener('scroll', onScroll)
  if (magneticCleanup) magneticCleanup()
  if (cursorCleanup) cursorCleanup()
  if (smoothCleanup) smoothCleanup()
  document.body.style.overflow = ''
})
</script>

<template>
  <div>
    <div class="aurora" aria-hidden="true">
      <span class="orb orb-a"></span>
      <span class="orb orb-b"></span>
      <span class="orb orb-c"></span>
    </div>
    <div class="grain" aria-hidden="true"></div>

    <div class="scroll-progress"></div>

    <NavBar />
    <main>
      <HeroSection />
      <MarqueeStrip />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <ExpertiseSection />
      <AchievementsSection />
      <CertificationsSection />
      <SkillsSection />
      <ContactSection />
    </main>
    <Footer />
    <FloatingDock :items="dockItems" />
    <button class="back-top" :class="{ show: showTop }" @click="toTop" aria-label="Back to top">
      <IconSet name="chevron-up" :size="16" />
    </button>
    <AiAssistant />
  </div>
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--grad);
  box-shadow: 0 0 12px var(--glow);
  transform-origin: 0 50%;
  transform: scaleX(0);
  z-index: var(--z-progress);
}

.back-top {
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: var(--z-backtop);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--canvas-raised);
  box-shadow: var(--shadow-sm);
  color: var(--text-secondary);
  cursor: pointer;
  display: grid;
  place-items: center;
  opacity: 0;
  transform: translateY(14px);
  pointer-events: none;
  transition: opacity var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
}
.back-top:hover {
  color: var(--accent);
  box-shadow: var(--shadow-md);
  transform: translateY(0);
}
.back-top.show { opacity: 1; transform: translateY(0); pointer-events: auto; }

@media (max-width: 768px) {
  .back-top { display: none; }
}
</style>
