import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import PartnersPage from './pages/PartnersPage.vue'
import AgendaPage from './pages/AgendaPage.vue'
import GazettePage from './pages/GazettePage.vue'
import GazetteIssuePage from './pages/GazetteIssuePage.vue'
import ResourcesPage from './pages/ResourcesPage.vue'

// URL propres (/agenda) plutôt que /#/agenda. Le serveur doit renvoyer
// index.html pour toute route inconnue : c'est le rôle de `public/.htaccess`
// (Apache, OVH) et de `public/404.html` (GitHub Pages). En dev, Vite le fait.
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/partenaires', name: 'partners', component: PartnersPage },
    { path: '/agenda', name: 'agenda', component: AgendaPage },
    { path: '/gazette', name: 'gazette', component: GazettePage },
    { path: '/gazette/:slug', name: 'gazette-issue', component: GazetteIssuePage },
    { path: '/ressources', name: 'resources', component: ResourcesPage },
    // URL inconnue : retour à l'accueil plutôt qu'une page blanche.
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Décalage de l'entête collante : on arrive sur le titre de la section,
    // jamais au milieu de ses vignettes (les sections commencent par leur titre).
    if (to.hash) {
      const band = getComputedStyle(document.documentElement).getPropertyValue('--band-height')
      return { el: to.hash, top: (parseInt(band, 10) || 92) + 16, behavior: 'smooth' }
    }
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})
