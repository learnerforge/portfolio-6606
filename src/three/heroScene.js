/**
 * HeroScene — a "holographic core" scene rendered with OGLogo
 * (a ~33 kB gzip drop-in for the three.js renderer). Driven by a GSAP
 * intro sequence, with continuous idle drift and mouse parallax.
 *
 * Ported 1:1 from the original three.js implementation (same geometry,
 * colors, opacities, camera path, ring/core/points rotations and the
 * on-demand render loop).
 */

import { Renderer, Camera, Transform, Mesh, Geometry, Program, Texture, Plane, Sphere, Torus, Vec3 } from 'ogl'
import { gsap } from 'gsap'

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
  return c
}

// ---- GLSL (WebGL1 syntax; OGL runs these shaders unchanged) ----

const POINTS_VERT = `
attribute vec3 position;
attribute vec3 color;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform float uPointSize;
uniform float uScale;
uniform float uOpacity;
varying vec3 vColor;
void main() {
  vColor = color;
  vec4 mv = viewMatrix * modelMatrix * vec4(position, 1.0);
  gl_PointSize = max(uPointSize * (uScale / -mv.z), 1.0);
  gl_Position = projectionMatrix * mv;
}`

const POINTS_UNIT_VERT = `
attribute vec3 position;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform float uPointSize;
uniform float uScale;
uniform float uOpacity;
void main() {
  vec4 mv = viewMatrix * modelMatrix * vec4(position, 1.0);
  gl_PointSize = max(uPointSize * (uScale / -mv.z), 1.0);
  gl_Position = projectionMatrix * mv;
}`

const POINTS_UNI_FRAG = `
precision mediump float;
varying vec3 vColor;
uniform float uOpacity;
void main() {
  gl_FragColor = vec4(vColor, uOpacity);
}`

const POINTS_COLOR_FRAG = `
precision mediump float;
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  gl_FragColor = vec4(uColor, uOpacity);
}`

const FLAT_VERT = `
attribute vec3 position;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}`

const FLAT_FRAG = `
precision mediump float;
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  gl_FragColor = vec4(uColor, uOpacity);
}`

const SPRITE_VERT = `
attribute vec3 position;
attribute vec2 uv;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform vec3 uSize;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 center = modelMatrix[3].xyz;
  vec3 p = center + position * uSize;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`

const SPRITE_FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  vec4 tex = texture2D(uTex, vUv);
  gl_FragColor = vec4(tex.rgb * uColor, tex.a * uOpacity);
}`

// ---- Icosahedron generator (unit sphere, detail levels like three.js) ----

function createIcosahedron(detail) {
  const t = (1 + Math.sqrt(5)) / 2
  const base = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
  ].map(([x, y, z]) => {
    const l = Math.hypot(x, y, z)
    return [x / l, y / l, z / l]
  })

  let faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
  ]

  const midOf = (p1, p2) => {
    const m = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2]
    const l = Math.hypot(m[0], m[1], m[2])
    const r = [m[0] / l, m[1] / l, m[2] / l]
    for (let i = 0; i < base.length; i++) {
      const p = base[i]
      if (p[0] === r[0] && p[1] === r[1] && p[2] === r[2]) return i
    }
    base.push(r)
    return base.length - 1
  }

  for (let d = 0; d < detail; d++) {
    const next = []
    for (const [a, b, c] of faces) {
      const ab = midOf(base[a], base[b])
      const bc = midOf(base[b], base[c])
      const ca = midOf(base[c], base[a])
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca])
    }
    faces = next
  }

  const positions = new Float32Array(base.length * 3)
  base.forEach(([x, y, z], i) => {
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  })
  return { positions, faces }
}

function wireFromFaces(positions, faces) {
  const seen = new Set()
  const pairs = []
  for (const [a, b, c] of faces) {
    for (const [p, q] of [[a, b], [b, c], [c, a]]) {
      const key = p < q ? `${p},${q}` : `${q},${p}`
      if (seen.has(key)) continue
      seen.add(key)
      pairs.push(positions[p * 3], positions[p * 3 + 1], positions[p * 3 + 2])
      pairs.push(positions[q * 3], positions[q * 3 + 1], positions[q * 3 + 2])
    }
  }
  return new Float32Array(pairs)
}

export function createHeroScene(canvas) {
  let raf = 0
  let disposed = false
  let contextLost = false
  let visible = true
  let rafRunning = false
  let start = 0
  let lastMove = 0
  let renderer = null

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = window.matchMedia('(pointer: coarse)').matches
  const deviceMem = navigator.deviceMemory || 8
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : (deviceMem >= 8 ? 1.25 : 1))

  const S = {} // mutable state — rebuilt on context restore

  function build() {
    renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
      depth: true,
      webgl: 1,
      dpr
    })

    const camera = new Camera(renderer.gl, { near: 0.1, far: 100, fov: 55 })
    camera.position.set(0, 0, 14)

    const scene = new Transform()
    scene.addChild(camera)

    renderer.gl.disable(renderer.gl.DEPTH_TEST)
    renderer.gl.depthMask(false)
    renderer.gl.enable(renderer.gl.BLEND)
    renderer.gl.blendFunc(renderer.gl.SRC_ALPHA, renderer.gl.ONE_MINUS_SRC_ALPHA)

    // ---------- particle galaxy ----------
    const GALAXY_COUNT = isMobile ? 760 : 1100
    const gPos = new Float32Array(GALAXY_COUNT * 3)
    const gCol = new Float32Array(GALAXY_COUNT * 3)
    const cIn = [0x5a / 255, 0xc8 / 255, 0xfa / 255]
    const cOut = [0x00 / 255, 0x71 / 255, 0xe3 / 255]
    for (let i = 0; i < GALAXY_COUNT; i++) {
      const dist = 2 + Math.pow(Math.random(), 0.6) * 9
      const angle = Math.random() * Math.PI * 2 + dist * 0.55
      const y = (Math.random() - 0.5) * 0.55 * (dist / 11)
      const i3 = i * 3
      gPos[i3] = Math.cos(angle) * dist
      gPos[i3 + 1] = y
      gPos[i3 + 2] = Math.sin(angle) * dist
      const tt = Math.min(Math.max((dist - 2) / 9, 0), 1)
      gCol[i3] = cIn[0] + (cOut[0] - cIn[0]) * tt
      gCol[i3 + 1] = cIn[1] + (cOut[1] - cIn[1]) * tt
      gCol[i3 + 2] = cIn[2] + (cOut[2] - cIn[2]) * tt
    }
    const galaxyGeo = new Geometry(renderer.gl, {
      position: { size: 3, data: gPos },
      color: { size: 3, data: gCol }
    })
    const galaxyProg = new Program(renderer.gl, {
      vertex: POINTS_VERT,
      fragment: POINTS_UNI_FRAG,
      uniforms: {
        uPointSize: { value: 0.05 },
        uScale: { value: 1 },
        uOpacity: { value: 0 }
      },
      transparent: true,
      depthWrite: false,
      cullFace: false,
      depthTest: false
    })
    const galaxy = new Mesh(renderer.gl, { geometry: galaxyGeo, program: galaxyProg, mode: renderer.gl.POINTS })
    galaxy.frustumCulled = false
    scene.addChild(galaxy)

    // ---------- distant stars ----------
    const STAR_COUNT = isMobile ? 260 : 400
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
    const starGeo = new Geometry(renderer.gl, { position: { size: 3, data: sPos } })
    const starProg = new Program(renderer.gl, {
      vertex: POINTS_UNIT_VERT,
      fragment: POINTS_COLOR_FRAG,
      uniforms: {
        uPointSize: { value: 0.03 },
        uScale: { value: 1 },
        uOpacity: { value: 0 },
        uColor: { value: [0xae / 255, 0xae / 255, 0xb2 / 255] }
      },
      transparent: true,
      depthWrite: false,
      cullFace: false,
      depthTest: false
    })
    const stars = new Mesh(renderer.gl, { geometry: starGeo, program: starProg, mode: renderer.gl.POINTS })
    stars.frustumCulled = false
    scene.addChild(stars)

    // ---------- luminous ambient orbs ----------
    const orbTex = new Texture(renderer.gl, { image: makeOrbTexture() })
    const ORB_SPECS = [
      { x: -6.2, y: 2.4, z: -4, s: 9, color: [0x5a / 255, 0xc8 / 255, 0xfa / 255], opacity: 0.2 },
      { x: 6.4, y: -2.2, z: -5, s: 10, color: [0x00 / 255, 0x71 / 255, 0xe3 / 255], opacity: 0.18 },
      { x: 0.4, y: -3.6, z: -7, s: 12, color: [0x8a / 255, 0xcb / 255, 0xff / 255], opacity: 0.14 }
    ]
    const orbGeo = new Plane(renderer.gl, { width: 1, height: 1 })
    const orbs = ORB_SPECS.map((o) => {
      const prog = new Program(renderer.gl, {
        vertex: SPRITE_VERT,
        fragment: SPRITE_FRAG,
        uniforms: {
          uTex: { value: orbTex },
          uColor: { value: o.color.slice() },
          uSize: { value: [o.s, o.s, 1] },
          uOpacity: { value: 0 }
        },
        transparent: true,
        depthWrite: false,
        cullFace: false,
        depthTest: false
      })
      const orb = new Mesh(renderer.gl, { geometry: orbGeo, program: prog })
      orb.frustumCulled = false
      orb.position.set(o.x, o.y, o.z)
      scene.addChild(orb)
      return { spec: o, mesh: orb }
    })

    // ---------- holographic core ----------
    const core = new Transform()
    scene.addChild(core)

    const wireIco = createIcosahedron(1)
    const wireGeo = new Geometry(renderer.gl, { position: { size: 3, data: wireFromFaces(wireIco.positions, wireIco.faces) } })
    const wireProg = new Program(renderer.gl, {
      vertex: FLAT_VERT,
      fragment: FLAT_FRAG,
      uniforms: { uColor: { value: [0x5a / 255, 0xc8 / 255, 0xfa / 255] }, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      cullFace: false,
      depthTest: false
    })
    const wire = new Mesh(renderer.gl, { geometry: wireGeo, program: wireProg, mode: renderer.gl.LINES })
    wire.frustumCulled = false
    wire.scale.set(1.35, 1.35, 1.35)
    core.addChild(wire)

    const shellIco = createIcosahedron(2)
    const shellGeo = new Geometry(renderer.gl, { position: { size: 3, data: shellIco.positions } })
    const shellProg = new Program(renderer.gl, {
      vertex: POINTS_UNIT_VERT,
      fragment: POINTS_COLOR_FRAG,
      uniforms: {
        uPointSize: { value: 0.05 },
        uScale: { value: 1 },
        uOpacity: { value: 0 },
        uColor: { value: [0x9e / 255, 0xcb / 255, 0xff / 255] }
      },
      transparent: true,
      depthWrite: false,
      cullFace: false,
      depthTest: false
    })
    const shell = new Mesh(renderer.gl, { geometry: shellGeo, program: shellProg, mode: renderer.gl.POINTS })
    shell.frustumCulled = false
    shell.scale.set(1.55, 1.55, 1.55)
    core.addChild(shell)

    const innerGeo = new Sphere(renderer.gl, { radius: 0.6, widthSegments: 32, heightSegments: 32 })
    const innerProg = new Program(renderer.gl, {
      vertex: FLAT_VERT,
      fragment: FLAT_FRAG,
      uniforms: { uColor: { value: [0x00 / 255, 0x71 / 255, 0xe3 / 255] }, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      cullFace: false,
      depthTest: false
    })
    const inner = new Mesh(renderer.gl, { geometry: innerGeo, program: innerProg })
    inner.frustumCulled = false
    core.addChild(inner)

    const ringGeo = new Torus(renderer.gl, { radius: 2.2, tube: 0.015, radialSegments: 8, tubularSegments: 120 })
    const ring1Prog = new Program(renderer.gl, {
      vertex: FLAT_VERT,
      fragment: FLAT_FRAG,
      uniforms: { uColor: { value: [0x5a / 255, 0xc8 / 255, 0xfa / 255] }, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      cullFace: false,
      depthTest: false
    })
    const ring1 = new Mesh(renderer.gl, { geometry: ringGeo, program: ring1Prog })
    ring1.frustumCulled = false
    ring1.rotation.x = Math.PI / 2.2
    core.addChild(ring1)

    const ringGeo2 = new Torus(renderer.gl, { radius: 2.7, tube: 0.01, radialSegments: 8, tubularSegments: 120 })
    const ring2Prog = new Program(renderer.gl, {
      vertex: FLAT_VERT,
      fragment: FLAT_FRAG,
      uniforms: { uColor: { value: [0x00 / 255, 0x71 / 255, 0xe3 / 255] }, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      cullFace: false,
      depthTest: false
    })
    const ring2 = new Mesh(renderer.gl, { geometry: ringGeo2, program: ring2Prog })
    ring2.frustumCulled = false
    ring2.rotation.x = Math.PI / 1.6
    ring2.rotation.y = 0.6
    core.addChild(ring2)

    Object.assign(S, {
      renderer, camera, scene, geometrySet: true, lookTarget: new Vec3(0, 0, 0),
      galaxy, galaxyProg, stars, starProg, orbs, orbTex,
      core, wire, wireProg, shell, shellProg, inner, innerProg,
      ring1, ring1Prog, ring2, ring2Prog,
      galaxyGeo, starGeo, wireGeo, shellGeo, innerGeo, ringGeo, ringGeo2, orbGeo
    })
  }

  // ---------- resize ----------
  const resize = () => {
    if (!S.renderer) return
    const w = canvas.clientWidth || canvas.parentElement.clientWidth
    const h = canvas.clientHeight || canvas.parentElement.clientHeight
    S.renderer.setSize(w, h)
    canvas.style.width = ''
    canvas.style.height = ''
    S.camera.perspective({ aspect: w / h })
    const half = (canvas.height * dpr) / 2
    S.galaxyProg.uniforms.uScale.value = half
    S.starProg.uniforms.uScale.value = half
    S.shellProg.uniforms.uScale.value = half
    requestFrame()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

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

  // ---------- loop (render on demand — ~0% CPU when idle) ----------
  const requestFrame = () => {
    if (!visible || disposed || reducedMotion || contextLost || !S.renderer) return
    if (!rafRunning) {
      rafRunning = true
      raf = requestAnimationFrame(renderOnce)
    }
  }

  function renderOnce() {
    raf = 0
    rafRunning = false
    if (disposed || !visible || contextLost || !S.renderer) return
    const t = (performance.now() - start) / 1000
    mouse.x += (target.x - mouse.x) * 0.06
    mouse.y += (target.y - mouse.y) * 0.06

    const camera = S.camera
    camera.position.z += (props.cameraZ - camera.position.z) * 0.08
    camera.position.y += (props.camY + mouse.y * 0.25 - camera.position.y) * 0.08
    camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.05
    camera.lookAt(S.lookTarget)

    S.core.rotation.y = props.spin * Math.PI * 2 + t * 0.05 + mouse.x * 0.15
    S.core.rotation.x = Math.sin(t * 0.12) * 0.06 + mouse.y * 0.12
    const s = Math.max(props.scale, 0.001)
    S.core.scale.set(s, s, s)

    S.ring1.rotation.z = t * 0.12
    S.ring2.rotation.z = -t * 0.09

    S.galaxy.rotation.y = t * 0.015 + 0.2
    S.stars.rotation.y = -t * 0.008

    for (let i = 0; i < S.orbs.length; i++) {
      const { spec, mesh } = S.orbs[i]
      mesh.program.uniforms.uOpacity.value = props.particleAlpha * spec.opacity * 0.85
      mesh.position.y = spec.y + Math.sin(t * 0.12 + i * 2.1) * 0.7
      mesh.position.x = spec.x + Math.cos(t * 0.09 + i * 1.7) * 0.6
    }

    const introFade = reducedMotion ? 1 : Math.min(1, Math.max(0, (t - 0.4) / 0.6))
    S.galaxyProg.uniforms.uOpacity.value = props.particleAlpha * 0.35
    S.starProg.uniforms.uOpacity.value = props.particleAlpha * 0.18
    S.wireProg.uniforms.uOpacity.value = props.coreAlpha * 0.25 * introFade
    S.shellProg.uniforms.uOpacity.value = props.coreAlpha * 0.32 * introFade
    S.innerProg.uniforms.uOpacity.value = props.coreAlpha * 0.14 * introFade
    S.ring1Prog.uniforms.uOpacity.value = props.coreAlpha * 0.2 * introFade
    S.ring2Prog.uniforms.uOpacity.value = props.coreAlpha * 0.14 * introFade

    renderer.render({ scene: S.scene, camera })
    const active = t < 5 || (performance.now() - lastMove) < 2000
    if (active) requestFrame()
  }

  // ---------- visibility ----------
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

  const visIO = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) requestFrame()
  }, { rootMargin: '50px' })
  visIO.observe(canvas)

  const onCtxLost = (e) => {
    e.preventDefault()
    contextLost = true
    cancelAnimationFrame(raf)
    raf = 0
    rafRunning = false
  }
  const onCtxRestored = () => {
    contextLost = false
    removeResources()
    start = performance.now()
    build()
    resize()
    if (!visible || disposed) return
    if (reducedMotion) {
      renderer.render({ scene: S.scene, camera: S.camera })
    } else {
      requestFrame()
    }
  }
  canvas.addEventListener('webglcontextlost', onCtxLost)
  canvas.addEventListener('webglcontextrestored', onCtxRestored)

  // ---------- teardown of GPU resources (also used on context restore) ----------
  function removeResources() {
    if (!S.geometrySet) return
    ;[S.galaxyGeo, S.starGeo, S.wireGeo, S.shellGeo, S.innerGeo, S.ringGeo, S.ringGeo2, S.orbGeo].forEach((g) => g && g.remove())
    ;[S.galaxyProg, S.starProg, S.wireProg, S.shellProg, S.innerProg, S.ring1Prog, S.ring2Prog].forEach((p) => p && p.remove())
    ;(S.orbs || []).forEach(({ mesh }) => mesh.program.remove())
    if (S.orbTex) {
      const gl = S.orbTex.gl
      gl.deleteTexture(S.orbTex.texture)
    }
    S.geometrySet = false
  }

  // ---------- boot ----------
  start = performance.now()
  build()
  resize()
  if (reducedMotion) {
    renderer.render({ scene: S.scene, camera: S.camera })
  } else {
    requestFrame()
  }

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
      removeResources()
      try {
        renderer.gl.getExtension('WEBGL_lose_context')?.loseContext()
      } catch { /* context already released */ }
    }
  }
}