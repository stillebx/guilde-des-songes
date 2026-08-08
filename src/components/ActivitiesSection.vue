<script setup>
import IconGlyph from './IconGlyph.vue'

const activities = [
  {
    icon: 'map',
    title: 'Campagnes',
    text: 'Des histoires au long cours, séance après séance, où vos personnages grandissent et laissent leur marque sur le monde.',
  },
  {
    icon: 'moon',
    title: 'Parties solo',
    text: 'Un·e joueur·se, un·e MJ : une aventure sur mesure, idéale pour découvrir un univers ou vivre un récit intimiste.',
  },
  {
    icon: 'swords',
    title: 'Soirées one-shot',
    text: 'Une histoire complète en une soirée. Parfait pour essayer un nouveau jeu, une nouvelle table — ou le jeu de rôle tout court.',
  },
]
</script>

<template>
  <section id="activites" class="section section--alt">
    <div class="container">
      <p class="section__kicker">Nos parties</p>
      <h2 class="section__title">Trois façons de rêver</h2>
      <div class="activities">
        <article v-for="activity in activities" :key="activity.title" class="activity">
          <span class="activity__icon"><IconGlyph :name="activity.icon" /></span>
          <h3 class="activity__title">{{ activity.title }}</h3>
          <p class="activity__text">{{ activity.text }}</p>
        </article>
      </div>
      <p class="activities__note">
        Les prochaines parties sont annoncées sur notre
        <a href="https://discord.gg/F8aghJ2Mpv" target="_blank" rel="noopener">Discord</a> —
        et nos meneur·ses publient des résumés de leurs campagnes (L5R, Warhammer…)
        pour vous donner un avant-goût.
      </p>
    </div>
  </section>
</template>

<style scoped>
.section--alt {
  background: linear-gradient(180deg, transparent, var(--accent-soft) 20%, var(--accent-soft) 80%, transparent);
}

.activities {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.activity {
  background: var(--bg-panel);
  border-radius: var(--radius);
  padding: 1.75rem 1.5rem;
  text-align: center;
  box-shadow: var(--shadow-out);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.activity:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-out-lg);
}

.activity__icon {
  color: var(--accent);
  font-size: 1.7rem;
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  box-shadow: var(--shadow-in-sm);
  margin: 0 auto 1rem;
}

.activity__title {
  font-size: 1.2rem;
  margin-bottom: 0.6rem;
}

.activity__text {
  color: var(--text-muted);
  font-size: 1.05rem;
}

.activities__note {
  margin-top: 2rem;
  color: var(--text-muted);
  text-align: justify;
}
</style>
