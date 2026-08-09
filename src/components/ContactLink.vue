<script setup>
// Lien de contact protégé des robots collecteurs d'adresses.
//
// L'adresse n'apparaît nulle part en clair : ni dans le HTML livré, ni dans un
// href `mailto:`. Elle est reconstituée en JavaScript à partir de morceaux au
// moment du clic (ou du survol/focus, pour que le clic droit « copier le lien »
// fonctionne). Les robots, qui lisent le HTML sans exécuter le script, ne
// trouvent rien à récolter.
import { ref } from 'vue'
import { contactAddress, contactHref } from '../socials.js'

const props = defineProps({
  // Affiche l'adresse en toutes lettres (page partenaires) ou un libellé.
  label: { type: String, default: '' },
  subject: { type: String, default: '' },
})

const adresse = contactAddress

const href = ref('#')

// L'adresse n'est posée dans le href qu'au moment d'une intention réelle.
function armer() {
  href.value = contactHref(props.subject)
}

function ouvrir(event) {
  armer()
  // Au clavier comme à la souris, on laisse le navigateur suivre le href
  // fraîchement posé : on relance la navigation nous-mêmes.
  event.preventDefault()
  window.location.href = href.value
}
</script>

<template>
  <a
    :href="href"
    class="contact-link"
    @mouseenter="armer"
    @focus="armer"
    @click="ouvrir"
  >
    <!-- Le texte visible est lui aussi assemblé côté navigateur. -->
    {{ label || adresse() }}
  </a>
</template>

<style scoped>
.contact-link {
  color: var(--accent);
  overflow-wrap: anywhere;
}
</style>
