# 05 — Apple HIG Migration Plan (Blueprint)

**Repo:** `E:\GitHub Projects\portfolio-6606` · Vue 3 + Vite + GSAP/ScrollTrigger + Three.js
**Goal:** Full redesign of the existing "neo-orbit" neon theme to Apple Human Interface Guideline quality — keeping **every feature, data binding, id anchor, and data source** working.

## 0. Sources & assumptions

- Read fully: `package.json`, `src/App.vue`, `src/styles/main.css`, all 14 components, `src/composables/useReveal.js`, `src/data/portfolio.js`, `src/three/*.js`, `src/ai/assistant.js`, `index.html`, `src/main.js`, `vite.config.js`.
- Agent files `01-apple-hig.md`, `02-apple-com-ux.md`, `03-motion-playbook.md`, `04-color-tokens.md` do **not exist yet** (Agents/ is empty). This plan proceeds from their topics:
  - **01 Apple HIG:** materials, hairline borders, large display type, generous spacing, 44px touch targets, clarity/deference/depth.
  - **02 apple.com UX:** eyebrow → big headline → subhead → CTA, sticky nav that gains material on scroll, `#f5f5f7` alternate sections, 980px content column.
  - **03 Motion playbook:** named patterns (`fade-up`, `hover-lift`, `scroll-zoom`, `infinite-loop`, `material-in`, `stagger-children`, `parallax-drift`, `scale-fade`) — referenced in §5. All honour `prefers-reduced-motion`.
  - **04 Color tokens:** Apple system palette — see §2 token table.
- If 01–04 appear later, treat this file as the integration point; the token names in §2 must be the single source the main session implements so 04's tokens line up.

## 1. Core strategy — "class-name-preserving restyle"

The safest way to keep every feature and data binding intact is to **restyle existing class/id names in place** and only add new markup where a section's anatomy truly changes. Rules for the main session:

1. **Never rename ids** — keep `#top #about #experience #education #projects #expertise #achievements #certifications #skills #contact` exactly (all anchors + AI assistant `goto` actions depend on them).
2. **Keep every Vue data binding / `v-for` / ref / emit** — only `.class`, inline styles and v-html-less static markup change.
3. **Rewrite `:root` first with Apple tokens + legacy aliases** (§2). Because every component's scoped CSS references legacy names (`--cyan`, `--text-dim`, `--grad`, `--panel`, `.btn`, `.glass`, `.tag`, `.chip`…), the whole site re-themes instantly with zero component edits. Then restyle section by section.
4. **Keep class names** (`.nav`, `.btn-primary`, `.section-head`, `.timeline`, `.bento-cell`, `.project-card`, `.marquee`…) and redefine their visuals. Add new Apple utility classes (`.apple-nav`, `.section-eyebrow`, `.section-title`, `.material`, `.pill-btn`, `.hairline`) for incremental adoption.
5. **Keep `data-reveal` / `data-dir` / `data-delay` / `data-stack`** attributes and `useReveal(root)` calls everywhere — only their derived motion ("from" state) changes.

## 2. Design-token migration (`src/styles/main.css` `:root`)

Rewrite the `:root` block first, in the same file, before touching any component.

| Old token | New Apple token | Value | Used by |
|---|---|---|---|
| `--bg` `--bg-2` `--panel` `--panel-2` | `--apple-bg` / `--apple-bg-2` / `--apple-bg-3` | `#ffffff` / `#f5f5f7` / `#fbfbfd` | page, alternate bands, cards |
| `--text` `--text-dim` `--text-faint` | `--apple-text` / `--apple-text-2` / `--apple-text-3` | `#1d1d1f` / `#6e6e73` / `#86868b` | all typography |
| `--line` `--line-strong` | `--apple-line` / `--apple-line-2` (+ `--apple-separator` `#d2d2d7`) | `rgba(0,0,0,0.1)` / `rgba(0,0,0,0.18)` | hairlines, borders |
| `--cyan` | `--apple-blue` `#0071e3` (+ `--apple-blue-hover` `#0077ed`, `--apple-link` `#0066cc`) | blue | primary accent, links, "current" states |
| `--violet` `--fuchsia` | `--apple-purple` `#af52de` | purple | secondary accent |
| `--emerald` | `--apple-green` `#34c759` | green | online/live dots |
| `--amber` | `--apple-orange` `#ff9500` | orange | ratings / level chips |
| `--grad` `--grad-soft` | `--apple-grad` | `linear-gradient(115deg,#0071e3,#af52de)` | heritage only; replaced progressively |
| — | `--apple-teal` `#5ac8fa` | teal | three.js orb, shimmer |
| — | `--apple-material` / `--apple-material-strong` | `rgba(255,255,255,0.72)` / `0.85` | nav, dock, modal, AI panel |
| — | `--apple-material-blur` | `blur(20px) saturate(180%)` | nav / dock glass |
| — | `--apple-material-blur-soft` | `blur(12px) saturate(160%)` | overlay glass |
| — | `--apple-radius(-sm/lg)` · `--apple-pill` | `10px` / `18px` / `28px` / `980px` | cards / buttons |
| — | `--apple-control` | `44px` | min button / input height |
| — | `--apple-content` / `--apple-content-wide` | `980px` / `1200px` | container width |
| — | `--apple-nav-h` | `52px` | nav height (drives `scroll-margin-top`) |
| `--font-display` `--font-body` `--font-mono` | system stack | `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue","Segoe UI",Roboto,sans-serif` · mono: `"SF Mono", ui-monospace, "IBM Plex Mono", monospace` | all text — authentic Apple look |
| — | `--ease-apple` / `--ease-spring` | `cubic-bezier(0.25,0.1,0.25,1)` / `cubic-bezier(0.18,0.9,0.28,1)` | all transitions/tweens |

**Legacy aliases — the anti-breakage contract.** Immediately after defining Apple tokens, add:

```
--bg: var(--apple-bg); --bg-2: var(--apple-bg-2); --panel: var(--apple-bg); --panel-2: var(--apple-bg-2);
--line: var(--apple-line); --line-strong: var(--apple-line-2);
--text: var(--apple-text); --text-dim: var(--apple-text-2); --text-faint: var(--apple-text-3);
--cyan: var(--apple-blue); --violet: var(--apple-purple); --fuchsia: var(--apple-purple);
--emerald: var(--apple-green); --amber: var(--apple-orange);
--grad: var(--apple-grad); --grad-soft: rgba(0,113,227,0.07);
```

Do **not** leave any component referencing an undefined legacy token — this `:root` rewrite must land in the same commit as any component change.

**Also in main.css, first pass (same file):**
- `body`: drop the 3 radial nebula gradients → flat `var(--apple-bg)`; keep `-webkit-font-smoothing: antialiased`.
- `.text-gradient`: **keep the class** (used in ~8 templates) but repoint to Apple blue→teal clip: `linear-gradient(115deg, #0071e3, #5ac8fa)`. No template edits needed.
- Scrollbar: gradient thumb → flat `#c7c7cc` track `#f5f5f7`, 8px.
- `::selection` → `rgba(0,113,227,0.15)`.
- `:focus-visible` outline → `2px solid var(--apple-blue)`.

**New global classes to add in main.css:**
- `.apple-nav` — the translucent material bar (see §4.2).
- `.section-eyebrow` — 12px, letter-spacing 0.06em, `#86868b`, small-caps style (numbered `01` in `--apple-blue`).
- `.section-title` — 48/56px, weight 600, `-0.015em`, `#1d1d1f`.
- `.section-sub` — 17–19px, `--apple-text-2`, max-width 620px.
- `.pill-btn` / `.pill-btn-secondary` — 44px pill buttons (blue filled / grey filled), hover `#0077ed` / `#dbdbdb`, active `scale(.98)`.
- `.material` — frosted surface: `background: var(--apple-material); backdrop-filter: var(--apple-material-blur-soft); border: 1px solid var(--apple-line); border-radius: var(--apple-radius);` + soft `0 40px 80px -30px rgba(0,0,0,0.18)` shadow on hover.
- `.hairline` — `height:1px; background: var(--apple-separator);`
- `.display` — 64–96px display family helper for hero.

### 2.2 Anchor & binding inventory (MUST stay wired)

Id anchors used by nav, dock, and AI `goto` actions — verify present post-migration:

| id | Source | Used by |
|---|---|---|
| `#top` | HeroSection `<section>` | nav logo, dock Home, back-top fallback |
| `#about` | About | nav, dock, AI |
| `#experience` | Experience | nav, dock, AI, open-box |
| `#education` | Education | AI only (not in nav/dock) |
| `#projects` | Projects | hero CTA, nav, dock, AI, Education link |
| `#expertise` | Expertise | dock, AI |
| `#achievements` | Achievements | dock, AI |
| `#certifications` | Certifications | dock, AI |
| `#skills` | Skills | nav, dock, AI |
| `#contact` | Contact | nav, dock, AI, footer CTA |

`portfolio.js` keys consumed by templates: `profile.{name,first,last,monogram,roles,tagline,location,email,linkedin,github,avatar}`, `about.{paragraphs,focus,stats}`, `experience[]`, `openTo[]`, `education[0]`, `projects[]` (incl. `longDescription/problem/solution/features/stack`), `expertise[]`, `achievements[]`, `certifications[]`, `codingProfiles[]`, `skills{...}`. Do not rename any of these keys; `assistant.js` also reads `experience[0]`, `openTo`, `projects[0]`.

Edit order: **main.css → index.html → the 3 JS files → components** (see §7).

### 2.1 `main.css` edit order — exact block sequence to avoid breakage

Edit one pass, top-to-bottom, keeping every selector name. Never delete a legacy block until its scoped counterpart in the component has been migrated (or both land in the same commit):

1. `:root` (tokens + aliases) — **do this first; everything else reads these vars**.
2. `*`, `html`, `body` (debounce `scroll-behavior:smooth` for reduced-motion; keep).
3. `:focus-visible`, scrollbar, `::selection`.
4. Typography helpers: `.font-display/.font-mono` (map to system stack), `.text-gradient` (re-point, never remove).
5. `.orb` (re-tint to blue/teal at 0.05, or retire — used by `ContactSection` only).
6. `.cursor-glow` — remove here **and** in App.vue together (one commit).
7. `.container`, `.section` (new `scroll-margin-top: 60px`, new padding rhythm).
8. `.section-head .index / h2 / .sub` → Apple eyebrow/title/sub.
9. `.glass` → `#fbfbfd` + hairline; **keep radius/border/transition shape** so all `glass` users (experience, education, certs, expertise) restyle at once.
10. `.btn/.btn-primary/.btn-ghost` → pill system; remove `::before` gradient fill + `::after` shine sweep.
11. `.tag/.tag-hl`, `.chip`, `.skill-chip` → 12px pills.
12. `.marquee` band + track (no border-block).
13. `.project-card` (+ `.num`).
14. `.timeline` + `.tl-item` hairline rail/dots.
15. `.bento/.bento-cell`.
16. `.nav` → `.apple-nav` values (component scoped CSS can override).
17. `.hero*` → Apple anatomy + reduced opacity for canvas layer (`hero-canvas { opacity: .7 }`).
18. `.stat`, `.avatar-ring`, `.modal-overlay/.modal`, `.divider-glow`, `footer` mapping (`footer` = Apple footer base).
19. Responsive guards (768/900/1024, max-height, reduced-motion) — update paddings after nav/dock sizes change.
20. Append the new global utility classes (`.apple-nav .material .pill-btn* .section-eyebrow .section-title .section-sub .hairline .display`).

## 3. Current-to-target component mapping

Legend: `C` = CSS-only restyle (template untouched), `M` = template markup changes, `J` = JS budget changes.

| # | File / block | Current (neo-orbit) | Target (Apple) | Effort |
|---|---|---|---|---|
| G1 | `main.css :root` | neon tokens | Apple tokens + aliases (§2) | C |
| G2 | `main.css body` | radial nebula bg | flat `#fff`, #f5f5f7 bands | C |
| G3 | `main.css .container` | 1200px max | `--apple-content-wide` 1200px desktop, 980px ideal; padding `clamp(22px,4vw,44px)` | C |
| G4 | `main.css .section` | `padding 64–128px; scroll-margin-top:72px` | `padding: clamp(72px,10vw,128px) 0; scroll-margin-top: calc(var(--apple-nav-h) + 8px)` | C |
| G5 | `main.css .section-head/.index/h2/.sub` | mono index + gradient h2 | Apple eyebrow + `.section-title` + `.section-sub` (keep class names, restyle) | C |
| G6 | `main.css .glass` | tinted glass, 20px radius | `.material` surface, 18px radius, hairline | C |
| G7 | `main.css .btn/.btn-primary/.btn-ghost` | 999px mono uppercase, gradient fill, shine sweep | `.pill-btn` system (44px, 17px, SF stack); remove `::before` gradient sweep + `::after` shine | C |
| G8 | `main.css .tag/.tag-hl/.chip/.skill-chip` | mono uppercase borders | 12px pill chips, `#f5f5f7` fill, hairline, blue `.hl` | C |
| G9 | `main.css .marquee` | bordered striped band, gradient dots | retina band, no border-block, eyebrow placed above (in component), grey 24–32px text, blue dots | C |
| G10 | `main.css .project-card` | ghost number + low-relief | `.project-tile`: white, 20px radius, hairline, hover `translateY(-6px)` + soft shadow; `.num` → small 10px corner label | C |
| G11 | `main.css .timeline/.tl-item` | gradient rail + cyan dots | 1px `#d2d2d7` hairline rail; filled blue dot on `.current`, outline dots otherwise; no pulse ring | C |
| G12 | `main.css .bento/.bento-cell` | gradient hover background | `.material` cells, radius 18px, hover: hairline→blue + `translateY(-2px)` + shadow, NO bg tint fill | C |
| G13 | `main.css .nav` | `rgba(248,..,0.92)` blur 12 | `.apple-nav`: transparent top → material on `.scrolled` (blur 20 saturate 180), height 52px, hairline bottom | C |
| G14 | `main.css .hero` | full gsap intro, canvas z0 | Apple hero anatomy (§4.1); canvas kept as ambient, opacity cap 0.5, ScrollTrigger zoom retained | M |
| G15 | `main.css .stat` | gradient-clipped values | flat `.value` 2.6–3.5rem weight 600 tabular-nums `#1d1d1f`; `.label` 12px `#86868b`, `#f5f5f7` pill behind optional | C |
| G16 | `main.css .avatar-ring` | gradient ring + glow | simple 28px-radius image, 1px hairline, 24px shadow; remove gradient | C |
| G17 | `main.css .modal-overlay/.modal` | dark blur overlay + 24px panel | HIG panel: overlay `rgba(0,0,0,0.32)` blur 20, panel `--apple-material-strong`, 20px radius, 40px+ shadow, auto margin | C |
| G18 | `main.css .divider-glow` | gradient | `.hairline` | C |
| G19 | `main.css footer` | 1 band, gradient-less | Apple footer anatomy (§4.11) | M |
| G20 | `main.css .cursor-glow` | violet radial cursor glow | **Remove** (App.vue template + script). Apple cleanliness; parallax/mouse already provided by 3D canvas | M |
| G21 | `App.vue .scroll-progress` | 3px gradient bar | 2px `--apple-blue` bar, same GSAP scrub | C |
| G22 | `App.vue .back-top` | left-bottom 46px circle ghost | keep left-bottom, 44px, `--apple-material-strong` + blur, blue hover arrow; still hidden ≤768px | C |
| H1 | `HeroSection.vue` | kicker+title+typed role+sub+CTAs; intro tl; scrollTl | Apple anatomy §4.1; keep typewriter, `data-hero`, canvas, lazy 3D, reduced-motion path | M |
| H2 | `NavBar.vue` | 34px logo, mono links, burger | 52px bar, centered logo lockup, 12px SF links, `.scrolled` material; keep scrollspy + mobile menu (restyled `#f5f5f7`) | M |
| H3 | `MarqueeStrip.vue` | plain strip | add `.section-eyebrow` ("Technologies") above track; keep 2× duplicate items + GSAP infinite + IO pause | M |
| H4 | `AboutSection.vue` | avatar ring + float chips + stats | Apple editorial: paragraph lead 19px, stats as large figures (G15), avatar simple, focus chips pills | C |
| H5 | `ExperienceSection.vue` | glass cards + gradient dots | hairline timeline + `.material` cards (`tl-card`), blue current dot, tags→chips | C |
| H6 | `EducationSection.vue` | gradient badge + divider-glow | square blue-filled badge, `.hairline` divider, `#f5f5f7` note card | C |
| H7 | `ProjectsSection.vue` | banner canvas + gradient title + big cards | banner canvas kept (Apple-teal palette), `.project-tile` cards, `pc-case` → `.pill-btn-secondary` | M |
| H8 | `ProjectModal.vue` | legacy panel | HIG panel (G17); section heads → `.section-eyebrow`; actions stay pill buttons | C |
| H9 | `ExpertiseSection.vue` | gradient icon tiles, mono labels | `.material` cards, icon square `#f5f5f7` w/ blue icon, level chip pill | C |
| H10 | `AchievementsSection.vue` | fuchsia tags + radial corner | `.material` cards, tag → 12px grey eyebrow, `#f5f5f7` org line, remove corner glow | C |
| H11 | `CertificationsSection.vue` | glass rows | `.material` rows, badge→`#f5f5f7` square + blue check | C |
| H12 | `SkillsSection.vue` | bento gradient cells | `.material` cells §4.9; keep 12-col span layout | C |
| H13 | `ContactSection.vue` | orbs + gradient title, 3 ghost buttons | Apple CTA panel §4.10: white band, big title, primary blue + secondary greys, meta hairline row | M |
| H14 | `Footer.vue` | CTA row + 1-line bottom | Apple footer §4.11 | M |
| H15 | `FloatingDock.vue` | rgba bar, cyan active | keep macOS dock; `.material` glass bar (blur saturate), blue active, keep tooltips/dots/scroll-spy/mobile tab | C |
| H16 | `AiAssistant.vue` | gradient avatar/send | HIG material panel, blue accent, SF text, keep logging + suggestions + actions | C |
| H17 | `IconSet.vue` | 1.6 stroke icons | keep (closest SF-ish); optionally stroke 1.5–1.75, round caps already on | C |
| J1 | `heroScene.js` | cyan/violet/fuchsia galaxy + orbs | Apple palette: teal `#5ac8fa`, blue orbs; lower final opacities (galaxy 0.35, orbs 0.25); keep render-on-demand, IO, lazy import | J |
| J2 | `particleBackdrop.js` | cyan→fuchsia particles | silver `#86868b`→teal particles, opacity 0.3; keep `setProgress`, IO, lazy | J |
| J3 | `useReveal.js` | blur 6 + y 46 | blur 0, y 24, duration 0.7, ease `power2.out`; keep reduced/1× mobile guards; `start: 'top 85%'` | J |
| J4 | `index.html` | Sora/Manrope/IBM fonts, boot spinner, `#f8f9fc` | remove Google Fonts (system stack), `theme-color #ffffff`, boot spinner → Apple-style grey pulse (optional), keep `#boot` id | J |

## 4. Section-by-section redesign spec

### 4.1 Hero (`HeroSection.vue`, `main.css .hero*`)
Apple hero anatomy (apple.com "overview" pattern):
1. `eyebrow` — 12px, `#86868b`, letter-spacing 0.06em; keep the green `live` dot (Apple-accurate "status" motif) + "Available for AI / ML opportunities".
2. `display headline` — `.hero-title`, 72–96px desktop / 44px mobile, weight 600, letter-spacing -0.015em, `#1d1d1f`; keep two `.line` spans; second line keeps `.text-gradient` (now blue→teal).
3. `subhead` — keep the **typewriter role line** immediately under title but as a 21px `#6e6e73` line (App feature — do not remove); keep blinking `_` cursor but make it `--apple-blue`.
4. `sub` — `p.tagline`, 17–19px `#6e6e73`, max-width 560px.
5. `dual CTA` — `View Work` = `.pill-btn` (blue), `Get in Touch` = `.pill-btn-secondary` (grey). Keep icons.
6. `scroll indicator` — keep wheel but neutral grey hairline; hidden on mobile/short viewport (already).
- **3D canvas:** keep `<canvas>` + `createHeroScene()` lazy import (400ms defer, reduced=0). In `heroScene.js` switch palette (§J1) and cap final opacities so the canvas reads as **subtle ambient** behind a left-aligned Apple headline.
- **ScrollTrigger zoom-out (keep):** `scrollTl` already fades/parallaxes content + canvas on scroll. Adjust to Apple's crop: scale canvas group to `scale(1)` → `scale(0.94)` + content `yPercent -8`, opacity 0 → 0.15. Gate the transform part off under `prefers-reduced-motion` (already skips timeline). On ≤768px keep only the opacity fade (no big transforms).

### 4.2 Nav (`NavBar.vue` → `.apple-nav`)
- Bar: height `var(--apple-nav-h)`, `position: fixed`. **Default (top):** transparent, no border. **`.scrolled` (>30px):** `background: var(--apple-material); backdrop-filter: var(--apple-material-blur); border-bottom: 1px solid var(--apple-separator);` — the classic Apple "material-in" (`material-in` pattern).
- **Centered logo** per brief: 3-column grid — links left, logo lockup center (glyph square 28px `#f5f5f7` radius 8px with blue `GB` → simpler: monogram in `--apple-blue`, text `BAKKERA.dev` 14px weight 600, drop the gradient glyph), CTA right. If links-outside-logo looks unbalanced at 900–1024px, fall back to logo-left/links-right (Apple.com standard) — decision delegated to visual check.
- Links: 12px SF, `#6e6e73`, `active` → `#1d1d1f` with 2px blue underline indicator (keep `::after` but solid blue, not gradient).
- CTA "Hire Me" → `.pill-btn` small (32px). Mobile menu: keep `#nav-menu` Teleport + burger; restyle panel to solid `#fbfbfd`, links 28px SF, `menu-num` blue.
- Keep IntersectionObserver scrollspy + body scroll-lock + 901px breakpoint logic unchanged.

### 4.3 Marquee (`MarqueeStrip.vue`)
- Add a `div.section-eyebrow` ("Technologies · Tools · Platforms") above the track inside the band.
- Strip: no border-block; background `#f5f5f7` alternate band; `.marquee-item` 24–32px weight 600 `#86868b`, gap 40px, `.dot` 6px `--apple-blue`.
- Keep: `v-for="n in 2"` duplication, GSAP `infinite-loop` tween (`x: -scrollWidth/2`, 40s), `pause/play` on intersection + `visibilitychange`, reduced-motion skip.

### 4.4 About (`AboutSection.vue`)
- Rework `.about-grid` to Apple editorial: intro max-width 640px; remove float-chips (or keep as grey pill chips — recommended keep, they're a nice feature, restyled to `#f5f5f7` pills with hairline).
- `.avatar-ring` → simple 28px-radius portrait, hairline border, shadow `0 24px 48px -24px rgba(0,0,0,.15)`, no gradient.
- Body paragraphs: 19px, `#1d1d1f` first paragraph, `#6e6e73` secondary.
- Stats: keep counter animation code (IO + rAF + reduced guard); restyle `.stat .value` to flat large figures, tabular-nums, `#1d1d1f`; `.label` 12px `#86868b`. Row separated by `.hairline`, not `--line`.

### 4.5 Experience / Education (`ExperienceSection.vue`, `EducationSection.vue`)
- Timeline: replace gradient rail with `1px #d2d2d7` hairline rail. Dots: 10px, `#fff` fill + 2px `#d2d2d7` border; `tl-item.current` → filled `--apple-blue`, no pulse animation.
- Cards: `.glass` → `.material` (blur behind only where safe — cards sit on `#fff` so `background: #fbfbfd` + hairline is cheaper; use `.material` translucency only for the modal/nav/dock/AI).
- `.tl-company` 22px weight 600; `.tl-role` → 13px `--apple-blue` (drop mono/uppercase); period 12px `#86868b`; tags → `.tag` chips.
- `open-box`: dashed border → hairline + `#f5f5f7` fill; `.open-label` grey eyebrow.
- Education: keep `edu-grid` 1.5fr/1fr; `.edu-badge` box `#0071e3` filled 56px radius 14; `divider-glow` → `.hairline`; note card `--apple-bg-2`.

### 4.6 Projects (`ProjectsSection.vue`) + Modal (`ProjectModal.vue`)
- Banner: keep `<canvas>` + `createParticleBackdrop()` lazy via IO (rootMargin 300px). Repalette particles silver→teal (`particleBackdrop.js`). Banner tinted `#f5f5f7`; label = `.section-eyebrow`; title `.section-title` under `.text-gradient` (or plain `#1d1d1f` + blue word).
- Tiles: `.project-card` → white, 20px radius, hairline; hover `translateY(-6px)` + `0 30px 60px -25px rgba(0,0,0,.15)` (`hover-lift`); `.num` ghost → 10px grey upper-left label (`PROJECT 01`); flagship `.tag-hl` → blue pill; `.pc-case` and links stay (→ 12px `--apple-link` with arrow, pill secondary for case button).
- Modal (HIG panel): overlay `rgba(0,0,0,0.32)` + blur(20px); panel `--apple-material-strong`, radius 20px, `max-width 720px`, `max-height 84vh`, inset close `#f5f5f7` circle with blue hover; `.modal-head` → `.section-eyebrow`; `list-dot` → 6px `--apple-blue`; `.modal-stack` → `#fbfbfd` fill hairline box; actions `.pill-btn` / `.pill-btn-secondary`. Keep Esc + backdrop-close + Teleport.

### 4.7 Expertise / Achievements / Certifications
- `exp-card` → `.material`; `exp-icon` square 44px `#f5f5f7`, blue icon; `exp-level` chip pill (`.hl` → blue); domain 17px weight 600.
- `ach-card` → `.material`; `.ach-tag` 12px `#86868b` eyebrow; `.ach-corner` removed; hover lift only.
- `cert-row` → `.material` rows, radius 14px; badge square `#f5f5f7` + blue initial; `.cert-link` → blue arrow link.

### 4.8 Skills (`SkillsSection.vue`)
- Keep 12-col bento grid + `span` inline styles + 900px collapse. Cells → `.material`, radius 18px, padding 24px; h4 → 11px `#86868b` eyebrow (drop uppercase mono → small-caps kept); hover: border-blue + `-2px` lift + soft shadow, **no** `--grad-soft` tint. Chips → `.skill-chip` grey pills.

### 4.9 Contact (`ContactSection.vue`)
Apple CTA panel:
- Background band `#f5f5f7` (not white card) or keep white card on `#fff` page → recommend white card radius 28 on `#f5f5f7` band for contrast.
- Remove orbs (or keep two ultra-faint blue/teal radial blobs at 0.05 alpha behind card — optional).
- Order: `.section-eyebrow` ("CONTACT") → title 56px `Let's build something intelligent` (blue gradient word) → sub 19px → pill actions (**Email = primary blue pill**, GitHub / LinkedIn = secondary grey pills) → meta row bound by hairlines above/below, 12px `#86868b`.

### 4.10 Footer (`Footer.vue`) — Apple footer anatomy
1. `.foot-cta` → CTA row (kicker eyebrow + "Have a role in mind? Let's talk." 40px + Email/Contact pills).
2. `.hairline` top border.
3. `.foot-top` → **multi-column**: `GB.dev` brand + columns (`Explore`: About/Experience/Projects/Skills; `Connect`: GitHub/LinkedIn/Email; `Credentials`: LeetCode/GfG/HackerRank/CodeChef from `portfolio.codingProfiles`). 12px `#6e6e73` links.
4. `.foot-bottom` legal row: "Copyright © {year} Ganesh Bakkera" + "Designed & built with Vue 3 · Three.js · Theatre.js · GSAP", 11px `#86868b`, separated by hairline. Keep `padding-bottom: 132px` clearance for dock + media queries.

### 4.11 Dock / back-top / AI assistant
- `FloatingDock`: `dock-inner` → `background: var(--apple-material); backdrop-filter: var(--apple-material-blur); border 1px hairline; radius 999px`; active item blue; tooltips `#1d1d1f` on `--apple-material-strong`. Keep magnification JS, scroll-spy, mobile bottom-bar, animation delays, reduced-motion blocks.
- `back-top` (App.vue): keep left-bottom, `#f5f5f7` material circle, blue hover, hidden ≤768.
- `AiAssistant`: panel → HIG material (radius 20), avatar `#0071e3`, close circle pill, bubbles `#e8e8ed` (AI) / `#0071e3` white text (user), input pill `#f5f5f7`, send circle blue. **Keep** localStorage logging (`portfolio-ai.logs`), suggestions, Esc.

## 5. Motion integration list

All patterns reference `03-motion-playbook.md` by name; every tween except `infinite-loop` is gated by the existing reduced-motion guards (useReveal sets distance 0 / `scroll-margin` handled by CSS).

| Section / element | Pattern | Trigger / notes |
|---|---|---|
| Hero intro | `fade-up` (stagger 0.12) | existing `introTl` on `[data-hero]` frames; switch y:44→24, ease power2.out, duration 0.9 |
| Hero scroll | `scroll-zoom` (scrub) | existing `scrollTl`: canvas `yPercent 16` + content `yPercent -10` opacity 0.1; keep scrub true; off on ≤768 (opacity only) |
| Scroll progress | `pin-progress` (scrub 0.4) | existing App.vue bar; 2px blue |
| Nav | `material-in` | add `.scrolled` at scrollY>30 (existing) |
| Marquee | `infinite-loop` | existing GSAP x-tween; pause on IO-out/`visibilitychange`; paused for reduced motion |
| Every section body | `fade-up` on `[data-reveal]` | existing useReveal; blur→0, miss 24px |
| Staggered grids (stats, chips, cards, bento) | `stagger-children` | existing `data-stack` / `data-delay="i*0.08"` |
| Project / achievement / expertise cards | `hover-lift` | CSS hover `translateY(-6px)` + shadow (was -4px + tint) |
| Project banner particles | `parallax-drift` | existing backdrop rotation; `setProgress` hook available for future scrub |
| Gradient title shimmer | (no) | *Removed by design* — Apple uses static color; do not re-add shimmer |
| Modal / AI panel | `scale-fade` | keep existing Vue `<Transition>`; ease-apple |
| Dock entrance | `scale-fade` staggered | existing `dock-in` keyframes (delay 0.25+i*0.04) |

Reduced-motion: CSS media query in main.css already zeroes animation/transition duration; `useReveal` already no-ops offsets. Hero 3D renders a single frame under reduced motion (already in `heroScene.js`).

## 6. Feature-preservation checklist (must all still pass)

- [ ] **3D hero scene** — lazy import `../three/heroScene.js` + 400ms defer + reduce-mode single frame + dispose on unmount + render-on-demand (keep `visible`/IO/`visibilitychange`).
- [ ] **Hero typewriter** — roles cycle, `_` cursor blink, reduced-motion shows `p.roles[0]`.
- [ ] **Hero ScrollTrigger zoom-out** — `gsap.timeline` scrub, killed on unmount.
- [ ] **Marquee infinite scroll** — double-duplicated track, pause on off-screen/visibility.
- [ ] **Particle backdrop** — IO-gated lazy init (`createParticleBackdrop`), `setProgress`, dispose.
- [ ] **AI assistant** — `defineAsyncComponent`, `ask()` intent engine, `goto/mailto/link` actions, **localStorage `portfolio-ai.logs` logging (+DEV console)**, suggestions, Esc close, mobile safe-area offsets.
- [ ] **Project modal** — Esc + backdrop click + close button, Teleport, `project` prop data rendering.
- [ ] **Scrollspy dock + nav** — IntersectionObserver (nav) + scroll-position logic (dock), active states, `go()` smooth scroll with reduced guard.
- [ ] **Cursor glow** — intentionally removed (cleanup code in App.vue removed too); verify no `.cursor-glow` references remain.
- [ ] **Back-to-top** — `showTop > 560` rAF logic, `window.scrollTo` smooth w/ reduced guard.
- [ ] **Scroll-progress bar** — GSAP scaleX scrub 0.4, killed on unmount.
- [ ] **All id anchors** — `#top #about #experience #education #projects #expertise #achievements #certifications #skills #contact` resolve; `scroll-margin-top` re-tuned to 52px nav.
- [ ] **Boot overlay** in `index.html` — kept, restyled; removal script in `main.js` untouched.

## 7. Implementation order + risk notes

Suggested commit/phase order (each phase should leave the app buildable — alias tokens land in Phase 1):

| Phase | Scope | Files |
|---|---|---|
| 0 | Git branch + baseline `npm run build` | — |
| 1 | **Tokens + globals (biggest single change, do first)** | `main.css` `:root`, body, scrollbar, selection, focus, `.text-gradient`, `.container`, `.section`, `.btn`, `.tag/.chip`, `.timeline`, `.bento`, `.stat`, `.avatar-ring`, `.modal`, marquee, scroll-progress, back-top; **remove** `.cursor-glow` + `.orb` tint; add `.apple-nav .material .pill-btn .section-eyebrow .section-title .section-sub .hairline .display` | 
| 2 | Shell + fonts | `index.html` (system font stack, `theme-color`), `App.vue` (drop glow div + listeners; restyle progress/back-top) |
| 3 | Nav | `NavBar.vue` scoped styles + centered-logo template tweak |
| 4 | Hero + 3D | `HeroSection.vue` (anatomy classes), `heroScene.js` palette |
| 5 | Marquee | `MarqueeStrip.vue` eyebrow |
| 6 | Editorial middle | `AboutSection.vue`, `ExperienceSection.vue`, `EducationSection.vue` |
| 7 | Info grids | `ExpertiseSection.vue`, `AchievementsSection.vue`, `CertificationsSection.vue`, `SkillsSection.vue` |
| 8 | Projects | `ProjectsSection.vue`, `ProjectModal.vue`, `particleBackdrop.js` |
| 9 | Close | `ContactSection.vue`, `Footer.vue`, `FloatingDock.vue`, `AiAssistant.vue` |
| 10 | Motion pass | `useReveal.js` defaults (blur 0 / y 24 / dur 0.7 / start 85%) |
| 11 | Verify | `npm run build`, `npm run dev`, `npm run smoke` |

**Risk notes:**
- **Anchor offsets:** switching nav 34→52px and `.section` scroll-margin 72px — verify every `scrollIntoView`/anchor lands with 52+8px offset; the dock `offsetTop` spy math is independent of CSS so it's safe.
- **Full-vh hero + scrub on mobile:** transforms on `100svh` sections cheap here (mix-blend-free), but disable the canvas/content scrub transforms ≤768px (fade only) to avoid jank on low-end Android; keep the existing short-viewport guards.
- **`backdrop-filter` budget:** applying `.material` blur everywhere is a real GPU cost. Limit true translucency to: nav, dock, modal overlay, AI panel, back-top. Section cards use solid `#fbfbfd` + hairline instead. Keep `-webkit-` prefixes.
- **Font swap → CLS/FOUC:** replacing Google Fonts with system stack changes metrics; set explicit `line-height` (0.98–1.0 display, 1.4–1.5 body) and `font-weight:600` on headlines so layout doesn't jump.
- **Class-name-preserving means zero template breakage** but `.section-head h2` sizing clamp must be updated in main.css once, not per component.
- **three.js is 520kB (already lazy-chunked)** — don't import statically; keep `dynamicImport` + IO gating. Keep `pixelRatio ≤ 1.25` (drop to 1.0 on mobile to save fill-rate).
- **HMR/listener stacking:** keep the existing `__glowBound` removal discipline when editing App.vue; when removing glow, also remove its cleanup.
- **`text-gradient` re-pointed, not removed** — otherwise 8+ components break visually mid-migration.
- **Marquee `scrollWidth/2`** is measured at mount; if the eyebrow adds a line above the track inside `.marquee`, it must not be inside `.marquee-track` (keep track as the only measured child).

## 8. Verification steps

1. `npm run build` — must pass; confirm three/GSAP chunks still split + lazy (check `dist/assets/*.js`; heroScene/particleBackdrop separate chunks).
2. `npm run smoke` — existing build+smoke script must pass.
3. `npm run dev`:
   - **Console:** zero errors/warnings; confirm `[AI]` DEV logs still appear when chatting.
   - **Nav:** transparent at top → frosted `blur/saturate` under `scrollY>30`; center logo; scrollspy highlights on scroll; burger → full-screen menu, body lock, resize closes.
   - **Hero:** eyebrow → 96px headline → typed role → subhead → two pills; galaxy renders subtle behind text; scroll-down zoom-out works; `prefers-reduced-motion` → static headline + single 3D frame; mobile (375px) layout, dock hidden conflicts none.
   - **Marquee:** seamless loop, pauses off-screen/tab-hidden.
   - **About:** counter stats animate once, hairline stat row.
   - **Experience/Education:** hairline timeline, blue current dot, anchored `#experience`.
   - **Projects:** banner particles fade in after IO trigger; 6 tiles hover-lift; modal opens, Esc/backdrop close, hairline content.
   - **Skills:** bento collapse to 1-col <900px, chips wrap.
   - **Contact:** pill CTAs open gmail draft link; meta hairline row.
   - **Footer:** multi-col links open coded profiles; legal row.
   - **Dock:** glass material, magnification + tooltips, active section dot, mobile full-width tab bar with safe-area inset.
   - **AI assistant:** open → suggestions; "show projects" scrolls to `#projects`; localStorage `portfolio-ai.logs` grows; panel glass.
   - **Back-top + progress bar:** bar scrubs blue; button appears >560px, smooth-to-top.
4. **A11y pass:** keyboard tab order, `:focus-visible` blue rings, aria-labels intact, contrast of `#86868b` on `#fff` ≥ 4.5:1 for body text (16px+), Lighthouse a11y ≥ 95.
5. Optional: `npx vite preview` to validate the `base:'./'` build on Git Pages/Vercel paths.