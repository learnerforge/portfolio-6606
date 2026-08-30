import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * HeroScene — a Three.js "holographic core" scene driven by a Theatre.js
 * intro sequence, with continuous idle drift and mouse parallax afterwards.
 */

// Soft radial glow texture used for the ambient orbs (no external asset).
function makeOrbTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(255, 255, 255, 0.6)')
  g.addColorStop(0.28, 'rgba(255, 255, 255, 0.2)')
  g.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

export function createHeroScene(canvas) {
  let raf = 0
  let disposed = false
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = window.matchMedia('(pointer: coarse)').matches
  const deviceMem = navigator.deviceMemory || 8

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : (deviceMem >= 8 ? 1.25 : 1)))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
  camera.position.set(0, 0, 14)

  // ---------- particle galaxy ----------
  const GALAXY_COUNT = isMobile ? 760 : 1100
  const galaxyGeo = new THREE.BufferGeometry()
  const gPos = new Float32Array(GALAXY_COUNT * 3)
  const gCol = new Float32Array(GALAXY_COUNT * 3)
  const cIn = new THREE.Color(0x5ac8fa)
  const cOut = new THREE.Color(0x0071e3)
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
    blending: THREE.NormalBlending, depthWrite: false, sizeAttenuation: true
  })
  const galaxy = new THREE.Points(galaxyGeo, galaxyMat)
  scene.add(galaxy)

  // ---------- distant stars ----------
  const STAR_COUNT = isMobile ? 260 : 400
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
    size: 0.03, color: 0xaeaeb2, transparent: true, opacity: 0,
    blending: THREE.NormalBlending, depthWrite: false, sizeAttenuation: true
  })
  const stars = new THREE.Points(starGeo, starMat)
  scene.add(stars)

  // ---------- luminous ambient orbs ----------
  const orbTex = makeOrbTexture()
  const ORB_SPECS = [
    { x: -6.2, y: 2.4, z: -4, s: 9, color: 0x5ac8fa, opacity: 0.2 },
    { x: 6.4, y: -2.2, z: -5, s: 10, color: 0x0071e3, opacity: 0.18 },
    { x: 0.4, y: -3.6, z: -7, s: 12, color: 0x8acbff, opacity: 0.14 }
  ]
  const orbs = ORB_SPECS.map((o, i) => {
    const mat = new THREE.SpriteMaterial({
      map: orbTex, color: o.color, transparent: true, opacity: 0,
      blending: THREE.NormalBlending, depthWrite: false
    })
    const orb = new THREE.Sprite(mat)
    orb.position.set(o.x, o.y, o.z)
    orb.scale.setScalar(o.s)
    scene.add(orb)
    return orb
  })

  // ---------- holographic core ----------
  const core = new THREE.Group()
  scene.add(core)

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.35, 1),
    new THREE.MeshBasicMaterial({ color: 0x5ac8fa, wireframe: true, transparent: true, opacity: 0, blending: THREE.NormalBlending, depthWrite: false })
  )
  core.add(wire)

  const shellGeo = new THREE.IcosahedronGeometry(1.55, 2)
  const shell = new THREE.Points(
    shellGeo,
    new THREE.PointsMaterial({ size: 0.05, color: 0x9ecbff, transparent: true, opacity: 0, blending: THREE.NormalBlending, depthWrite: false, sizeAttenuation: true })
  )
  core.add(shell)

  const inner = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x0071e3, transparent: true, opacity: 0, blending: THREE.NormalBlending, depthWrite: false })
  )
  core.add(inner)

  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.015, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0x5ac8fa, transparent: true, opacity: 0, blending: THREE.NormalBlending, depthWrite: false })
  )
  ring1.rotation.x = Math.PI / 2.2
  core.add(ring1)

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.7, 0.01, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0x0071e3, transparent: true, opacity: 0, blending: THREE.NormalBlending, depthWrite: false })
  )
  ring2.rotation.x = Math.PI / 1.6
  ring2.rotation.y = 0.6
  core.add(ring2)

  // ---------- intro sequence (GSAP timeline) ----------
  const props = { cameraZ: 14, camY: 0, spin: 0, scale: 0, particleAlpha: 0, coreAlpha: 0 }
  let introTl = null
  if (!reducedMotion) {
    introTl = gsap.timeline()
      .to(props, { duration: 0.6, cameraZ: 12, camY: 0.3, spin: 0.1, scale: 0.15, particleAlpha: 0.35, coreAlpha: 0.15, ease: 'none' })
      .to(props, { duration: 0.8, cameraZ: 9, camY: 0.2, spin: 0.5, scale: 0.8, particleAlpha: 0.8, coreAlpha: 0.6, ease: 'none' })
      .to(props, { duration: 0.6, cameraZ: 7.6, camY: 0.18, spin: 0.9, scale: 1.05, particleAlpha: 1, coreAlpha: 0.9, ease: 'none' })
      .to(props, { duration: 0.5, cameraZ: 7.4, camY: 0.18, spin: 1, scale: 1, particleAlpha: 1, coreAlpha: 1, ease: 'power2.out' })
  } else {
    props.cameraZ = 7.4; props.camY = 0.18; props.spin = 1; props.scale = 1; props.particleAlpha = 1; props.coreAlpha = 1
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
  let contextLost = false
  let lastMove = 0

  const requestFrame = () => {
    if (!visible || disposed || reducedMotion || contextLost) return
    if (!rafRunning) {
      rafRunning = true
      raf = requestAnimationFrame(renderOnce)
    }
  }

  function renderOnce() {
    raf = 0
    rafRunning = false
    if (disposed || !visible || contextLost) return
    const t = clock.getElapsedTime()
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

    for (let i = 0; i < orbs.length; i++) {
      const o = orbs[i]
      const spec = ORB_SPECS[i]
      o.material.opacity = props.particleAlpha * spec.opacity * 0.85
      o.position.y = spec.y + Math.sin(t * 0.12 + i * 2.1) * 0.7
      o.position.x = spec.x + Math.cos(t * 0.09 + i * 1.7) * 0.6
    }

    const introFade = reducedMotion ? 1 : Math.min(1, Math.max(0, (t - 0.4) / 0.6))
    galaxyMat.opacity = props.particleAlpha * 0.35
    starMat.opacity = props.particleAlpha * 0.18
    wire.material.opacity = props.coreAlpha * 0.25 * introFade
    shell.material.opacity = props.coreAlpha * 0.32 * introFade
    inner.material.opacity = props.coreAlpha * 0.14 * introFade
    ring1.material.opacity = props.coreAlpha * 0.2 * introFade
    ring2.material.opacity = props.coreAlpha * 0.14 * introFade

    renderer.render(scene, camera)
    // keep animating during the intro and for a short drift window after any
    // interaction; otherwise stop the loop entirely (near-zero CPU)
    const active = t < 5 || (performance.now() - lastMove) < 2000
    if (active) {
      requestFrame()
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
    } else {
      visible = true
      requestFrame()
    }
  }
  document.addEventListener('visibilitychange', onVisChange)

  const onCtxLost = (e) => {
    e.preventDefault()
    contextLost = true
    cancelAnimationFrame(raf)
    raf = 0
    rafRunning = false
  }
  const onCtxRestored = () => {
    contextLost = false
    if (visible && !disposed) renderer.render(scene, camera)
  }
  canvas.addEventListener('webglcontextlost', onCtxLost)
  canvas.addEventListener('webglcontextrestored', onCtxRestored)

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
      cancelAnimationFrame(raf)
      ro.disconnect()
      visIO.disconnect()
      document.removeEventListener('visibilitychange', onVisChange)
      canvas.removeEventListener('webglcontextlost', onCtxLost)
      canvas.removeEventListener('webglcontextrestored', onCtxRestored)
      window.removeEventListener('mousemove', onMouse)
      if (introTl) introTl.kill()
      galaxyGeo.dispose(); starGeo.dispose()
      galaxyMat.dispose(); starMat.dispose()
      wire.geometry.dispose(); wire.material.dispose()
      shell.geometry.dispose(); shell.material.dispose()
      inner.geometry.dispose(); inner.material.dispose()
      ring1.geometry.dispose(); ring1.material.dispose()
      ring2.geometry.dispose(); ring2.material.dispose()
      orbs.forEach((o) => o.material.dispose())
      orbTex.dispose()
      renderer.dispose()
      try {
        renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext()
      } catch { /* context already released */ }
    }
  }
}
