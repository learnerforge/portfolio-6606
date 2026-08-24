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
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

let scrollRaf = null
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
  if (window.__glowCleanup) window.__glowCleanup()
  if (onScroll) window.removeEventListener('scroll', onScroll)
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
  transform-origin: 0 50%;
  transform: scaleX(0);
  z-index: 200;
}

.back-top {
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: 110;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  background: rgba(248, 249, 252, 0.92);
  color: var(--text-dim);
  cursor: pointer;
  display: grid;
  place-items: center;
  opacity: 0;
  transform: translateY(14px);
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.back-top:hover {
  color: var(--cyan);
  border-color: rgba(8, 145, 178, 0.5);
  transform: translateY(-2px);
}
.back-top.show { opacity: 1; transform: translateY(0); pointer-events: auto; }

@media (max-width: 768px) {
  .back-top { display: none; }
}
</style>
