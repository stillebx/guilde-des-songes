<script setup>
// Ambiance des pages secondaires : mêmes halos rouges + brume que le hero de
// l'accueil, en fondu vers le bas pour ne jamais couper net le contenu.
// À placer en premier enfant d'un conteneur `position: relative`.
import WelcomeFog from './WelcomeFog.vue'
</script>

<template>
  <div class="atmosphere" aria-hidden="true">
    <div class="atmosphere__halos" />
    <WelcomeFog subtle />
  </div>
</template>

<style scoped>
.atmosphere {
  position: absolute;
  inset: 0 0 auto;
  /* Couvre le haut de la page puis se dissout : le contenu reste lisible. */
  height: min(760px, 100%);
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  -webkit-mask-image: linear-gradient(to bottom, #000 45%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 45%, transparent 100%);
}

.atmosphere__halos {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(ellipse 45% 40% at 10% 8%, var(--accent-soft), transparent 70%),
    radial-gradient(ellipse 40% 35% at 90% 22%, var(--accent-soft), transparent 70%),
    radial-gradient(ellipse 50% 40% at 45% 75%, var(--accent-soft), transparent 70%);
  opacity: 0.85;
}
</style>
