# Apple.com Product-Marketing Page Pattern Report
**Research agent output · feeds the Vue3 portfolio redesign spec**

## Scope / Sources
Live pages fetched via webfetch (markdown) on 2026-08-30:
- `https://www.apple.com/in/ipad-air/` (M4 iPad Air, 2026)
- `https://www.apple.com/in/macbook-neo/` (A18 Pro MacBook Neo) — **NOTE: this URL did NOT 404**, it resolves to a real 2026 Apple page ("Hello, Neo."). No fallback needed, but the MacBook Air page (`/in/macbook-air/`, "Might takes flight.", M5) was also captured and is referenced throughout because it shows the benchmark-comparison variant.
- `https://www.apple.com/in/macbook-air/`

Supporting research: GSAP ScrollTrigger pin/scrub/parallax recipes (hontran.dev), CSS `view-timeline` sticky-video-stack wipe (builder.io), CSS-Tricks "Apple fancy scrolling animations" (canvas frame scrub), CSS-Tricks "Recreating Apple's Vision Pro animation" (sticky + view timeline), CSS-only infinite marquee patterns (master.dev / frontend.fyi), UX teardowns (typenorm.com "lead with the object, defer the spec", capturly.com heatmap analysis).

**Overall thesis (from teardowns + page observation):** Apple product pages *lead with the object and defer the spec sheet, ending at a compare tool that does the deciding.* Every section is one idea: giant headline + short subhead + one image/video + one CTA. Whitespace and product photography carry the design; near-zero decorative color.

---

## 1. Page Anatomy Walkthrough (top → bottom, as observed)

### 1.1 Global nav (`<header id="globalnav">` on every page)
- Full-width near-black translucent bar (`rgba(22,22,23,.8)`), height ~44px, `backdrop-filter: saturate(180%) blur(20px)`.
- Left→center: Apple logo glyph, then Store / Mac / iPad / iPhone / Watch / AirPods / TV & Home / Entertainment / Accessories / Support (10 links, ~12px, #f5f5f7).
- Right: search icon, bag icon (both glyph-only links). On mobile this collapses to logo + "menu" hamburger.
- Always fixed at top; product pages keep it visible during scroll (the homepage is the one place Apple lets it ride away).

### 1.2 Utility / promo band (product pages)
- Thin dark band *above* the local nav, e.g. iPad Air: "For a limited time, get Apple Pencil when you buy iPad Air with education savings. [Shop ›]" — one line, ~13px, bg `#161617`, text `#fff`. This is the promo carousel ("unibanner").

### 1.3 Local nav (`.localnav`)
- Below global nav, height ~52px, white translucent (`rgba(251,251,253,.8)` + blur), sticks with `position: sticky; top: 44px`.
- Left: product name ("iPad Air", 17px / semibold). Center: Overview · Tech Specs · Compare (· Switch from PC to Mac). Right: filled blue pill **"Buy iPad Air"** — the primary conversion stays reachable all page long.
- Borders appear on scroll (hairline `#d2d2d7`).

### 1.4 Hero (`section.hero`)
Structure (iPad Air):
```html
<section class="section hero" data-tracking>
  <a class="icon icon-apple" ...>        <!-- huge product "eyebrow logo" image -->
  <h1 class="hero-headline">iPad Air</h1>
  <p class="hero-subhead">Whoosh.</p>     <!-- tagline, 28px, #86868b -->
  <a class="hero-link icon-chevronright">Now supercharged by M4</a>   <!-- optional -->
  <div class="hero-container">
    <picture> hero_endframe (thin-device front+back render) </picture>
  </div>
  <div class="hero-cta">
    <a class="button">Buy</a>
    <a class="button button-secondary">Learn more</a>
  </div>
</section>
```
- iPad Air hero = H1 + one-word tagline "Whoosh." then the big endframe render. It **scrubs**: `hero_startframe → hero_endframe` plays a "whoosh" reveal as you scroll past the hero (image-fade sequence pinned to the hero container, ~hero pinned for 150% viewport).
- MacBook Neo hero: H1 "MacBook Neo", tagline "Hello, Neo.", the laptop balanced on fingertips (hero_start→end scrub), **Buy** pill only (single CTA — cheaper product page reduces options).
- MacBook Air hero: "MacBook Air" / "Might takes flight." / bold kicker "**Now supercharged by M5.**" / Buy pill.
- Rule: **eyebrow or logo → H1 → one-line tagline → hero media → 1–2 CTAs.** Never a paragraph in the hero.
- Footnote asterisks (`*`, `‡`) as tiny superscripts after CTAs, resolving in the footer.

### 1.5 "Get the highlights." — media card gallery
- Horizontal card rail of the 4–7 key selling points, each: title line + 3-frame animated image (`startframe / endframe / static` stack scrubbed on visibility or hover) e.g. "Whoosh. Now supercharged by M4", "IPadOS and amazing apps", "Apple Intelligence", "Magic Keyboard... Apple Pencil Pro", sizes.
- Each card is a jump-link to the deep section on the same page (`#card-...`). Serves as a mini-TOC of the story.

### 1.6 "Take a closer look." — color / materials breakdown
- **Color chip rail** (All Colours · Space Grey · Blue · Purple · Starlight — iPad Air; Silver · Blush · Citrus · Indigo — MacBook Neo). Clicking a swatch swaps a 2–3 panel gallery of the product in that finish (`slide_1A/2A/2B/3A/3B` + per-color assets), crossfading.
- Also "View in your space" (AR Quick Look `.usdz` link) — subtle understated link with icon.

### 1.7 Narrative section pattern (repeated 6–10× down the page)
Generic template:
```html
<section class="section with-pretitle __TITLE">   <!-- light #f5f5f7 or #fff, alternating -->
  <div class="pretitle">M4. <span class="bold">Power up, up, up.</span></div>  <!-- disguised H2 -->
  <div class="section-content">
    <div class="copy"> <p>…subhead…</p>
      <a class="icon-chevronright">Discover what you can do with the power of M4</a> </div>
    <div class="media"> layered/pinned imagery or video </div>
  </div>
</section>
```
- The **H2 looks like three short lines** ("M4. / Power up, up, / up.") — typically `"iPadOS and apps. / Fly right / through it all."` lines break at phrase boundaries for punch.
- The **pinned scroll-zoom "product story"** section (the famous one): iPad Air "M4. Power up, up, up." is a **stance-scene**: `chip_top_startframe` (small floating iPad) → scrubs by scaling the whole layer with scroll → passes through `chip_middle_top` (device + game) → `hero_middle_bottom` → `hero_bottom` (full-bleed landscape shot). Implementation = sticky canvas/picture stack, scroll drives scale `1 → ~1.2` and crossfade. Narrative text lines fade in/out in a fixed pinned sticky column at the left ("elevates performance … AI powerhouse …"). Anchor stats rendered as giant numbers ("Up to **2.3x faster**", "Over **4x faster** 3D pro rendering").
- Dark **"lights-out"** alternates: "iPadOS and apps" (#000 bg, white text, purple/blue/starlight devices racked), "Apple Intelligence" section (black w/ lock-graphic privacy shot), MacBook Neo "Privacy and Security". Text `#f5f5f7`, secondary `#a1a1a6`, links `#2997ff`.

### 1.8 Feature modal (`.modal`) — progressive disclosure
- Section paragraphs carry **bold inline emphasis** with a "Focus in on X" / "Squeeze." style opener that opens a **modal carousel**: e.g. Apple Pencil Pro "Intuitive and precise creative control." with feature tabs (Squeeze / Barrel roll / Haptic feedback / Hover / Double-tap), each tab = caption + video w/ Pause/Play/Replay. Close button top-right; modal is fixed, full-screen, black scrim, `overflow:auto` inner.

### 1.9 "There's never been a better time / The muscle for your hustle" — benchmark & compare
- MacBook Air Performance shows the **animated comparison table** variant: tabbed tracks ("M5 compared to previous" / "M5 vs Intel PC"), rows per benchmark, a baseline bar and an M5 bar that **grows as you scroll** (bars animate width, scrub-linked), plus big stat headline "Up to **9.5x** faster".
- iPad Air contrast block "Two sizes. Infinite possibilities." = spec-chip list comparing 11″/13″ (resolution chips, True Tone / P3 / Full lamination chips).

### 1.10 "Why Apple is the best place to buy." — benefits grid
- 6–8 cards in a responsive grid. Each: icon (colorless line glyph), title ("Ways to Buy"), purpose-line, then an expandable/clickable panel with detail copy + "Learn more ›". Converts residual hesitation into next actions.
- iPad Air variant: 8 cards (payments, trade-in, education, delivery, engraving, live specialist, personal setup, store app). MacBook Neo: 7 (ways to buy, education, personal setup, delivery, trade-in, guided shopping, store app).

### 1.11 "Keep exploring." — comparison/router tiles (`#compare` / `#buildseries`)
- Grid of horizontal product tiles: product render + color swatches + tagline + "Currently viewing" badge on the current model, spec bullets w/ icons, Buy / Learn more. Footer link **"Compare all iPad models ›"** / "Which laptop is right for you?" — this is Apple's decision funnel exit.

### 1.12 Environment / "Our values" + Footer
- Decarbonize cards ("iPad Air and the environment." — 30% recycled, renewable electricity, fibre packaging) → each expands.
- Footer: dense 6-column link grid on `#f5f5f7`, tiny legalese, asterisk footnote list, "Copyright © 2026 Apple Inc." — the "boring stuff" is compressed & aligned (capturly teardown notes alignment does the work here).

---

## 2. Typography Hierarchy (marketing type scale)

| Role | Size / weight | Color | Notes |
|---|---|---|---|
| Eyebrow / pretitle | 14px / 600 semibold | `#6e6e73` (grey) | tiny label above H2, sentence case, e.g. "M4." / "Performance" / "AI"; `letter-spacing: .01em` |
| Giant section headline | **96px** desktop (56–80px tab., 40–56px mob) / 600 SemiBold ("Heavy" per popular perception; Apple's SF Pro Display is typically SemiBold, some launch punch words go up to 700) | `#1d1d1f` (light bg) or `#f5f5f7` (dark) | `line-height: 1.05`, `letter-spacing: -0.015em`, centered, max ~3 lines; the **fold-up reveal** element |
| Tagline / hero subhead | 21–28px / 400 regular | `#86868b` | `line-height: 1.47`, hero taglines like "Whoosh." are 28px; section subheads 21px |
| Body / feature copy | 17px / 400 | `#86868b` | `line-height: 1.47–1.5`, ~45–75ch |
| Footlinks / captions / legal | 14px | `#6e6e73`/`#86868b` | recirculation links, chips, captions |
| Big stat numbers | 80–96px / 600 | `#1d1d1f` | "2.3x faster", "18 hr" — one per stat block |
| Bold emphasis in copy | 700 inline | `#1d1d1f` | **heat** words inside body are semibold/bold for scanability |

- Font: long track.**SF Pro** (self-hosted in portfolio → use Inter, system-ui-ui, or the SF fallback stack `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`).
- **Max content widths:** marketing body ~**1024px** centered; hero text blocks ~**1200px**; edge-to-edge imagery allowed; horizontal gutter 32px on large, 24px mobile. Text sections cap around 50–60rem for line length.
- Global: `font-family: "SF Pro Display", "SF Pro Text", ...system`. `-webkit-font-smoothing: antialiased`. Baseline mobile type-first with `clamp()`.

---

## 3. Color Usage

Apple uses an effectively **achromatic design system** — color comes only from product photography.

| Token | Hex | Use |
|---|---|---|
| Background light | `#f5f5f7` | default page bg, alt sections |
| Background white | `#ffffff` | contrast sections, cards, localnav |
| Background dark (lights-out) | `#000000` | narrative sections |
| Primary text | `#1d1d1f` | headings/body on light |
| Secondary text | `#6e6e73` | eyebrows, captions, disabled |
| Muted/tertiary text | `#86868b` | taglines, subheads, footnotes |
| On-dark text | `#f5f5f7` | headings on black |
| On-dark secondary | `#a1a1a6` | body on black |
| Accent blue (fill) | `#0071e3` (grad `#0077ed`) | primary pills, Buy |
| Link blue (text) | `#06c` (light bg) / `#2997ff` (dark bg) | "Learn more ›" links |
| Hairlines | `#d2d2d7` (light) / `rgba(255,255,255,.2)` (dark) | 1px borders, dividers |

- Decorative color is **zero**: no reds/greens/purples in the UI palettes. The iPad Air product itself is Blue/Purple/Starlight; the MacBook Neo is Blush/Citrus/Indigo — the *product imagery* is the vibrancy.
- Section rhythm = light `#f5f5f7` ↔ white `#fff` ↔ occasional black; color changes are **hard section boundaries** (no gradients bleeding across sections, no decorative gradients except subtle ones inside hero renders).
- One line tooltip/nav shadow: rgba black @ low alpha for hover lifts and the sticky localnav hairline.

---

## 4. Buttons / CTAs

Exact recipe (Apple's `button` system class):

```css
.button {
  font-size: 17px; color: #fff; font-weight: 400; line-height: 1.18;
  background: #0071e3;                       /* hover #0077ed */
  padding: 12px 22px; border-radius: 980px;  /* ← signature pill radius */
  text-decoration: none; cursor: pointer; min-width: 28px;
  transition: background .3s;
}
.button-secondary { /* ghost / outline pill */
  background: transparent; color: #1d1d1f;
  border: 1px solid #d2d2d7;                 /* dark: 1px #fff, text #fff */
  padding: 12px 22px; border-radius: 980px;
}
.button-secondary:hover { background: #f5f5f7; }  /* white bg on dark */
```
- **Primary = filled blue pill** ("Buy", "Shop", "View projects"). Hover: slightly lighter blue, no lift.
- **Secondary = outline/ghost pill** (same radius, hairline border), hover tints bg.
- **Text link** with chevron: `#[06c](8px)` for light / `#2997ff` dark, eg `"Learn more ›"`, `"Discover what you can do with the power of M4 ›"`. Chevron is an inline SVG/entity `›` appended, `::after { content:"›" }` or an ARROW glyph — Apple uses `icon-chevronright` (blue SVG chevron).
- **"Learn more" small links**: 17px blue, chevron after, used en-masse in cards/recirculation.
- Micro-links: "View in your space" (AR), "Watch the film", "Play" — same text-link grammar.
- Hierarchy: **1 primary pill + optional 1 ghost pill per section; unlimited text links.** Pills are conversion, text links are exploration.

---

## 5. Interaction Language + concrete CSS/JS

### 5.1 Hover micro-interactions on tiles/cards
Apple cards (recirculation tiles, contrast tiles) lift gently on hover:
```css
.card { transition: transform .35s cubic-bezier(0,0,.25,1), box-shadow .35s;
        box-shadow: none; background: #fff; border-radius: 18px; }
.card:hover { transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.08); }
```

### 5.2 Sticky section headers + sticky local nav
```css
.localnav { position: sticky; top: 44px; z-index: 5;
  backdrop-filter: saturate(180%) blur(20px); background: rgba(251,251,253,.8);
  border-bottom: 1px solid rgba(0,0,0,0); }
.localnav.is-stuck { border-color: #d2d2d7; }
```
JS toggles `.is-stuck` via `IntersectionObserver` on a 1px sentinel. This is the "section header pins under the nav" pattern (feature paragraphs stay pinned in a left column while imagery scrolls on Apple's stance sections).

### 5.3 Scroll-driven PINNED section where media scrubs (the flagship move)
Two proven implementations:

**(a) GSAP ScrollTrigger — pin + scrub** (react/gsap or @gsap/react):
```js
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: ref.current, start: "top top", end: "+=150%",
                     pin: true, scrub: 1 }   // scrub:1 = 1s smoothing, feels premium
  });
  tl.fromTo(".hero-media", { scale: 1 }, { scale: 1.2, ease: "none" });  // scroll-zoom
}, { scope: ref });
```
Rules: animate only `transform`/`opacity` (compositor), use `scrub: 1` for smooth catch-up, call `ScrollTrigger.refresh()` after fonts/images settle, kill on route unmount (pin leaves push-pins at wrong positions otherwise).

**(b) CSS `view-timeline` (Chrome/Safari — no JS sync, compositor-driven):**
```css
section.scene { view-timeline-name: --scene; view-timeline-axis: block; }
.media { position: sticky; top: 8vh;          /* pinned frame while story scrolls */
  animation: zoom-in linear both; animation-timeline: --scene;
  animation-range: entry 0% cover 55%; }
@keyframes zoom-in { 0% { scale: 1; } 100% { scale: 1.2; } }
```
- **Sticky-video-swap** variant (Apple TV/iPad page style): sticky frame with a stack of absolutely-positioned layers; each layer clips away driven by the *next* section's timeline:
```css
@supports (animation-timeline: view()) {
  @keyframes wipe-out { 0% { clip-path: inset(0 0 0% 0); } 100% { clip-path: inset(0 0 100% 0); } }
  .video-layer { animation: wipe-out 1s linear both; animation-range: entry 0% contain 0%; }
  .video-layer:nth-child(1) { animation-timeline: --section-1; }
  .video-layer:nth-child(2) { animation-timeline: --section-2; }
}
```

### 5.4 Canvas frame-scrubbing (the classic "148 images" scroll animation)
Apple's `css-lock` scroll-sequencer: a sequence of `canvas` frames, index = `Math.round(progress * (n-1))`, drawn in a `rAF` loop that keeps a `sticky canvas` aligned:
```js
const frames = [...]; let idx, cur = -1;
function update(progress) {
  idx = Math.max(0, Math.min(n - 1, Math.floor(progress * n)));   // progress 0..1
  if (idx !== cur) { cur = idx; ctx.drawImage(frames[idx], 0, 0); }
}
function loop() { /* scrollFraction within section → progress */ update(progress); requestAnimationFrame(loop); }
```
- iPad Air "Whoosh." hero + MacBook "fold open start→end" stills use exactly this: preload as JPG (lazy), draw only on index change. Cheap per-frame if you play the endframe between. DRAWBACK: sequential loads; Apple solves by shipping ~30 JPEGs with `loading="lazy"` posters — for a portfolio, 8–12 frames is indistinguishable to most eyes.

### 5.5 Fold-up / lift-up entrance (NOT a fade — a vertical fold)
Apple's section reveal: giant headline + image **fold open from the bottom** — implemented as a `clip-path` wipe (streaming) or a perspective rotateX flip into place (entrance):
```css
/* entrance: fold up on viewport entry */
[data-fold] { transform-origin: 50% 100%; }
@keyframes fold-in {
  0%   { opacity: 0; translate: 0 100%; scale: 1; }
  60%  { opacity: 1; }
  100% { opacity: 1; translate: 0 0; }
}
/* scroll-linked version (headline unfolds as it enters) */
@supports (animation-timeline: view()) {
  [data-fold] { animation: wipe-in linear both; animation-timeline: view(); animation-range: entry 0% cover 25%; }
  @keyframes wipe-in { 0% { clip-path: inset(0 0 100% 0); } 100% { clip-path: inset(0 0 0 0); } }
}
```
- The clip-path wipe from bottom (inset bottom grows) reads as "unfolding paper"; a rotateX variant: `from : rotateX(-90deg)` with `perspective: 1200px` on the parent.
- Fallback for Firefox (no `animation-timeline`): run the same keyframe once on `IntersectionObserver` entry (add `.revealed` class), respecting `prefers-reduced-motion: reduce`.

### 5.6 Cursor pointer over huge scroll-linked words
On stance sections the giant headline is a *link* (`a.section-headline`) that scrolls to the media / opens the sub-story; `cursor: pointer` is set on the text and hover underlines chevron sections. (In the iPad Air variant the pinch words are plain, the *whole media* is the scroll-link.)

### 5.7 Infinite auto-scrolling marquee (pure CSS)
```css
.marquee { overflow: hidden; white-space: nowrap; }
.marquee__track { display: inline-flex; width: max-content; animation: marquee var(--speed, 30s) linear infinite; }
.marquee__track > * { flex: 0 0 auto; }
@keyframes marquee { to { transform: translateX(-50%); } }
```
- Must duplicate content 2× (track = [A B C][A B C]) and translate exactly **-50%** for a seamless loop. Pause on hover: `.marquee:hover .marquee__track { animation-play-state: paused; }`. (Apple uses this for store product-topics and value-rails like brand strips.)

### 5.8 Parallax
```js
gsap.to(".layer--bg", { yPercent: -30, ease: "none",
  scrollTrigger: { trigger: ".scene", start: "top bottom", end: "bottom top", scrub: true } });
```
Background moves slower than copy (0.2 vs 0.82 speed factors); always `yPercent`, never `top/margin`.

### 5.9 Number counters & stat blocks
Stats ("2.3x", "18 hr", "9.5x") count up when their section enters view (IntersectionObserver → rAF easing), then sit static. Keep them compositor-only.

### 5.10 Accessibility & perf rules (from GSAP/MDN guidance)
- `@media (prefers-reduced-motion: reduce)` → kill all pin/scrub/parallax, keep content fully laid out and visible.
- `screen-reader-only` text for animated numeral equivalence (`aria-hidden` on the animated span + `<span class="visually-hidden">9.5x</span>`).
- Lazy-load below-fold media; poster frames; muted looped `<video playsinline preload="none">`.

---

## 6. Nav `<header>` specifics

```html
<header id="globalnav" class="globalnav">
  <div class="globalnav-scroller">           <!-- 44px, bg rgba(22,22,23,.8), blur -->
    <a class="globalnav-logo">  Apple glyph </a>
    <ul class="globalnav-list">  Store · Mac · iPad · iPhone · Watch · AirPods · TV&Home · Entertainment · Accessories · Support </ul>
    <ul class="globalnav-icons"> search glyph → overlay search · bag glyph → cart </ul>
  </div>
</header>
<div class="localnav-wrapper">               <!-- 52px, sticky top:44px, white blur -->
  <nav class="localnav">
    <a class="localnav-title">iPad Air</a>
    <ul class="localnav-menu"> Overview · Tech Specs · Compare </ul>
    <a class="button localnav-button">Buy iPad Air</a>
  </nav>
</div>
```
- **Behavior:** globalnav is fixed; localnav sticks at `top:44px`; both persist through the whole product page (product pages never hide the nav; only the main homepage lets it scroll off). Mobile: hamburger with slide-down panel; product pages keep sticky global + local.
- Visual: global always near-black translucent; local white blur w/ hairline that appears only when stuck; **the Buy pill in the localnav is the money tracking link** — Apple CTA's `data-analytics` click-stream attribute lives here.

---

## 7. PORTFOLIO APPLICABILITY — mapping Apple patterns to an AI/ML engineering portfolio (Vue3 + Vite)

| Apple pattern | Portfolio translation |
|---|---|
| **Sticky translucent global nav** | Thin translucent `rgba(22,22,23,.8)` bar w/ `backdrop-filter blur(20px)`. Left: monogram logo. Center: About · Experience · Projects · Skills · Contact. Right: paper-plane/"Let's talk" icon + **"Résumé"** filled pill. Sticky localnav (52px) could carry "Overview · Case Studies · Benchmarks · Contact" + "Contact" pill on the Projects page. |
| **Hero** (logo→H1→tagline→media→CTA) | Eyebrow logo = small "AI / ML ENGINEER" 14px grey caps. H1 96px SemiBold: "Building Intelligence." Tagline `#86868b`: "LLM systems, MLOps platforms, and computer vision — from prototype to production." Scrub-in hero media = a terminal typing a training loop / architecture diagram slowly zooming pinned (GSAP `pin` + `scrub` on `scale`). CTAs: filled blue pill **"View Projects"** + ghost pill **"Download Résumé"**. No paragraph. |
| **"Get the highlights" media-card rail** | Section "What I ship." — 4–6 cards w/ animated 3-frame stagger: "LLM / RAG systems", "MLOps & observability", "Computer vision", "Real-time inference", "Data pipelines", "Finetuning". Cards deep-link to Project IDs, hover = slight shadow lift. |
| **"Take a closer look" color chips** | "The stack." — swatch-style chips per specialization (e.g. PyTorch·Transformers·CUDA·Ray·Kubernetes·HuggingFace) that re-skin a hero diagram = "swatch swapping" pattern; keep icons monochrome so selection color pops. |
| **Lights-out narrative section** | Black (#000) "Why ML." / about strip: two-line H2 + body + a right-aligned photo of you on-dark (white text #f5f5f7, secondary #a1a1a6). |
| **Pinned scroll-zoom product story** | Projects case-study hero: each project page pins its cover architecture diagram and scales it ~1.2 while 3 phase captions (Problem → Approach → Impact) fade in a sticky left column. Reuse the `view-timeline` variant for the cover image + GSAP fallback for Firefox. |
| **Fold-up entrance** | Every section headline (`[data-fold]`) unfolds via `clip-path: inset` bottom-wipe on `view()` timeline; IntersectionObserver fallback + `prefers-reduced-motion` kill-switch. **Don't use fade** — this is the key differentiator. |
| **Benchmark comparison table** | "Benchmarks." — animated bar-comparison (M5-style) row: your finetuned model vs baseline vs SOTA on latency/accuracy/throughput; bars scrub-grow with scroll, giant stat "2.3× faster". Perfect story for an AI engineer: numbers are the product. |
| **Tech-spec tiles** | "Skills" grid of icon + label tiles (spec-chip grammar), grouping: ML Engineering / MLOps / CV / NLP / Backend / Infra. |
| **"Why Apple is best place to buy" benefit grid** | "Why work with me" — 5–6 cards (Delivery speed, Production-grade code, Research-to-product, Clear communication, Ownership, Benchmarks-first). Click-to-expand panel = modal pattern. |
| **"Keep exploring" contrast/router tiles** | Project recirculation grid ("Explore more projects.") with "Currently viewing" overkill → simply highlight active; footer link "See all projects ›". |
| **Marquee** | Skills marquee under the hero: "LLM Systems ✦ RAG ✦ PyTorch ✦ MLOps ✦ CUDA ✦ Computer Vision ✦ Real-time Inference ✦" — duplicated track, translateX(-50%), 30–40s linear infinite, pause on hover. |
| **Text-link grammar** | All secondary nav = blue `#06c` + `›` chevron links ("View case study ›", "GitHub ›", "LinkedIn ›"); blue `#06c` on light, `#2997ff` on dark sections. |
| **Navigation CTA pill** | Primary conversion pill ("Contact" / "Résumé") present in: localnav, hero, section 3/4 through page, contact CTA section. Repeats = Apple's "sprinkle CTAs" rule. |
| **Number counters** | "14 models shipped · 38% avg inference latency cut · 5 patents" — rAF counters on `IntersectionObserver` entry, with `visually-hidden` text for a11y. |

### Concrete design tokens to adopt verbatim
```css
:root {
  --bg-light: #f5f5f7;  --bg-white: #fff;  --bg-dark: #000;
  --text-1: #1d1d1f;  --text-2: #6e6e73;  --text-3: #86868b;
  --text-on-dark: #f5f5f7;  --text-2-dark: #a1a1a6;
  --accent: #0071e3;  --accent-hover: #0077ed;
  --link: #06c;  --link-dark: #2997ff;
  --hairline: #d2d2d7;
  --radius-pill: 980px;
  --gutter: clamp(20px, 6vw, 64px);
  --content: 1024px;  --content-hero: 1200px;
  --ease-1: cubic-bezier(0,0,.25,1);
}
```

### Suggested build order for the redesign
1. Design tokens + type scale + buttons only (static fidelity check).
2. Sticky global/localnav + hero (GSAP pin/scrub on cover, marquee).
3. Fold-up reveal system (`[data-fold]` view-timeline + IO fallback).
4. One flagship pinned case-study story (sticky caption column + scrub zoom).
5. Benchmark bars + number counters.
6. Cards/hover, benefits grid, recirculation, footer.

### Source URLs collected
- https://www.apple.com/in/ipad-air/ · https://www.apple.com/in/macbook-neo/ · https://www.apple.com/in/macbook-air/
- https://typenorm.com/articles/apple-ux-teardown · https://capturly.com/blog/apples-website-comprehensive-analysis-of-the-ux-design-with-heatmaps/
- https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
- https://css-tricks.com/recreating-apples-vision-pro-animation-in-css/ · https://o-rex.com/recreating-apples-vision-pro-animation-in-css/
- https://www.builder.io/blog/view-timeline · https://www.hontran.dev/blog/gsap-scrolltrigger-tutorial-pin-scrub-parallax
- https://frontendmasters.com/blog/infinite-marquee-animation-using-modern-css/ · https://www.frontend.fyi/tutorials/css-only-text-marquee
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations