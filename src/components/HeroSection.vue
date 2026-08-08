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
        Débutant·e ou vétéran des dés, pour une partie solo, une soirée one-shot
        ou une campagne au long cours&nbsp;: la Guilde des Songes vous accueille
        autour de ses tables.
      </p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="https://discord.gg/F8aghJ2Mpv" target="_blank" rel="noopener">
          Rejoindre le Discord
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 5.5rem 0 5rem;
  background: var(--bg);
  text-align: center;
}

/* Halos rouges très doux en pur CSS, léger et sans image.
   Ils débordent sous le hero et s'évanouissent en fondu : pas de bord net. */
.hero__stars {
  position: absolute;
  inset: 0 0 -240px;
  background-image:
    radial-gradient(ellipse 40% 35% at 12% 20%, var(--accent-soft), transparent 70%),
    radial-gradient(ellipse 35% 30% at 88% 30%, var(--accent-soft), transparent 70%),
    radial-gradient(ellipse 45% 35% at 50% 95%, var(--accent-soft), transparent 70%);
  opacity: 0.8;
  -webkit-mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
  pointer-events: none;
}

/* La brume déborde elle aussi sous le hero et se dissout en douceur dans la
   section suivante : c'est elle qui fait la transition, sans séparation nette. */
.hero :deep(.welcome-fog) {
  height: calc(100% + 240px);
  -webkit-mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
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
  font-size: var(--title-size);
  margin-bottom: 1.25rem;
}

/* Texte centré : il occupe toute la largeur du conteneur, sans coupure précoce.
   `text-wrap: balance` équilibre les lignes pour une lecture plus confortable. */
.hero__lead {
  margin: 0 0 2.25rem;
  color: var(--text-muted);
  font-size: var(--lead-size);
  line-height: 1.55;
  text-wrap: balance;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
