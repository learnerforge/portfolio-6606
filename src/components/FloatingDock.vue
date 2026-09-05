<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import IconSet from './IconSet.vue'
import { scrollToTarget } from '../composables/useSmoothScroll.js'

/**
 * FloatingDock — macOS-style dock port (Aceternity UI pattern).
 *
 * Desktop: floating pill bottom-center; icons magnify toward the cursor,
 * tooltips label each item, and a scroll-spy highlights the active section.
 * Mobile (<768px): becomes a full-width bottom tab bar (always visible).
 */
const props = defineProps({
  items: { type: Array, required: true } // { icon, label, href }
})

const el = ref(null)
const itemEls = ref([])
const mouseX = ref(null)
const show = ref(false)
const active = ref(props.items[0].href)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const mobile = window.matchMedia('(max-width: 768px)')

function onMove(e) {
  mouseX.value = e.clientX - el.value.getBoundingClientRect().left
}
function onLeave() {
  mouseX.value = null
}

function itemStyle(i) {
  if (reduced || mouseX.value == null) return {}
  const node = itemEls.value[i]
  if (!node) return {}
  const center = node.offsetLeft + node.offsetWidth / 2
  const dist = Math.abs(mouseX.value - center)
  const scale = Math.max(1, 1.3 - dist * 0.0018)
  return { transform: `scale(${scale.toFixed(3)})`, zIndex: Math.round(scale * 10) }
}

function go(href) {
  if (href.startsWith('#')) {
    scrollToTarget(href)
  } else {
    window.open(href, '_blank', 'noopener')
  }
}

let raf = null
function updateActive() {
  raf = null
  const m = window.scrollY + window.innerHeight * 0.4
  let id = props.items[0].href
  for (const it of props.items) {
    if (!it.href.startsWith('#')) continue
    const sec = document.getElementById(it.href.slice(1))
    if (sec && sec.offsetTop <= m) id = it.href
  }
  if (id !== active.value) active.value = id
  const shouldShow = mobile.matches || window.scrollY > 260
  if (shouldShow !== show.value) show.value = shouldShow
}

const onScroll = () => {
  if (raf) return
  raf = requestAnimationFrame(updateActive)
}
const onMobileChange = () => updateActive()

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  mobile.addEventListener('change', onMobileChange)
  updateActive()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  mobile.removeEventListener('change', onMobileChange)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div
    class="dock"
    :class="{ show }"
    ref="el"
    @mousemove="onMove"
    @mouseleave="onLeave"
    role="navigation"
    aria-label="Floating navigation"
  >
    <div class="dock-inner">
      <div
        v-for="(item, i) in items"
        :key="item.href"
        class="dock-item"
        :class="{ active: active === item.href }"
        :style="[itemStyle(i), { animationDelay: `${0.25 + i * 0.04}s` }]"
        ref="itemEls"
      >
        <button class="dock-btn" type="button" :aria-label="item.label" @click="go(item.href)">
          <span class="dock-tip">{{ item.label }}</span>
          <IconSet :name="item.icon" :size="20" />
        </button>
        <span class="dock-dot" aria-hidden="true"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dock {
  position: fixed;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%) translateY(18px);
  z-index: var(--z-dock);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.dock.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}

.dock-inner {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 999px;
  background: var(--nav-material);
  -webkit-backdrop-filter: blur(var(--blur-nav)) saturate(var(--material-sat));
  backdrop-filter: blur(var(--blur-nav)) saturate(var(--material-sat));
  border: 1px solid var(--hairline);
  box-shadow: var(--shadow-md);
}

.dock-item {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--text-secondary);
  animation: dock-in 0.5s var(--ease-spring) backwards;
  transition: transform 0.16s var(--ease-spring), color 0.25s ease, background 0.25s ease;
}
@keyframes dock-in {
  from { opacity: 0; transform: translateY(14px) scale(0.4); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.dock-btn {
  background: none;
  border: none;
  padding: 0;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: inherit;
  cursor: pointer;
  border-radius: 14px;
  transition: background 0.25s ease, color 0.25s ease;
}
.dock-btn:hover { color: var(--text-primary); background: var(--fill-hover); }
.dock-item.active { color: var(--accent); }
.dock-item.active .dock-btn { background: var(--accent-tint); }

.dock-dot {
  position: absolute;
  bottom: 3px;
  left: 50%;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 50%;
  background: transparent;
  transition: background 0.25s ease;
}
.dock-item.active .dock-dot { background: var(--accent); }

.dock-tip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  opacity: 0;
  pointer-events: none;
  background: var(--canvas-raised);
  border: 1px solid var(--hairline);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 6px 11px;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
  transition: opacity 0.2s ease, transform 0.2s var(--ease-out);
  z-index: 5;
}
.dock-item:hover .dock-tip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 768px) {
  .dock, .dock.show {
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    transform: none;
    opacity: 1;
    pointer-events: auto;
  }
  .dock-inner {
    width: 100%;
    justify-content: space-around;
    gap: 2px;
    padding: 8px 8px calc(8px + env(safe-area-inset-bottom, 0px));
    border-radius: 0;
    border: none;
    border-top: 1px solid var(--hairline);
    background: var(--canvas-raised);
    box-shadow: none;
  }
  .dock-item { width: 42px; height: 42px; animation: none; }
  .dock-tip { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .dock-item { animation: none; transition: none; }
}
</style>
