import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router.js'
import { prechargerAgenda } from './data/sheet.js'

// La feuille Google est demandée dès l'ouverture du site, quelle que soit la
// page d'arrivée : la requête part en parallèle du rendu plutôt qu'au moment où
// l'on ouvre l'agenda, où elle se voyait en écran d'attente.
prechargerAgenda()

createApp(App).use(router).mount('#app')
