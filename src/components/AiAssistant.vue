<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import IconSet from './IconSet.vue'
import { ask, SUGGESTIONS } from '../ai/assistant.js'
import { portfolio } from '../data/portfolio.js'
import { theme, themeName, setTheme, initTheme } from '../composables/useTheme.js'
import { scrollToTarget } from '../composables/useSmoothScroll.js'

initTheme()

const statusText = computed(() =>
  `online — theme: ${themeName.value} (${theme.value})`
)

const open = ref(false)
const typing = ref(false)
const input = ref('')
const field = ref(null)
const list = ref(null)
const fab = ref(null)
let timer = null

// ---- interaction logging (console + localStorage) ----
const LOG_KEY = 'portfolio-ai.logs'
const LOG_MAX = 300
const SESSION = Math.random().toString(36).slice(2, 10)

function logEntry(entry) {
  const e = { t: Date.now(), s: SESSION, v: 1, ...entry }
  if (import.meta.env.DEV) console.debug(`%c[AI]${e.i ? ` ${e.i}` : ''}`, 'color:#7c3aed', e.q ? `"${e.q}"` : '', e.a ? `→ ${e.a}` : '')
  try {
    let list = JSON.parse(localStorage.getItem(LOG_KEY) || '[]')
    if (!Array.isArray(list)) list = []
    list.push(e)
    if (list.length > LOG_MAX) list.splice(0, list.length - LOG_MAX)
    localStorage.setItem(LOG_KEY, JSON.stringify(list))
  } catch (err) { /* storage unavailable — logs are best-effort */ }
}

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
  if (action.type === 'goto') {
    scrollToTarget(action.id)
  } else if (action.type === 'mailto') {
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(portfolio.profile.email)}&su=${encodeURIComponent('Hello Ganesh — from your portfolio')}`,
      '_blank',
      'noopener'
    )
  } else if (action.type === 'link') {
    window.open(action.url, '_blank', 'noopener')
  } else if (action.type === 'theme') {
    setTheme(action.theme)
  }
}

function onThemeChip() {
  send(theme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')
}

function send(raw) {
  const text = (raw ?? input.value).trim()
  if (!text || typing.value) return
  input.value = ''
  messages.value.push({ role: 'user', text })
  typing.value = true
  scrollBottom()
  logEntry({ q: text })
  timer = window.setTimeout(() => {
    typing.value = false
    const res = ask(text)
    messages.value.push({ role: 'ai', text: res.text })
    scrollBottom()
    logEntry({ i: res.intent, a: res.action ? res.action.type : null })
    execAction(res.action)
  }, 500 + Math.random() * 300)
}

watch(open, (v) => {
  logEntry({ i: v ? 'open' : 'close' })
  if (v) {
    nextTick(() => field.value && field.value.focus())
  } else {
    nextTick(() => fab.value && fab.value.focus())
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
              <div class="ai-status" :title="`Theme: ${themeName} (${theme})`"><span class="ai-live"></span>{{ statusText }}</div>
            </div>
            <button class="ai-close" @click="open = false" aria-label="Close assistant">
              <IconSet name="close" :size="14" />
            </button>
          </div>

          <transition-group name="message" tag="div" class="ai-body" ref="list">
            <div v-for="(m, i) in messages" :key="'msg-'+i" class="ai-msg" :class="m.role">
              <div class="ai-bubble">{{ m.text }}</div>
            </div>
            <div v-if="typing" key="typing" class="ai-msg ai">
              <div class="ai-bubble ai-typing"><span></span><span></span><span></span></div>
            </div>
          </transition-group>

          <div v-if="messages.length <= 1" class="ai-suggest">
            <button v-for="s in SUGGESTIONS" :key="s" class="ai-chip" @click="send(s)">{{ s }}</button>
            <button class="ai-chip" @click="onThemeChip">
              Switch to {{ theme === 'dark' ? 'light' : 'dark' }} theme
            </button>
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

      <button
        ref="fab"
        class="ai-fab"
        :class="{ active: open }"
        @click="open = !open"
        :aria-label="open ? 'Close assistant' : 'Open AI assistant'"
      >
        <span class="ai-fab-icon"><IconSet name="sparkles" :size="20" /></span>
        <span class="ai-fab-dot"></span>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-assistant { position: fixed; z-index: var(--z-ai); right: 24px; bottom: 24px; }

/* ---- panel (HIG material) ---- */
.ai-panel {
  position: absolute;
  right: 0;
  bottom: 72px;
  width: min(380px, calc(100vw - 32px));
  height: min(540px, calc(100dvh - 120px));
  display: flex;
  flex-direction: column;
  background: var(--canvas-raised);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.ai-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--hairline);
  background: var(--surface-card);
}
.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--btn-fill);
  color: var(--text-on-accent);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  box-shadow: 0 8px 20px -8px var(--glow);
}
.ai-head-text { flex: 1; min-width: 0; }
.ai-title { font-size: 15px; font-weight: var(--fw-semibold); letter-spacing: -0.01em; }
.ai-status {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
}
.ai-live {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--sys-green);
  animation: ai-pulse 2.4s ease-in-out infinite;
}
.ai-close {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--fill-sunken);
  color: var(--text-secondary);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
}
.ai-close:hover { background: var(--fill-hover); color: var(--accent); }

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
  border-radius: 16px;
  font-size: 13.5px;
  line-height: 1.55;
  white-space: pre-line;
  word-break: break-word;
}
.ai-msg.ai .ai-bubble {
  background: var(--fill-sunken);
  color: var(--text-primary);
  border-bottom-left-radius: 4px;
}
.ai-msg.user .ai-bubble {
  background: var(--btn-fill);
  color: var(--text-on-accent);
  border-bottom-right-radius: 4px;
}
.ai-typing { display: inline-flex; gap: 5px; padding: 14px 16px; align-items: center; }
.ai-typing span {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--text-tertiary);
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
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--canvas);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-pill);
  padding: 8px 14px;
  min-height: 36px;
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    background var(--duration-fast) var(--ease-out);
}
.ai-chip:hover {
  color: var(--accent);
  border-color: var(--accent-hair);
  background: var(--accent-tint-soft);
}

.ai-input {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-top: 1px solid var(--hairline);
  background: var(--surface-card);
}
.ai-input input {
  flex: 1;
  min-width: 0;
  background: var(--fill-sunken);
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  padding: 11px 16px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-out);
}
.ai-input input:focus { border-color: var(--accent-hair); box-shadow: 0 0 0 4px var(--accent-tint-soft); }
.ai-input input::placeholder { color: var(--text-placeholder); }
.ai-send {
  width: 44px; height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--btn-fill);
  color: var(--text-on-accent);
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: transform var(--duration-fast) var(--ease-out),
    filter var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}
.ai-send:hover { transform: translateY(-2px); filter: brightness(1.12); box-shadow: 0 10px 26px -10px var(--glow); }
.ai-send:disabled { opacity: 0.75; cursor: default; transform: none; box-shadow: none; }

/* ---- floating button ---- */
.ai-fab {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--btn-fill);
  color: var(--text-on-accent);
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: var(--shadow-md);
  transition: transform var(--duration-base) var(--ease-spring),
    filter var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}
.ai-fab:hover { filter: brightness(1.12); transform: translateY(-3px) scale(1.04); box-shadow: var(--shadow-lg); }
.ai-fab.active { transform: rotate(180deg) scale(0.94); }
.ai-fab-dot {
  position: absolute;
  top: 4px;
  right: 5px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--sys-green);
  border: 2px solid var(--canvas);
}

@keyframes ai-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.45); }
  50% { box-shadow: 0 0 0 5px rgba(52, 199, 89, 0); }
}
@keyframes ai-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}

.ai-panel-enter-active, .ai-panel-leave-active { transition: opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out); }
.ai-panel-enter-from, .ai-panel-leave-to { opacity: 0; transform: translateY(12px) scale(0.97); }

@media (max-width: 768px) {
  .ai-assistant { right: 16px; bottom: calc(78px + env(safe-area-inset-bottom, 0px)); }
  .ai-panel { bottom: calc(86px + env(safe-area-inset-bottom, 0px)); }
}
@media (max-width: 480px) {
  .ai-assistant { right: 12px; }
}

/* Message enter / leave / move animations */
.message-enter-active, .message-leave-active {
  transition: opacity var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out);
}
.message-enter-from, .message-leave-to {
  opacity: 0;
}
.ai-msg.ai.message-enter-from { transform: translateX(-12px); }
.ai-msg.user.message-enter-from { transform: translateX(12px); }
/* Smoothly slide siblings when a message (e.g. the typing dot) is removed */
.message-move { transition: transform var(--duration-base) var(--ease-out); }

</style>
