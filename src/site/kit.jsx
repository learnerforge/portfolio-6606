import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useSpring } from 'motion/react'
import {
  useInView,
  useMedia,
  usePrefersReducedMotion,
} from './hooks'

/* ============================================================
   Project "art" — deterministic procedural preview SVGs
   (stand-in for real screenshots; generated per project).
   Pure inline <svg> data-URIs — no images, no canvas. Motion is
   CSS-keyframe based and fully disabled under reduced-motion
   via an in-document @media gate.
   ============================================================ */

export const ART = {
  'pathforge-ai': ['#6366f1', '#a855f7', '#e879f9'],
  'ai-github-repo-analyzer': ['#0ea5e9', '#6366f1', '#a855f7'],
  'remote-mouse': ['#10b981', '#14b8a6', '#22d3ee'],
  nexasite: ['#f59e0b', '#f97316', '#f43f5e'],
  'js-components': ['#d946ef', '#a855f7', '#6366f1'],
  'push-to-github': ['#64748b', '#94a3b8', '#475569'],
}

const MOTIFS = {
  'pathforge-ai': 'graph',
  'ai-github-repo-analyzer': 'radar',
  'remote-mouse': 'signal',
  nexasite: 'windows',
  'js-components': 'wire',
  'push-to-github': 'console',
}

const ART_PALETTE_FALLBACK = ['#6366f1', '#a855f7', '#e879f9']

const ART_MOTION_CSS = `.art-pulse{transform-box:fill-box;transform-origin:center;animation:artPulse 3.4s ease-out infinite;opacity:0}
@keyframes artPulse{0%{transform:scale(0.4);opacity:0.85}100%{transform:scale(1.9);opacity:0}}
.art-drift{animation:artDrift 4.6s ease-in-out infinite alternate}
@keyframes artDrift{from{opacity:0.3}to{opacity:0.9}}
.art-scan{animation:artScan 5.5s linear infinite}
@keyframes artScan{0%{transform:translateY(-26px)}100%{transform:translateY(26px)}}
.art-spin{transform-box:view-box;animation:artSpin 16s linear infinite}
@keyframes artSpin{to{transform:rotate(360deg)}}
.art-blink{animation:artBlink 1.1s steps(1) infinite}
@keyframes artBlink{0%,49%{opacity:1}50%,100%{opacity:0}}
@media (prefers-reduced-motion:reduce){
.art-pulse,.art-drift,.art-scan,.art-spin,.art-blink{animation:none!important}
.art-pulse{opacity:0.45}
.art-drift{opacity:0.6}}`

function artSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function artRng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function artEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function artBackground(w, h, c1, c2) {
  const gridH = h * 0.66
  return `<rect width="${w}" height="${h}" fill="#0a0b18"/>
<rect width="${w}" height="${h}" fill="url(#r)"/>
<g opacity="0.14" filter="url(#b)">
<circle cx="${(w * 0.84).toFixed(1)}" cy="${(h * 0.2).toFixed(1)}" r="${(w * 0.2).toFixed(1)}" fill="${c2}"/>
<circle cx="${(w * 0.1).toFixed(1)}" cy="${(h * 0.6).toFixed(1)}" r="${(w * 0.18).toFixed(1)}" fill="${c1}"/>
</g>
<g opacity="0.08" stroke="#eef0ff" stroke-width="1">
${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${((gridH / 7) * (i + 1)).toFixed(1)}" x2="${w}" y2="${((gridH / 7) * (i + 1)).toFixed(1)}"/>`).join('')}
${Array.from({ length: 10 }, (_, i) => `<line x1="${((w / 9) * (i + 1)).toFixed(1)}" y1="0" x2="${((w / 9) * (i + 1)).toFixed(1)}" y2="${gridH.toFixed(1)}"/>`).join('')}
</g>`
}

function artCaption(w, h, id, label, num) {
  const pad = Math.round(Math.min(w, h) * 0.07)
  const titleSize = Math.max(20, Math.round(Math.min(w, h) * 0.08))
  const capSize = Math.max(10, Math.round(titleSize * 0.32))
  const n = typeof num === 'number' ? String(num).padStart(2, '0') : String(num ?? '')
  const cap = `${n ? `${n} — ` : ''}/work/${id}`
  const ttl = (String(label ?? '').trim() || 'project').slice(0, 18)
  return `<rect x="0" y="${(h * 0.52).toFixed(1)}" width="${w}" height="${(h * 0.48).toFixed(1)}" fill="url(#fade)"/>
<text x="${pad}" y="${(h - pad - capSize * 2).toFixed(1)}" font-family="Sora, Inter, sans-serif" font-size="${titleSize}" font-weight="800" letter-spacing="-0.5" fill="#eef0ff">${artEscape(ttl)}</text>
<text x="${pad}" y="${(h - pad).toFixed(1)}" font-family="JetBrains Mono, monospace" font-size="${capSize}" letter-spacing="${(capSize * 0.2).toFixed(1)}" fill="#9aa1d0" opacity="0.9">${artEscape(cap)}</text>`
}

/* ---- motif: roadmap node graph (pathforge-ai) ---- */
function artGraph(w, h, c1, c2, c3, rnd) {
  const top = h * 0.12
  const bottom = h * 0.56
  const x0 = w * 0.1
  const x1 = w * 0.9
  const cols = 5
  const layers = []
  for (let i = 0; i < cols; i += 1) {
    const count = 2 + Math.floor(rnd() * 3)
    const layer = []
    for (let j = 0; j < count; j += 1) {
      layer.push({
        x: x0 + ((x1 - x0) * i) / (cols - 1) + (rnd() - 0.5) * w * 0.02,
        y: top + ((bottom - top) * (j + 0.5)) / count + (rnd() - 0.5) * h * 0.03,
      })
    }
    layers.push(layer)
  }
  const edges = []
  for (let i = 0; i < cols - 1; i += 1) {
    for (const a of layers[i]) {
      let best = layers[i + 1][0]
      let bd = Infinity
      for (const b of layers[i + 1]) {
        const d = Math.abs(a.y - b.y)
        if (d < bd) {
          bd = d
          best = b
        }
      }
      const mx = ((a.x + best.x) / 2).toFixed(1)
      edges.push(
        `<path d="M${a.x.toFixed(1)} ${a.y.toFixed(1)} C${mx} ${a.y.toFixed(1)} ${mx} ${best.y.toFixed(1)} ${best.x.toFixed(1)} ${best.y.toFixed(1)}" fill="none" stroke="${c2}" stroke-width="1" opacity="0.35"/>`,
      )
    }
  }
  const dots = []
  const pulses = []
  let pi = 0
  for (const layer of layers) {
    for (const p of layer) {
      dots.push(
        `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="9" fill="none" stroke="${c3}" stroke-width="1" opacity="0.5"/>`,
        `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="${c1}"/>`,
      )
      if (rnd() > 0.72 && pi < 4) {
        pulses.push(
          `<circle class="art-pulse" style="animation-delay:${(pi * 0.75).toFixed(2)}s" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="12" fill="none" stroke="${c3}" stroke-width="1.4"/>`,
        )
        pi += 1
      }
    }
  }
  return edges.join('') + dots.join('') + pulses.join('')
}

/* ---- motif: 9-axis audit radar (ai-github-repo-analyzer) ---- */
function artRadar(w, h, c1, c2, c3, rnd) {
  const cx = w * 0.5
  const cy = h * 0.34
  const R = Math.min(w, h) * 0.25
  const axes = 9
  const parts = []
  for (let r = 1; r <= 3; r += 1) {
    const pts = []
    for (let i = 0; i < axes; i += 1) {
      const a = (Math.PI * 2 * i) / axes - Math.PI / 2
      pts.push(`${(cx + Math.cos(a) * R * (r / 3)).toFixed(1)},${(cy + Math.sin(a) * R * (r / 3)).toFixed(1)}`)
    }
    parts.push(`<polygon points="${pts.join(' ')}" fill="none" stroke="#eef0ff" stroke-width="1" opacity="${(0.08 + r * 0.04).toFixed(2)}"/>`)
  }
  for (let i = 0; i < axes; i += 1) {
    const a = (Math.PI * 2 * i) / axes - Math.PI / 2
    parts.push(
      `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * R).toFixed(1)}" y2="${(cy + Math.sin(a) * R).toFixed(1)}" stroke="#eef0ff" stroke-width="1" opacity="0.12"/>`,
    )
  }
  const dataPts = []
  const data = []
  for (let i = 0; i < axes; i += 1) {
    const a = (Math.PI * 2 * i) / axes - Math.PI / 2
    const rr = R * (0.45 + rnd() * 0.5)
    data.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr })
    dataPts.push(`${data[i].x.toFixed(1)},${data[i].y.toFixed(1)}`)
  }
  parts.push(`<polygon points="${dataPts.join(' ')}" fill="${c2}" fill-opacity="0.16" stroke="url(#g)" stroke-width="1.6" class="art-drift"/>`)
  for (let i = 0; i < data.length; i += 3) {
    parts.push(`<circle cx="${data[i].x.toFixed(1)}" cy="${data[i].y.toFixed(1)}" r="3.2" fill="${c3}"/>`)
  }
  parts.push(
    `<g class="art-scan"><rect x="${(cx - R).toFixed(1)}" y="${(cy - R * 0.8).toFixed(1)}" width="${(R * 2).toFixed(1)}" height="2" fill="${c3}" opacity="0.55"/></g>`,
  )
  return parts.join('')
}

/* ---- motif: pointer + signal to device (remote-mouse) ---- */
function artSignal(w, h, c1, c2, c3, rnd) {
  const min = Math.min(w, h)
  const cx = w * 0.36
  const cy = h * 0.32
  const rings = [0.14, 0.23, 0.32]
    .map(
      (f, i) =>
        `<circle class="art-pulse" style="animation-delay:${(i * 0.9).toFixed(2)}s" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(min * f).toFixed(1)}" fill="none" stroke="${c2}" stroke-width="1.5"/>`,
    )
    .join('')
  const s = min * 0.055
  const cursor = `<path d="M${(cx - s * 0.3).toFixed(1)} ${(cy - s * 0.6).toFixed(1)} L${(cx - s * 0.3).toFixed(1)} ${(cy + s * 0.9).toFixed(1)} L${(cx + s * 0.05).toFixed(1)} ${(cy + s * 0.55).toFixed(1)} L${(cx + s * 0.35).toFixed(1)} ${(cy + s * 1.1).toFixed(1)} L${(cx + s * 0.55).toFixed(1)} ${(cy + s * 0.95).toFixed(1)} L${(cx + s * 0.25).toFixed(1)} ${(cy + s * 0.4).toFixed(1)} L${(cx + s * 0.7).toFixed(1)} ${(cy + s * 0.4).toFixed(1)} Z" fill="#0a0b18" stroke="${c3}" stroke-width="1.6" stroke-linejoin="round"/>`
  const pw = min * 0.16
  const ph = pw * 1.9
  const px0 = w * 0.74
  const py0 = h * 0.14
  const phone = `<rect x="${px0.toFixed(1)}" y="${py0.toFixed(1)}" width="${pw.toFixed(1)}" height="${ph.toFixed(1)}" rx="${(pw * 0.14).toFixed(1)}" fill="#0a0b18" stroke="${c1}" stroke-width="1.6"/>
<rect x="${(px0 + pw * 0.12).toFixed(1)}" y="${(py0 + ph * 0.08).toFixed(1)}" width="${(pw * 0.76).toFixed(1)}" height="${(ph * 0.76).toFixed(1)}" rx="${(pw * 0.08).toFixed(1)}" fill="${c1}" opacity="0.14"/>
<circle cx="${(px0 + pw / 2).toFixed(1)}" cy="${(py0 + ph * 0.93).toFixed(1)}" r="${(pw * 0.07).toFixed(1)}" fill="none" stroke="${c1}" stroke-width="1.2" opacity="0.7"/>`
  const link = `<path d="M${(cx + s).toFixed(1)} ${cy.toFixed(1)} Q${((cx + px0) / 2).toFixed(1)} ${(cy - h * 0.05).toFixed(1)} ${(px0 - 5).toFixed(1)} ${(py0 + ph * 0.4).toFixed(1)}" fill="none" stroke="${c3}" stroke-width="1.2" stroke-dasharray="3 7" opacity="0.6" class="art-drift"/>`
  void rnd
  return rings + link + phone + cursor
}

/* ---- motif: stacked browser windows (nexasite) ---- */
function artWindows(w, h, c1, c2, c3, rnd) {
  const winW = w * 0.5
  const winH = h * 0.38
  const cards = [
    { x: w * 0.08, y: h * 0.08, s: 0.82, o: 0.35, hero: false },
    { x: w * 0.22, y: h * 0.15, s: 0.92, o: 0.55, hero: false },
    { x: w * 0.38, y: h * 0.22, s: 1, o: 0.92, hero: true },
  ]
  const out = []
  for (const c of cards) {
    const cw = winW * c.s
    const ch = winH * c.s
    const bar = ch * 0.16
    const dots = [c1, c2, c3]
      .map(
        (col, k) =>
          `<circle cx="${(c.x + 12 + k * 9).toFixed(1)}" cy="${(c.y + bar / 2).toFixed(1)}" r="2.4" fill="${col}"/>`,
      )
      .join('')
    const hero = c.hero
      ? `<rect x="${(c.x + cw * 0.08).toFixed(1)}" y="${(c.y + bar + ch * 0.14).toFixed(1)}" width="${(cw * 0.6).toFixed(1)}" height="${(ch * 0.2).toFixed(1)}" rx="4" fill="url(#g)" opacity="0.8"/>
<rect x="${(c.x + cw * 0.08).toFixed(1)}" y="${(c.y + bar + ch * 0.44).toFixed(1)}" width="${(cw * 0.44).toFixed(1)}" height="${(ch * 0.07).toFixed(1)}" rx="3" fill="#eef0ff" opacity="0.35"/>
<rect x="${(c.x + cw * 0.08).toFixed(1)}" y="${(c.y + bar + ch * 0.57).toFixed(1)}" width="${(cw * 0.3).toFixed(1)}" height="${(ch * 0.07).toFixed(1)}" rx="3" fill="#eef0ff" opacity="0.2"/>
<rect x="${(c.x + cw * 0.08).toFixed(1)}" y="${(c.y + bar + ch * 0.74).toFixed(1)}" width="${(cw * 0.22).toFixed(1)}" height="${(ch * 0.13).toFixed(1)}" rx="${(ch * 0.065).toFixed(1)}" fill="none" stroke="${c3}" stroke-width="1.4"/>`
      : ''
    out.push(
      `<g opacity="${c.o}" class="${c.hero ? '' : 'art-drift'}">
<rect x="${c.x.toFixed(1)}" y="${c.y.toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" rx="10" fill="#0d0f21" stroke="#eef0ff" stroke-opacity="0.22"/>
<line x1="${c.x.toFixed(1)}" y1="${(c.y + bar).toFixed(1)}" x2="${(c.x + cw).toFixed(1)}" y2="${(c.y + bar).toFixed(1)}" stroke="#eef0ff" stroke-opacity="0.16"/>
${dots}${hero}</g>`,
    )
  }
  void rnd
  return out.join('')
}

/* ---- motif: wireframe sphere + wave (js-components) ---- */
function artWire(w, h, c1, c2, c3, rnd) {
  const cx = w * 0.5
  const cy = h * 0.33
  const R = Math.min(w, h) * 0.23
  const parts = []
  for (let i = 0; i < 5; i += 1) {
    const t = ((i + 0.5) / 5) * Math.PI
    parts.push(
      `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${R.toFixed(1)}" ry="${(Math.cos(t) * R).toFixed(1)}" fill="none" stroke="${c2}" stroke-width="1" opacity="0.5"/>`,
    )
  }
  for (let i = 0; i < 4; i += 1) {
    const rx = Math.abs(Math.cos((i / 4) * Math.PI)) * R
    parts.push(
      `<ellipse class="art-spin" style="transform-origin:${cx.toFixed(1)}px ${cy.toFixed(1)}px;animation-delay:${(i * 0.4).toFixed(2)}s" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(rx || 2).toFixed(1)}" ry="${R.toFixed(1)}" fill="none" stroke="${c3}" stroke-width="1" opacity="0.65"/>`,
    )
  }
  for (let i = 0; i < 16; i += 1) {
    const a = rnd() * Math.PI * 2
    const rr = R * (1.2 + rnd() * 0.8)
    parts.push(
      `<circle cx="${(cx + Math.cos(a) * rr).toFixed(1)}" cy="${(cy + Math.sin(a) * rr * 0.7).toFixed(1)}" r="${(1 + rnd() * 1.8).toFixed(1)}" fill="${i % 2 ? c3 : c1}" class="art-drift" style="animation-delay:${(rnd() * 3).toFixed(2)}s"/>`,
    )
  }
  const pts = []
  for (let i = 0; i <= 40; i += 1) {
    const x = w * 0.08 + ((w * 0.84) * i) / 40
    const y = h * 0.6 + Math.sin(i * 0.45) * h * 0.028
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  parts.push(`<polyline points="${pts.join(' ')}" fill="none" stroke="url(#g)" stroke-width="1.8" opacity="0.8"/>`)
  return parts.join('')
}

/* ---- motif: terminal + branch graph (push-to-github) ---- */
function artConsole(w, h, c1, c2, c3, rnd) {
  const x = w * 0.1
  const y = h * 0.1
  const cw = w * 0.8
  const ch = h * 0.46
  const bar = Math.max(18, ch * 0.12)
  const parts = [
    `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" rx="12" fill="#0b0d1a" stroke="#eef0ff" stroke-opacity="0.18"/>`,
    `<line x1="${x.toFixed(1)}" y1="${(y + bar).toFixed(1)}" x2="${(x + cw).toFixed(1)}" y2="${(y + bar).toFixed(1)}" stroke="#eef0ff" stroke-opacity="0.14"/>`,
  ]
  ;[c1, c2, c3].forEach((col, k) => {
    parts.push(`<circle cx="${(x + 14 + k * 10).toFixed(1)}" cy="${(y + bar / 2).toFixed(1)}" r="2.6" fill="${col}"/>`)
  })
  parts.push(`<circle cx="${(x + 16).toFixed(1)}" cy="${(y + bar + 18).toFixed(1)}" r="3" fill="${c1}"/>`)
  const widths = [0.5, 0.32, 0.56, 0.26, 0.42]
  let ly = y + bar + 13
  for (let i = 0; i < widths.length; i += 1) {
    parts.push(
      `<rect x="${(x + 28).toFixed(1)}" y="${ly.toFixed(1)}" width="${(cw * widths[i] * 0.72).toFixed(1)}" height="6" rx="3" fill="${i % 2 ? c2 : c3}" opacity="${(0.55 - i * 0.06).toFixed(2)}"/>`,
    )
    ly += 15
  }
  parts.push(`<rect class="art-blink" x="${(x + 28).toFixed(1)}" y="${ly.toFixed(1)}" width="8" height="10" rx="1.5" fill="${c3}"/>`)
  const bx = x + cw - 30
  const by = y + bar + 22
  parts.push(
    `<line x1="${bx.toFixed(1)}" y1="${by.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${(by + 72).toFixed(1)}" stroke="${c2}" stroke-width="1.5" opacity="0.7"/>`,
    `<path d="M${bx.toFixed(1)} ${(by + 30).toFixed(1)} q14 11 0 26" fill="none" stroke="${c3}" stroke-width="1.4" opacity="0.85"/>`,
    `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="4" fill="${c1}"/>`,
    `<circle cx="${bx.toFixed(1)}" cy="${(by + 30).toFixed(1)}" r="4" fill="${c2}"/>`,
    `<circle cx="${bx.toFixed(1)}" cy="${(by + 56).toFixed(1)}" r="4" fill="${c3}"/>`,
    `<circle cx="${bx.toFixed(1)}" cy="${(by + 72).toFixed(1)}" r="4" fill="${c2}"/>`,
  )
  void rnd
  return parts.join('')
}

/* ---- motif: fallback orb + particles ---- */
function artOrb(w, h, c1, c2, c3, rnd) {
  const cx = w * 0.5
  const cy = h * 0.34
  const R = Math.min(w, h) * 0.2
  const parts = [
    `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${R.toFixed(1)}" fill="none" stroke="url(#g)" stroke-width="1.6"/>`,
    `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(R - 9).toFixed(1)}" fill="none" stroke="${c2}" stroke-width="1" stroke-dasharray="2 7" opacity="0.5"/>`,
    `<circle class="art-pulse" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(R * 0.45).toFixed(1)}" fill="none" stroke="${c3}" stroke-width="1.4"/>`,
  ]
  for (let i = 0; i < 12; i += 1) {
    const a = (Math.PI * 2 * i) / 12 + rnd() * 0.4
    const rr = R * (1.25 + rnd() * 0.5)
    parts.push(
      `<circle cx="${(cx + Math.cos(a) * rr).toFixed(1)}" cy="${(cy + Math.sin(a) * rr * 0.75).toFixed(1)}" r="${(1.2 + rnd() * 1.6).toFixed(1)}" fill="${i % 2 ? c1 : c3}" class="art-drift" style="animation-delay:${(rnd() * 3).toFixed(2)}s"/>`,
    )
  }
  return parts.join('')
}

const MOTIF_GENS = {
  graph: artGraph,
  radar: artRadar,
  signal: artSignal,
  windows: artWindows,
  wire: artWire,
  console: artConsole,
  orb: artOrb,
}

export function artFor(id, label, num, { w = 640, h = 420 } = {}) {
  const pid = String(id ?? 'project')
  const [c1, c2, c3] = ART[pid] || ART_PALETTE_FALLBACK
  const rnd = artRng(artSeed(pid))
  const gen = MOTIF_GENS[MOTIFS[pid] ?? 'orb'] || MOTIF_GENS.orb
  const defs = `<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c1}"/>
<stop offset="0.55" stop-color="${c2}"/>
<stop offset="1" stop-color="${c3}"/>
</linearGradient>
<radialGradient id="r" cx="0.3" cy="0.25" r="1">
<stop offset="0" stop-color="${c3}" stop-opacity="0.4"/>
<stop offset="1" stop-color="transparent"/>
</radialGradient>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#07080f" stop-opacity="0"/>
<stop offset="1" stop-color="#07080f" stop-opacity="0.95"/>
</linearGradient>
<filter id="b"><feGaussianBlur stdDeviation="3"/></filter>
</defs>`
  const body = gen(w, h, c1, c2, c3, rnd)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><style>${ART_MOTION_CSS}</style>${defs}${artBackground(w, h, c1, c2)}${body}${artCaption(w, h, pid, label, num)}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/* ============================================================
   Typewriter — rotating roles with caret
   ============================================================ */

export function Typewriter({ roles, className = '' }) {
  const reduce = usePrefersReducedMotion()
  const safe = useMemo(() => (roles?.length ? roles : ['']), [roles])
  const [i, setI] = useState(0)
  const [len, setLen] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduce) {
      setLen(safe[0].length)
      return
    }
    let t = setTimeout(
      () => {
        const word = safe[i]
        if (!deleting) {
          if (len < word.length) {
            setLen(len + 1)
          } else {
            setDeleting(true)
          }
        } else if (len > 0) {
          setLen(len - 1)
        } else {
          setDeleting(false)
          setI((i + 1) % safe.length)
        }
      },
      deleting ? 34 : len === 0 ? 420 : 58
    )
    return () => clearTimeout(t)
  }, [i, len, deleting, safe, reduce])

  const word = safe[i]
  const text = reduce ? safe[0] : word.slice(0, len)

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span className="text-accent-2">{text}</span>
      {!reduce && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-accent-2"
          style={{ animation: 'blink 1.1s steps(1) infinite' }}
        />
      )}
    </span>
  )
}

/* ============================================================
   GradientText — flowing gradient headline
   ============================================================ */

export function GradientText({ children, className = '' }) {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.span
      className={className}
      style={{
        backgroundImage:
          'linear-gradient(90deg,#818cf8 0%,#e879f9 25%,#a78bfa 50%,#f0abfc 75%,#818cf8 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline-block',
      }}
      animate={reduce ? false : { backgroundPosition: ['0% center', '-200% center'] }}
      transition={
        reduce ? undefined : { duration: 14, repeat: Infinity, ease: 'linear' }
      }
    >
      {children}
    </motion.span>
  )
}

/* ============================================================
   StaggerText — per-character rise/blur reveal
   ============================================================ */

export function StaggerText({ text, as: Tag = 'span', className = '', delay = 0, once = true }) {
  const [ref, inView] = useInView({ threshold: 0.3, once, rootMargin: '0px 0px -10% 0px' })
  const reduce = usePrefersReducedMotion()
  const chars = (text ?? '').split('')

  return (
    <Tag ref={ref} className={className} aria-label={text} role="text">
      {chars.map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
          style={{ display: 'inline-block' }}
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={reduce ? false : { y: '112%', opacity: 0, filter: 'blur(8px)' }}
            animate={reduce || inView ? { y: '0%', opacity: 1, filter: 'blur(0px)' } : {}}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.026,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {c === ' ' ? '\u00A0' : c}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* ============================================================
   BlockReveal — mask/slide paragraph, accent keywords
   ============================================================ */

export function BlockReveal({ text, accent = [], className = '', delay = 0, as: Tag = 'p' }) {
  const [ref, inView] = useInView({ threshold: 0.25, rootMargin: '0px 0px -12% 0px' })
  const reduce = usePrefersReducedMotion()
  const words = useMemo(() => (text ?? '').split(' '), [text])
  const accentSet = useMemo(() => new Set(accent), [accent])

  return (
    <Tag ref={ref} className={className} aria-label={text} role="text">
      {words.map((w, i) => {
        const clean = w.replace(/[^a-zA-Z]/g, '')
        const hot = accentSet.has(clean) || accentSet.has(w)
        return (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block overflow-hidden align-top"
          >
            <motion.span
              className={hot ? 'inline-block text-accent-2' : 'inline-block'}
              initial={reduce ? false : { y: '118%', opacity: 0 }}
              animate={reduce || inView ? { y: '0%', opacity: 1 } : {}}
              transition={{ duration: 0.62, delay: delay + i * 0.011, ease: [0.16, 1, 0.3, 1] }}
            >
              {'\u00A0' + w}
            </motion.span>
          </span>
        )
      })}
    </Tag>
  )
}

/* ============================================================
   StarfieldButton — twinkle-fill CTA (Originkit `starfield-button` slot)
   ============================================================ */

export function StarfieldButton({ children, className = '', onClick, href, type = 'button' }) {
  const canvasRef = useRef(null)
  const reduce = usePrefersReducedMotion()
  const hover = useRef(false)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const N = 90
    const stars = Array.from({ length: N }, (_, i) => ({
      x: ((i * 53) % 97) / 97,
      y: ((i * 37) % 89) / 89,
      s: 0.8 + ((i * 11) % 10) / 9,
      ph: ((i * 29) % 360),
      tint: i % 3,
    }))

    const resize = () => {
      const r = cv.getBoundingClientRect()
      w = r.width
      h = r.height
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    if (reduce) {
      ctx.clearRect(0, 0, w, h)
      stars.forEach((st) => {
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fillRect(st.x * w, st.y * h, st.s, st.s)
      })
      return
    }

    const colors = ['255,255,255', '167,139,250', '232,121,249']
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      const act = hover.current ? 1 : 0.25
      stars.forEach((st) => {
        const tw = (Math.sin(t / 400 + st.ph) + 1) / 2
        const a = (0.12 + tw * 0.88) * act
        ctx.fillStyle = `rgba(${colors[st.tint]},${a})`
        ctx.beginPath()
        ctx.arc(st.x * w, st.y * h, st.s, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduce])

  const cls = `glow-border gb-spin relative grid place-items-center overflow-hidden rounded-full bg-surface text-ink transition-transform duration-300 ${className}`
  const inner = (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-1.5 rounded-full"
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onPointerEnter={() => (hover.current = true)}
        onPointerLeave={() => (hover.current = false)}
      >
        {inner}
      </a>
    )
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={cls}
      onPointerEnter={() => (hover.current = true)}
      onPointerLeave={() => (hover.current = false)}
    >
      {inner}
    </button>
  )
}

/* ============================================================
   GhostCta — arrow-badge expand (Originkit `arrow-reveal-button` slot)
   ============================================================ */

export function GhostCta({ children, className = '', href, onClick, mono = true }) {
  const cls = `group inline-flex items-center gap-3 rounded-full border border-line bg-surface/60 pl-5 text-ink transition-colors duration-300 hover:border-accent-3/50 ${className}`
  const inner = (
    <>
      <span
        className={`relative z-10 transition-colors duration-300 group-hover:text-accent ${
          mono ? 'font-mono text-sm' : 'text-sm font-semibold'
        }`}
      >
        {children}
      </span>
      <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface-2 transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-accent transition-transform duration-500 group-hover:rotate-45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <span className="absolute inset-0 -translate-x-full rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

/* ============================================================
   GlowCard — cursor-tracked spotlight + rotating conic border
   ============================================================ */

export function GlowCard({ className = '', children, spin = true, as: Tag = 'div' }) {
  const ref = useRef(null)
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false })

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setSpot({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      on: true,
    })
  }

  return (
    <Tag
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setSpot((s) => ({ ...s, on: false }))}
      className={`glow-border ${spin ? 'gb-spin' : ''} panel group relative rounded-3xl ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-500"
        style={{
          opacity: spot.on ? 1 : 0,
          background: `radial-gradient(360px circle at ${spot.x}% ${spot.y}%, rgba(167,139,250,0.14), transparent 65%)`,
        }}
      />
      {children}
    </Tag>
  )
}

/* ============================================================
   FloatingPreview — cursor-following project preview
   (Originkit `hover-image-reveal` slot)
   ============================================================ */

export function FloatingPreview({ item, x, y }) {
  const reduce = usePrefersReducedMotion()
  const sx = useSpring(x, { stiffness: 340, damping: 34, mass: 0.8 })
  const sy = useSpring(y, { stiffness: 340, damping: 34, mass: 0.8 })

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] w-[270px] rounded-2xl border border-line bg-surface p-1.5 shadow-deep sm:w-[300px]"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-58%',
        rotate: reduce ? 0 : 2,
        opacity: item ? 1 : 0,
        scale: item ? 1 : 0.85,
      }}
      transition={{ duration: 0.18 }}
    >
      {item ? (
        <div className="overflow-hidden rounded-xl">
          <img
            src={artFor(item.id, item.title, item.num)}
            alt=""
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
      ) : null}
    </motion.div>
  )
}

/* ============================================================
   CursorAmbient — premium custom cursor
   (Originkit `cursor-ring-field` slot)
   ============================================================ */

export function CursorAmbient() {
  const fine = useMedia('(pointer: fine)')
  const reduce = usePrefersReducedMotion()
  const [show, setShow] = useState(false)

  const mx = useSpring(-100, { stiffness: 260, damping: 30, mass: 0.4 })
  const my = useSpring(-100, { stiffness: 260, damping: 30, mass: 0.4 })
  const rx = useSpring(-100, { stiffness: 420, damping: 34, mass: 0.28 })
  const ry = useSpring(-100, { stiffness: 420, damping: 34, mass: 0.28 })
  const scale = useSpring(0, { stiffness: 300, damping: 26 })

  useEffect(() => {
    if (!fine || reduce) return
    const onMove = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      rx.set(e.clientX)
      ry.set(e.clientY)
      setShow(true)
      document.body.classList.add('has-cursor')
    }
    const onOver = (e) => {
      const hot = e.target.closest('a, button, input, [data-hover]')
      scale.set(hot ? 1 : 0)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
    }
  }, [fine, reduce, mx, my, rx, ry, scale])

  if (!fine || reduce) return null

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[95] h-[22px] w-[22px] rounded-full border border-accent/70"
        style={{
          x: rx,
          y: ry,
          translateX: '-50%',
          translateY: '-50%',
          opacity: show ? 1 : 0,
          scale: 0.55 + scale,
        }}
        transition={{ duration: 0.12 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[94] h-1.5 w-1.5 rounded-full bg-accent"
        style={{ x: mx, y: my, translateX: '-50%', translateY: '-50%', opacity: show ? 1 : 0 }}
      />
    </>
  )
}

/* ============================================================
   HeroBackground — layered parallax starfield + nebula
   ============================================================ */

export function HeroBackground({ className = '' }) {
  const ref = useRef(null)
  const reduce = usePrefersReducedMotion()
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const stars = Array.from({ length: 210 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.25 + Math.pow(Math.random(), 2) * 0.75,
      s: 0.4 + Math.random() * 1.1,
      tw: Math.random() * Math.PI * 2,
      tint: i % 4,
    }))
    const colors = ['255,255,255', '255,255,255', '167,139,250', '232,121,249']

    const resize = () => {
      const r = cv.getBoundingClientRect()
      w = r.width
      h = r.height
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const onResize = () => {
      resize()
      if (reduce) draw()
    }
    const onMove = (e) => {
      const r = cv.getBoundingClientRect()
      targetRef.current.x = (e.clientX - r.left) / r.width - 0.5
      targetRef.current.y = (e.clientY - r.top) / r.height - 0.5
    }

    const draw = (t = 0) => {
      ctx.clearRect(0, 0, w, h)
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.06
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.06
      stars.forEach((st) => {
        const depth = st.z
        const par = 1 - depth * 0.85
        const ix = st.x * w + mouseRef.current.x * 40 * depth
        const iy = st.y * h + mouseRef.current.y * 26 * depth
        const b = (Math.sin(t / 800 + st.tw) + 1) / 2
        const a = (0.14 + b * 0.6) * (par + 0.15)
        ctx.fillStyle = `rgba(${colors[st.tint]},${a})`
        ctx.beginPath()
        ctx.arc(ix, iy, st.s * depth + 0.3, 0, Math.PI * 2)
        ctx.fill()
      })
      if (!reduce) raf = requestAnimationFrame(draw)
    }

    if (reduce) draw()
    else raf = requestAnimationFrame(draw)

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduce])

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} />
}

/* ============================================================
   Marquee — infinite ticker
   ============================================================ */

export function Marquee({ items = [], className = '', reverse = false, speed = 26 }) {
  const row = items.filter((t) => t).map((t, i) => (
    <span key={i} className="mx-5 flex shrink-0 items-center gap-5 font-mono tracking-[0.18em] text-faint uppercase">
      {t}
      <span className="text-accent/60">✦</span>
    </span>
  ))

  return (
    <div
      className={`marquee paused ${reverse ? '' : ''} ${className}`}
      aria-hidden="true"
      style={{ '--marquee-dur': `${speed}s` }}
    >
      <div className={`marquee-track items-center ${reverse ? 'reverse' : ''}`}>
        {row}
        {row}
      </div>
    </div>
  )
}