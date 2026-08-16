<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import IconSet from './IconSet.vue'
import { ask, SUGGESTIONS } from '../ai/assistant.js'
import { portfolio } from '../data/portfolio.js'

const open = ref(false)
const typing = ref(false)
const input = ref('')
const field = ref(null)
const list = ref(null)
let timer = null

const messages = ref([
  {
    role: 'ai',
    text: `Hi, I'm ${portfolio.profile.name.split(' ')[0]}'s portfolio assistant. Ask about his experience, skills, projects and education — or say "show projects" and I'll take you straight there.`
  }
])

function scrollBottom() {
  nextTick(() => {
    const el = list.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function execAction(action) {
  if (!action) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (action.type === 'goto') {
    const el = document.getElementById(action.id)
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  } else if (action.type === 'mailto') {
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(portfolio.profile.email)}&su=${encodeURIComponent('Hello Ganesh — from your portfolio')}`,
      '_blank',
      'noopener'
    )
  } else if (action.type === 'link') {
    window.open(action.url, '_blank', 'noopener')
  }
}

function send(raw) {
  const text = (raw ?? input.value).trim()
  if (!text || typing.value) return
  input.value = ''
  messages.value.push({ role: 'user', text })
  typing.value = true
  scrollBottom()
  timer = window.setTimeout(() => {
    typing.value = false
    const res = ask(text)
    messages.value.push({ role: 'ai', text: res.text })
    scrollBottom()
    execAction(res.action)
  }, 500 + Math.random() * 300)
}

watch(open, (v) => {
  if (v) {
    nextTick(() => field.value && field.value.focus())
  }
})

function onKey(e) {
  if (e.key === 'Escape' && open.value) open.value = false
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  if (timer) window.clearTimeout(timer)
})
</script>

<template>
  <Teleport to="body">
    <div class="ai-assistant">
      <Transition name="ai-panel">
        <div v-if="open" class="ai-panel" role="dialog" aria-label="Portfolio AI assistant">
          <div class="ai-head">
            <div class="ai-avatar"><IconSet name="sparkles" :size="15" /></div>
            <div class="ai-head-text">
              <div class="ai-title font-display">Portfolio Assistant</div>
              <div class="ai-status font-mono"><span class="ai-live"></span>online — knows his full profile</div>
            </div>
            <button class="ai-close" @click="open = false" aria-label="Close assistant">
              <IconSet name="close" :size="14" />
            </button>
          </div>

          <div class="ai-body" ref="list">
            <div v-for="(m, i) in messages" :key="i" class="ai-msg" :class="m.role">
              <div class="ai-bubble">{{ m.text }}</div>
            </div>
            <div v-if="typing" class="ai-msg ai">
              <div class="ai-bubble ai-typing"><span></span><span></span><span></span></div>
            </div>
          </div>

          <div v-if="messages.length <= 1" class="ai-suggest">
            <button v-for="s in SUGGESTIONS" :key="s" class="ai-chip" @click="send(s)">{{ s }}</button>
          </div>

          <form class="ai-input" @submit.prevent="send()">
            <input
              ref="field"
              v-model="input"
              type="text"
              placeholder="Ask anything…"
              aria-label="Ask the assistant"
              autocomplete="off"
            />
            <button class="ai-send" type="submit" aria-label="Send" :disabled="typing">
              <span v-if="typing" class="spinner"></span>
              <IconSet v-else name="arrow-right" :size="16" />
            </button>
          </form>
        </div>
      </Transition>

      <button class="ai-fab" :class="{ active: open }" @click="open = !open" :aria-label="open ? 'Close assistant' : 'Open AI assistant'">
        <span class="ai-fab-icon"><IconSet name="sparkles" :size="20" /></span>
        <span class="ai-fab-dot"></span>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-assistant { position: fixed; z-index: 130; right: 24px; bottom: 24px; }

/* ---- panel ---- */
.ai-panel {
  position: absolute;
  right: 0;
  bottom: 68px;
  width: min(380px, calc(100vw - 32px));
  height: min(540px, calc(100dvh - 120px));
  display: flex;
  flex-direction: column;
  background: var(--panel);
  border: 1px solid var(--line-strong);
  border-radius: 18px;
  box-shadow: 0 24px 80px -20px rgba(0, 0, 0, 0.75);
  overflow: hidden;
}

.ai-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.02);
}
.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: var(--grad);
  color: #07070c;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ai-head-text { flex: 1; min-width: 0; }
.ai-title { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; }
.ai-status {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-faint);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
}
.ai-live {
  width: 6px; height: 6px; border-radius: 50%;
  background: #34d399;
  animation: ai-pulse 2.4s ease-in-out infinite;
}
.ai-close {
  width: 30px; height: 30px;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.3s ease;
}
.ai-close:hover { color: #07070c; background: var(--grad); border-color: transparent; }

.ai-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ai-msg { display: flex; }
.ai-msg.user { justify-content: flex-end; }
.ai-msg.ai { justify-content: flex-start; }
.ai-bubble {
  max-width: 86%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.55;
  white-space: pre-line;
  word-break: break-word;
}
.ai-msg.ai .ai-bubble {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  color: var(--text);
  border-bottom-left-radius: 4px;
}
.ai-msg.user .ai-bubble {
  background: var(--grad);
  color: #07070c;
  border-bottom-right-radius: 4px;
}
.ai-typing { display: inline-flex; gap: 5px; padding: 14px 16px; align-items: center; }
.ai-typing span {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--text-dim);
  animation: ai-bounce 1.2s ease-in-out infinite;
}
.ai-typing span:nth-child(2) { animation-delay: 0.15s; }
.ai-typing span:nth-child(3) { animation-delay: 0.3s; }

.ai-suggest {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 14px 12px;
}
.ai-chip {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--text-dim);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 7px 12px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.ai-chip:hover {
  color: var(--cyan);
  border-color: rgba(34, 211, 238, 0.5);
  background: rgba(34, 211, 238, 0.08);
}

.ai-input {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-top: 1px solid var(--line);
}
.ai-input input {
  flex: 1;
  min-width: 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 11px 16px;
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 12px;
  outline: none;
  transition: border-color 0.25s ease;
}
.ai-input input:focus { border-color: rgba(34, 211, 238, 0.5); }
.ai-input input::placeholder { color: var(--text-faint); }
.ai-send {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--grad);
  color: #07070c;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.ai-send:hover { transform: translateY(-2px); box-shadow: 0 8px 24px -8px rgba(34, 211, 238, 0.6); }
.ai-send:disabled { opacity: 0.75; cursor: default; transform: none; box-shadow: none; }

/* ---- floating button ---- */
.ai-fab {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--grad);
  color: #07070c;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: 0 14px 40px -12px rgba(139, 92, 246, 0.7);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
}
.ai-fab:hover { transform: translateY(-3px) scale(1.04); }
.ai-fab.active { transform: rotate(180deg) scale(0.94); }
.ai-fab-dot {
  position: absolute;
  top: 4px;
  right: 5px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #34d399;
  border: 2px solid #0b0b14;
  animation: ai-pulse 2.4s ease-in-out infinite;
}

@keyframes ai-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.45); }
  50% { box-shadow: 0 0 0 5px rgba(52, 211, 153, 0); }
}
@keyframes ai-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}

.ai-panel-enter-active, .ai-panel-leave-active { transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.ai-panel-enter-from, .ai-panel-leave-to { opacity: 0; transform: translateY(12px) scale(0.97); }

@media (max-width: 768px) {
  .ai-assistant { right: 16px; bottom: 78px; }
  .ai-panel { bottom: 86px; }
}
@media (max-width: 480px) {
  .ai-assistant { right: 12px; }
}
</style>
