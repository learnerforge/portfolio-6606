import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist-smoke')
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const checks = [
  { name: 'build output exists', ok: fs.existsSync(dist) },
  { name: 'boot overlay present', ok: html.includes('id="boot"') },
  { name: 'app mount point present', ok: html.includes('id="app"') },
  { name: 'fonts wired', ok: html.includes('Space+Grotesk') && html.includes('JetBrains+Mono') },
  { name: 'title set', ok: html.includes('Ganesh Bakkera | AI & ML Engineer') }
]

let pass = true
for (const c of checks) {
  console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}`)
  if (!c.ok) pass = false
}

const jsAssets = fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.js'))
console.log(`\n${jsAssets.length} JS assets emitted:`)
for (const f of jsAssets) {
  const size = (fs.statSync(path.join(dist, 'assets', f)).size / 1024).toFixed(1)
  console.log(`  - ${f} (${size} KB)`)
}

if (!pass) {
  console.error('\nSMOKE TEST FAILED')
  process.exit(1)
}
console.log('\nSMOKE TEST PASSED')
