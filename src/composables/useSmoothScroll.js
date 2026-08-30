import 'lenis/dist/lenis.css'

/**
 * useSmoothScroll — buttery Lenis momentum scrolling wired into GSAP's ticker so
 * every ScrollTrigger scrub/reveal stays frame-locked to the smoothed scroll.
 *
 * Call once from App.vue (`await useSmoothScroll()`). Skipped automatically under
 * prefers-reduced-motion and on touch devices. Anchor links (`a[href="#…"]`) are
 * delegated globally so offset and easing stay consistent with scrollToTarget().
 * The returned cleanup tears down the ticker, listeners and the Lenis instance.
 */
let initPromise = null
let anchorHandler = null

export function scrollToTarget(target, opts = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isEl = target instanceof Element
  let el = null
  if (typeof target === 'string') {
    const id = target.charAt(0) === '#' ? target.slice(1) : target
    el = document.getElementById(id) || document.querySelector(target) || null
  } else if (isEl) {
    el = target
  }
  const lenis = window.__lenis

  if (lenis && !reduced) {
    lenis.scrollTo(el || target, {
      offset: el ? (typeof opts.offset === 'number' ? opts.offset : -84) : 0,
      duration: typeof opts.duration === 'number' ? opts.duration : 1.1,
      force: true
    })
    return
  }

  if (el) {
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' })
  }
}

export function useSmoothScroll() {
  if (initPromise) return initPromise
  initPromise = (async () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduced || !fine) return null

    const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
      import('lenis'),
      (async () => {
        const m = await import('gsap')
        const st = await import('gsap/ScrollTrigger')
        m.gsap.registerPlugin(st.ScrollTrigger)
        return { gsap: m.gsap, ScrollTrigger: st.ScrollTrigger }
      })()
    ])

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      smoothWheel: true
    })
    window.__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tickerFn = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    anchorHandler = (e) => {
      if (e.defaultPrevented || e.button !== 0 || !e.target.closest) return
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const el = document.querySelector(href)
      if (!el) return
      e.preventDefault()
      scrollToTarget(el)
    }
    document.addEventListener('click', anchorHandler)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(tickerFn)
      if (anchorHandler) {
        document.removeEventListener('click', anchorHandler)
        anchorHandler = null
      }
      lenis.destroy()
      if (window.__lenis === lenis) window.__lenis = null
      initPromise = null
    }
  })()
  return initPromise
}