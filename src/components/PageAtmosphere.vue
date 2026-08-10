<script setup>
// Ambiance du site : brume, en couche fixe derrière tout le contenu. Posée une
// seule fois dans App.vue, elle accompagne donc toutes les pages sur toute leur
// hauteur, sans être étirée au défilement.
//
// Pas de halos en dégradé radial ici : sur des teintes aussi peu contrastées,
// ils produisaient des anneaux de bande bien visibles. La brume du shader,
// bruitée par nature, donne la même profondeur sans cet artefact.
import WelcomeFog from './WelcomeFog.vue'
</script>

<template>
  <div class="atmosphere" aria-hidden="true">
    <WelcomeFog subtle />
  </div>
</template>

<style scoped>
.atmosphere {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  /* Derrière le contenu, mais au-dessus du fond de page (posé sur <html>). */
  z-index: -1;
}

/* Brume d'ambiance permanente : plus discrète que le voile d'arrivée, mais
   franchement perceptible — à 0.12 elle passait inaperçue. */
.atmosphere :deep(.welcome-fog) {
  opacity: 0.26;
}

/* En mobile, l'écran ne montre qu'une poignée de volutes : à la même densité
   elles se rejoignent en un voile uniforme, où l'on ne distingue plus le
   mouvement. Plus légère, la brume redevient lisible comme brume. */
@media (max-width: 760px) {
  .atmosphere :deep(.welcome-fog) {
    opacity: 0.15;
  }
}
</style>
