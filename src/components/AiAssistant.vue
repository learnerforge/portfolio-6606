<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import IconSet from './IconSet.vue'
import { ask, followUps, SUGGESTIONS } from '../ai/assistant.js'
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
const copiedId = ref(null)
const listening = ref(false)
const micSupported = ref(
  !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition))
)

let timer = null
let streamRaf = null
let live = null
let rec = null
let micStop = false
let hist = []
let histIdx = -1
let draft = ''

// ---- interaction logging (console + localStorage) ----
const LOG_KEY = 'portfolio-ai.logs'
const LOG_MAX = 300
const SESSION = Math.random().toString(36).slice(2, 10)
const CHAT_KEY = 'portfolio-ai.session.v1'
const CHAT_MAX = 24

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

function starter() {
  return {
    role: 'ai',
    text: `Hi, I'm ${portfolio.profile.name.split(' ')[0]}'s portfolio assistant. Ask about his experience, skills, projects and education — or say "show projects" and I'll take you straight there.`
  }
}

const messages = ref([starter()])

function saveChat() {
  try {
    sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages.value.slice(-CHAT_MAX)))
  } catch (err) { /* storage full or blocked — session is best-effort */ }
}

function restoreChat() {
  try {
    const raw = sessionStorage.getItem(CHAT_KEY)
    if (!raw) return
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr) || arr.length === 0) return
    messages.value = arr.filter((m) => m && typeof m.text === 'string')
  } catch (err) { /* ignore */ }
}

function pinScroll(force = false) {
  nextTick(() => {
    const el = list.value
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60
    if (force || nearBottom) el.scrollTop = el.scrollHeight
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

const SECTION_LABELS = {
  about: 'About', experience: 'Experience', education: 'Education', projects: 'Projects',
  skills: 'Skills', expertise: 'Expertise', achievements: 'Achievements',
  certifications: 'Certifications', contact: 'Contact'
}

function actionLabel(a) {
  if (a.type === 'goto') return `Go to ${SECTION_LABELS[a.id] || a.id}`
  if (a.type === 'mailto') return 'Open email'
  if (a.type === 'link') return 'Open link'
  if (a.type === 'theme') return `Switch to ${a.theme} theme`
  return 'Open'
}

function onThemeChip() {
  send(theme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')
}

function finish(L) {
  if (live === L) live = null
  L.msg.streaming = false
  L.msg.chips = L.chips
  L.msg.action = L.action
  saveChat()
  logEntry({ i: L.intent, a: L.action ? L.action.type : null })
  if (L.action) execAction(L.action)
}

function streamAnswer(res) {
  const L = {
    msg: { role: 'ai', text: '', streaming: true },
    text: res.text,
    intent: res.intent,
    action: res.action || null,
    chips: followUps(res.intent)
  }
  live = L
  messages.value.push(L.msg)
  let i = 0
  let last = performance.now()
  const step = (now) => {
    if (live !== L) return
    const per = Math.max(1, Math.round(((now - last) / 1000) * 260))
    last = now
    i = Math.min(L.text.length, i + per)
    L.msg.text = L.text.slice(0, i)
    pinScroll()
    if (i < L.text.length) {
      streamRaf = requestAnimationFrame(step)
    } else {
      streamRaf = null
      finish(L)
    }
  }
  streamRaf = requestAnimationFrame(step)
}

function interrupt() {
  if (timer) { clearTimeout(timer); timer = null }
  if (streamRaf) { cancelAnimationFrame(streamRaf); streamRaf = null }
  if (live) {
    const L = live
    L.msg.text = L.text
    finish(L)
  }
  typing.value = false
}

function send(raw) {
  const text = (raw ?? input.value).trim()
  if (!text) return
  interrupt()
  input.value = ''
  messages.value.push({ role: 'user', text })
  hist.unshift(text)
  if (hist.length > 20) hist.length = 20
  histIdx = -1
  draft = ''
  pinScroll(true)
  saveChat()
  logEntry({ q: text })
  typing.value = true
  timer = window.setTimeout(() => {
    timer = null
    typing.value = false
    streamAnswer(ask(text))
  }, 330 + Math.random() * 300)
}

function newChat() {
  interrupt()
  messages.value = [starter()]
  hist = []
  histIdx = -1
  copiedId.value = null
  try { sessionStorage.removeItem(CHAT_KEY) } catch (err) { /* ignore */ }
  nextTick(() => field.value && field.value.focus())
}

async function copyMsg(m, i) {
  try {
    await navigator.clipboard.writeText(m.text)
    copiedId.value = i
    setTimeout(() => { if (copiedId.value === i) copiedId.value = null }, 1200)
  } catch (err) { /* clipboard unavailable */ }
}

function toggleMic() {
  if (!micSupported.value) return
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (listening.value) {
    micStop = true
    if (rec) rec.stop()
    return
  }
  rec = new SR()
  rec.lang = 'en-US'
  rec.interimResults = true
  rec.continuous = false
  rec.onresult = (e) => {
    let interim = ''
    const finals = []
    for (let i = 0; i < e.results.length; i++) {
      const r = e.results[i]
      if (r.isFinal) finals.push(r[0].transcript)
      else interim += r[0].transcript
    }
    const done = finals.join(' ')
    input.value = done + (done && interim ? ' ' : '') + interim
  }
  rec.onerror = () => { listening.value = false }
  rec.onend = () => {
    listening.value = false
    const v = input.value.trim()
    if (!micStop && v) send(v)
    micStop = false
  }
  micStop = false
  try { rec.start() } catch (err) { return }
  listening.value = true
}

function isEditable(el) {
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable
}

function onKey(e) {
  const inField = document.activeElement === field.value
  if (e.key === 'Escape' && open.value) {
    open.value = false
    return
  }
  if (e.key === '/' && !open.value && !isEditable(document.activeElement)) {
    e.preventDefault()
    open.value = true
    return
  }
  if (!inField) return
  if (e.key === 'ArrowUp' && hist.length) {
    e.preventDefault()
    if (histIdx === -1) draft = input.value
    histIdx = Math.min(histIdx + 1, hist.length - 1)
    input.value = hist[histIdx]
  } else if (e.key === 'ArrowDown' && histIdx !== -1) {
    e.preventDefault()
    histIdx -= 1
    input.value = histIdx === -1 ? draft : hist[histIdx]
  }
}

watch(open, (v) => {
  logEntry({ i: v ? 'open' : 'close' })
  if (v) {
    nextTick(() => field.value && field.value.focus())
  } else {
    nextTick(() => fab.value && fab.value.focus())
  }
})

onMounted(() => {
  restoreChat()
  document.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  interrupt()
  if (rec && listening.value) { micStop = true; rec.stop() }
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
            <button
              class="ai-ghost"
              :disabled="messages.length <= 1"
              aria-label="Start a new chat"
              @click="newChat"
            >
              <IconSet name="rotate-cw" :size="14" />
            </button>
            <button class="ai-close" @click="open = false" aria-label="Close assistant">
              <IconSet name="close" :size="14" />
            </button>
          </div>

          <transition-group name="message" tag="div" class="ai-body" ref="list" aria-live="polite">
            <div v-for="(m, i) in messages" :key="'msg-'+i" class="ai-msg" :class="m.role">
              <div class="ai-wrap">
                <div class="ai-bubble" :class="{ streaming: m.streaming }">{{ m.text }}</div>
                <button
                  v-if="m.role === 'ai' && m.text"
                  class="ai-copy"
                  :aria-label="'Copy answer'"
                  @click="copyMsg(m, i)"
                >
                  <IconSet :name="copiedId === i ? 'check' : 'copy'" :size="13" />
                </button>
              </div>
              <div
                v-if="m.role === 'ai' && (m.action || (m.chips && m.chips.length))"
                class="ai-chips"
              >
                <button v-if="m.action" class="ai-chip ai-act" @click="execAction(m.action)">
                  {{ actionLabel(m.action) }}
                </button>
                <button v-for="(c, k) in m.chips" :key="'c'+k" class="ai-chip" @click="send(c)">
                  {{ c }}
                </button>
              </div>
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
            <button
              v-if="micSupported"
              class="ai-mic"
              :class="{ active: listening }"
              type="button"
              :aria-label="listening ? 'Stop voice input' : 'Speak to ask'"
              @click="toggleMic"
            >
              <IconSet name="mic" :size="15" />
            </button>
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
.ai-ghost,
.ai-close {
  width: 34px; height: 34px;
  border-radius: 50%;
  border: none;
  background: var(--fill-sunken);
  color: var(--text-secondary);
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
}
.ai-ghost:hover,
.ai-close:hover { background: var(--fill-hover); color: var(--accent); }
.ai-ghost:disabled { opacity: 0.4; cursor: default; }

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
.ai-msg.ai { flex-direction: column; align-items: flex-start; }
.ai-wrap { display: flex; align-items: flex-end; gap: 6px; max-width: 100%; }
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
.ai-bubble.streaming::after {
  content: '';
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 3px;
  vertical-align: -2px;
  background: currentColor;
  animation: ai-blink 0.9s steps(2) infinite;
}
.ai-copy {
  width: 26px; height: 26px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out);
}
.ai-msg.ai:hover .ai-copy { opacity: 1; }
.ai-copy:hover { color: var(--accent); background: var(--accent-tint-soft); }
.ai-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
  padding-left: 2px;
  max-width: 100%;
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
.ai-chips .ai-chip { min-height: 32px; padding: 6px 12px; }
.ai-chip.ai-act {
  color: var(--text-on-accent);
  background: var(--btn-fill);
  border-color: transparent;
}
.ai-chip.ai-act:hover { color: var(--text-on-accent); background: var(--btn-fill); filter: brightness(1.1); }

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
.ai-mic,
.ai-send {
  width: 44px; height: 44px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ai-mic {
  background: var(--fill-sunken);
  color: var(--text-secondary);
  transition: color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}
.ai-mic:hover { color: var(--accent); background: var(--accent-tint-soft); }
.ai-mic.active {
  color: #fff;
  background: var(--sys-green);
  animation: ai-pulse 1.2s ease-in-out infinite;
}
.ai-send {
  background: var(--btn-fill);
  color: var(--text-on-accent);
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
@keyframes ai-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.ai-panel-enter-active, .ai-panel-leave-active { transition: opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out); }
.ai-panel-enter-from, .ai-panel-leave-to { opacity: 0; transform: translateY(12px) scale(0.97); }

@media (max-width: 768px) {
  .ai-assistant { right: 16px; bottom: calc(78px + env(safe-area-inset-bottom, 0px)); }
  .ai-panel { bottom: calc(86px + env(safe-area-inset-bottom, 0px)); }
  .ai-copy { opacity: 1; }
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
.message-move { transition: transform var(--duration-base) var(--ease-out); }
</style>