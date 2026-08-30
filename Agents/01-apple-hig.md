# Apple HIG Research Notes — Portfolio Redesign Spec

**Source:** Official Apple Human Interface Guidelines (developer.apple.com/design), WWDC25 "Meet Liquid Glass" (session 219) & "Get to know the new design system" (session 356), plus measured analysis of `www.apple.com` production CSS (May 2026 snapshot) and the UIKit/SwiftUI animation APIs.

**Audience:** Vue3 + CSS designer building an Apple-quality personal portfolio.
**Role of this file:** Primary specification for the redesign. Apply every section concretely.

> Truth note: Apple publishes semantic *named tokens* (semantic colors, Dynamic Type styles, spring timers) but refuses to publish a fixed hex spec, because its colors are *adaptive by design* (light/dark, Increased Contrast, P3 gamut, vibrancy). The hex values in this doc are **community-measured references** of the shipped Apple.com CSS / iOS colors, verified across multiple independent teardowns. Use them as tokens, but design to *roles* — not raw hex — and ship light+dark variants for every custom color.

---

## 1. Design themes (Clarity · Deference · Depth · Consistency)

Apple's long-stated principles, stated three since iOS 7; "Consistency" is the connective tissue. These are *intentions that drive every decision* — translate them to concrete CSS.

### Clarity
> Text is legible at every size; icons are precise and lucid; adornments are subtle and appropriate; a sharpened focus on functionality motivates design.

**Concretely:**
- One neutral system typeface (SF Pro), no more than 3–4 type roles per view.
- Text must be legible at every size *and* at accessibility sizes (see §3, §8) — semantic styles that scale, never fixed pixels in a vacuum.
- Remove decorative clutter so the *content* carries the message.
- Use the "Increase Contrast", dark mode, and large-type passes as a forcing function for clarity.

**HOW TO APPLY (Vue3/CSS):**
- Build a `--text-*` token scale (see §3) and use type roles, never ad-hoc px sizes in components.
- Create a "clarity checklist": every screen legible at 300% font scale (top-anchor key content), in dark mode, and under increase-contrast.
- Keep at most one focal element per section; if two things shout, neither is clear.

### Deference
> Fluid motion and a clean interface help people understand and interact with content, while never competing with it.

**Concretely:**
- The UI *framing* is quiet; the *content* (text, project imagery) is the star.
- On Apple.com: near-monochrome UI, a single blue accent reserved for interactive moments, and all chromatic interest comes from product/project imagery — never from UI decoration.
- Platform chrome (nav bars, toolbars) becomes translucent and recedes; the content scrolls beneath it.
- Physics-based motion feels like a natural consequence of interaction, not a performance (see §5).

**HOW TO APPLY (Vue3/CSS):**
- UI chrome is monochrome grayscale (`#1d1d1f` text, `#f5f5f7` bands, white canvas). Only ONE accent color exists, reserved for CTA's and links.
- Let your personal project imagery/photos carry all color. Mockups, screenshots, and personal photos are the palette.
- Nav and hero CTAs get translucent glass treatment so they defer to content behind them.

### Depth
> Visual layers and realistic motion impart vitality, and heighten people's awareness and understanding of navigating through multiple pieces of content.

**Concretely:**
- Layers (z-axis): background → content → transparent/translucent chrome → hierarchy communicated by *blur, vibrancy, scale, and elevation*, not borders and shadows everywhere.
- On marketing pages, depth comes from large product imagery above alternating flat backgrounds — hierarchy via *position, size, whitespace, and background alternation* rather than box-shadows (Apple.com uses essentially **zero drop shadows on cards**).
- Material thickness maps directly to prominence on the z-axis.

**HOW TO APPLY (Vue3/CSS):**
- Use z-index + `backdrop-filter` for layered chrome; layer panels via translucency/blur rather than `box-shadow` stacking.
- Don't use box-shadows as the "card" signal — use background-color alternation (`#ffffff` ↔ `#f5f5f7`) + generous spacing to establish hierarchy.
- Reserve real depth cues (soft elevation on hover, 0.5px glass borders, specular top highlight) for interactive elements only.

### Consistency
- Reuse the same system controls, semantic colors, type styles, spacing tokens, and motion tokens everywhere. Global tokens are not an option — they are the discipline that produces "designed by Apple."

---

## 2. Color system

### Semantic vs. brand color — the core decision
Apple's system is **semantic, not literal**. Tokens are named by *role* (`label`, `secondaryLabel`, `systemBackground`, `systemBlue`) and auto-adapt to light/dark/increase-contrast/vibrancy. Color's job is communication: brand identity, visual continuity, status, feedback — not decoration.

**"COLOR as brand" vs "COLOR as semantic":**
- **Semantic color** = the color a role occupies (primary text, secondary text, separator, background, link, destructive). Same role = same color everywhere. Do NOT hard-code; define tokens that flip with appearance.
- **Brand color (tint/accent)** = a single user-selectable accent (`tintColor` / `controlAccentColor`) applied to interactive emphasis: primary button fill, selection highlight, active tab, focus. On macOS this is the user's System Settings accent — `multicolor` uses your brand accent, otherwise the user's color replaces it.
- **Rule:** If you use your brand color to signal "this is interactive," never use the same/similar color on non-interactive text — it breaks the affordance.

### Dynamic system colors
iOS/macOS define dynamic colors that adapt to light & dark and to Increased Contrast. Hierarchical bg families: `systemBackground` (primary/secondary/tertiary), `systemGroupedBackground`. Foreground: `label`, `secondaryLabel`, `tertiaryLabel`, `quaternaryLabel`, `placeholderText`, `separator`, `opaqueSeparator`, `link`.

**Apple's measured palette (light mode, community reference):**
- `label` (primary text): dark `#000` (iOS) / Apple.com uses **`#1d1d1f`** for text.
- `secondaryLabel`: ~60% black (Apple.com secondary text measured **`#707070`**).
- `systemBackground`: white `#FFFFFF`; Apple.com canvas **`#ffffff`**, alternating bands **`#f5f5f7`**, elevated panel **`#fafafc`**, nav text **`#474747`**.
- `separator`: light **`#d6d6d6`** (Apple.com hairlines only, rarely used).
- Dark mode: text inverts to near-white, backgrounds near-black (see §2.3 for a concrete dark flip).

### System accent/tint colors (iOS, community-measured)
| Color | Hex (light) | Dark | Use |
|---|---|---|---|
| Blue (default tint) | `#007AFF` | `#0A84FF` | Primary interactive accent |
| Red | `#FF3B30` | `#FF453A` | Destructive/important |
| Green | `#34C759` | `#30D158` | Success/positive |
| Orange | `#FF9500` | `#FF9F0A` | |
| Indigo | `#5856D6` | `#5E5CE6` | |
| Gray | `#8E8E93` | `#8E8E93` | |

**Apple.com accent pair (marketing):**
- Filled CTA button: **`#0071e3`** (and `#0077ED` on hover) — reserved for the filled primary button ONLY.
- Inline text link: **`#0066cc`** (a slightly darker blue).
- **Golden rule from teardown:** "Don't introduce accent colors beyond #0071e3 and #0066cc. Even the orange 'Nuevo' badge is used at most once per page." Reserve accent for interactive moments; never decorative.

### Contrast (WCAG AA as guidance)
Accessibility Inspector uses these WCAG Level AA minima (from official HIG):
| Text size | Weight | Min contrast ratio |
|---|---|---|
| Up to 17 pts | all | **4.5:1** |
| 18 pts | all | **3:1** |
| all | Bold | **3:1** |

- Non-text (icons, graphical objects, component boundaries) should also meet ~3:1.
- Check contrast in **both** light and dark appearances.
- If default colors don't satisfy AA, at least provide a higher-contrast scheme when the system "Increase Contrast" is on. Apple's system colors ship accessible variants.

### Don't use color alone
- Some people can't differentiate certain pairings (red-green, blue-orange). Pair every color-coded meaning with a **text label or distinct shape/icon** so meaning survives color blindness.
- Be aware of cultural color meaning (red = danger vs. good fortune) — think about localization.

### When to use color in the design
Apple.com model: **near-white backgrounds (`#ffffff` / `#f5f5f7`) + dark text (`#1d1d1f`) + a single limited accent (`#0071e3`)**. All chromatic interest lives in product imagery. Use background color only when there's something to communicate; never a full-screen flourish.

**HOW TO APPLY (Vue3/CSS design tokens):**
```css
:root{
  --canvas: #ffffff;
  --canvas-alt: #f5f5f7;         /* alternating section */
  --canvas-raised: #fafafc;      /* nav-open / elevated */
  --text-primary: #1d1d1f;
  --text-secondary: #707070;     /* 60% gray — meet 3:1+ */
  --text-tertiary: #86868b;      /* footnotes/legal — use sparingly */
  --nav-text: #474747;
  --border: #d6d6d6;             /* hairlines only */
  --accent: #0071e3;             /* filled CTA */
  --accent-strong: #0077ED;      /* CTA hover */
  --link: #0066cc;               /* inline links */
}
@media (prefers-color-scheme: dark){
  :root{
    --canvas: #000000;            /* OLED base */
    --canvas-alt: #101012;        /* Apple dark alt ~ #101012 */
    --canvas-raised: #1c1c1e;
    --text-primary: #f5f5f7;
    --text-secondary: #86868b;
    --text-tertiary: #6e6e73;
    --border: rgba(255,255,255,.12);
    --accent: #0A84FF;
    --link: #2997ff;              /* Apple dark link */
  }
}
```
- Define every color as a token; never inline hex in components.
- Force a test pass in light + dark + high-contrast.
- Prove every accent use is interactive (CTA / link / active state / focus), not decoration.

---

## 3. Typography (SF Pro & Dynamic Type)

### The system: San Francisco
- **SF Pro** = neutral, flexible, sans-serif, the system font on iOS/iPadOS/macOS/tvOS/visionOS. Nine weights (Ultralight→Black). Complaints: SF Pro Text (≈<20pt optical) / SF Pro Display (≈≥20pt optical) are now one **variable font** with an `opsz` (optical size) axis + `wght` + `wdth`.
- **SF Mono** (code), **SF Compact** (watchOS), **New York** (serif editorial companion).
- Web fallbacks: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial`. **Inter** is the closest free cross-platform substitute; **system-ui** for display.

### Dynamic Type: the semantic text scale (11 named styles)
These are semantic *roles*, defined at the user's **"Large" (default) setting** in pt, and scale up/down automatically (xSmall→XXXLarge plus Accessibility AX1–5, ~up to 310% at AX5):

| Style | Size (pt, Large) | Weight | Emphasized | Use |
|---|---|---|---|---|
| Large Title | 34 | Regular | Bold | Hero/heading |
| Title 1 | 28 | Regular | Bold | Section header |
| Title 2 | 22 | Regular | Bold | Subsection |
| Title 3 | 20 | Regular | Semibold | Minor heading |
| Headline | 17 | **Semibold** | Semibold | Emphasized body, nav |
| **Body** | **17** | Regular | Semibold | Default paragraph |
| Callout | 16 | Regular | Semibold | Supporting body |
| Subhead | 15 | Regular | Semibold | Secondary header |
| Footnote | 13 | Regular | Semibold | Small meta |
| Caption 1 | 12 | Regular | Semibold | Captions |
| Caption 2 | 11 | Medium | Semibold | Minimum readable |

- **17pt Body is the legibility floor** for arm's-length reading (this is why Apple.com sets body at 17px with `-0.022em` tracking).
- Leading (line-height) increases with size; Apple ships per-style leading (~/1.4 for body up to ~1.1 for large titles).

### Apple.com marketing type scale (measured — THIS is your portfolio's display system)
Minor-third (1.2) scale from a 20px base. Two families: **SF Pro Display** (headlines, tight tracking) + **SF Pro Text** (body/nav).

| Role | Font | Size | Weight | Line-height | Letter-spacing | Notes |
|---|---|---|---|---|---|---|
| **Display (hero)** | SF Pro Display | **96px** | **600–700** | 1.04 | **-1.44px** | Signature "enormous headline floating in white" |
| Display 2 | SF Pro Display | 80px | 700 | 1.05 | ~-1.2px | Sub-hero |
| Display 3 | SF Pro Display | 56px | 600 | 1.07 | -0.28px | Section opener |
| 44px | SF Pro | 44px | 400 | 1.0 | — | |
| Heading (H1) | SF Pro Text | 40px | 600 | 1.2 | -0.01em | Main section title |
| H2 | SF Pro Text | 28px | 600 | 1.2 | +0.007em | Sub-section |
| H3 | SF Pro Text | 21px | 600 | 1.3 | +0.011em | Card title |
| **Body** | SF Pro Text | **17px** | **400** | 1.4–1.47 | **-0.022em** | Canonical reading text |
| Sub-body | SF Pro Text | 14px | 400 | 1.5 | — | Description |
| Caption/nav | SF Pro Text | 12px | 400 | 1.5 | +0.01em | Footer, nav links |

**Key Apple typographic behaviors:**
- **Ultra-large display headlines** (96px is the art direction; never go below ~40px on hero marketing sections — the system depends on oversized type to create the "cathedral of white space").
- Display sizes: **tight letter-spacing** (negative tracking up to -1.44px at 96px), **tight line-height** (1.04–1.07).
- Mid/body sizes: **negative-to-slightly-positive tracking**, **open line-height** (1.4–1.5). This *contrast between display and body* creates hierarchy without a size jump.
- **Weight discipline:** 600–700 for display headings, **400 for body**. Headlines usually regular/semibold weight, not black — Apple almost never sets headlines in weight ≥700 except the very largest marketing lines.
- **`$` sign / prices:** numbers use tabular figures — apply `font-feature-settings: "tnum"` (Apple uses `"numr"`) so digits align in lists/tables/prices.
- **ALL CAPS:** avoid ALL CAPS for body/headlines. There is one legitimate use: **tiny UI labels** (eyebrows, section kickers, button labels, nav) set at ~12px/600 with 0.05–0.08em letterspacing. That's the Apple "label" style. Never uppercase body prose.
- **Optical sizing:** use font-stretch/weight so small text isn't just scaled-down large text.

**HOW TO APPLY (Vue3/CSS):**
```css
--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;

--text-display: clamp(56px, 10vw, 96px) / 1.05 weight 700 letter-spacing -1.44px;  /* hero */
--text-h1: clamp(40px, 6vw, 56px) / 1.07 weight 600 letter-spacing -0.28px;
--text-h2: 28px / 1.2 weight 600;
--text-h3: 21px / 1.3 weight 600;
--text-body: 17px / 1.47 weight 400 letter-spacing -0.022em;
--text-sub:  14px / 1.5 weight 400;
--text-label: 12px / 1.5 weight 600 letter-spacing 0.06em;  /* uppercase kickers */
```
- Mobile: scale display down via `clamp()` (96→56→40→32 on breakpoints) — Apple's noscript CSS shows 48px → 40px → 32px on small screens.
- Always pair with unitless line-height and rem-based sizes driven by a root `html { font-size }` so you can honor user text-size preferences (see §8 Dynamic Type).

---

## 4. Layout & Spacing

### 8pt grid
- iOS measures in **points**; spacing/sizing snaps to **multiples of 8** so values land on whole pixels at @2x/@3x. Use a **4pt sub-grid** for typographic/baseline detail.
- **Standard scale: 4, 8, 12, 16, 24, 32, 40, 48, 64.** (12 = 4pt sub-grid; 20 is the iOS "large" margin exception on tablets.)

### Margins & safe areas
- **System layout margins:** 16pt on phones, 20pt on tablets/larger. `systemMinimumLayoutMargins` keeps root margins ≥ system minimum.
- Respect safe-area insets (Dynamic Island, home indicator, status bar). On web: use `env(safe-area-inset-*)` and don't let interactive content sit inside unsafe zones.
- **Avoid full-width buttons** — inset them from the edges and align to safe areas/layout margins.

### Alignment & hierarchy
- Content aligned to a consistent grid; **content a mastery of whitespace is as important as content** — Apple uses vast negative space.
- Hierarchy conveyed by panel background alternation + spacing, not borders.

### Apple.com marketing column (your primary structural model)
- **Clean centered column ~980px** (Apple uses `980px` max content width on desktop marketing, with `692px` and `87.5%` at tablet/mobile breakpoints).
- Sections are **full-width bands** alternating `#ffffff` / `#f5f5f7`, with **100–120px vertical section gaps** and generous internal whitespace.
- Text in narrow columns (~560px) centered, against a wider visual area (product image).
- The global nav is a single sticky 44px bar; content scrolls *beneath* translucent chrome.
- **No borders to separate sections — alternate the canvas color instead.** Never use shadows/card elevation for hierarchy.

### Z-axis layering (on web)
- Ground → content → chrome. Chrome (nav, floating tab bar/pill) is translucent `backdrop-filter` glass with elevated z-index; content scrolls underneath.
- iOS 26 "floating chrome": nav/tab/toolbar float as glass over content that passes beneath; add bottom content inset so the last item clears the floating bar at rest.

**HOW TO APPLY (Vue3/CSS):**
```css
.container { max-width: 980px; margin-inline: auto; padding-inline: 24px; }
/* section rhythm */
section { background: #fff; padding-block: 120px; }
section:nth-child(odd) { background: #f5f5f7; }       /* alternate bands */
section > .container { /* centered 980 column */ }
@media (max-width: 1068px){ section{ padding-block: 90px; } .container{padding-inline:22px;} }
@media (max-width: 735px){ section{ padding-block: 64px; } .container{padding-inline:16px;} }
```
- Spacing scale tokens: `--sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:20px; --sp-6:24px; --sp-7:32px; --sp-8:48px; --sp-9:64px; --section:120px`.
- Grid: use CSS grid with 8pt-aligned column gaps/gutters; align to a 4/8pt baseline.
- Nav: `position: sticky; top:0; height:44px;` glass background, `padding-inline:16px`.
- Never separate sections with borders; switch canvas color. Reserve shadows for interactive depth.

---

## 5. Motion

### The four HIG recommendations (official)
1. **Make motion purposeful** — support the experience without overshadowing it. Don't add motion for its own sake; gratuitous animation distracts and can cause discomfort. Motion conveys status, provides feedback & instruction, enriches experience.
2. **Honor reduce-motion / make motion optional** — not everyone can or wants motion; never let motion be the *only* way to communicate important info. Pair visual feedback with text/audio/haptics; respond to the OS accessibility setting (`prefers-reduced-motion` on web). Apple's own Reduce Motion swaps slide/zoom for **dissolve/fade**.
3. **Use spring physics** (tension, friction/damping, mass) — user-driven motion. Because springs don't assume the interaction is finished, they adapt fluidly to interruptions and pick up the gesture's velocity — easing curves can't.
4. **Follow recommended timing** — brief, precise, realistic. Feedback animation should be short and exact so it feels lightweight and unobtrusive. Direction encodes spatial memory (a panel that slides *down* to open slides *up* to close). Let people cancel motion; don't block input.

### Apple's spring model (UIKit / SwiftUI)
- `UISpringTimingParameters` — damping ratio = `damping / (2 * sqrt(stiffness * mass))`.
- Physical knobs: **mass** (heaviness of object), **stiffness/tension** (how taut; higher = snappier), **damping/friction** (how energy/settle), **initialVelocity** (picks up gesture speed; e.g. `dx/dy=0` when still).
- Modern SwiftUI (iOS 17+): **perceptual `duration` + `bounce`** instead of opaque physics:
```swift
withAnimation(.spring(duration: 0.6, bounce: 0.2)) { isExpanded.toggle() }
.smooth   // critically damped, no overshoot (damping 1.0)
.snappy   // slight bounce ~0.15
.bouncy   // more overshoot ~0.3
```
- Default spring: **`stiffness: 170–210, dampingRatio: ~0.8`** (the well-known "ease-like spring"). For web, Framer Motion equivalent: `{ type:'spring', stiffness:170, damping:26 }` (≈iOS default).

### Recommended timing / durations
- **Micro-interactions (hover, button press, focus): 150–300ms** (Apple/community guidance; complex transitions ≤400ms; avoid >500ms).
- **Exits faster than enters** (~60–70% of enter duration) to feel responsive.
- **Stagger** list/grid item entrances by **30–50ms** per item.
- High-frequency / repeated interactions: keep snappy (≤150ms) or instant — don't animate things users do constantly.
- Distance and size scale duration — never one fixed number for everything.
- **Scale feedback:** tappable cards/buttons press at `scale(0.95–0.98)`, restore on release.

### Easing curves (cubic-bezier) — the exact values
The industry's curves + Apple's real ones:
- **Apple/iOS standard curve** (most UIKit animations): **`cubic-bezier(0.25, 0.1, 0.25, 1)`** — "more forgiving on the in-curve, similar settle." (Same family as CSS `ease` = `cubic-bezier(0.25, 0.1, 0.25, 1)`, which Apple's QuickTime shipped first.)
- **Apple.com measured marketing ease** (the famous one you asked about): **`cubic-bezier(0.28, 0.11, 0.32, 1)`** — a slightly decelerating, confident "Apple" curve used across apple.com transitions. (This is the commonly extracted value.)
- CSS `ease` keyword = `cubic-bezier(0.25, 0.1, 0.25, 1)`.
- **`ease-out` (enter/settle)** = `cubic-bezier(0, 0, 0.2, 1)`, or the preferred **`cubic-bezier(0.16, 1, 0.3, 1)`** (snappy deceleration — recommend as your default `--ease-out`).
- **`ease-in` (exit)** = `cubic-bezier(0.4, 0, 1, 1)`.
- **Material-style smooth** = `cubic-bezier(0.4, 0, 0.2, 1)`.
- Symmetric `ease-in-out` = `cubic-bezier(0.42, 0, 0.58, 1)` (rarely the premium choice — Apple motion is asymmetric: fast in, slow settle).
- Spring-like overshoot via bezier: `cubic-bezier(0.34, 1.56, 0.64, 1)`.

### Motion doctrine for the portfolio
- **Springs for user-driven** motion (press, drag, hamburger, sheet). **Easing for automatic** motion (spinners, ambient, page-load cascade).
- Animate `transform` + `opacity` ONLY (compositor-only = 60fps+). Never animate `width/height/top/left/box-shadow/filter` in a hot path.
- One orchestrated staggered entrance per screen (header → hero → content), then restraint. **Animate 1–2 key elements max per view.**
- `prefers-reduced-motion` is mandatory: **reduce, not remove** — swap big transforms for opacity/color so meaning survives.

**HOW TO APPLY (Vue3/CSS):**
```css
:root{
  --ease-standard: cubic-bezier(0.28, 0.11, 0.32, 1); /* apple.com signature */
  --ease-ios:     cubic-bezier(0.25, 0.1, 0.25, 1);   /* iOS UIKit default */
  --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);      /* enters/settle */
  --ease-in:      cubic-bezier(0.4, 0, 1, 1);         /* exits */
  --dur-fast: 150ms; --dur-med: 250ms; --dur-slow: 400ms;
  --spring: cubic-bezier(0.34, 1.56, 0.64, 1);        /* subtle settle */
}
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{ animation-duration:.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.01ms !important; scroll-behavior:auto !important; }
}
```
- For spring feel in CSS, use a slightly-bouncy cubic-bezier (above) or a JS spring (Framer Motion `stiffness 170 damping 26`).
- Stagger children with `transition-delay: calc(var(--i) * 40ms)`.
- Press feedback: `transform: scale(.97)` on `:active`.

---

## 6. Materials & Vibrancy

### Standard material levels (native → web)
- iOS/iPadOS: **ultraThin, thin, regular, thick** (and ultraThick on macOS). SwfitUI: `.ultraThinMaterial … .ultraThickMaterial`.
- **Thicker = more opaque = better contrast for fine text.** **Thinner = more translucent = keeps context/background visible.**
- **Vibrancy:** system-defined *vibrant* colors (labels, fills, separators) designed to sit *on* materials so you don't worry about contrast. Use vibrant colors on every material. Levels: default (highest contrast) → quaternary (lowest); avoid quaternary on thin/ultraThin.
- **"Liquid Glass" colors:** by default glass *has no inherent color*; it takes on the colors of content behind it. Apply color to the glass only for emphasis (e.g. primary CTA = colored background, symbols/text white). Reserve color; don't tint multiple controls.

### "Liquid Glass" (iOS 26 / macOS Tahoe, 2025)
The new system material across iOS/iPadOS/macOS/watchOS/tvOS. Behaviors:
- **Dynamic translucency** — background shows through via blur + saturation; material *dynamically tints* from colors behind it.
- **Enhanced concentricity** — nested rounded-corner radii flow outward (Apple hardware echo).
- **Bolder typography** — heavier, more contrast titles.
- **Fluid responsiveness** — press causes a ripple/depth morph; materials respond to touch more than trackpad.
- **Floating chrome** — nav/tab/toolbar float as glass; content scrolls beneath.
- Optical ingredients: translucency+blur, refraction (lens displacement), chromatic aberration at edges, specular rim/edge highlight.

### Translating to the web (concrete CSS)
The core is `backdrop-filter: blur() saturate()`, a translucent bg, a "glass edge" (semi-opaque border + inset top specular line), and optionally an SVG displacement map for true refraction (Chromium-only; use plain blur+saturate elsewhere).

**Base Liquid Glass card:**
```css
.liquid-glass{
  background: rgba(255,255,255,.08);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 20px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.25),   /* top specular line */
    inset 0 -1px 0 rgba(255,255,255,.06),
    0 8px 32px rgba(0,0,0,.35);
}
```
**Material thickness tiers:**
```css
/* thin   — cards / overlays */
background: rgba(255,255,255,.15); backdrop-filter: blur(12px) saturate(150%);
/* regular — base/cards */
background: rgba(255,255,255,.25); backdrop-filter: blur(20px) saturate(180%);
/* thick  — nav bars, floating tab bars */
background: rgba(255,255,255,.45); backdrop-filter: blur(40px) saturate(200%);
/* títinted accent glass (e.g. primary CTA) */
background: color-mix(in srgb, var(--accent) 92%, transparent); backdrop-filter: blur(20px) saturate(180%);
```
**Floating nav (Liquid Glass):**
```css
.nav{ position:sticky; top:0; z-index:100; height:56px; padding:0 16px;
  background: rgba(255,255,255,.4);
  backdrop-filter: blur(40px) saturate(200%); -webkit-backdrop-filter: blur(40px) saturate(200%);
  border-bottom:.5px solid rgba(0,0,0,.1); }
```
**Dark-mode glass + fallbacks:**
```css
@media (prefers-color-scheme: dark){
  .liquid-glass{ background: rgba(30,30,30,.5); border-color: rgba(255,255,255,.08); }
  .nav{ background: rgba(30,30,30,.6); }
}
/* no-backdrop-filter fallback */
@supports not (backdrop-filter: blur(1px)){
  .liquid-glass, .nav{ background: var(--canvas-raised); backdrop-filter:none; }
}
/* respect system "reduce transparency" */
@media (prefers-reduced-transparency: reduce){
  .liquid-glass,.nav{ background: var(--canvas-raised); backdrop-filter:none; }
}
```
**Optional native shortcut (Safari/iOS 26):** `-apple-visual-effect: -apple-system-glass-material;` with a `@supports not (...) { backdrop-filter: blur(12px) saturate(180%); background: rgba(255,255,255,.08); }` fallback.

**When NOT to use glass:** content-heavy reading areas (solid bg for readability), editing/performance-critical views, accessibility-sensitive contexts.

**HOW TO APPLY (Vue3):**
- Use Liquid Glass for **nav, hero CTA, floating contact/tab pill, and modal overlays** — the interactive chrome. Keep content/reading areas on solid (`--canvas`/`--canvas-alt`) backgrounds.
- Apply vibrance in spirit: put text on glass with adequate contrast (prefer white-on-colored-CTA), and add a top specular highlight to make glass read as glass.
- Provide solid + reduced-transparency fallbacks.

---

## 7. Buttons & Controls

### The two-button language on Apple.com
1. **Link-style pill button (filled blue)** — the primary CTA. A pill (border-radius ~9999px), blue fill `#0071e3`, white text. On hover `#0077ED`. This is the canonical "Learn more / Buy" button.
2. **Plain text button / text link** — secondary action, `#0066cc` link color, no fill, no border. Often paired with the filled button + a chevron `›`.

### States
- **Default** → **hover** (slightly lighter/darker fill; Apple's pill darkens `/ lightens` subtly) → **active/pressed** (`scale(.97)` + darker) → **focus** (visible focus ring for keyboard) → **disabled** (reduced opacity, ~0.4).
- Filled CTA: blue → hover `#0077ED` → active darker → focus ring.
- Secondary: plain blue text link; hover underline; focus ring.

### Accessibility of controls
- **Minimum 44×44pt touch target** for every tappable element (long-standing HIG rule; 28×28 is an absolute hard floor, 44 is the design target).
- **Inline text links are the exception** (allowed below 44pt because body line-height is short).
- **≥8pt gap** between adjacent 44pt targets (~12–24pt around bezeled buttons).
- Don't use hover alone for visibility; support click/tap and keyboard focus. Show a focus ring (`outline` / `box-shadow`) for keyboard nav.
- Never shrink buttons to gain density — tighten non-interactive text/dividers instead. Density comes from non-interactive content, not from undersized controls.
- Buttons feel at home inset from screen edges aligned to layout margins (avoid full-width buttons).

**HOW TO APPLY (Vue3/CSS):**
```css
.btn-primary{
  min-height:44px; padding:0 22px 0 22px;
  border-radius:9999px; background:var(--accent); color:#fff;
  font-size:17px; font-weight:400; letter-spacing:0;
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  transition: background var(--dur-fast) var(--ease-standard),
              transform var(--dur-fast) var(--ease-standard);
}
.btn-primary:hover{ background:var(--accent-strong); }
.btn-primary:active{ transform:scale(.97); }
.btn-primary:focus-visible{ outline:2px solid var(--link); outline-offset:3px; }
.btn-primary:disabled{ opacity:.4; pointer-events:none; }

.btn-text{ /* secondary */
  min-height:44px; padding:0 6px; color:var(--link); background:transparent;
  border-radius:8px; display:inline-flex; align-items:center; gap:4px;
}
.btn-text:hover{ text-decoration:underline; }
.btn-text:focus-visible{ outline:2px solid var(--link); outline-offset:3px; }
```
- Wrap any visually-small link/icon in a 44px min tap area (`position:relative;` with `::after{ position:absolute; inset:-Xpx }`) on touch.
- Add `cursor:pointer` to all clickable elements.

---

## 8. Accessibility (mandatory)

### Dynamic Type / scalable text
- Support user-preferred text size — the whole text system is semantic styles that scale (17pt Body is the floor; scale to AX5 ≈ 300%+). **Keep key info anchored near the top so it isn't lost at huge sizes.**
- On web: drive type from `rem` (`html{font-size}`), never fixed px exclusively, so browser zoom and user font-size preferences work. Consider a "text-size" control on the portfolio.

### Contrast
- WCAG AA: **4.5:1 normal text**, **3:1 for 18pt+ or bold** and for **non-text UI/graphics**. Verify in light + dark. Provide an increase-contrast pass. Prefer semantic/system colors (they ship accessible variants).

### Reduced motion
- Honor `prefers-reduced-motion` (reduce → dissolates/fades, not removal of meaning). Also honor `prefers-reduced-transparency`. Never make motion the sole carrier of information — pair with text/haptics/audio.

### VoiceOver / screen readers
- Provide meaningful `aria-label` / `aria-label` equivalents (accessibilityLabel/hint); logical reading order; text alternatives for images.
- Semantic HTML/Vue: `nav`, `main`, `section`, `header`, `footer`, `h1…h6` in correct order, `button` vs `link` used correctly (real `<button>` for actions, `<a href>` for navigation).
- Focus management: visible focus ring, skip-link, logical tab order, trapped focus in modals.

### Focus
- Keyboard-focusable controls with a **clearly visible focus indicator** (Apple: keyboard focus indicator color). Don't rely on mouse hover; `:focus-visible` styling required. macOS has a keyboard focus indicator ring — mirror with outline/box-shadow.

### Touch/size & targets
- **44×44pt min targets**, ≥8pt gaps, tap area ≥ visible area on touch.

**HOW TO APPLY (Vue3/CSS):**
- Add a semantic page structure + skip-to-content link.
- A11y token pass: ensure `--text-secondary` `#707070` on white (~4.5:1) — yes; sub-body used at 14px still meets AA. Test `#707070` against `#f5f5f7` if placed on alt bands.
- Ship the reduced-motion + reduced-transparency media queries in every stylesheet (see §5, §6).
- Every icon gets `aria-hidden="true"` + a text label; every image alt text; decorative imagery hidden from screen readers.
- Set `:focus-visible { outline: 2px solid var(--link); outline-offset:3px; }` globally.
- Provide a visible text-size toggle wired to `html { font-size }` rem scaling.

---

## Appendix — Apple.com measured CSS quick-reference (design tokens for the redesign)

```css
:root{
  /* color */
  --canvas:#fff; --canvas-alt:#f5f5f7; --canvas-raised:#fafafc;
  --text-primary:#1d1d1f; --text-secondary:#707070; --text-tertiary:#86868b;
  --nav-text:#474747; --border:#d6d6d6;
  --accent:#0071e3; --accent-strong:#0077ED; --link:#0066cc;

  /* type */
  --font-display:"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
  --font-text:  -apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,Helvetica,Arial,sans-serif;

  /* spacing (8pt grid) */
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:20px;
  --sp-6:24px; --sp-7:32px; --sp-8:48px; --sp-9:64px; --section-v:120px;

  /* motion */
  --ease-standard:cubic-bezier(0.28,0.11,0.32,1);
  --ease-ios:cubic-bezier(0.25,0.1,0.25,1);
  --ease-out:cubic-bezier(0.16,1,0.3,1);
  --dur-fast:150ms; --dur-med:250ms; --dur-slow:400ms;

  /* shape */
  --radius-sm:8px; --radius-lg:20px; --radius-xl:28px; --radius-pill:9999px;
}
```

**Card/section conventions:** 28px border-radius on cards/product images; pill CTAs (9999px); sections alternate white/`#f5f5f7` with 100–120px vertical gaps; centered 980px column; text columns ~560px; 44px sticky nav; body 17px `-0.022em`; hero 96px `-1.44px` tracking.

---

## Redesign checklist (top 12 non-negotiables)
1. One neutral sans (SF Pro stack / Inter fallback); semantic type roles only.
2. Monochrome UI + ONE accent (`#0071e3` CTA, `#0066cc` links); all color in imagery.
3. 8pt spacing grid; 980px centered column; alternate `#fff`/`#f5f5f7` sections — no borders.
4. Hero display headline 56–96px, weight 600–700, tracking -1.44px→-0.28px, line-height 1.04–1.07.
5. Body 17px/1.4–1.47 weight 400, -0.022em tracking.
6. Liquid Glass nav + hero CTA (`backdrop-filter: blur+saturate`, specular edge); solid content areas.
7. Filled pill primary CTA (`#0071e3`→`#0077ED` hover, `scale(.97)` press) + text secondary link.
8. 44px min touch targets, ≥8px gaps.
9. Motion: `--ease-standard cubic-bezier(0.28,0.11,0.32,1)` / ios curve; springs for user-driven; animate transform+opacity only; one staggered entrance then restraint.
10. `prefers-reduced-motion` + `prefers-reduced-transparency` honored everywhere.
11. WCAG AA contrast (4.5:1 text) in light+dark; never rely on color alone.
12. Semantic HTML + `:focus-visible` ring + VoiceOver labels + tabular numerics (`font-feature-settings:"tnum"`).
