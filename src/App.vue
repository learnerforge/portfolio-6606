<script setup>
import { defineAsyncComponent, onMounted, onBeforeUnmount } from 'vue'
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

const AiAssistant = defineAsyncComponent(() => import('./components/AiAssistant.vue'))

let gsap
let ScrollTrigger

onMounted(async () => {
  const gmod = await import('gsap')
  const stmod = await import('gsap/ScrollTrigger')
  gsap = gmod.gsap
  ScrollTrigger = stmod.ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)

  // cursor glow (bind once so dev/HMR remounts never stack listeners)
  const glow = document.querySelector('.cursor-glow')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!glow || reduced || window.matchMedia('(pointer: coarse)').matches) return
  if (!window.__glowBound) {
    window.__glowBound = true
    const onMove = (e) => {
      glow.style.setProperty('--mx', `${e.clientX}px`)
      glow.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.__glowCleanup = () => window.removeEventListener('mousemove', onMove)
  }

  // scroll progress bar (create once)
  const bar = document.querySelector('.scroll-progress')
  if (bar && !bar.__gsapBound) {
    bar.__gsapBound = true
    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.4 }
    })
  }
})

onBeforeUnmount(() => {
  if (window.__glowCleanup) window.__glowCleanup()
  document.body.style.overflow = ''
})
</script>

<template>
  <div>
    <div class="cursor-glow"></div>
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
  transform-origin: 0 50%;
  transform: scaleX(0);
  z-index: 200;
}
</style>
