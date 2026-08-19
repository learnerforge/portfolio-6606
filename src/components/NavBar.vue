<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { portfolio } from '../data/portfolio.js'
import IconSet from './IconSet.vue'

const p = portfolio.profile
const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(p.email)}&su=${encodeURIComponent('Hello Ganesh — from your portfolio')}`
const sections = [
  { id: 'about', label: 'About', num: '01' },
  { id: 'experience', label: 'Experience', num: '02' },
  { id: 'projects', label: 'Projects', num: '03' },
  { id: 'skills', label: 'Skills', num: '04' },
  { id: 'contact', label: 'Contact', num: '05' }
]

const scrolled = ref(false)
const open = ref(false)
const active = ref('')

let spyIo = null
let mq = null
let scrollCleanup = null
let scrollRaf = null

function onScroll() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = null
    scrolled.value = window.scrollY > 30
  })
}

function toggle() {
  open.value = !open.value
}

function go() {
  open.value = false
  document.body.style.overflow = ''
}

// Lock body scroll while the mobile menu is open
watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // scroll-spy: mark the section crossing the middle of the viewport
  if ('IntersectionObserver' in window) {
    spyIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) active.value = e.target.id
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) spyIo.observe(el)
    })
  }

  // close the mobile menu when resized up to desktop
  mq = window.matchMedia('(min-width: 901px)')
  const onMq = (e) => {
    if (e.matches) open.value = false
  }
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', onMq)
    scrollCleanup = () => mq.removeEventListener('change', onMq)
  } else {
    mq.addListener(onMq)
    scrollCleanup = () => mq.removeListener(onMq)
  }
})

onBeforeUnmount(() => {
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  window.removeEventListener('scroll', onScroll)
  if (spyIo) spyIo.disconnect()
  if (scrollCleanup) scrollCleanup()
  document.body.style.overflow = ''
})
</script>

<template>
  <nav class="nav" :class="{ scrolled }">
    <div class="nav-inner">
      <a class="nav-logo" href="#top">
        <span class="glyph">{{ p.monogram }}</span>
        <span>BAKKERA<span class="text-gradient">.DEV</span></span>
      </a>

      <div class="nav-links" v-if="!open">
        <a
          v-for="s in sections"
          :key="s.id"
          :href="`#${s.id}`"
          :class="{ active: active === s.id }"
        >{{ s.label }}</a>
        <a :href="emailUrl" target="_blank" rel="noopener" class="btn btn-ghost nav-cta">Hire Me</a>
      </div>

      <button class="nav-burger" :class="{ active: open }" @click="toggle" aria-label="Menu">
        <span></span><span></span>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="menu">
        <div v-if="open" class="nav-menu">
          <div class="menu-label font-mono">// NAVIGATION</div>
          <a
            v-for="s in sections"
            :key="s.id"
            :href="`#${s.id}`"
            :class="{ active: active === s.id }"
            @click="go()"
          >
            <span class="menu-num">{{ s.num }}</span>{{ s.label }}
          </a>
          <div class="menu-divider"></div>
          <a class="menu-cta" :href="emailUrl" target="_blank" rel="noopener" @click="go()">
            <IconSet name="mail" :size="15" />Hire Me
          </a>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<style scoped>
/* ---- consistent row height across logo / links / CTA / burger ---- */
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px clamp(20px, 5vw, 48px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.nav-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.1em;
  line-height: 1;
  color: var(--text);
  text-decoration: none;
}
.nav-logo .glyph {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--grad);
  color: #07070c;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 26px;
}
.nav-links a {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  line-height: 1;
  color: var(--text-dim);
  text-decoration: none;
  text-transform: uppercase;
  position: relative;
  padding: 6px 0;
  transition: color 0.3s ease;
}
.nav-links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 4px;
  width: 0;
  height: 1px;
  background: var(--grad);
  transition: width 0.35s ease;
}
.nav-links a:hover,
.nav-links a.active { color: var(--text); }
.nav-links a:hover::after,
.nav-links a.active::after { width: 100%; }

/* compact CTA so it matches the link row height */
.nav-cta {
  padding: 10px 18px;
  font-size: 11px;
  line-height: 1;
  margin-left: 6px;
  white-space: nowrap;
}
@media (pointer: coarse) {
  .nav-cta { min-height: 44px; padding: 12px 18px; }
}

/* burger matches the 34px row so nav height stays constant across breakpoints */
.nav-burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line-strong);
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  padding: 0;
}
.nav-burger span {
  width: 16px;
  height: 2px;
  background: var(--text);
  margin: 0 auto;
  border-radius: 2px;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.nav-burger.active span:first-child { transform: translateY(3.5px) rotate(45deg); }
.nav-burger.active span:last-child { transform: translateY(-3.5px) rotate(-45deg); }

/* ---- mobile menu ---- */
.nav-menu {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: rgba(7, 7, 12, 0.97);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 80px 24px 40px;
  overflow-y: auto;
}
.menu-label {
  font-size: 10px;
  letter-spacing: 0.4em;
  color: var(--text-faint);
  margin-bottom: 18px;
}
.nav-menu a {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 6vw, 2rem);
  font-weight: 600;
  color: var(--text-dim);
  text-decoration: none;
  padding: 8px 16px;
  display: inline-flex;
  align-items: baseline;
  gap: 12px;
  transition: color 0.3s ease, transform 0.3s ease;
}
.nav-menu a:hover,
.nav-menu a.active { color: var(--text); transform: translateX(6px); }
.menu-num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--cyan);
  letter-spacing: 0.1em;
}
.menu-divider {
  width: 120px;
  height: 1px;
  background: var(--line-strong);
  margin: 20px 0;
}
.menu-cta {
  font-family: var(--font-mono) !important;
  font-size: 12px !important;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text) !important;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  margin-top: 6px;
}
.menu-cta:hover { border-color: var(--cyan); }

.menu-enter-active, .menu-leave-active { transition: opacity 0.3s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .nav-links { display: none; }
  .nav-burger { display: flex; }
}
</style>
