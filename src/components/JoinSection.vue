<script setup>
import IconGlyph from './IconGlyph.vue'

const channels = [
  {
    icon: 'discord',
    name: 'Discord',
    detail: 'Le cœur de la vie de la Guilde : annonces de parties, discussions, entraide.',
    href: 'https://discord.gg/F8aghJ2Mpv',
  },
  {
    icon: 'instagram',
    name: 'Instagram',
    detail: 'Les coulisses de nos tables en images.',
    href: 'https://www.instagram.com/songesjdr/',
  },
  {
    icon: 'facebook',
    name: 'Facebook',
    detail: 'Les actualités et événements de l\'association.',
    href: 'https://www.facebook.com/laguildedessonges',
  },
]
</script>

<template>
  <section id="rejoindre" class="section join">
    <div class="container">
      <p class="section__kicker">Nous rejoindre</p>
      <h2 class="section__title">Prêt·e à lancer les dés&nbsp;?</h2>
      <p class="join__lead">
        Le plus simple&nbsp;: rejoignez notre Discord et présentez-vous, ou passez
        nous voir lors d'un créneau. Aucune expérience requise — juste l'envie de
        jouer.
      </p>
      <div class="join__channels">
        <a
          v-for="channel in channels"
          :key="channel.name"
          class="join__channel"
          :href="channel.href"
          target="_blank"
          rel="noopener"
        >
          <span class="join__icon"><IconGlyph :name="channel.icon" /></span>
          <span class="join__name">{{ channel.name }}</span>
          <span class="join__detail">{{ channel.detail }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.join {
  background:
    radial-gradient(ellipse 70% 80% at 50% 110%, var(--accent-soft), transparent 70%),
    transparent;
}

/* Pleine largeur, justifié : pas de coupure précoce des phrases */
.join__lead {
  color: var(--text-muted);
  margin-bottom: 2rem;
  text-align: justify;
}

.join__channels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: 1.5rem;
}

.join__channel {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 0.35rem;
  background: var(--bg-panel);
  border-radius: var(--radius);
  padding: 1.75rem 1.5rem;
  text-decoration: none;
  color: var(--text);
  box-shadow: var(--shadow-out);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.join__channel:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-out-lg);
}

.join__icon {
  color: var(--accent);
  font-size: 1.6rem;
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  box-shadow: var(--shadow-in-sm);
  margin-bottom: 0.6rem;
}

.join__name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
}

.join__detail {
  color: var(--text-muted);
  font-size: 1.05rem;
}
</style>
