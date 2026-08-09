<script setup>
import { nextTick } from 'vue'
import { useRouter } from 'vue-router'
import IconGlyph from '../components/IconGlyph.vue'
import PageHeading from '../components/PageHeading.vue'
import { issues } from '../data/gazette.js'
import { typo } from '../typographie.js'

const router = useRouter()

const dateFormat = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

function formatMonth(iso) {
  if (!iso) return ''
  const [y, m] = iso.split('-').map(Number)
  return dateFormat.format(new Date(y, (m || 1) - 1, 1))
}

// Sans PDF joint, on ouvre le numéro puis on lance l'impression du navigateur,
// qui sait enregistrer en PDF (les styles @media print n'emportent que l'article).
async function downloadIssue(issue) {
  await router.push({ name: 'gazette-issue', params: { slug: issue.slug } })
  await nextTick()
  window.print()
}
</script>

<template>
  <section class="section">
    <div class="container">
      <PageHeading
        kicker="La gazette"
        title="Bienvenue sur La Gazette rôlistique !"
        lead="C'est ici que la Guilde raconte ses parties, expose la vie associative et annonce les futurs événements. Bonne lecture !"
      />

      <ul v-if="issues.length" class="issues">
        <li v-for="issue in issues" :key="issue.slug" class="issue">
          <p class="issue__date">{{ formatMonth(issue.date) }}</p>
          <h2 class="issue__title">{{ typo(issue.title) }}</h2>
          <p v-if="issue.excerpt" class="issue__excerpt">{{ typo(issue.excerpt) }}</p>

          <div class="issue__actions">
            <RouterLink
              class="btn btn--ghost issue__action"
              :to="{ name: 'gazette-issue', params: { slug: issue.slug } }"
            >
              Lire le numéro
            </RouterLink>

            <a
              v-if="issue.pdf"
              class="btn btn--primary issue__action"
              :href="issue.pdf"
              download
            >
              <IconGlyph name="download" />
              Télécharger
            </a>
            <button v-else class="btn btn--primary issue__action" @click="downloadIssue(issue)">
              <IconGlyph name="download" />
              Télécharger
            </button>
          </div>
        </li>
      </ul>

      <p v-else class="issues__empty">
        Le premier numéro est en préparation. Revenez bientôt&nbsp;!
      </p>
    </div>
  </section>
</template>

<style scoped>
.issues {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.5rem;
}

.issue {
  background: var(--bg-panel);
  border-radius: var(--radius);
  padding: 1.75rem;
  color: var(--text);
  box-shadow: var(--shadow-out);
  transition: box-shadow 0.3s ease;
}

.issue:hover {
  box-shadow: var(--shadow-out), var(--glow);
}

.issue__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.issue__action {
  font-size: 0.95rem;
  padding: 0.65rem 1.3rem;
}

.issue__date {
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.issue__title {
  font-size: 1.3rem;
  margin-bottom: 0.6rem;
}

.issue__excerpt {
  color: var(--text-muted);
  text-align: justify;
}

.issues__empty {
  color: var(--text-muted);
}
</style>
