<script setup>
import IconSet from '../IconSet.vue'

defineProps({
  profile: { type: Object, required: true },
  emailUrl: { type: String, required: true }
})
</script>

<template>
  <div class="contact-card">
    <div class="orb orb-cyan" style="width: 260px; height: 260px; top: -120px; left: -100px;"></div>
    <div class="orb orb-violet" style="width: 280px; height: 280px; bottom: -140px; right: -90px;"></div>

    <div class="contact-index" data-reveal data-delay="0"><IconSet name="send" :size="14" />Let's connect</div>
    <h2 class="contact-title font-display" data-reveal data-delay="0.08">
      Let's build<br>something <span class="text-gradient">intelligent</span>
    </h2>
    <p class="contact-sub" data-reveal data-delay="0.16">
      I'm open to AI/ML internships, research collaborations, and full-stack
      engineering roles. If you have an idea worth shipping — I want to hear it.
    </p>

    <div class="contact-actions" data-reveal data-dir="up" data-delay="0.24">
      <a :href="emailUrl" target="_blank" rel="noopener" class="btn btn-primary"><IconSet name="mail" :size="15" />bakkeraganesh@gmail.com</a>
      <a :href="profile.github" target="_blank" rel="noopener" class="btn btn-ghost"><IconSet name="github" :size="15" />GitHub</a>
      <a :href="profile.linkedin" target="_blank" rel="noopener" class="btn btn-ghost"><IconSet name="linkedin" :size="15" />LinkedIn</a>
    </div>

    <div class="contact-meta" data-reveal data-delay="0.32">
      <span><IconSet name="location" :size="14" />{{ profile.location }}</span>
      <span><IconSet name="bolt" :size="14" />Responds within 24h</span>
    </div>
  </div>
</template>

<style scoped>
.contact-card {
  position: relative;
  text-align: center;
  border: 1px solid var(--hairline);
  border-radius: var(--radius-2xl);
  padding: clamp(48px, 8vw, 96px) clamp(24px, 5vw, 72px);
  overflow: hidden;
  background: var(--surface-card);
  box-shadow: var(--shadow-md);
}
.contact-card .orb {
  opacity: 0.45;
  filter: blur(30px);
}
.contact-index {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: var(--fw-medium);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}
.contact-index svg { color: var(--accent); }
.contact-title {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: var(--fw-semibold);
  letter-spacing: -0.02em;
  margin: 18px 0 0;
  color: var(--text-primary);
}
.contact-sub {
  color: var(--text-secondary);
  max-width: 520px;
  margin: 22px auto 0;
  line-height: 1.75;
}
.contact-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: 38px;
}
@media (max-width: 480px) {
  .contact-actions .btn-primary { font-size: 13px; padding: 0 16px; }
  .contact-actions .btn-primary svg:first-child { display: none; }
}
.contact-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid var(--hairline);
  color: var(--text-tertiary);
  font-size: 12px;
}
.contact-meta span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>