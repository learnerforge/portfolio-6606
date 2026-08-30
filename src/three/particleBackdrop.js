import * as THREE from 'three'

/**
 * ParticleBackdrop — a slow-drifting 3D particle cloud used behind the
 * projects banner. Exposes setProgress() so GSAP can scrub opacity/rotation
 * as the user scrolls past it.
 */
export function createParticleBackdrop(canvas, { count = 400, opacity = 0.3 } = {}) {
  let raf = 0
  let disposed = false
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = window.matchMedia('(pointer: coarse)').matches
  const deviceMem = navigator.deviceMemory || 8
  if (isMobile) count = Math.min(count, 280)

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : (deviceMem >= 8 ? 1.25 : 1)))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
  camera.position.set(0, 0, 8)

  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const cA = new THREE.Color(0x86868b)
  const cB = new THREE.Color(0x5ac8fa)
  for (let i = 0; i < count; i++) {
    const r = 3 + Math.pow(Math.random(), 0.8) * 4.5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const i3 = i * 3
    pos[i3] = r * Math.sin(phi) * Math.cos(theta)
    pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65
    pos[i3 + 2] = r * Math.cos(phi) * 0.5
    const t = Math.random()
    const c = cA.clone().lerp(cB, t)
    col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({
    size: 0.045, vertexColors: true, transparent: true, opacity,
    blending: THREE.NormalBlending, depthWrite: false, sizeAttenuation: true
  })
  const points = new THREE.Points(geo, mat)
  scene.add(points)

  const clock = new THREE.Clock()
  let rafRunning = false
  let contextLost = false
  let visible = true
  let driftUntil = 0

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
    points.rotation.y = t * 0.03
    points.rotation.x = Math.sin(t * 0.02) * 0.1
    renderer.render(scene, camera)
    if (performance.now() < driftUntil) {
      requestFrame()
    }
  }

  const wake = () => {
    driftUntil = performance.now() + 2600
    requestFrame()
  }

  const visIO = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) wake()
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
      wake()
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

  const resize = () => {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth
    const h = canvas.clientHeight || canvas.parentElement.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    wake()
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  if (!reducedMotion) {
    wake()
  } else {
    renderer.render(scene, camera)
  }

  return {
    setProgress(p) {
      mat.opacity = opacity * p
      wake()
    },
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
      geo.dispose(); mat.dispose()
      renderer.dispose()
      try {
        renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext()
      } catch { /* context already released */ }
    }
  }
}
