import { ref, computed } from 'vue'

/**
 * useTheme (singleton) — shared reactive theme state for the whole app.
 *
 * Themes:
 *   dark  → "Nebula"  (immersive deep-space, vibrant aurora accents)
 *   light → "Paper"   (bright, colorful gradient accents)
 *
 * - Persists the choice in localStorage (key: 'portfolio.theme')
 * - Falls back to prefers-color-scheme on first visit, defaulting to dark.
 * - Applies/removes [data-theme] on <html> so the whole token system re-themes.
 * - Keeps the <meta name="theme-color"> in sync for mobile chrome.
 * - Adds a short .theme-transition class for a smooth color cross-fade.
 */

const STORAGE_KEY = 'portfolio.theme'
const INITIAL = 'dark'

export const THEMES = Object.freeze({
  dark: { name: 'Nebula', meta: '#07070f' },
  light: { name: 'Paper', meta: '#f6f7fb' }
})

export const theme = ref(INITIAL)
export const themeName = computed(() => THEMES[theme.value]?.name || 'Autumn')

let transitionTimer = null

export function applyTheme(t) {
  const next = THEMES[t] ? t : INITIAL
  theme.value = next
  document.documentElement.setAttribute('data-theme', next)

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEMES[next].meta)

  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch (err) {
    /* storage unavailable — theme still applies for this session */
  }

  const html = document.documentElement
  html.classList.add('theme-transition')
  clearTimeout(transitionTimer)
  transitionTimer = setTimeout(() => html.classList.remove('theme-transition'), 700)
}

export function initTheme() {
  let saved = null
  try {
    saved = localStorage.getItem(STORAGE_KEY)
  } catch (err) {
    /* ignore */
  }
  if (!saved) {
    saved =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : INITIAL
  }
  applyTheme(saved)
  return theme.value
}

export function setTheme(t) {
  if (THEMES[t]) applyTheme(t)
}

export function toggleTheme() {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  return theme.value
}