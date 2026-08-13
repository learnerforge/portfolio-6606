import { onMounted, onUnmounted } from 'vue'

/**
 * useReveal — per-container scroll-reveal engine built on GSAP + ScrollTrigger.
 *
 * Usage:
 *   const root = ref(null)
 *   useReveal(root)
 *
 * Any element inside root with [data-reveal] fades/slides in when scrolled
 * into view. Optional data-dir="up|down|left|right|scale" and data-delay="0.2".
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

  const apply = () => {
    if (!gsap || !root.value) return
    if (ctx) ctx.revert()
    ctx = gsap.context(() => {
      const els = gsap.utils.toArray('[data-reveal]', root.value)
      els.forEach((el) => {
        if (animated.has(el)) return
        animated.add(el)
        const dir = el.dataset.dir || 'up'
        const dist = 46
        const from = {
          opacity: 0,
          y: dir === 'up' ? dist : dir === 'down' ? -dist : 0,
          x: dir === 'left' ? dist : dir === 'right' ? -dist : 0,
          scale: dir === 'scale' ? 0.92 : 1
        }
        const delay = parseFloat(el.dataset.delay || 0)
        gsap.fromTo(el, from, {
          opacity: 1, y: 0, x: 0, scale: 1,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
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
