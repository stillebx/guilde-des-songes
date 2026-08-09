import { typo } from '../typographie.js'

// Lien avec la feuille Google qui pilote l'agenda et reçoit les inscriptions.
//
// Coller ici l'URL du déploiement Apps Script (elle finit par /exec) — la marche
// à suivre complète est dans docs/agenda-google-sheet.gs. Tant que cette
// constante est vide, le site fonctionne sur les parties écrites en dur dans
// src/data/events.js : rien ne casse, mais les places ne se décomptent pas.
export const SHEET_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwlwLChRf3RMtjSH23hC22chzlmPUiXu17E4J5iAK8vvTACFUQQqsvrc1dC5g54DEheBA/exec'

// Les requêtes partent en `text/plain` : c'est une requête « simple », donc sans
// pré-vol CORS — Apps Script ne répond pas aux requêtes OPTIONS.
const ENTETES_SIMPLES = { 'Content-Type': 'text/plain;charset=utf-8' }

/**
 * Agenda publié dans la feuille.
 * Renvoie `null` si la feuille n'est pas configurée ou ne répond pas : l'appelant
 * garde alors les parties locales plutôt que d'afficher un agenda vide.
 */
export async function fetchAgenda() {
  if (!SHEET_ENDPOINT) return null

  try {
    const response = await fetch(SHEET_ENDPOINT, { method: 'GET' })
    const resultat = await response.json()
    if (!resultat.ok || !Array.isArray(resultat.evenements)) return null
    return resultat.evenements.map(versEvenement)
  } catch {
    return null
  }
}

/** Enregistre une inscription. Renvoie { ok, rang, restantes, complet }. */
export async function postInscription({ soiree, dateSoiree, horaire, pseudo }) {
  const corps = JSON.stringify({ soiree, dateSoiree, horaire, pseudo })

  try {
    const response = await fetch(SHEET_ENDPOINT, {
      method: 'POST',
      headers: ENTETES_SIMPLES,
      body: corps,
    })
    return await response.json()
  } catch {
    // Selon le déploiement, le navigateur peut bloquer la lecture de la réponse
    // alors que l'écriture a bien eu lieu. On renvoie donc en « aveugle » plutôt
    // que d'annoncer un échec à tort — sans prétendre connaître le rang.
    try {
      await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: ENTETES_SIMPLES,
        body: corps,
      })
      return { ok: true, aveugle: true }
    } catch {
      return { ok: false }
    }
  }
}

// La feuille corrige déjà la saisie (liste déroulante, `onEdit`), mais le site
// reste tolérant : une ligne collée en masse ou saisie avant l'installation du
// script s'affiche quand même correctement.
const TYPES = ['campagne', 'one-shot', 'solo', 'mensuelle', 'evenement']

function sansAccent(texte) {
  return String(texte || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** « One Shot », « oneshot », « OS », « Soirée mensuelle »… → un type connu. */
function normaliserType(valeur) {
  const t = sansAccent(valeur).replace(/[\s_]+/g, '-')
  if (t.startsWith('mensuel') || t.includes('mensuelle')) return 'mensuelle'
  if (t.startsWith('campagne')) return 'campagne'
  if (t.startsWith('solo')) return 'solo'
  if (t.startsWith('evenement') || t.startsWith('event')) return 'evenement'
  if (['one-shot', 'oneshot', 'os'].includes(t)) return 'one-shot'
  return TYPES.includes(t) ? t : 'one-shot'
}

/** Dates en 10/10/2026 → 2026-10-10, seul format que le site sait trier. */
function normaliserDate(valeur) {
  const texte = String(valeur || '').trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(texte)) return texte

  const m = texte.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/)
  if (!m) return texte

  const annee = m[3].length === 2 ? `20${m[3]}` : m[3]
  return `${annee}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
}

// Une ligne de la feuille → la forme attendue par l'agenda du site.
function versEvenement(ligne) {
  const places = Number(ligne.places) || 0

  return {
    date: normaliserDate(ligne.date),
    time: typo(ligne.horaire),
    kind: normaliserType(ligne.type),
    title: typo(ligne.titre),
    game: typo(ligne.jeu),
    place: typo(ligne.lieu),
    gm: typo(ligne.mj),
    text: typo(ligne.description),
    places: places,
    inscrits: Number(ligne.inscrits) || 0,
    // C'est le nombre de places qui ouvre les inscriptions en ligne, quel que
    // soit le type : une partie, une soirée mensuelle ou un événement hors
    // partie peuvent tous en proposer. Sans places : ni formulaire ni compteur.
    form: places > 0,
    signup: ligne.lien || undefined,
  }
}

/** Places restantes, ou `null` quand la partie n'en déclare pas. */
export function placesRestantes(event) {
  if (!event || !event.places) return null
  return Math.max(0, event.places - (event.inscrits || 0))
}
