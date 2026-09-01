<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import IconSet from './IconSet.vue'

const props = defineProps({ project: { type: Object, required: true } })
const emit = defineEmits(['close'])
const root = ref(null)
const dialog = ref(null)
let previousFocus = null

function close() {
  emit('close')
  if (previousFocus && previousFocus.focus) previousFocus.focus()
}

function onKey(e) {
  if (e.key === 'Escape') close()
  if (e.key === 'Tab') {
    const focusables = Array.from(
      dialog.value.querySelectorAll('a[href], button:not([disabled])')
    )
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}
onMounted(() => {
  previousFocus = document.activeElement
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKey)
  nextTick(() => dialog.value && dialog.value.focus())
})
onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKey)
})

function onBackdrop(e) {
  if (e.target === e.currentTarget) close()
}
</script>

<template>
  <Teleport to="body">
    <div
      ref="root"
      class="modal-overlay"
      tabindex="-1"
      @click.self="onBackdrop"
    >
      <div
        ref="dialog"
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Case study: {{ project.title }}"
        tabindex="0"
      >
        <button class="modal-close" @click="close" aria-label="Close"><IconSet name="close" :size="15" /></button>

        <div class="modal-tags">
          <span v-if="project.flagship" class="tag tag-hl"><IconSet name="sparkles" :size="12" />FLAGSHIP</span>
          <span class="tag">{{ project.num }}</span>
        </div>

        <h3 class="modal-title font-display">{{ project.title }}</h3>
        <div class="modal-subtitle">{{ project.subtitle }}</div>

        <p class="modal-lead">{{ project.longDescription }}</p>

        <div class="modal-section">
          <h4 class="modal-head">The problem</h4>
          <p class="modal-text">{{ project.problem }}</p>
        </div>

        <div class="modal-section">
          <h4 class="modal-head">The solution</h4>
          <p class="modal-text">{{ project.solution }}</p>
        </div>

        <div class="modal-section">
          <h4 class="modal-head">Highlights</h4>
          <ul class="modal-list">
            <li v-for="f in project.features" :key="f"><span class="list-dot"></span>{{ f }}</li>
          </ul>
        </div>

        <div class="modal-section">
          <h4 class="modal-head">Stack</h4>
          <p class="modal-stack">{{ project.stack }}</p>
        </div>

        <div class="modal-actions">
          <a :href="project.github" target="_blank" rel="noopener" class="btn btn-primary"><IconSet name="github" :size="15" />View on GitHub</a>
          <button class="btn btn-ghost" @click="close">Close</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--fill-sunken);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
  z-index: 2;
  display: grid;
  place-items: center;
}
.modal-close:hover { background: var(--fill-hover); color: var(--accent); }
.modal-tags { display: flex; gap: 10px; margin-bottom: 18px; }
.modal-title { font-size: clamp(2rem, 5vw, 2.75rem); font-weight: var(--fw-semibold); letter-spacing: -0.02em; }
.modal-subtitle { color: var(--accent); font-size: 13px; margin-top: 8px; letter-spacing: 0.02em; }
.modal-lead { color: var(--text-secondary); margin: 24px 0; line-height: 1.8; }
.modal-section { margin-bottom: 24px; }
.modal-head {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: var(--fw-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: 10px;
}
.modal-text { color: var(--text-secondary); line-height: 1.7; }
.modal-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.modal-list li { color: var(--text-secondary); display: flex; gap: 12px; align-items: baseline; }
.list-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent); flex-shrink: 0; transform: translateY(-1px);
}
.modal-stack {
  font-size: 13px;
  color: var(--text-primary);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  padding: 14px 18px;
  background: var(--fill-sunken);
}
.modal-actions { display: flex; gap: 14px; margin-top: 30px; flex-wrap: wrap; }
</style>
