<script setup>
// Sélecteur de thème : clair / sombre / système. Un clic passe au suivant ;
// l'icône et l'infobulle indiquent le mode courant.
import { computed } from 'vue'
import IconGlyph from './IconGlyph.vue'
import { themeChoice, setTheme } from '../theme.js'

const MODES = [
  { value: 'light', icon: 'sun', label: 'Thème clair' },
  { value: 'dark', icon: 'moon', label: 'Thème sombre' },
  { value: 'system', icon: 'screen', label: 'Thème du système' },
]

const courant = computed(() => MODES.find((m) => m.value === themeChoice.value) || MODES[2])

function suivant() {
  const index = MODES.findIndex((m) => m.value === themeChoice.value)
  setTheme(MODES[(index + 1) % MODES.length].value)
}
</script>

<template>
  <button
    class="social-btn"
    :aria-label="`${courant.label} — cliquer pour changer`"
    :title="courant.label"
    @click="suivant"
  >
    <IconGlyph :name="courant.icon" />
  </button>
</template>
