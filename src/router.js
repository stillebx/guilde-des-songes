import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import PartnersPage from './pages/PartnersPage.vue'
import AgendaPage from './pages/AgendaPage.vue'
import GazettePage from './pages/GazettePage.vue'
import GazetteIssuePage from './pages/GazetteIssuePage.vue'

// Historique en hash (#/agenda) : le site reste un pur statique déployable sur
// n'importe quel hébergeur, sans règle de réécriture serveur à configurer.
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/partenaires', name: 'partners', component: PartnersPage },
    { path: '/agenda', name: 'agenda', component: AgendaPage },
    { path: '/gazette', name: 'gazette', component: GazettePage },
    { path: '/gazette/:slug', name: 'gazette-issue', component: GazetteIssuePage },
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
