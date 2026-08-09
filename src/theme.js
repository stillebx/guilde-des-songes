// Thème du site : clair, sombre ou « système » (suit le réglage de l'appareil).
// Le choix est mémorisé dans le navigateur ; l'application initiale se fait dans
// index.html, avant le premier rendu, pour éviter tout flash au chargement.
import { ref, watch } from 'vue'

const CLE = 'theme'
const MODES = ['light', 'dark', 'system']

const media = window.matchMedia('(prefers-color-scheme: dark)')

function lireChoix() {
  const enregistre = localStorage.getItem(CLE)
  return MODES.includes(enregistre) ? enregistre : 'system'
}

export const themeChoice = ref(lireChoix())

// Thème réellement appliqué (« system » résolu selon l'appareil).
export const resolvedTheme = ref('light')

function appliquer() {
  const sombre =
    themeChoice.value === 'dark' || (themeChoice.value === 'system' && media.matches)
  resolvedTheme.value = sombre ? 'dark' : 'light'
  document.documentElement.dataset.theme = resolvedTheme.value
}

watch(themeChoice, (mode) => {
  localStorage.setItem(CLE, mode)
  appliquer()
})

// En mode « système », suivre les changements de réglage de l'appareil.
media.addEventListener('change', () => {
  if (themeChoice.value === 'system') appliquer()
})

appliquer()

export function setTheme(mode) {
  if (MODES.includes(mode)) themeChoice.value = mode
}
