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

.page-heading__lead {
  color: var(--text-muted);
  font-size: var(--lead-size);
  text-align: justify;
}
</style>
