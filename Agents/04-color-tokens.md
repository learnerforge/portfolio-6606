# 04 — Apple Design Tokens & Color Spec (Light Theme)

> **Goal:** Replace the current cyan/violet/fuchsia neon-gradient theme (`NEO-ORBIT`) with Apple-grade restraint: near-monochrome canvas, a single blue interactive accent, generous negative space, borderless rounded cards, and color appearing only in product imagery and the soft "Colorful" hero gradient — never as UI decoration.

**Sources (researched):**
- apple.com live CSS extraction: `#f5f5f7` fog canvas, `#1d1d1f` ink, `#6e6e73` muted, `#86868b` tertiary, `#0071e3` filled action, `#0066cc` link/outline, `#2997ff` link-on-dark, `#fafafc` nav-elevated, `#e8e8ed` hover wash.
- Apple HIG system colors (SwiftUI/UIKit light mode): blue `#007AFF`, orange `#FF9500`, green `#34C759`, purple `#AF52DE`, pink `#FF2D55`, red `#FF3B30`, gray `#8E8E93` / `#AEAEB2` / `#C7C7CC` / `#D1D1D6` / `#E5E5EA` / `#F2F2F7`.
- Apple Design System / layout-kit tokens: `--radius-sm 8px`, `--radius-md 11px`, `--radius-pill 980px`; `--duration-fast 0.1s/0.16s`, base `0.24s`, slow `0.32s`; nav `backdrop-filter: saturate(1.8) blur(20px)`.
- HIG typography: SF Pro Display for ≥ 28px display, SF Pro Text for ≤ 24px UI/body; 9 weights; hero 56/600, section 40/600, tile 28/400, body 17/400/25px, small 14/18px, caption 12/16px.
- iOS 26 Liquid Glass material params: blur radii 7/12/14px, layer shadow blur 40px, background blur 80px, depth, splay, lightAngle.
- 2025 MacBook Air "Colorful"/"sky blue" marketing gradient: soft, saturated-but-light pastel blue→purple→pink motion blurs — used as a restrained hero/marquee material, not the default theme.

---

## 1. CSS Custom-Property Token Set (`:root`, light)

The full CSS block below is the single source of truth. Hardcode nothing in components; always reference a `var(--…)`.

```css
/* ============================================================
   APPLE DESIGN SYSTEM — light theme (replaces NEO-ORBIT)
   ============================================================ */

:root {
  color-scheme: light;

  /* ---------- Surfaces / backgrounds ---------- */
  --canvas:            #ffffff;   /* primary page background, white card surface */
  --canvas-alt:        #f5f5f7;   /* alternating section bands, footer, badges  */
  --canvas-raised:     #fafafc;   /* elevated/frosted surfaces, nav after scroll */
  --fill-hover:        #e8e8ed;   /* interactive hover wash on light controls    */
  --fill-sunken:       #f0f0f2;   /* inset / recessive wells (subtle)            */
  --surface-card:      #ffffff;   /* elevated card surface (white)               */

  /* ---------- Translucent nav / material------------ */
  --nav-material:        rgba(255, 255, 255, 0.72);  /* light frosted glass     */
  --nav-material-blur:   20px;                        /* saturate(1.8) blur(20px) */
  --nav-material-sat:    1.8;
  --glass-tint:          rgba(255, 255, 255, 0.55);   /* liquid-glass translucency */
  --glass-blur-sm:       7px;
  --glass-blur-md:       12px;
  --glass-blur-lg:       14px;

  /* ---------- Text (glyphs) ---------- */
  --text-primary:    #1d1d1f;   /* principal text, selected commerce            */
  --text-secondary:  #6e6e73;   /* secondary / caption / subdued copy           */
  --text-tertiary:   #86868b;   /* tertiary labels, meta, hints                 */
  --text-placeholder:#aeaeb2;   /* input placeholders, disabled-adjacent        */
  --text-disabled:   #d2d2d7;   /* disabled / inactive glyphs                   */
  --text-on-accent:  #ffffff;   /* text on blue filled buttons                  */

  /* ---------- Accent (blue — the ONLY interactive color) ---------- */
  --accent:            #0071e3;   /* filled action buttons, focus ring          */
  --accent-hover:      #0077ed;   /* hover state of filled action               */
  --accent-press:      #0062c4;   /* active/pressed state                       */
  --accent-link:       #0066cc;   /* inline links & outline-button text/border  */
  --accent-link-hover: #0077ed;
  --accent-tint:       rgba(0, 113, 227, 0.10);   /* subtle blue wash / badges   */
  --accent-tint-soft:  rgba(0, 113, 227, 0.06);
  --accent-ring:       3px;       /* focus ring blur/width                      */

  /* ---------- Semantic highlights (system colors, NONE used as UI chroma) ---- */
  --sys-orange:  #ff9500;   /* promotion / attention                          */
  --sys-green:   #34c759;   /* success / online status                        */
  --sys-purple:  #af52de;   /* creative / accent variety                      */
  --sys-pink:    #ff2d55;   /* pricing / campaign emphasis                    */
  --sys-red:     #ff3b30;   /* error / destructive                            */
  --sys-teal:    #5ac8fa;
  --sys-gray:    #8e8e93;

  /* ---------- Hairlines & borders ---------- */
  --hairline:        rgba(0, 0, 0, 0.10);   /* default hairline border          */
  --hairline-strong: rgba(0, 0, 0, 0.16);
  --hairline-faint:  rgba(0, 0, 0, 0.06);

  /* ---------- Shadows (Apple 3-layer) ---------- */
  --shadow-sm:  0 2px 8px  rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md:  0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.06);
  --shadow-lg:  0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-glass: 0 20px 40px rgba(0, 0, 0, 0.22);   /* liquid-glass layer      */

  /* ---------- Gradient material ("Colorful" hero/marquee) ---------- */
  /* Soft blue→purple→pink. Reserve ONLY for special hero/marquee moments.   */
  /* Stops can be used directly; the theme body stays monochrome.            */
  --gradient-material:
    radial-gradient(120% 120% at 18% 12%, #bfe3ff 0%, transparent 55%),
    radial-gradient(120% 120% at 82% 18%, #e5c7ff 0%, transparent 55%),
    radial-gradient(130% 130% at 50% 92%, #ffd1e0 0%, transparent 60%),
    #f5f5f7;
  /* flat stop ramp (for linear use / texture):                              */
  --gradient-material-stops:
    #c7e5ff 0%,   /* blue  */
    #d6c8ff 45%,  /* purple*/
    #ffcddc 100%; /* pink  */
  --gradient-material-hard:
    linear-gradient(115deg, #c7e5ff 0%, #d6c8ff 50%, #ffcddc 100%);

  /* ---------- Buttons ---------- */
  --btn-fill:            var(--accent);
  --btn-fill-hover:      var(--accent-hover);
  --btn-fill-press:      var(--accent-press);
  --btn-radius:          980px;      /* pill */
  --btn-padding-md:      11px 21px;  /* large CTA  (44px tall) */
  --btn-padding-sm:      8px 15px;   /* compact    (36px tall) */
}
```

### Usage guardrails
- **One accent.** Everything interactive is `#0071e3`-family. Semantic system colors (`--sys-*`) appear only as status/feedback or in real product imagery — never as decorative UI chrome slipping back toward the neon look.
- **No decorative shadows** on flat cards — Apple surfaces are flat or use subtle fills. Shadows are reserved for raised/elevated moments (modals, cards in a stack, glass panels). `--shadow-*` above are the only allowed shadows.
- **Body font-weight max 600.** Never 700+ on body copy; display headings may reach 600–700, never 800 for running text.

---

## 2. Typography Tokens

### Font stacks
The site currently uses **Sora** (display), **Manrope** (body), **IBM Plex Mono** (mono). Real SF Pro is proprietary and not web-licensed — we keep the Sora/Manrope pairing but align *metrics* to SF Pro and preserve the Apple fallback chain (`-apple-system`, `system-ui`). **Inter is the closest free SF Pro substitute** if we ever swap; Manrope/Sora already read Apple-caliber geometric. Keep current stacks (below) with Apple-correct tracking/leading, and always include the native stack as fallback.

```css
:root {
  --font-display: 'Sora', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  --font-body:    'Manrope', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif;
  --font-mono:    'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace;

  /* Optional closer drop-in (free & metrics-compatible with SF Pro): */
  /* --font-display: 'Inter Tight', ... ;  --font-body: 'Inter', ... ; */
}
```

### Type scale (Apple HIG; values in rem @ 16px base)
| Step | px | rem | Weight | Line-height | Letter-spacing (em) | Use |
|------|----|----|--------|-------------|----------------------|-----|
| caption | 12 | 0.75 | 400 | 1.33 | -0.01 | labels, meta, footnotes |
| small | 14 | 0.875 | 400 | 1.29 | -0.016 | compact UI, buttons(sm), captions |
| body | 17 | 1.0625 | 400 | 1.47 | -0.022 | default body, nav, buttons |
| lead | 21 | 1.3125 | 400 | 1.38 | -0.024 | intro paragraphs |
| tile | 28 | 1.75 | 400 | 1.14 | -0.032 | card / tile headings |
| section | 34 | 2.125 | 600 | 1.10 | -0.037 | section headings |
| headline | 44 | 2.75 | 600 | 1.05 | -0.042 | big section titles |
| hero | 56 | 3.5 | 600 | 1.07 | -0.028 | hero headline |
| display-lg | 64 | 4 | 600 | 1.00 | -0.03 | marquee/display |
| display-xl | 80 | 5 | 600 | 1.00 | -0.03 | hero display |
| display-xxl | 96 | 6 | 600 | 0.98 | -0.03 | flagship |

```css
:root {
  --text-caption:   0.75rem;  /* 12 */
  --text-small:     0.875rem; /* 14 */
  --text-body:      1.0625rem;/* 17 */
  --text-lead:      1.3125rem;/* 21 */
  --text-tile:      1.75rem;  /* 28 */
  --text-section:   2.125rem; /* 34 */
  --text-headline:  2.75rem;  /* 44 */
  --text-hero:      3.5rem;   /* 56 */
  --text-display-lg:4rem;     /* 64 */
  --text-display-xl:5rem;     /* 80 */
  --text-display-xxl:6rem;    /* 96 */

  --leading-tight:  1.0;
  --leading-snug:   1.05;
  --leading-normal: 1.2;
  --leading-relax:  1.47;
  --leading-loose:  1.6;

  /* Weights */
  --fw-regular: 400;
  --fw-medium:  500;
  --fw-semibold:600;
  --fw-bold:    700;
  --fw-extrabold:800;   /* display accents only */

  /* Letter-spacing (px, at base size) */
  --track-tight:   -0.02em;
  --track-normal:  0;
  --track-wide:    0.02em;
  --track-label:   0.04em;   /* eyebrow/uppercase labels */
}
```

**Rule:** ≥ 28px use the display family; ≤ 24px use the body family. Increase line-height slightly (+0.02–0.06) on the Manrope/Sora substitutes vs. SF Pro for readability.

---

## 3. Spacing / Radii / Motion Tokens

```css
:root {
  /* ---------- 8pt grid ---------- */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* ---------- Radii ---------- */
  --radius-sm:    8px;    /* cards, inputs        */
  --radius-md:    11px;   /* larger surfaces      */
  --radius-lg:    18px;   /* feature cards        */
  --radius-xl:    22px;   /* tonal panels         */
  --radius-2xl:   28px;   /* hero / large cards   */
  --radius-pill:  980px;  /* buttons, chips, nav  */
  --radius-round: 999px;  /* avatars / dots       */

  /* ---------- Focus ring ---------- */
  --focus-width:    3px;
  --focus-offset:   4px;
  --focus-color:    var(--accent);
  --focus-ring:     0 0 0 var(--focus-width) var(--focus-color);
  --focus-ring-soft:0 0 0 4px rgba(0, 113, 227, 0.25);

  /* ---------- Motion ---------- */
  --duration-fast: 0.16s;
  --duration-base: 0.32s;
  --duration-slow: 0.54s;
  --duration-slower:0.8s;

  --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);      /* Apple standard exit  */
  --ease-standard:cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);  /* liquid-glass overshoot */

  /* ---------- Blur materials ---------- */
  --blur-nav:   20px;   /* saturate(1.8) blur(20px) */
  --blur-panel: 40px;
  --blur-glass: 80px;
}
```

---

## 4. Dark Mode Consideration (future)

No dark mode ships now — `color-scheme: light` is fixed. If dark is added later, remap only the semantic tokens (never touch component values). Recommended light→dark mapping:

| Light token | Dark equivalent (HIG dark) |
|---|---|
| `--canvas` `#ffffff` | `#000000` |
| `--canvas-alt` `#f5f5f7` | `#161617` |
| `--canvas-raised` `#fafafc` | `#1d1d1f` |
| `--fill-hover` `#e8e8ed` | `#2c2c2e` |
| `--nav-material` `rgba(255,255,255,.72)` | `rgba(22,22,23,.72)` |
| `--text-primary` `#1d1d1f` | `#f5f5f7` |
| `--text-secondary` `#6e6e73` | `#a1a1a6` |
| `--text-tertiary` `#86868b` | `#86868b` |
| `--text-placeholder` `#aeaeb2` | `#6e6e73` |
| `--text-disabled` `#d2d2d7` | `#48484a` |
| `--accent` `#0071e3` | `#2997ff` |
| `--accent-hover` `#0077ed` | `#0a84ff` |
| `--accent-link` `#0066cc` | `#2997ff` |
| `--hairline` `rgba(0,0,0,.10)` | `rgba(255,255,255,.16)` |
| `--gradient-material` bg `#f5f5f7` | `rgba(16,16,20,.6)` over `#000` |

Wrap in `@media (prefers-color-scheme: dark)` overriding the same custom-property names — components are already token-driven and need zero edits.

---

## 5. Semantic Mapping — Current Theme → New Apple Theme

| Current NEO-ORBIT | New Apple token | Notes |
|---|---|---|
| `--bg` `#f8f9fc` | `--canvas` `#ffffff` | page base |
| `--bg-2` `#f0f1f5` | `--canvas-alt` `#f5f5f7` | alternate bands / footer |
| `--panel` `#ffffff` | `--surface-card` `#ffffff` / `--canvas-raised` `#fafafc` | cards |
| `--panel-2` `#f4f5f8` | `--fill-sunken` `#f0f0f2` | inset wells |
| `--line` `rgba(0,0,0,.07)` | `--hairline` `rgba(0,0,0,.10)` | borders |
| `--line-strong` `rgba(0,0,0,.14)` | `--hairline-strong` `rgba(0,0,0,.16)` | stronger borders |
| `--text` `#1a1a2e` | `--text-primary` `#1d1d1f` | ink |
| `--text-dim` `#6b6b80` | `--text-secondary` `#6e6e73` | secondary copy |
| `--text-faint` `#9a9ab0` | `--text-tertiary` `#86868b` / `--text-placeholder` `#aeaeb2` | tertiary/placeholder |
| `--cyan` `#0891b2` | `--accent` `#0071e3` (interactive) OR `--sys-teal` `#5ac8fa` (semantic) | no more cyan UI |
| `--violet` `#7c3aed` | `--sys-purple` `#af52de` (semantic only) | no violet accents |
| `--fuchsia` `#c026d3` | `--sys-pink` `#ff2d55` (semantic only) | no fuchsia accents |
| `--emerald` `#059669` | `--sys-green` `#34c759` | semantic success |
| `--amber` `#d97706` | `--sys-orange` `#ff9500` | semantic warning |
| `--grad` (cyan→violet→fuchsia 120deg) | `--gradient-material-hard` (blue→purple→pink 115deg) | special hero/marquee only |
| `--grad-soft` (8% tints) | `--accent-tint` `rgba(0,113,227,.10)` | subtle accents |
| body radial-gradient tint glows | remove → flat `--canvas`; color lives in `--gradient-material` | kill background neon |
| `--font-display` Sora | Sora (display) + `-apple-system` fallback | keep, fix tracking/weight |
| `--font-body` Manrope | Manrope (body) | keep, metrics per HIG |
| `--font-mono` IBM Plex Mono | IBM Plex Mono | keep |
| focus `outline: 2px solid var(--cyan)` | `box-shadow: var(--focus-ring)` blue 3px + offset | per spec §6 |
| scrollbar cyan→violet gradient | `--sys-purple`/`--sys-pink` thin, subtle or neutral | decorative chrome removed |
| button/ghost gradients | `--btn-fill` blue pill / plain `--btn-plain` | §6 |

---

## 6. Button Spec — Apple Pill Buttons

### Filled (primary action)
- Shape: pill `border-radius: var(--radius-pill)` (980px).
- Large CTA: `height 44px`, `padding var(--btn-padding-md)` `11px 21px`, `font 17px/400` body family.
- Compact: `height 36px`, `padding var(--btn-padding-sm)` `8px 15px`, `font 14px/400`.
- Colors: bg `var(--accent) #0071e3`, text `var(--text-on-accent) #ffffff`, no border, no shadow (flat).
- Hover: bg `var(--accent-hover) #0077ed`.
- Press: bg `var(--accent-press) #0062c4`.

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  border: 0; cursor: pointer; white-space: nowrap;
  font-family: var(--font-body); font-weight: var(--fw-regular);
  border-radius: var(--radius-pill);
  color: var(--text-on-accent);
  background: var(--btn-fill);
  transition: background var(--duration-fast) var(--ease-out);
  -webkit-appearance: none; appearance: none;
}
.btn--lg  { height: 44px; padding: 0 21px; font-size: var(--text-body); }
.btn--sm  { height: 36px; padding: 0 15px; font-size: var(--text-small); }
.btn:hover { background: var(--btn-fill-hover); }
.btn:active{ background: var(--btn-fill-press); }
```

### Outline (secondary / "Más información" — plain)
Apple's secondary button is the **plain** style: transparent background, **blue text** `--accent-link #0066cc`, animated **underline** on hover.

```css
.btn--plain {
  background: transparent;
  color: var(--accent-link);
  height: auto; padding: 4px 0;
  border-radius: 0;
}
.btn--plain::after {
  content: ""; display: block; height: 1px;
  background: currentColor;
  transform: scaleX(0); transform-origin: left;
  transition: transform var(--duration-base) var(--ease-out);
}
.btn--plain:hover::after { transform: scaleX(1); }
.btn--plain:hover { color: var(--accent-link-hover); }
```

### Focus states (both variants)
Apple uses a blue 3px focus ring with offset for keyboard users — not outline.

```css
:where(.btn, a, button, input, [tabindex]) :focus-visible,
.btn:focus-visible, a:focus-visible, button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring); /* 0 0 0 3px #0071e3 */
  border-radius: var(--radius-pill);
}
/* on white/filled surfaces prefer the soft ring: */
.btn--fill:focus-visible { box-shadow: var(--focus-ring-soft); }
```

**Rules:** Apple never bolds button labels (400 only). Never use warm colors for CTAs — blue `#0071e3` is the only action color. Buttons are flat (no inner shadows).

---

## 7. Summary of the "Restraint" Rules
1. **One blue.** `#0071e3` for every interactive element; nothing else.
2. **Monochrome canvas.** `#ffffff` / `#f5f5f7` / `#fafafc` only; the neon body-glow gradients are deleted.
3. **Color = content.** Semantic system colors and the `--gradient-material` appear only for real status/feedback, product imagery, or a single reserved hero/marquee moment.
4. **Borderless rhythm.** Alternate white/gray bands instead of dividers; cards are borderless with `18/22/28px` radii.
5. **Flat > shadow.** Shadows only for elevation; keep Apple's 3-layer softness.
6. **Type > chrome.** Generous whitespace and SF-Pro-metric type carry the hierarchy; tracking must be Apple-tight, body weight ≤ 600.
7. **Notation.** Reference every token as `var(--…)`; never hardcode hex in components.
