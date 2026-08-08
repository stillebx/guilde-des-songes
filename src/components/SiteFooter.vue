<script setup>
import IconGlyph from './IconGlyph.vue'
import { socials } from '../socials.js'
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__brand">
        <img class="footer__logo" src="/logo-guilde.png" alt="" />
        La Guilde des Songes
      </p>
      <p class="footer__meta">Association de jeu de rôle à Dijon</p>
      <div class="footer__socials">
        <a
          v-for="social in socials"
          :key="social.icon"
          class="social-btn"
          :href="social.href"
          :aria-label="social.label"
          :title="social.label"
          :target="social.href.startsWith('http') ? '_blank' : undefined"
          :rel="social.href.startsWith('http') ? 'noopener' : undefined"
        >
          <IconGlyph :name="social.icon" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  box-shadow: 0 -6px 18px var(--shadow-dark);
}

/* Même disposition et même hauteur que l'entête : groupes répartis sur toute la bande */
.footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--band-gap);
  min-height: var(--band-height);
}

.footer__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
  white-space: nowrap;
}

.footer__logo {
  height: 60px;
  width: auto;
}

.footer__meta {
  text-align: center;
  color: var(--text-muted);
  font-size: 1.05rem;
}

.footer__socials {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

@media (max-width: 760px) {
  .footer__inner {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem 0;
  }
}
</style>
