<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import PageHeading from '../components/PageHeading.vue'
import AgendaCalendar from '../components/AgendaCalendar.vue'
import SignupForm from '../components/SignupForm.vue'
import { events as localEvents, KIND_LABELS } from '../data/events.js'
import { fetchAgenda, placesRestantes } from '../data/sheet.js'

// Six vignettes par page (3 colonnes × 2 lignes) : la page reste courte quel
// que soit le nombre de parties annoncées.
const PAGE_SIZE = 6

const today = new Date().toISOString().slice(0, 10)

// L'agenda vient de la feuille Google quand elle est configurée et joignable ;
// sinon on garde les parties écrites dans events.js — jamais de page vide.
const events = ref(localEvents)

async function chargerAgenda() {
  const depuisFeuille = await fetchAgenda()
  if (depuisFeuille) events.value = depuisFeuille
}

onMounted(chargerAgenda)

const sorted = computed(() => [...events.value].sort((a, b) => a.date.localeCompare(b.date)))

// Les parties passées quittent la liste mais restent consultables dans le
// calendrier : leur pastille y demeure, en retrait.
const upcoming = computed(() => sorted.value.filter((event) => event.date >= today))

function eventKey(event) {
  return event.date + event.title
}

// Le type vient de la feuille et pilote couleur et libellé ; la présence d'un
// formulaire d'inscription, elle, ne dépend que du nombre de places.
function kindOf(event) {
  return event.kind || 'one-shot'
}

function kindLabel(event) {
  return KIND_LABELS[kindOf(event)] || kindOf(event)
}

// Places affichées : décompte réel venu de la feuille, sinon le texte de events.js.
function placesLabel(event) {
  const restantes = placesRestantes(event)
  if (restantes === null) return event.seats || ''
  if (restantes === 0) return 'Complet'
  return `${restantes} place${restantes > 1 ? 's' : ''} restante${restantes > 1 ? 's' : ''}`
}

function estComplet(event) {
  return placesRestantes(event) === 0
}

// Les cellules laissées vides dans la feuille ne doivent laisser aucune trace :
// on assemble les lignes d'information à partir des seuls champs remplis.
function joindre(...parties) {
  return parties.filter((p) => p && String(p).trim()).join(' · ')
}

function kindColor(event) {
  return `var(--kind-${kindOf(event)})`
}

const marks = computed(() =>
  sorted.value.map((event) => ({
    date: event.date,
    color: kindColor(event),
    past: event.date < today,
  })),
)

// Légende limitée aux types réellement présents dans l'agenda.
const legend = computed(() => {
  const seen = new Map()
  for (const event of sorted.value) {
    const key = kindOf(event)
    if (!seen.has(key)) seen.set(key, { label: kindLabel(event), color: kindColor(event) })
  }
  return [...seen.values()]
})

// Partie dont les détails sont ouverts (clé = date + titre), null = aucune.
const openKey = ref(null)

const openEvent = computed(() => sorted.value.find((event) => eventKey(event) === openKey.value))

const page = ref(0)

const pageCount = computed(() => Math.max(1, Math.ceil(upcoming.value.length / PAGE_SIZE)))

const paged = computed(() =>
  upcoming.value.slice(page.value * PAGE_SIZE, page.value * PAGE_SIZE + PAGE_SIZE),
)

// Une suppression de partie ne doit pas laisser la pagination dans le vide.
watch(pageCount, (count) => {
  if (page.value > count - 1) page.value = count - 1
})

function toggleEvent(event) {
  openKey.value = openKey.value === eventKey(event) ? null : eventKey(event)
}

// Clic sur une pastille du calendrier : on ouvre la partie de ce jour et, si
// elle est à venir, on amène la page de vignettes correspondante.
function selectDate(iso) {
  if (!iso) {
    openKey.value = null
    return
  }
  const event = sorted.value.find((item) => item.date === iso)
  if (!event) return
  openKey.value = eventKey(event)

  const index = upcoming.value.findIndex((item) => eventKey(item) === openKey.value)
  if (index !== -1) page.value = Math.floor(index / PAGE_SIZE)
}

const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const shortDateFormat = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return dateFormat.format(new Date(y, m - 1, d))
}

function formatShortDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return shortDateFormat.format(new Date(y, m - 1, d))
}
</script>

<template>
  <section class="section">
    <div class="container">
      <PageHeading
        kicker="Agenda"
        title="L'agenda des parties et des événements"
        lead="Les salons Discord permettent aux maîtres du jeu d'annoncer leurs parties. Les joueuses et joueurs peuvent s'y inscrire."
      />

      <AgendaCalendar
        :marks="marks"
        :selected="openEvent ? openEvent.date : null"
        :focus="upcoming.length ? upcoming[0].date : ''"
        @select="selectDate"
      />

      <ul class="legend">
        <li v-for="item in legend" :key="item.label" class="legend__item">
          <span class="legend__dot" :style="{ background: item.color }" aria-hidden="true" />
          {{ item.label }}
        </li>
      </ul>

      <!-- Détails de la partie choisie, dans le calendrier ou dans les vignettes. -->
      <article v-if="openEvent" class="detail" :style="{ '--kind-color': kindColor(openEvent) }">
        <div class="detail__head">
          <p class="detail__kind">{{ kindLabel(openEvent) }}</p>
          <h2 class="detail__title">{{ openEvent.title }}</h2>
          <p class="detail__when">
            {{ joindre(formatDate(openEvent.date), openEvent.time, openEvent.place) }}
          </p>
          <p v-if="joindre(openEvent.game, openEvent.gm)" class="detail__meta">
            {{ joindre(openEvent.game, openEvent.gm) }}
          </p>
        </div>

        <p v-if="openEvent.text" class="detail__text">{{ openEvent.text }}</p>

        <p v-if="openEvent.date < today" class="detail__past">Cette partie a déjà eu lieu.</p>

        <template v-else>
          <p v-if="placesLabel(openEvent)" class="detail__seats" :class="{ 'detail__seats--complet': estComplet(openEvent) }">
            {{ placesLabel(openEvent) }}
          </p>

          <p v-if="estComplet(openEvent)" class="detail__closed">
            Cette soirée affiche complet. Écrivez-nous sur le Discord pour la liste d'attente.
          </p>

          <!-- Soirée mensuelle ouverte à tous : inscription directe par formulaire. -->
          <SignupForm
            v-else-if="openEvent.form"
            :title="openEvent.title"
            :date="openEvent.date"
            :time="openEvent.time"
            @inscrit="chargerAgenda"
          />
          <!-- Partie classique : le MJ gère les inscriptions dans son salon. -->
          <a
            v-else-if="openEvent.signup"
            class="btn btn--primary detail__btn"
            :href="openEvent.signup"
            target="_blank"
            rel="noopener"
          >
            S'inscrire sur le Discord
          </a>
          <!-- Sans lien d'inscription : on ne le dit que si la mention a du sens.
               Un événement hors partie n'a pas de « table » à fermer. -->
          <p v-else-if="openEvent.kind === 'campagne'" class="detail__closed">
            Table fermée&nbsp;: la campagne suit son cours.
          </p>
        </template>
      </article>

      <!-- Vignettes minimalistes : le détail s'ouvre au clic. -->
      <div v-if="upcoming.length" class="upcoming">
        <div class="upcoming__head">
          <h2 class="upcoming__title">Prochaines parties</h2>
          <div v-if="pageCount > 1" class="upcoming__nav">
            <button
              class="upcoming__arrow"
              aria-label="Parties précédentes"
              :disabled="page === 0"
              @click="page--"
            >
              ‹
            </button>
            <span class="upcoming__count">{{ page + 1 }} / {{ pageCount }}</span>
            <button
              class="upcoming__arrow"
              aria-label="Parties suivantes"
              :disabled="page >= pageCount - 1"
              @click="page++"
            >
              ›
            </button>
          </div>
        </div>

        <ul class="cards">
          <li v-for="event in paged" :key="eventKey(event)">
            <button
              class="card"
              :class="{ 'card--open': openKey === eventKey(event) }"
              :style="{ '--kind-color': kindColor(event) }"
              :aria-expanded="openKey === eventKey(event)"
              @click="toggleEvent(event)"
            >
              <span class="card__kind">{{ kindLabel(event) }}</span>
              <span class="card__date">{{ formatShortDate(event.date) }}</span>
              <span v-if="event.title" class="card__title">{{ event.title }}</span>
            </button>
          </li>
        </ul>
      </div>

      <p v-else class="agenda__empty">
        Aucune partie n'est annoncée pour le moment. Les prochaines tables sont publiées
        ici dès qu'elles sont ouvertes.
      </p>
    </div>
  </section>
</template>

<style scoped>
/* Légende du code couleur, sous le calendrier */
.legend {
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.legend__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 1rem;
}

.legend__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* Panneau de détails : liseré à la couleur du type de partie */
.detail {
  margin-top: 1.75rem;
  padding: 1.5rem 1.75rem;
  border-left: 5px solid var(--kind-color);
  border-radius: var(--radius);
  background: var(--bg-panel);
  box-shadow: var(--shadow-out);
}

.detail__kind {
  color: var(--kind-color);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
}

.detail__title {
  font-size: 1.5rem;
  margin-bottom: 0.4rem;
}

.detail__when {
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 0.2rem;
}

.detail__meta {
  color: var(--text-muted);
  margin-bottom: 0.8rem;
}

.detail__text {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.detail__seats--complet {
  color: var(--text-muted);
}

.detail__seats {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  box-shadow: var(--shadow-in-sm);
  color: var(--accent);
  font-weight: 700;
  font-size: 0.95rem;
}

.detail__past,
.detail__closed {
  color: var(--text-muted);
  font-style: italic;
}

.detail__btn {
  font-size: 1rem;
}

/* Liste paginée */
.upcoming {
  margin-top: 2.5rem;
}

.upcoming__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.upcoming__title {
  font-size: 1.5rem;
}

.upcoming__nav {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.upcoming__arrow {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: var(--bg);
  color: var(--accent);
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: var(--shadow-out-sm);
  transition: box-shadow 0.2s ease;
}

.upcoming__arrow:hover:not(:disabled) {
  box-shadow: var(--shadow-out-sm), var(--glow);
}

.upcoming__arrow:active:not(:disabled) {
  box-shadow: var(--shadow-in-sm);
}

.upcoming__arrow:disabled {
  opacity: 0.4;
  cursor: default;
}

.upcoming__count {
  color: var(--text-muted);
  font-size: 1rem;
  white-space: nowrap;
}

/* Trois colonnes de deux vignettes, sans défilement interne */
.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

/* Vignette minimaliste : type, date, titre — le reste au clic. */
.card {
  width: 100%;
  height: 100%;
  display: grid;
  gap: 0.3rem;
  padding: 1.1rem 1.25rem;
  border: none;
  border-left: 5px solid var(--kind-color);
  border-radius: var(--radius);
  background: var(--bg-panel);
  color: var(--text);
  font-family: var(--font-body);
  text-align: left;
  cursor: pointer;
  box-shadow: var(--shadow-out);
  transition: box-shadow 0.25s ease;
}

.card:hover {
  box-shadow: var(--shadow-out), var(--glow);
}

.card--open {
  box-shadow: var(--shadow-in-sm);
}

.card__kind {
  color: var(--kind-color);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.card__date {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: capitalize;
}

.card__title {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.35;
}

.agenda__empty {
  margin-top: 2rem;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .cards {
    grid-template-columns: minmax(0, 1fr);
  }

  .detail {
    padding: 1.25rem;
  }
}
</style>
