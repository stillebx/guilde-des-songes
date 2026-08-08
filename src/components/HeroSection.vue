<script setup>
import WelcomeFog from './WelcomeFog.vue'
</script>

<template>
  <section class="hero">
    <div class="hero__stars" aria-hidden="true"></div>
    <WelcomeFog subtle />
    <div class="container hero__content">
      <p class="hero__place">Association de jeu de rôle · Dijon</p>
      <h1 class="hero__title">Ta partie commence&nbsp;ici&nbsp;!</h1>
      <p class="hero__lead">
        Débutant·e ou vétéran des dés, pour une partie solo, un one-shot d'un soir
        ou une campagne au long cours&nbsp;: la Guilde des Songes vous accueille
        autour de la table.
      </p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="https://discord.gg/F8aghJ2Mpv" target="_blank" rel="noopener">
          Rejoindre le Discord
        </a>
        <a class="btn btn--ghost" href="#qui-sommes-nous">Découvrir la Guilde</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 5.5rem 0 5rem;
  background: var(--bg);
  text-align: center;
}

/* Halos rouges très doux en pur CSS, léger et sans image */
.hero__stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(ellipse 40% 35% at 12% 20%, var(--accent-soft), transparent 70%),
    radial-gradient(ellipse 35% 30% at 88% 30%, var(--accent-soft), transparent 70%),
    radial-gradient(ellipse 45% 35% at 50% 95%, var(--accent-soft), transparent 70%);
  opacity: 0.8;
}

.hero__content {
  position: relative;
}

.hero__place {
  color: var(--accent);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.hero__title {
  font-size: clamp(2.2rem, 6vw, 3.8rem);
  margin-bottom: 1.25rem;
}

/* Texte centré : il occupe toute la largeur du conteneur, sans coupure précoce */
.hero__lead {
  margin: 0 0 2.25rem;
  color: var(--text-muted);
  font-size: 1.15rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
