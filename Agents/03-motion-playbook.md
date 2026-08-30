# Web-Motion Playbook

Apple-quality motion system for the Vue 3 + GSAP + ScrollTrigger + Three.js portfolio rebuild.

**Stack reality check (from `package.json`):** GSAP `^3.15.0` (all plugins free since 3.13, incl. `ScrollTrigger.batch`), Three.js `^0.185.1`, Vue `^3.5`. Read the existing `src/composables/useReveal.js` before writing new motion — it already lazy-loads GSAP via `import()` and uses `gsap.utils.toArray`/`gsap.context` scoped to a root for clean component cleanup. Mirror that pattern.

---

## 0. Reference pen decoded (0xKev / bGOOKOy)

The pen "Infinite Scrolling Animation (Kevin Powell)" is **not** a scrubbed image reveal — it's the canonical **infinite horizontal CSS marquee**:
- `.scroller` wrappers each hold one `.scroller__inner` flex track (a `<ul>` of chips or a row of `<img>`s).
- Every track's children are **cloned once** and appended, each duplicate flagged `aria-hidden="true"` (no screen-reader double-read).
- Animated when `data-animated="true"`: track becomes `display:flex; width:max-content; flex-wrap:nowrap` and runs one keyframe — `@keyframes scroll { to { transform: translate(calc(-50% - 0.5rem)); } }`. Because the track is exactly 2x original, `translateX(-50%)` returns it pixel-perfect to start → seamless loop.
- Edge fade: `mask: linear-gradient(90deg, transparent, #fff 20%, #fff 80%, transparent)` dissolves chips at both edges (the "Apple" look).
- `data-direction` sets `forwards`/`reverse`; `data-speed` sets duration via `--_animation-duration`.
- Pause on hover/focus: `animation-play-state: paused` via `:has(img:hover, img:focus)`.
- Reduced motion: the animation is **never created** unless `!matchMedia("(prefers-reduced-motion: reduce)").matches`.

**Reuse:** duplicate-track + `translateX(-50%)` loop, mask edge-fade, `aria-hidden` clones, reduced-motion gate *before creating anything*, pause-on-hover. Backbone of §3.

---

## 1. ScrollTrigger cookbook

Register once at module level (plain Vite SPA: top of a shared module).

```js
// src/lib/gsap.js — single module that lazily resolves gsap once
import { onUnmounted } from 'vue'

let promise = null
export function getGsap() {
  if (!promise) {
    promise = Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([mod, st]) => {
      const g = mod.gsap
      g.registerPlugin(st.ScrollTrigger)
      return g
    })
  }
  return promise
}

// Run cb in a scoped gsap.context, auto-revert on unmount (matches useReveal).
export function onGsap(cb, root) {
  let ctx
  getGsap().then((gsap) => {
    ctx = gsap.context(() => cb(gsap), root && root.value)
  })
  onUnmounted(() => ctx && ctx.revert())
  return () => ctx && ctx.revert()
}
```

### 1a. Pinned section with scrubbed media scale (start `top top`, end `bottom bottom`)

The "scroll story" hero: section pins for a full viewport of scroll while the media scales/zooms.

```js
// 1a — media scales as the section scrolls out, pinned for a full beat
gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.value,
    start: 'top top',       // pin when section top hits viewport top
    end: 'bottom bottom',   // un-pin when section bottom hits viewport bottom
    pin: true,
    scrub: 1,               // 1s catch-up = buttery; use true for 1:1
    anticipatePin: 1,       // pre-settle layout before pin to avoid jump
  },
})
  .fromTo(mediaRef.value, { scale: 1.2 }, { scale: 1, ease: 'none' }, 0)
  .fromTo(headingRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0 }, 0.2)
```

**Notes**
- `end: 'bottom bottom'` = exactly one viewport-height of scrub; use `end: '+=2000'` for a longer, slower beat.
- Always `ease: 'none'` on tweens inside a scrubbed timeline — scrub overrides normal easing.
- `pin: true` wraps the trigger in a pin-spacer; avoid `position: sticky` + `position: fixed` conflicts on/under the pinned element.

### 1b. Fold-up reveal (clip-path wipe + y movement)

Premium "unfold": an image/panel peels up from its bottom with a simultaneous rise. Pure `clip-path` + transform — GPU-friendly.

```js
// 1b — clip-path inset wipe + rise
gsap.timeline({
  scrollTrigger: { trigger: sectionRef.value, start: 'top 70%', end: 'bottom top', scrub: 1 },
})
  .fromTo(
    panelRef.value,
    { clipPath: 'inset(0 0 100% 0)', y: 80 },
    { clipPath: 'inset(0 0 0% 0)', y: 0, ease: 'none' },
    0
  )
```

**Why it feels Apple:** `inset(0 0 100% 0)` hides everything; animating only the bottom inset to `0%` folds content up from the bottom edge. Put a parent `overflow: hidden` under the clip so residual edges stay crisp.

### 1c. Parallax layers (multiple speeds)

Layers move at different rates as they pass through the viewport. Start/end cover the whole pass (`top bottom` → `bottom top`) for a continuous effect.

```js
// 1c — parallax: each layer scrolls at its own rate
gsap.utils.toArray('[data-parallax]', scopedRoot).forEach((layer) => {
  const speed = parseFloat(layer.dataset.speed || 0.2) // e.g. 0.1 bg, 0.3 mid, 0.6 fg
  gsap.to(layer, {
    yPercent: -100 * speed,
    ease: 'none',                                   // never ease a scrub
    scrollTrigger: {
      trigger: layer.parentElement || scopedRoot,
      start: 'top bottom', end: 'bottom top', scrub: true,
    },
  })
})
```

### 1d. Staggered items on enter (batch → cascade)

For a grid entering together, `ScrollTrigger.batch` makes elements crossing the line in the same frame animate as one staggered cascade (not N independent triggers = noise).

```js
// 1d — batch + stagger reveal for grids/lists
ScrollTrigger.batch('[data-card]', scopedRoot, {
  start: 'top 85%',
  once: true,
  onEnter: (batch) => {
    gsap.fromTo(
      batch,
      { autoAlpha: 0, y: 48, scale: 0.98 },
      {
        autoAlpha: 1, y: 0, scale: 1,
        duration: 0.8, ease: 'power3.out',
        stagger: 0.08, clearProps: 'all',           // free the element after
      }
    )
  },
})
```

### 1e. Text reveal with overflow-hidden line masks

The premium headline: each line sits in its own `overflow: hidden` wrapper and a mask slides up. Split lines manually (SplitText is a paid Club plugin).

```html
<h2 class="lines">
  <span class="line-mask"><span class="line-inner">Build things</span></span>
  <span class="line-mask"><span class="line-inner">that feel alive.</span></span>
</h2>
```

```css
.line-mask { display: block; overflow: hidden; }
.line-inner { display: block; will-change: transform; }
```

```js
// 1e — mask lines slide up one after another on enter
gsap.timeline({
  scrollTrigger: {
    trigger: headingRef.value,
    start: 'top 82%',
    once: true,
  },
})
  .fromTo(
    gsap.utils.toArray('.line-inner', headingRef.value),
    { yPercent: 110 },
    { yPercent: 0, ease: 'power4.out', duration: 1.1, stagger: 0.09 }
  )
```

`yPercent: 110` starts each line fully below its own mask; the `overflow: hidden` mask clips it until it slides up.

---

## 2. The Apple "hero zoom"

The signature scroll-out: hero content stays **pinned for a beat** while the whole viewport scales and fades, so the next section slides over a shrinking stage. Two layers — background scales, foreground (type) fades and lifts.

```js
// 2 — Apple hero zoom: pinned hero that scales/fades out while pinned
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: heroRef.value,
    start: 'top top',
    end: '+=120%',           // 1.2 viewports of pinned scroll beat
    pin: true,
    scrub: 1,
    anticipatePin: 1,
  },
})

// Background stage zooms back (creates the "camera pull" feel)
tl.to(bgRef.value, { scale: 1.35, ease: 'none' }, 0)
// Foreground lifts + fades out, then the next section can cover it
tl.to(contentRef.value, { autoAlpha: 0, yPercent: -12, ease: 'none' }, 0)
tl.to(heroRef.value, { scale: 0.9, borderRadius: 24, ease: 'none' }, 0)
```

**Why it feels Apple:** the whole *section* (not just an image) scales and rounds its corners → one continuous panel zooming away while content below pushes in (Apple's "expand/collapse"). Keep the pinned beat ~1–1.5 viewports; longer and scrub drags.

**Product-rotate variant (AirPods-style):** pin a canvas and draw frames from scroll progress:
```js
ScrollTrigger.create({
  trigger: seqRef.value, start: 'top top', end: '+=150%', pin: true, scrub: 1,
  onUpdate: (self) => drawFrame(Math.round(self.progress * (FRAMES - 1))),
})
```

---

## 3. Infinite loops (transform/opacity only — no layout thrash)

### 3a. Seamless marquee (duplicate-track + `translateX(-50%)`)

The 0xKev pattern ported to the Vue composable style. Only `transform` animates; the loop is exact because the track is 2x content.

```html
<!-- MarqueeTrack.vue -->
<div class="marquee" data-direction="left" data-speed="22">
  <ul class="marquee__track" ref="trackRef">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</div>
```

```css
.marquee { overflow: hidden; -webkit-mask: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent); mask: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent); }
.marquee__track { display: flex; width: max-content; flex-wrap: nowrap; gap: 1rem; will-change: transform; }
.marquee__track > li { flex: none; }
```

```js
// MarqueeTrack.vue <script setup>
// Clone each child once (aria-hidden) → track is 2x → translateX(-50%) loops seam-free.
onMounted(async () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return // never create it
  const gsap = await getGsap()

  const track = trackRef.value
  Array.from(track.children).forEach((child) => {
    const clone = child.cloneNode(true)
    clone.setAttribute('aria-hidden', 'true')
    track.appendChild(clone)
  })
  const dir = track.closest('.marquee').dataset.direction === 'right' ? -1 : 1

  tween = gsap.to(track, {
    xPercent: dir * -50,                 // seamless because track is 2x
    ease: 'none',
    duration: parseFloat(track.closest('.marquee').dataset.speed) || 22,
    repeat: -1,                          // animate ONLY transform; never width/left
  })
})
// add pause-on-hover + stop when off-screen (Playbook §6)
```

**Subpixel gap gotcha** (GSAP forum): 0.5px seams can appear between items; use `margin-inline: -1px` and keep the exact `translate(-50%)` (not `-49.999%`).

### 3b. Wheel / infinite spinner with rotation-reset trick

Use **relative `+=` rotation** + `repeat: -1` — GSAP restarts automatically, so the angle never drifts or needs resetting.

```js
const spin = gsap.to(wheelRef.value, {
  rotation: '+=360',                     // relative → no reset jump
  ease: 'none', duration: 4, repeat: -1,
})
```

**No CSS-transition conflict** (GSAP forum rule): never put a CSS `transition` on an element GSAP rotates — it causes the "rotates back then spins" bug. If a hover transition is needed, put it on a nested wrapper. For a wheel that advances one index per *input*, use GSAP's `seamlessLoop` helper or an `xPercent`-based index timeline.

### 3c. Infinite gradient shimmer (background-position)

`background-position` is **not** compositor-only — keep shimmer small, ephemeral, and off under reduced-motion. The seamless trick: the gradient is 2x element width and travels exactly 100% each loop.

```css
.shimmer {
  background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%);
  background-size: 200% 100%;          /* 2x width → seamless 100% travel */
  animation: shimmer-shift 3s linear infinite;
}
@keyframes shimmer-shift { to { background-position: 200% 0; } }
```

**CSS vs GSAP loops:** pure loops needing only `transform`/`opacity`/`background-position` → **CSS keyframes** (compositor-thread, no JS ticker). Use **GSAP** when you need `repeatRefresh`, scrub control, non-linear eases, or velocity-based pause/play.

---

## 4. Timing / easing

Apple's feel = **strong ease-out** (fast start, long settle); never linear except inside scrubbed timelines.

### Curves
| Apple-feel | CSS cubic-bezier | GSAP | Use for |
|---|---|---|---|
| Standard exit | `0.28 0.11 0.32 1` | `power4.out` | Buttons, cards, UI enter |
| Camera decel | `0.22 1 0.36 1` | `power4.out`/`expo.out` | Hero zoom, big panels |
| Overshoot settle | `0.34 1.56 0.64 1` | `back.out(1.4)` | Pop-in accents, badges |
| Organic spring | `0.22 0.61 0.36 1` | `quickTo(... 'power3.out')` | Mouse-follow parallax |
| Stiff product | `0.2 0.8 0.2 1` | `power2.out` | Micro-interactions, toggles |

### Where each goes
- **Reveals / section content:** `power3.out` (0.7–1.0s).
- **Hero zoom / non-scrubbed cinematic:** `power4.out` or `expo.out` (1.0–1.4s).
- **Marquee/rotation loops:** `ease: 'none'` (seamless repeat).
- **Scrubbed tweens:** `ease: 'none'` — scroll owns timing; non-linear ease distorts mapping.
- **Cascades:** same ease + `stagger: 0.06–0.09`.

### Spring feel without a physics lib
```js
const followX = gsap.quickTo(elm, 'x', { duration: 0.45, ease: 'power3.out' })
const followY = gsap.quickTo(elm, 'y', { duration: 0.45, ease: 'power3.out' })
window.addEventListener('pointermove', (e) => { followX(e.clientX * s); followY(e.clientY * s) })
```

---

## 5. Reveal system — reusable Vue composable

Extends the existing `useReveal.js` into a configurable direction/fold-mask system with `ScrollTrigger.batch` and full lifecycle cleanup.

```js
// src/composables/useReveal.js (enhanced) — direction, fold-mask, batch, cleanup
import { onMounted, onUnmounted } from 'vue'
import { getGsap } from '../lib/gsap'

export function useReveal(root, options = {}) {
  const { batch = true, stagger = 0.08 } = options
  let gsap, ctx, triggers = []

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const makeFrom = (el) => {
    const dir = el.dataset.dir || 'up'
    let v = { autoAlpha: 0 }
    if (reduced) return v                       // reduced motion → fade only
    const dist = 46
    if (dir === 'up') v.y = dist
    else if (dir === 'down') v.y = -dist
    else if (dir === 'left') v.x = dist
    else if (dir === 'right') v.x = -dist
    else if (dir === 'scale') v.scale = 0.92
    else if (dir === 'fold') {
      v.clipPath = 'inset(0 0 100% 0)'          // fold-up mask
      v.y = dist
    }
    return v
  }
  const to = { autoAlpha: 1, y: 0, x: 0, scale: 1, clipPath: 'inset(0 0 0% 0)' }

  const apply = () => {
    if (!gsap || !root.value) return
    if (ctx) ctx.revert()
    triggers.forEach((t) => t && t.kill())
    triggers = []
    ctx = gsap.context(() => {
      const els = gsap.utils.toArray('[data-reveal]', root.value)
      if (!els.length) return

      if (batch) {
        ScrollTrigger.batch(els, {
          start: 'top 85%',
          once: true,
          onEnter: (group) => {
            group.forEach((el) => {
              if (el.dataset.stack) {
                triggers.push(...Array.from(el.children).map((kid, i) =>
                  gsap.fromTo(kid, makeFrom(kid), {
                    ...to, duration: 0.8, ease: 'power3.out',
                    delay: i * 0.07, clearProps: 'all', once: true,
                  })
                ))
              } else {
                triggers.push(gsap.fromTo(el, makeFrom(el), {
                  ...to, duration: 0.9, ease: 'power3.out', clearProps: 'all',
                }))
              }
            })
          },
        })
      } else {
        // non-batch: one ScrollTrigger per element (existing useReveal behavior)
        els.forEach((el) => {
          const delay = parseFloat(el.dataset.delay || 0)
          triggers.push(gsap.fromTo(el, makeFrom(el), {
            ...to, duration: 0.9, delay, ease: 'power3.out', clearProps: 'all',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }))
        })
      }
    }, root.value)
  }

  onMounted(async () => { gsap = await getGsap(); apply() })
  onUnmounted(() => { if (ctx) ctx.revert(); triggers.forEach((t) => t && t.kill()) })

  return { apply }
}
```

**Usage:** root element with `[data-reveal]` children; `data-dir="up|down|left|right|scale|fold"`, `data-stack` to stagger children, `data-delay` in non-batch mode: `const rootRef = ref(null); useReveal(rootRef, { batch: true })`.

**Cleanup contract:** every composable must revert its `gsap.context()` **and** kill any batched tweens on unmount — otherwise pin-spacers and triggers leak across route changes in an SPA.

---

## 6. Reduced motion + pause off-screen

### 6a. Gate EVERY motion with `gsap.matchMedia`

`gsap.matchMedia()` both handles `prefers-reduced-motion` **and** auto-reverts when conditions change (it wraps a context internally — don't nest a `gsap.context()` inside it). Prefer it over a one-shot `window.matchMedia` read because the user can toggle the OS preference mid-session.

```js
export function useReducedAwareMotion(cb) {
  let mm
  getGsap().then((gsap) => {
    mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', (context) => cb(gsap, context))
    // reduce branch: gentle fade only (no transforms) or nothing
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('[data-reveal], [data-card], [data-parallax]', { autoAlpha: 1, clearProps: 'transform' })
    })
  })
  onUnmounted(() => mm && mm.revert())
}
```

Universal reduced-motion CSS fallback:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .marquee__track, .shimmer { animation: none !important; }
}
```

> Because GSAP bypasses CSS transitions, a **blanket** reset can desync GSAP from CSS state. Keep the hard reset scoped to `:not([data-gsap-managed])` or handle reduced motion per-animation in `gsap.matchMedia()`; test with reduced motion enabled from the start.

### 6b. Pause infinite animations off-screen (IntersectionObserver composable)

Every marquee, spinner, or shimmer should freeze off-screen. Tiny composable with auto-cleanup:

```js
// src/composables/usePauseOffscreen.js
import { onUnmounted } from 'vue'

export function usePauseOffscreen(targets, anims) {
  let observer
  if (typeof IntersectionObserver !== 'undefined' && anims.length) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const fn = entry.isIntersecting ? 'play' : 'pause'
        anims.forEach((a) => a[fn]())
      })
    }, { rootMargin: '200px 0px' })  // small pre-roll buffer
    targets.forEach((t) => t && observer.observe(t.value || t))
  }
  onUnmounted(() => observer && observer.disconnect())
  return observer
}
```

Wire it in: `usePauseOffscreen([marqueeRef], [tween])` right after creating the tween. Also pause on hidden tab with a `document.visibilitychange` listener calling `gsap.globalTimeline.pause()/play()` — between the two, off-screen + hidden-tab work is eliminated.

---

## 7. Performance rules

- **Animate `transform` (+ `opacity`/`autoAlpha`) ONLY.** Never `width`, `height`, `top`, `left`, `margin`, `padding` — those force layout per tick. Use GSAP transform aliases (`x`, `y`, `scale`, `rotation`).
- **`clip-path` inset** and **`filter`** are OK for scroll/transitional effects (composited in modern browsers); keep them off always-on infinite loops. `background-position` is not compositor-friendly — small & ephemeral only.
- **`will-change` discipline:** add `will-change: transform` only to elements mid-animation; remove after (`clearProps`). Too many layers on the page hurts more than helps. Don't `will-change` the pinned container (pin-spacer handles it).
- **`gsap.quickTo`** for continuously-driven values (mouse-follow, velocity skew) instead of `onUpdate`+manual set — runs inside GSAP's ticker with deadweight reduction.
- **Avoid heavy `onUpdate`:** on a scrubbed trigger, listen to the *tween*, not the ScrollTrigger `onUpdate`.
- **`ScrollTrigger.batch`** for many same-type elements (one grouped trigger/frame instead of N).
- **`ease: 'none'` inside every scrubbed timeline.**
- **Text reveals:** translate only (`y`/`yPercent`) on wrapped lines; never animate `letter-spacing`/`font-size`.
- **Three.js:** drive the renderer once per GSAP ticker tick, and `renderer.setAnimationLoop` only while visible (pair with `usePauseOffscreen`).
- **For heavy multi-element scroll scrubs,** prefer native CSS scroll-driven animations (§9) so the compositor handles the work off the main thread.

---

## 8. Accessibility

- **`prefers-reduced-motion` everywhere** via `gsap.matchMedia` (§6a). Vestibular disorders matter — big x-axis swipes and scale zooms are most triggering.
- **Provide a manual motion toggle** (system pref isn't universal): a checkbox flips a store flag then calls `gsap.matchMediaRefresh()` (per GSAP a11y docs).
- **Screen readers:** duplicated loop clones must be `aria-hidden="true"` (0xKev does this). Keep content in the DOM; never `display:none` active states.
- **Focus:** pause-on-hover must also pause on `:focus` (`animation-play-state` via `:has(... :focus)`). Don't let reveals hide focusable elements indefinitely.
- **Pause on hidden tab & off-screen** (§6b) — wasted animation is worse on limited devices.
- **Coarse pointers / touch:** use `gsap.matchMedia('(pointer: coarse)')` to reduce parallax/velocity-skew magnitude (large gestures disorient).
- **Contrast/legibility:** fade reveals (`autoAlpha`) should be ~0.6–0.9s so content never lingers illegible at partial opacity.

---

## 9. (Optional) Native CSS scroll-driven animations — know the trade-off

As of 2026, Chrome/Edge 115+, Firefox 132+, Safari 18.2+ support `animation-timeline: scroll()/view()` — compositor-thread, zero JS, GPU-only for transform/opacity/scale. Apple-style viewport wipe:

```css
@supports (animation-timeline: view()) {
  @keyframes wipe-in { from { clip-path: inset(0 0 100% 0); opacity: 0; } to { clip-path: inset(0 0 0% 0); opacity: 1; } }
  .reveal-1 { animation: wipe-in 1s linear both; animation-timeline: view(); animation-range: entry 5% cover 40%; }
}
```

**Choose it** for reveal-on-scroll and progress indicators (compositor perf, zero bundle). **Stay with GSAP** for sequenced timelines, scrubbed *group* reveals with stagger, pin+scrub stories, and interactive state (Three.js, drag, pointer-follow). Idiomatic mix: CSS for cheap reveals, GSAP for hero/pinned/sprite work. **Guard:** `@media (prefers-reduced-motion: reduce) { .anything-scroll { animation-timeline: none; } }`.

---

## 10. Lenis smooth scroll (OPTIONAL — Apple does NOT smooth-scroll)

Apple uses **native scroll** + ScrollTrigger `scrub: 1` — no Lenis-like inertia. Native keeps pin/`position:sticky`/anchors rock-solid and avoids scroll-jacking. If you still want Lenis (e.g. a Three/WebGL page), the official integration is the exact trio — missing any one jitters the pins:

```js
const lenis = new Lenis({ autoRaf: true })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))  // drive from GSAP ticker
gsap.ticker.lagSmoothing(0)                         // no lag → no pin jitter
```

**Don't init Lenis under reduced motion. Rebuild decision: default to native scroll; Lenis only if a Three scene needs it.**

---

## 11. Build checklist

- [ ] Centralize GSAP registration in `src/lib/gsap.js` (lazy `import()`, single promise).
- [ ] Port `useReveal.js` to the enhanced version (§5) with `ScrollTrigger.batch`.
- [ ] Add `usePauseOffscreen` (+ tab-visibility pause) and wire it into every infinite loop.
- [ ] Replace ad-hoc scroll listeners with ScrollTrigger (scrub where possible).
- [ ] Wrap ALL motion setup in `gsap.matchMedia` (no-preference) + reduced fallback.
- [ ] Add a manual motion toggle calling `gsap.matchMediaRefresh()`.
- [ ] `aria-hidden` on all duplicated loop content.
- [ ] Audit every tween: transform/opacity only; never width/height/left; `ease: 'none'` in scrubbed timelines.
- [ ] Test with OS reduced-motion ON, on a coarse-pointer device, and with devtools CPU throttling.
- [ ] Keep Apple eases consistent: `power3.out` reveals, `power4.out`/`expo.out` hero, `back.out` accents.
