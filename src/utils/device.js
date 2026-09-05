/**
 * device — cached capability profile, resolved once on first call.
 *
 * Cheap guards so the app can skip smoothing / parallax / blur work on
 * devices that struggle with it (low-RAM, touch, reduced-motion).
 */

let cached = null

export function getDevice() {
  if (cached) return cached
  const mq = (q) => window.matchMedia(q)
  cached = {
    reduced: mq('(prefers-reduced-motion: reduce)').matches,
    coarse: mq('(pointer: coarse)').matches,
    fine: mq('(pointer: fine)').matches,
    lowRam: (navigator.deviceMemory || 8) <= 4,
    touchRange: mq('(any-hover: none)').matches
  }
  return cached
}