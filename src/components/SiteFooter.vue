<script setup>
import IconGlyph from './IconGlyph.vue'
import { socials, openContact } from '../socials.js'
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__brand">
        <img class="footer__logo" src="/logo-guilde.png" alt="" />
        La Guilde des Songes
      </p>
      <!-- Groupe central : plan du site + mention, pour garder 3 blocs comme l'entête -->
      <div class="footer__center">
        <nav class="footer__links" aria-label="Plan du site">
          <RouterLink :to="{ name: 'agenda' }">Agenda</RouterLink>
          <RouterLink :to="{ name: 'gazette' }">Gazette</RouterLink>
          <RouterLink :to="{ name: 'partners' }">Partenaires</RouterLink>
        </nav>
        <p class="footer__meta">Association de jeu de rôle à Dijon</p>
      </div>
      <div class="footer__socials">
        <component
          :is="social.mail ? 'button' : 'a'"
          v-for="social in socials"
          :key="social.icon"
          class="social-btn"
          :href="social.mail ? undefined : social.href"
          :aria-label="social.label"
          :title="social.label"
          :target="social.href?.startsWith('http') ? '_blank' : undefined"
          :rel="social.href?.startsWith('http') ? 'noopener' : undefined"
          @click="social.mail ? openContact() : null"
        >
          <IconGlyph :name="social.icon" />
        </component>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg);
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

/* Le tracé du logo est rouge sombre : on l'éclaircit sur fond sombre. */
:root[data-theme='dark'] .footer__logo {
  filter: brightness(1.75) saturate(1.1);
}

.footer__center {
  display: grid;
  justify-items: center;
  gap: 0.3rem;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
}

.footer__links a {
  color: var(--text-muted);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer__links a:hover {
  color: var(--accent);
}

.footer__meta {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.98rem;
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
