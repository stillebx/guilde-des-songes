import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Chemins relatifs : le site fonctionne aussi bien sur l'URL GitHub Pages
  // (stillebx.github.io/guilde-des-songes/) que sur le domaine de la Guilde,
  // sans rien changer à la configuration.
  base: './',
  plugins: [vue()],
})
