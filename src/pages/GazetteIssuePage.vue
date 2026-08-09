<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import IconGlyph from '../components/IconGlyph.vue'
import { findIssue } from '../data/gazette.js'

const route = useRoute()
const issue = computed(() => findIssue(route.params.slug))

const dateFormat = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

const publishedAt = computed(() => {
  const date = issue.value?.date
  if (!date) return ''
  const [y, m] = date.split('-').map(Number)
  return dateFormat.format(new Date(y, (m || 1) - 1, 1))
})

// Sans PDF joint au numéro, on passe par l'impression du navigateur, qui sait
// enregistrer en PDF — les styles @media print n'emportent que l'article.
function printIssue() {
  window.print()
}
</script>

<template>
  <section class="section">
    <div class="container">
      <RouterLink class="back" :to="{ name: 'gazette' }">← Tous les numéros</RouterLink>

      <template v-if="issue">
        <header class="issue-head">
          <p class="section__kicker">{{ publishedAt }}</p>
          <h1 class="issue-head__title">{{ issue.title }}</h1>

          <a
            v-if="issue.pdf"
            class="btn btn--primary issue-head__download"
            :href="issue.pdf"
            download
          >
            <IconGlyph name="download" />
            Télécharger le numéro
          </a>
          <button v-else class="btn btn--primary issue-head__download" @click="printIssue">
            <IconGlyph name="download" />
            Télécharger le numéro
          </button>
        </header>

        <!-- Contenu Markdown du numéro, converti au build (source : src/gazette/*.md) -->
        <article class="prose" v-html="issue.html" />
      </template>

      <p v-else class="missing">
        Ce numéro n'existe pas (ou plus).
        <RouterLink :to="{ name: 'gazette' }">Retour à la gazette</RouterLink>.
      </p>
    </div>
  </section>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.issue-head {
  margin-bottom: 2rem;
}

.issue-head__title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
}

.issue-head__download {
  margin-top: 1.5rem;
  font-size: 1rem;
}

/* Mise en forme du Markdown rendu : v-html échappe au scoping, d'où :deep. */
.prose {
  background: var(--bg-panel);
  border-radius: var(--radius);
  padding: 2rem 2.25rem;
  box-shadow: var(--shadow-out);
}

.prose :deep(h2) {
  font-size: 1.35rem;
  margin: 2rem 0 0.75rem;
}

.prose :deep(h3) {
  font-size: 1.15rem;
  margin: 1.5rem 0 0.6rem;
}

.prose :deep(h2:first-child),
.prose :deep(h3:first-child) {
  margin-top: 0;
}

.prose :deep(p) {
  color: var(--text-muted);
  text-align: justify;
  margin-bottom: 1rem;
}

.prose :deep(ul),
.prose :deep(ol) {
  color: var(--text-muted);
  margin: 0 0 1rem;
  padding-left: 1.4rem;
}

.prose :deep(li) {
  margin-bottom: 0.4rem;
}

.prose :deep(blockquote) {
  margin: 0 0 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow-in-sm);
  color: var(--text-muted);
  font-style: italic;
}

.prose :deep(img) {
  border-radius: var(--radius);
  box-shadow: var(--shadow-out-sm);
}

.prose :deep(hr) {
  border: none;
  height: 1px;
  background: var(--border);
  margin: 2rem 0;
}

.missing {
  color: var(--text-muted);
}

@media (max-width: 620px) {
  .prose {
    padding: 1.5rem 1.25rem;
  }
}

/* Impression / « Enregistrer au format PDF » : on ne garde que le numéro,
   sans relief ni navigation. */
@media print {
  .back,
  .issue-head__download {
    display: none;
  }

  .prose {
    padding: 0;
    box-shadow: none;
    background: none;
  }

  .prose :deep(blockquote) {
    box-shadow: none;
    border-left: 2px solid var(--accent);
  }
}
</style>
