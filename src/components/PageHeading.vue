<script setup>
// Entête commune aux pages secondaires (partenaires, agenda, gazette) :
// même grammaire que les kickers/titres de sections de l'accueil.
defineProps({
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  lead: { type: String, default: '' },
})
</script>

<template>
  <header class="page-heading">
    <p class="section__kicker">{{ kicker }}</p>
    <h1 class="page-heading__title">{{ title }}</h1>
    <p v-if="lead" class="page-heading__lead">{{ lead }}</p>
    <!-- Paragraphes supplémentaires propres à la page, au même corps que le chapô. -->
    <slot />
  </header>
</template>

<style scoped>
.page-heading {
  margin-bottom: 2.5rem;
}

.page-heading__title {
  font-size: var(--title-size);
  margin-bottom: 1rem;
}

.page-heading__lead,
.page-heading :slotted(p) {
  color: var(--text-muted);
  font-size: var(--lead-size);
  text-align: justify;
}

/* `p { margin: 0 }` partout : c'est ici qu'on redonne l'air entre les paragraphes. */
.page-heading :slotted(p) {
  margin-top: 0.9rem;
}
</style>
