import raw from './notes.md?raw'

/**
 * Notes — loads the assistant's knowledge base (notes.md) as a lightweight,
 * editable single source of truth. Sections are marked up with:
 *
 *   ## Section title
 *   > aliases: keyword, keyword, phrase
 *   <body lines>
 *
 * parseNotes() returns { title, aliases, body } for every section.
 * findNotes(text) scores sections against the query's aliases + heading words
 * and returns the best match (or null). listNoteTitles() is used by the
 * "what notes do you have?" intent.
 */
const SECTION_RE = /^##\s+(.+)$/
const ALIAS_RE = /^>\s*aliases?:\s*(.+)$/i

export function parseNotes() {
  const sections = []
  let cur = null
  for (const line of raw.split('\n')) {
    const m = line.match(SECTION_RE)
    if (m) {
      cur = { title: m[1].trim(), aliases: [], body: [] }
      sections.push(cur)
      continue
    }
    if (!cur) continue
    const a = line.match(ALIAS_RE)
    if (a) {
      cur.aliases = a[1].split(',').map((s) => s.trim().toLowerCase())
      continue
    }
    cur.body.push(line)
  }
  return sections.map((s) => ({
    title: s.title,
    aliases: s.aliases,
    body: s.body.join('\n').trim()
  }))
}

export function listNoteTitles() {
  return parseNotes().map((s) => s.title)
}

const norm = (s) => ' ' + s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ') + ' '

export function findNotes(text) {
  const q = norm(text)
  const tokens = q.trim().split(/\s+/)
  let best = null
  let bestScore = 0
  for (const n of parseNotes()) {
    let score = n.aliases.reduce((acc, a) => acc + (q.includes(` ${a} `) ? a.split(/\s+/).length : 0), 0)
    for (const w of n.title.toLowerCase().replace(/&/g, 'and').split(/\s+/)) {
      if (w.length > 3 && tokens.some((tok) => w.startsWith(tok) || tok.startsWith(w))) score += 1
    }
    if (score > bestScore) {
      bestScore = score
      best = n
    }
  }
  return bestScore > 0 ? best : null
}