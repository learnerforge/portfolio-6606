# Ganesh Bakkera — Portfolio

Personal portfolio of **Ganesh Bakkera** — AI/ML Engineer & Full Stack Developer.
A deploy-ready single-page app built with **Vue 3, Three.js, and GSAP**, styled in a dark immersive "neo-orbit" theme (deep ink + cyan/violet gradient + glass + noise).

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs) ![Three.js](https://img.shields.io/badge/Three.js-r185-000000?logo=threedotjs) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite) ![GSAP](https://img.shields.io/badge/GSAP-3-88CE02)

## Highlights

- **3D hero** — holographic core (wireframe icosahedron, particle shell, orbit rings, galaxy field) rendered with Three.js and choreographed by a GSAP intro sequence. Initialized after first paint so page load stays snappy
- **Particle backdrop** — lazy-initialized Three.js cloud behind the projects banner (via IntersectionObserver, constant opacity)
- **GSAP reveals** — every section fades/slides in as it scrolls into view (`data-reveal` attributes)
- **Cohesive icon system** — all emojis replaced by a single 24×24 / 1.6-stroke inline SVG icon set
- **Case-study modal**, typed hero roles, infinite marquee, cursor glow, scroll progress bar, boot overlay
- Perf-minded: capped pixel ratio, no full-screen noise overlay, no backdrop-blur on cards

## Sections

- Cover hero · About · Experience · Education · Projects (with case-study modal)
- AI/ML Expertise · Achievements · Certifications · Coding Profiles · Skills · Contact

## Getting Started

```bash
npm install        # install dependencies
npm run dev        # local dev server at http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview the production build
npm run smoke      # build to dist-smoke/ and run a lightweight output audit
```

## Deploy

The `base` is set to `./`, so the built `dist/` works on any static host.

### Vercel (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/learnerforge/portfolio-6606)

Or via CLI:

```bash
npm i -g vercel
vercel          # first deploy
vercel --prod   # production
```

A `vercel.json` (framework: vite, output: `dist`) is included.

### GitHub Pages

Push to `main` — the included `.github/workflows/deploy.yml` builds and publishes the site to GitHub Pages automatically. Enable **Settings → Pages → Source → GitHub Actions** once.

### Netlify

Import the repo; build command `npm run build`, publish directory `dist`.

## Content

All portfolio content lives in one file: [`src/data/portfolio.js`](src/data/portfolio.js). Update projects, skills, experience, and contact info there. The profile photo lives at `public/images/profile/ganesh-profile.png`.

## Structure

```
src/
├── main.js                # entry — mounts App, fades out boot overlay
├── App.vue                # layout, cursor glow, scroll progress, section order
├── styles/main.css        # "neo-orbit" design system (tokens, glass, buttons, chips)
├── data/portfolio.js      # single source of truth for all content
├── three/
│   ├── heroScene.js       # Three.js holographic core + GSAP intro sequence
│   └── particleBackdrop.js# scroll-scrubbed particle cloud for the projects banner
├── composables/
│   └── useReveal.js       # GSAP ScrollTrigger reveal engine (data-reveal)
└── components/            # one SFC per section
```

## Built With

- Vue 3 (Composition API) · Vite 8 · Three.js · GSAP (ScrollTrigger)

