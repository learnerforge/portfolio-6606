# Ganesh Bakkera — Portfolio

Personal portfolio of **Ganesh Bakkera** — AI/ML Engineer & Full Stack Developer.
A deploy-ready single-page app built with **React 19, Vite, Tailwind CSS v4, framer-motion, and lucide-react**, styled in an editorial "deep emerald on cream" theme.

![React](https://img.shields.io/badge/React-19-0F4C3A?logo=react) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Sections

- Cover hero · About · Experience · Education · Projects (with case-study modal)
- AI/ML Expertise · Achievements · Certifications · Coding Profiles · Skills · Contact

## Getting Started

```bash
npm install        # install dependencies
npm run dev        # local dev server at http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview the production build
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

All portfolio content lives in one file: [`src/data/portfolioData.js`](src/data/portfolioData.js). Update projects, skills, experience, and contact info there. The profile photo lives at `public/images/profile/ganesh-profile.png`.

## Built With

- React 19 · Vite 8 · Tailwind CSS v4 · framer-motion · lucide-react
