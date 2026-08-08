<script setup>
import IconGlyph from './IconGlyph.vue'
</script>

<template>
  <section id="qui-sommes-nous" class="section">
    <div class="container about">
      <div class="about__text">
        <p class="section__kicker">Qui sommes-nous</p>
        <h2 class="section__title">Une guilde ouverte à toutes les tables</h2>
        <p class="about__body">
          La Guilde des Songes est une association dijonnaise dédiée au jeu de
          rôle. Que vous soyez débutant·e ou expérimenté·e, meneur·se de jeu ou
          joueur·se, nous vous accueillons avec grand plaisir — pour une partie
          solo comme pour une campagne.
        </p>
        <p class="about__body">
          Envie d'en savoir plus&nbsp;? Passez nous voir lors d'un de nos
          créneaux ou écrivez-nous sur Discord&nbsp;: on répondra à toutes vos
          questions, et on vous trouvera une place autour de la table.
        </p>
      </div>
      <ul class="about__values">
        <li class="about__value">
          <span class="about__value-icon"><IconGlyph name="dice" /></span>
          <strong>Tous niveaux</strong>
          <span>Les débutant·es sont guidé·es pour découvrir le jeu de rôle.</span>
        </li>
        <li class="about__value">
          <span class="about__value-icon"><IconGlyph name="candle" /></span>
          <strong>Ambiance conviviale</strong>
          <span>On joue pour rêver ensemble, jamais pour se prendre au sérieux.</span>
        </li>
        <li class="about__value">
          <span class="about__value-icon"><IconGlyph name="book" /></span>
          <strong>Univers variés</strong>
          <span>L5R, Warhammer et bien d'autres mondes à explorer.</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 3rem;
  align-items: start;
}

/* Texte au fil : justifié pour occuper toute la largeur de sa colonne */
.about__body {
  color: var(--text-muted);
  margin-bottom: 1rem;
  text-align: justify;
}

.about__values {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.about__value {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 0.35rem;
  background: var(--bg-panel);
  border-radius: var(--radius);
  padding: 1.25rem;
  box-shadow: var(--shadow-out);
}

.about__value-icon {
  color: var(--accent);
  font-size: 1.5rem;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  box-shadow: var(--shadow-in-sm);
  margin-bottom: 0.4rem;
}

.about__value strong {
  font-size: 1.02rem;
}

.about__value span:last-child {
  color: var(--text-muted);
  font-size: 1.05rem;
}

@media (max-width: 820px) {
  .about {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
