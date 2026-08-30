<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { portfolio } from '../data/portfolio.js'
import { theme, themeName, toggleTheme, initTheme } from '../composables/useTheme.js'
import IconSet from './IconSet.vue'

initTheme()

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

      <button
        class="theme-toggle"
        @click="toggleTheme"
        :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
        :title="`Theme: ${themeName}`"
      >
        <IconSet :name="theme === 'dark' ? 'sun' : 'moon'" :size="15" />
      </button>

      <button class="nav-burger" :class="{ active: open }" @click="toggle" aria-label="Menu">
        <span></span><span></span>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="menu">
        <div v-if="open" class="nav-menu">
          <div class="menu-label">Navigation</div>
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
          <button class="menu-theme" @click="toggleTheme">
            <IconSet :name="theme === 'dark' ? 'sun' : 'moon'" :size="15" />
            Switch to {{ theme === 'dark' ? 'Paper (light)' : 'Nebula (dark)' }}
          </button>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<style scoped>
/* ---- consistent 52px row (material bar height driven by main.css) ---- */
.nav-inner {
  max-width: var(--content-wide);
  margin: 0 auto;
  height: var(--apple-nav-h);
  padding: 0 clamp(20px, 4vw, 44px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.nav-logo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-display);
  font-weight: var(--fw-semibold);
  font-size: 15px;
  letter-spacing: 0.03em;
  line-height: 1;
  color: var(--text-primary);
  text-decoration: none;
}
.nav-logo .glyph {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-sm);
  background: var(--fill-sunken);
  color: var(--accent);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: var(--fw-semibold);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}
.nav-links a {
  font-family: var(--font-body);
  font-size: 12px;
  letter-spacing: 0.01em;
  line-height: 1;
  color: var(--text-secondary);
  text-decoration: none;
  position: relative;
  padding: 6px 0;
  transition: color var(--duration-fast) var(--ease-out);
}
.nav-links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 2px;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-base) var(--ease-out);
}
.nav-links a:hover,
.nav-links a.active { color: var(--text-primary); }
.nav-links a:hover::after,
.nav-links a.active::after { transform: scaleX(1); }

/* compact CTA so it matches the 52px row */
.nav-cta {
  height: 32px;
  padding: 0 16px;
  font-size: 12px;
  line-height: 1;
  margin-left: 6px;
  white-space: nowrap;
}
@media (pointer: coarse) {
  .nav-cta { min-height: 44px; }
}

/* burger is 44px for touch, but the bar stays 52px */
.nav-burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
  padding: 0;
}
.nav-burger span {
  width: 16px;
  height: 2px;
  background: var(--text-primary);
  margin: 0 auto;
  border-radius: 2px;
  transition: transform var(--duration-base) var(--ease-out);
}
.nav-burger.active span:first-child { transform: translateY(3.5px) rotate(45deg); }
.nav-burger.active span:last-child { transform: translateY(-3.5px) rotate(-45deg); }

/* ---- mobile menu (Apple fullscreen sheet) ---- */
.nav-menu {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: var(--canvas-raised);
  -webkit-backdrop-filter: blur(var(--glass-blur-lg)) saturate(var(--material-sat));
  backdrop-filter: blur(var(--glass-blur-lg)) saturate(var(--material-sat));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 80px 24px 40px;
  overflow-y: auto;
}
.menu-label {
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--text-tertiary);
  margin-bottom: 18px;
  text-transform: uppercase;
}
.nav-menu a {
  font-family: var(--font-display);
  font-size: clamp(26px, 6vw, 34px);
  font-weight: var(--fw-semibold);
  letter-spacing: -0.01em;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 16px;
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
  transition: color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
}
.nav-menu a:hover,
.nav-menu a.active { color: var(--text-primary); transform: translateX(6px); }
.menu-num {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.04em;
}
.menu-divider {
  width: 120px;
  height: 1px;
  background: var(--separator);
  margin: 20px 0;
}
.menu-cta {
  height: 44px;
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 0 22px !important;
  border-radius: var(--radius-pill) !important;
  background: var(--btn-fill) !important;
  color: var(--text-on-accent) !important;
  font-family: var(--font-body) !important;
  font-size: 15px !important;
  font-weight: var(--fw-regular) !important;
  letter-spacing: 0 !important;
  border: none !important;
  margin-top: 6px;
}
.menu-cta:hover { background: var(--btn-fill-hover) !important; transform: none !important; }

.menu-theme {
  margin-top: 16px;
  height: 40px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--hairline);
  background: var(--fill-sunken);
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out),
    background var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);
}
.menu-theme:hover { color: var(--accent); background: var(--fill-hover); border-color: var(--accent-hair); }

.menu-enter-active, .menu-leave-active { transition: opacity var(--duration-base) var(--ease-out); }
.menu-enter-from, .menu-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .nav-links { display: none; }
  .nav-burger { display: flex; }
}
</style>
