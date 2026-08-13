import * as THREE from 'three'
import { getProject, types } from '@theatre/core'

/**
 * HeroScene — a Three.js "holographic core" scene driven by a Theatre.js
 * intro sequence, with continuous idle drift and mouse parallax afterwards.
 */
export function createHeroScene(canvas) {
  let raf = 0
  let disposed = false
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
  camera.position.set(0, 0, 14)

  // ---------- particle galaxy ----------
  const GALAXY_COUNT = 1100
  const galaxyGeo = new THREE.BufferGeometry()
  const gPos = new Float32Array(GALAXY_COUNT * 3)
  const gCol = new Float32Array(GALAXY_COUNT * 3)
  const cIn = new THREE.Color(0x22d3ee)
  const cOut = new THREE.Color(0x8b5cf6)
  for (let i = 0; i < GALAXY_COUNT; i++) {
    const dist = 2 + Math.pow(Math.random(), 0.6) * 9
    const angle = Math.random() * Math.PI * 2 + dist * 0.55
    const y = (Math.random() - 0.5) * 0.55 * (dist / 11)
    const i3 = i * 3
    gPos[i3] = Math.cos(angle) * dist
    gPos[i3 + 1] = y
    gPos[i3 + 2] = Math.sin(angle) * dist
    const t = THREE.MathUtils.clamp((dist - 2) / 9, 0, 1)
    const c = cIn.clone().lerp(cOut, t)
    gCol[i3] = c.r; gCol[i3 + 1] = c.g; gCol[i3 + 2] = c.b
  }
  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3))
  galaxyGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3))
  const galaxyMat = new THREE.PointsMaterial({
    size: 0.05, vertexColors: true, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  })
  const galaxy = new THREE.Points(galaxyGeo, galaxyMat)
  scene.add(galaxy)

  // ---------- distant stars ----------
  const STAR_COUNT = 400
  const starGeo = new THREE.BufferGeometry()
  const sPos = new Float32Array(STAR_COUNT * 3)
  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3
    const r = 12 + Math.random() * 8
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    sPos[i3] = r * Math.sin(phi) * Math.cos(theta)
    sPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4
    sPos[i3 + 2] = r * Math.cos(phi)
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
  const starMat = new THREE.PointsMaterial({
    size: 0.03, color: 0xffffff, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  })
  const stars = new THREE.Points(starGeo, starMat)
  scene.add(stars)

  // ---------- holographic core ----------
  const core = new THREE.Group()
  scene.add(core)

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.35, 1),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  )
  core.add(wire)

  const shellGeo = new THREE.IcosahedronGeometry(1.55, 2)
  const shell = new THREE.Points(
    shellGeo,
    new THREE.PointsMaterial({ size: 0.05, color: 0xe879f9, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true })
  )
  core.add(shell)

  const inner = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  )
  core.add(inner)

  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.015, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  )
  ring1.rotation.x = Math.PI / 2.2
  core.add(ring1)

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.7, 0.01, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  )
  ring2.rotation.x = Math.PI / 1.6
  ring2.rotation.y = 0.6
  core.add(ring2)

  // ---------- Theatre.js intro sequence ----------
  const props = { cameraZ: 14, camY: 0, spin: 0, scale: 0, particleAlpha: 0, coreAlpha: 0 }
  let project, sheet, obj, seq
  try {
    project = getProject('GBK-PORTFOLIO')
    sheet = project.sheet('HeroIntro')
    obj = sheet.object('hero', {
      cameraZ: types.number(14, { range: [5, 16] }),
      camY: types.number(0, { range: [-2, 2] }),
      spin: types.number(0),
      scale: types.number(0, { range: [0, 1.2] }),
      particleAlpha: types.number(0, { range: [0, 1] }),
      coreAlpha: types.number(0, { range: [0, 1] })
    })
    seq = sheet.sequence
    const record = (position, values) => {
      seq.position = position
      Object.assign(obj.value, values)
    }
    record(0, { cameraZ: 14, camY: 0.5, spin: 0, scale: 0, particleAlpha: 0, coreAlpha: 0 })
    record(0.6, { cameraZ: 12, camY: 0.3, spin: 0.1, scale: 0.15, particleAlpha: 0.35, coreAlpha: 0.15 })
    record(1.4, { cameraZ: 9, camY: 0.2, spin: 0.5, scale: 0.8, particleAlpha: 0.8, coreAlpha: 0.6 })
    record(2.0, { cameraZ: 7.6, camY: 0.18, spin: 0.9, scale: 1.05, particleAlpha: 1, coreAlpha: 0.9 })
    record(2.5, { cameraZ: 7.4, camY: 0.18, spin: 1, scale: 1, particleAlpha: 1, coreAlpha: 1 })
    if (!reducedMotion) {
      seq.play({ range: [0, 3.2], rate: 1 })
    } else {
      seq.position = 2.5
    }
  } catch (e) {
    // fall back to static final state
    props.cameraZ = 7.4; props.camY = 0.18; props.spin = 1; props.scale = 1; props.particleAlpha = 1; props.coreAlpha = 1
  }

  // read live Theatre values (updates during sequence playback)
  const readProps = () => {
    if (obj) {
      props.cameraZ = obj.value.cameraZ
      props.camY = obj.value.camY
      props.spin = obj.value.spin
      props.scale = obj.value.scale
      props.particleAlpha = obj.value.particleAlpha
      props.coreAlpha = obj.value.coreAlpha
    }
  }

  // ---------- input ----------
  const mouse = { x: 0, y: 0 }
  const target = { x: 0, y: 0 }
  const onMouse = (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1
    target.y = (e.clientY / window.innerHeight) * 2 - 1
    lastMove = performance.now()
    requestFrame()
  }
  window.addEventListener('mousemove', onMouse)

  // ---------- loop (render on demand — ~0% CPU when idle) ----------
  const clock = new THREE.Clock()
  let rafRunning = false
  let needsFrame = false
  let lastMove = 0

  const requestFrame = () => {
    if (!visible || disposed || reducedMotion) return
    needsFrame = true
    if (!rafRunning) {
      rafRunning = true
      raf = requestAnimationFrame(renderOnce)
    }
  }

  function renderOnce() {
    raf = 0
    rafRunning = false
    if (disposed || !visible) return
    const t = clock.getElapsedTime()
    readProps()
    mouse.x += (target.x - mouse.x) * 0.06
    mouse.y += (target.y - mouse.y) * 0.06

    camera.position.z += (props.cameraZ - camera.position.z) * 0.08
    camera.position.y += (props.camY + mouse.y * 0.25 - camera.position.y) * 0.08
    camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.05
    camera.lookAt(0, 0, 0)

    core.rotation.y = props.spin * Math.PI * 2 + t * 0.05 + mouse.x * 0.15
    core.rotation.x = Math.sin(t * 0.12) * 0.06 + mouse.y * 0.12
    const s = Math.max(props.scale, 0.001)
    core.scale.setScalar(s)

    ring1.rotation.z = t * 0.12
    ring2.rotation.z = -t * 0.09

    galaxy.rotation.y = t * 0.015 + 0.2
    stars.rotation.y = -t * 0.008

    const introFade = reducedMotion ? 1 : Math.min(1, Math.max(0, (t - 0.4) / 0.6))
    galaxyMat.opacity = props.particleAlpha * 0.9
    starMat.opacity = props.particleAlpha * 0.55
    wire.material.opacity = props.coreAlpha * 0.7 * introFade
    shell.material.opacity = props.coreAlpha * 0.9 * introFade
    inner.material.opacity = props.coreAlpha * 0.35 * introFade
    ring1.material.opacity = props.coreAlpha * 0.55 * introFade
    ring2.material.opacity = props.coreAlpha * 0.4 * introFade

    renderer.render(scene, camera)
    // keep animating during the intro and for a short drift window after any
    // interaction; otherwise stop the loop entirely (near-zero CPU)
    const active = t < 5 || (performance.now() - lastMove) < 2000
    if (active) {
      needsFrame = true
      requestFrame()
    } else {
      needsFrame = false
    }
  }

  // ---------- visibility (stop work when the hero is off-screen / tab hidden) ----------
  let visible = true
  const visIO = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) requestFrame()
  }, { rootMargin: '50px' })
  visIO.observe(canvas)

  const onVisChange = () => {
    if (document.hidden) {
      visible = false
      cancelAnimationFrame(raf)
      raf = 0
      rafRunning = false
      needsFrame = false
    } else {
      visible = true
      requestFrame()
    }
  }
  document.addEventListener('visibilitychange', onVisChange)

  // ---------- sizing ----------
  const resize = () => {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth
    const h = canvas.clientHeight || canvas.parentElement.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    requestFrame()
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  if (reducedMotion) {
    renderer.render(scene, camera)
  } else {
    requestFrame()
  }

  // ---------- dispose ----------
  return {
    dispose() {
      disposed = true
      visible = false
      rafRunning = false
      needsFrame = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      visIO.disconnect()
      document.removeEventListener('visibilitychange', onVisChange)
      window.removeEventListener('mousemove', onMouse)
      if (seq && seq.isPlaying) seq.pause()
      galaxyGeo.dispose(); starGeo.dispose()
      galaxyMat.dispose(); starMat.dispose()
      wire.geometry.dispose(); wire.material.dispose()
      shell.geometry.dispose(); shell.material.dispose()
      inner.geometry.dispose(); inner.material.dispose()
      ring1.geometry.dispose(); ring1.material.dispose()
      ring2.geometry.dispose(); ring2.material.dispose()
      renderer.dispose()
    }
  }
}
