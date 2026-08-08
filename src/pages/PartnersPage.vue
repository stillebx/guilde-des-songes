<script setup>
import IconGlyph from '../components/IconGlyph.vue'
import PageHeading from '../components/PageHeading.vue'
import PageAtmosphere from '../components/PageAtmosphere.vue'
import { partners } from '../data/partners.js'
</script>

<template>
  <section class="section section--atmospheric">
    <PageAtmosphere />
    <div class="container">
      <PageHeading
        kicker="Nos partenaires"
        title="Celles et ceux qui nous accompagnent"
        lead="La Guilde ne joue pas seule : des lieux et des boutiques dijonnaises nous accueillent, nous équipent et font vivre le jeu avec nous."
      />

      <div class="partners">
        <component
          :is="partner.href ? 'a' : 'article'"
          v-for="partner in partners"
          :key="partner.name"
          class="partner"
          :href="partner.href"
          :target="partner.href ? '_blank' : undefined"
          :rel="partner.href ? 'noopener' : undefined"
        >
          <header class="partner__head">
            <span class="partner__icon"><IconGlyph :name="partner.icon" /></span>
            <h2 class="partner__name">{{ partner.name }}</h2>
            <p class="partner__address">{{ partner.address }}</p>
          </header>

          <div class="partner__body">
            <p class="partner__text">{{ partner.text }}</p>
          </div>

          <!-- Zone basse toujours présente : les descriptions restent alignées
               d'une vignette à l'autre, avec ou sans avantage adhérent. -->
          <div class="partner__foot">
            <span v-if="partner.perk" class="partner__perk">{{ partner.perk }}</span>
          </div>
        </component>
      </div>

      <p class="partners__note">
        Vous tenez un lieu, une boutique ou un festival et souhaitez collaborer avec la
        Guilde&nbsp;? Écrivez-nous à
        <a href="mailto:laguildedessonges@gmail.com">laguildedessonges@gmail.com</a>.
      </p>
    </div>
  </section>
</template>

<style scoped>
.partners {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: 1.5rem;
}

/* Entête (icône, nom, adresse) calé en haut, description centrée dans l'espace
   restant : les cartes gardent la même hauteur et se lisent en ligne. */
.partner {
  display: flex;
  flex-direction: column;
  background: var(--bg-panel);
  border-radius: var(--radius);
  padding: 1.4rem 1.25rem;
  text-align: center;
  text-decoration: none;
  color: var(--text);
  box-shadow: var(--shadow-out);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

a.partner:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-out-lg);
}

.partner__icon {
  color: var(--accent);
  font-size: 1.7rem;
  width: 60px;
  height: 60px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 50%;
  box-shadow: var(--shadow-in-sm);
  margin: 0 auto 1rem;
}

.partner__name {
  font-size: 1.3rem;
  margin-bottom: 0.3rem;
}

/* L'adresse ne se coupe pas au milieu : elle passe à la ligne d'un bloc. */
.partner__address {
  color: var(--accent);
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.7rem;
  text-wrap: balance;
}

.partner__body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0;
}

.partner__text {
  color: var(--text-muted);
  font-size: var(--card-text-size);
  line-height: 1.4;
}

/* Hauteur réservée dans chaque vignette, badge ou non : les descriptions
   restent alignées d'une carte à l'autre. */
.partner__foot {
  flex: none;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.75rem;
}

/* Avantage adhérent : pastille compacte en creux */
.partner__perk {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  box-shadow: var(--shadow-in-sm);
  color: var(--accent);
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
}

.partners__note {
  margin-top: 2.5rem;
  color: var(--text-muted);
  text-align: justify;
}
</style>
