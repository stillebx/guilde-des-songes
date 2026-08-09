<script setup>
import { onMounted, ref } from 'vue'
import WelcomeFog from './components/WelcomeFog.vue'
import PageAtmosphere from './components/PageAtmosphere.vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'

// Voile d'arrivée : la brume couvre le site au premier paint puis se dissipe
// lentement pour révéler la page (même grammaire immersive que l'Atelier MJ).
// Les waits JS doivent rester ≥ à la durée CSS de .fog-veil (1.2s) sous peine
// de retirer le voile avant la fin de sa dissipation.
const veilActive = ref(true)
const veilOpaque = ref(true)
onMounted(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    veilActive.value = false
    return
  }
  // Laisse le premier paint + le shader s'installer derrière le voile,
  // puis dissipe (900ms d'immersion, 1.3s ≥ transition CSS 1.2s).
  setTimeout(() => { veilOpaque.value = false }, 900)
  setTimeout(() => { veilActive.value = false }, 2200)
})
</script>

<template>
  <!-- Ambiance permanente : halos + brume derrière toutes les pages. -->
  <PageAtmosphere />

  <SiteHeader />
  <main>
    <RouterView />
  </main>
  <SiteFooter />

  <!-- Voile de brume d'arrivée : opaque au chargement (fond du site, jamais
       de flash), la brume dérive dessus, puis tout se dissipe lentement. -->
  <div v-if="veilActive" class="fog-veil" :class="{ 'fog-veil--on': veilOpaque }" aria-hidden="true">
    <WelcomeFog />
  </div>
</template>

<style>
/* Non scoped : doit cibler .welcome-fog rendu par le composant enfant. */
.fog-veil {
  position: fixed;
  inset: 0;
  z-index: 300;
  /* Fond teinté aux couleurs du site, même grammaire que l'atelier MJ :
     halo d'accent en haut à droite + dégradé bg → bg-panel-soft. */
  background:
    radial-gradient(circle at 80% 18%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 55%),
    linear-gradient(165deg, var(--bg) 0%, var(--bg-panel-soft) 100%);
  opacity: 0;
  transition: opacity 1.2s ease;
  pointer-events: none;
  overflow: hidden;
}

.fog-veil--on {
  opacity: 1;
}

/* Mist plus marqué pendant le voile que la version d'ambiance du hero. */
.fog-veil .welcome-fog {
  opacity: 0.7 !important;
}
</style>
