import { onMounted, onUnmounted } from 'vue'
import { getDevice } from '../utils/device.js'

/**
 * useReveal — per-container scroll-reveal engine built on GSAP + ScrollTrigger.
 *
 * Usage:
 *   const root = ref(null)
 *   useReveal(root)
 *
 * Any element inside root with [data-reveal] fades/slides in when scrolled
 * into view. Optional data-dir="up|down|left|right|scale|tilt", data-delay="0.2"
 * (staggered children get data-delay="i * 0.08"). Add data-stack to stagger a
 * container's direct children instead of the container itself. Elements with
 * [data-parallax="n"] scrub-drift vertically while crossing the viewport.
 * A subtle blur-in is applied by default and disabled under prefers-reduced-motion.
 */
let gsapPromise = null
function getGsap() {
  if (!gsapPromise) {
    gsapPromise = Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([mod, st]) => {
      const g = mod.gsap
      g.registerPlugin(st.ScrollTrigger)
      return g
    })
  }
  return gsapPromise
}

export function useReveal(root) {
  let gsap = null
  let ctx = null
  const animated = new WeakSet()
  const device = getDevice()
  const reduced = device.reduced
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const lowRam = device.lowRam

  const makeFrom = (el) => {
    const dir = el.dataset.dir || 'up'
    const dist = reduced ? 0 : lowRam ? 14 : isMobile ? 34 : 60
    const blur = reduced || lowRam ? 0 : isMobile ? 4 : 8
    const tilt = dir === 'tilt' ? 8 : 0
    return {
      opacity: 0,
      filter: `blur(${blur}px)`,
      y: dir === 'up' ? dist : dir === 'down' ? -dist : 0,
      x: dir === 'left' ? dist : dir === 'right' ? -dist : 0,
      scale: dir === 'scale' ? 0.9 : 1,
      rotate: tilt
    }
  }
  const to = { opacity: 1, filter: 'blur(0px)', y: 0, x: 0, scale: 1, rotate: 0 }

  const apply = () => {
    if (!gsap || !root.value) return
    if (ctx) ctx.revert()
    animated.clear()
    ctx = gsap.context(() => {
      // scrub parallax: any [data-parallax] element drifts as it crosses the viewport
      gsap.utils.toArray('[data-parallax]', root.value).forEach((el) => {
        const amt = parseFloat(el.dataset.parallax || 14)
        gsap.fromTo(el,
          { yPercent: amt },
          {
            yPercent: -amt,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
          }
        )
      })

      const els = gsap.utils.toArray('[data-reveal]', root.value)
      els.forEach((el) => {
        if (animated.has(el)) return
        animated.add(el)
        const delay = parseFloat(el.dataset.delay || 0)

        if (el.dataset.stack) {
          Array.from(el.children).forEach((kid, i) => {
            gsap.fromTo(kid, makeFrom(kid), {
              ...to,
              duration: reduced ? 0 : 1,
              delay: delay + i * 0.09,
              ease: 'power3.out',
              clearProps: 'filter',
              scrollTrigger: { trigger: el, start: 'top 86%', once: true }
            })
          })
          return
        }

        gsap.fromTo(el, makeFrom(el), {
          ...to,
          duration: reduced ? 0 : 1,
          delay,
          ease: 'power3.out',
          clearProps: 'filter',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true }
        })
      })
    }, root.value)
  }

  onMounted(async () => {
    gsap = await getGsap()
    apply()
  })

  onUnmounted(() => {
    if (ctx) ctx.revert()
  })

  return { apply }
}
