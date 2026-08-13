<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import IconSet from './IconSet.vue'

const props = defineProps({ project: { type: Object, required: true } })
const emit = defineEmits(['close'])
const root = ref(null)

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))

function onBackdrop(e) {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      ref="root"
      class="modal-overlay"
      tabindex="-1"
      @keydown.esc="emit('close')"
      @click.self="onBackdrop"
    >
      <div class="modal">
        <button class="modal-close" @click="emit('close')" aria-label="Close"><IconSet name="close" :size="15" /></button>

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
          <button class="btn btn-ghost" @click="emit('close')">Close</button>
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
  border: 1px solid var(--line-strong);
  background: var(--panel);
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  display: grid;
  place-items: center;
}
.modal-close:hover { color: #07070c; background: var(--grad); border-color: transparent; }
.modal-tags { display: flex; gap: 10px; margin-bottom: 18px; }
.modal-title { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 600; letter-spacing: -0.02em; }
.modal-subtitle { color: var(--cyan); font-family: var(--font-mono); font-size: 13px; margin-top: 8px; letter-spacing: 0.12em; }
.modal-lead { color: var(--text-dim); margin: 24px 0; line-height: 1.8; }
.modal-section { margin-bottom: 24px; }
.modal-head {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 10px;
}
.modal-text { color: var(--text-dim); line-height: 1.7; }
.modal-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.modal-list li { color: var(--text-dim); display: flex; gap: 12px; align-items: baseline; }
.list-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--grad); flex-shrink: 0; transform: translateY(-1px);
}
.modal-stack {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.02);
}
.modal-actions { display: flex; gap: 14px; margin-top: 30px; flex-wrap: wrap; }
</style>
