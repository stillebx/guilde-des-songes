<template>
  <section class="hero">
    <div class="container hero__content">
      <p class="hero__place">Association de jeu de rôle · Dijon</p>
      <h1 class="hero__title">Ta partie commence&nbsp;ici&nbsp;!</h1>
      <p class="hero__lead">
        Débutant·e ou vétéran des dés, pour une campagne au long cours, une
        soirée one-shot ou une partie de jeu de plateau&nbsp;: la Guilde des
        Songes vous accueille autour de ses tables.
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
/* Aucun fond ni halo propres : la brume du site (couche fixe, App.vue) passe
   derrière sans interruption — le hero se fond dans la suite de la page. */
.hero {
  padding: 5.5rem 0 5rem;
  text-align: center;
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
