/**
 * ParticleBackdrop — a slow-drifting 3D particle cloud used behind the
 * projects banner, rendered with bare WebGL (no three.js). Exposes
 * setProgress() so GSAP can scrub opacity/rotation as the user scrolls.
 *
 * Visual contract kept identical to the previous three.js Points version:
 * perspective camera at +z, same sphere distribution, same gray→blue color
 * ramp, square points with size attenuation, straight-alpha blending, and a
 * short wake-window render loop driven by visibility.
 */

const VERT = `
attribute vec3 aPos;
attribute vec3 aColor;
uniform mat4 uMVP;
uniform float uSize;
uniform float uScale;
uniform float uOpacity;
varying vec3 vColor;
void main() {
  vec4 mv = uMVP * vec4(aPos, 1.0);
  gl_PointSize = max(uSize * (uScale / -mv.z), 1.0);
  vColor = aColor;
  gl_Position = mv;
}`

const FRAG = `
precision mediump float;
varying vec3 vColor;
uniform float uOpacity;
void main() {
  gl_FragColor = vec4(vColor, uOpacity);
}`

function compile(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('particleBackdrop shader error:', gl.getShaderInfoLog(sh))
  }
  return sh
}

function mul(a, b) {
  const r = new Float32Array(16)
  for (let c = 0; c < 4; c++) {
    for (let row = 0; row < 4; row++) {
      let s = 0
      for (let k = 0; k < 4; k++) s += a[k * 4 + row] * b[c * 4 + k]
      r[c * 4 + row] = s
    }
  }
  return r
}

function perspectiveProjection(aspect, fovDeg, near, far) {
  const f = 1 / Math.tan((fovDeg * Math.PI) / 360)
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0
  ])
}

function rotation(view, rotX, rotY) {
  const cx = Math.cos(rotX), sx = Math.sin(rotX)
  const cy = Math.cos(rotY), sy = Math.sin(rotY)
  const rx = new Float32Array([1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1])
  const ry = new Float32Array([cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1])
  return mul(mul(view, rx), ry)
}

export function createParticleBackdrop(canvas, { count = 400, opacity = 0.3 } = {}) {
  let raf = 0
  let disposed = false
  let contextLost = false
  let visible = true
  let driftUntil = 0
  let rafRunning = false
  let start = 0
  let currentOpacity = opacity
  let pixelRatio = 1

  const noop = () => {}
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = window.matchMedia('(pointer: coarse)').matches
  const deviceMem = navigator.deviceMemory || 8
  if (isMobile) count = Math.min(count, 280)

  const gl = canvas.getContext('webgl', {
    alpha: true, antialias: false, depth: false, stencil: false,
    premultipliedAlpha: true, powerPreference: 'high-performance'
  })
  if (!gl) return { setProgress: noop, dispose: noop }

  let program, locMVP = 0, locSize = 0, locScale = 0, locOpacity = 0, buffer = null
  let viewportW = 1, viewportH = 1

  function buildProgram() {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('particleBackdrop program error:', gl.getProgramInfoLog(prog))
    }
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    gl.useProgram(prog)
    return prog
  }

  function fillParticles() {
    const data = new Float32Array(count * 6)
    const cA = [0x86 / 255, 0x86 / 255, 0x8b / 255]
    const cB = [0x5a / 255, 0xc8 / 255, 0xfa / 255]
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.pow(Math.random(), 0.8) * 4.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const i6 = i * 6
      data[i6] = r * Math.sin(phi) * Math.cos(theta)
      data[i6 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65
      data[i6 + 2] = r * Math.cos(phi) * 0.5
      const t = Math.random()
      data[i6 + 3] = cA[0] + (cB[0] - cA[0]) * t
      data[i6 + 4] = cA[1] + (cB[1] - cA[1]) * t
      data[i6 + 5] = cA[2] + (cB[2] - cA[2]) * t
    }
    return data
  }

  function initialize() {
    program = buildProgram()
    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, fillParticles(), gl.STATIC_DRAW)

    const stride = 24
    const aPos = gl.getAttribLocation(program, 'aPos')
    const aColor = gl.getAttribLocation(program, 'aColor')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, stride, 0)
    gl.enableVertexAttribArray(aColor)
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride, 12)

    locMVP = gl.getUniformLocation(program, 'uMVP')
    locSize = gl.getUniformLocation(program, 'uSize')
    locScale = gl.getUniformLocation(program, 'uScale')
    locOpacity = gl.getUniformLocation(program, 'uOpacity')

    gl.disable(gl.DEPTH_TEST)
    gl.depthMask(false)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    resize()
  }

  function renderOnce() {
    raf = 0
    rafRunning = false
    if (disposed || !visible || contextLost) return
    if (reducedMotion) return

    const t = (performance.now() - start) / 1000
    const proj = perspectiveProjection(viewportW / viewportH, 55, 0.1, 100)
    const mvp = rotation(proj, Math.sin(t * 0.02) * 0.1, t * 0.03)

    gl.useProgram(program)
    gl.uniformMatrix4fv(locMVP, false, mvp)
    gl.uniform1f(locSize, 0.045)
    gl.uniform1f(locScale, viewportH / 2)
    gl.uniform1f(locOpacity, currentOpacity)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.POINTS, 0, count)

    if (performance.now() < driftUntil) requestFrame()
  }

  const requestFrame = () => {
    if (!visible || disposed || reducedMotion || contextLost) return
    if (!rafRunning) {
      rafRunning = true
      raf = requestAnimationFrame(renderOnce)
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
    initialize()
    wake()
  }
  canvas.addEventListener('webglcontextlost', onCtxLost)
  canvas.addEventListener('webglcontextrestored', onCtxRestored)

  const resize = () => {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth
    const h = canvas.clientHeight || canvas.parentElement.clientHeight
    pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : (deviceMem >= 8 ? 1.25 : 1))
    viewportW = Math.max(1, Math.round(w * pixelRatio))
    viewportH = Math.max(1, Math.round(h * pixelRatio))
    canvas.width = viewportW
    canvas.height = viewportH
    gl.viewport(0, 0, viewportW, viewportH)
    wake()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  start = performance.now()
  pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : (deviceMem >= 8 ? 1.25 : 1))
  initialize()
  if (reducedMotion) {
    renderOnce()
  } else {
    wake()
  }

  return {
    setProgress(p) {
      currentOpacity = opacity * p
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
      if (buffer) gl.deleteBuffer(buffer)
      if (program) gl.deleteProgram(program)
      try {
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      } catch { /* context already released */ }
    }
  }
}